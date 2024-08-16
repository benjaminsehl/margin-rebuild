import Link from '@h2/Link';
import {Flex} from '@radix-ui/themes';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Text} from './Text';

function Component({
  product,
  loading,
}: {
  product: any;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Flex direction="column" gap="2" pb="5" asChild>
      <Link
        className="items-center text-center max-w-none"
        key={product.id}
        to={variantUrl}
      >
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="4/5"
            className="object-cover w-full h-full"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        )}
        <Flex direction="column" gap="0">
          <Text variant="heading">{product.title}</Text>
          <Text variant="fine">
            <Money
              withoutTrailingZeros
              data={product.priceRange.minVariantPrice}
            />
          </Text>
        </Flex>
      </Link>
    </Flex>
  );
}

export const PRODUCT_CARD_FRAGMENT = `#graphql
    fragment Money on MoneyV2 {
      amount
      currencyCode
    }
    fragment ProductCard on Product {
      id
      handle
      title
      featuredImage {
        id
        altText
        url
        width
        height
      }
      priceRange {
        minVariantPrice {
          ...Money
        }
        maxVariantPrice {
          ...Money
        }
      }
      variants(first: 1) {
        nodes {
          selectedOptions {
            name
            value
          }
        }
      }
    }
  ` as const;

const ProductCard = {
  Component,
  Fragment: PRODUCT_CARD_FRAGMENT,
};

export default ProductCard;
