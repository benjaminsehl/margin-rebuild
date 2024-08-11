import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  Text,
  VisuallyHidden,
} from '@radix-ui/themes';
import {Container} from '~/components';
import {ProductForm} from '~/components/ProductForm';

export default function ProductDetails() {
  const product = {
    variants: {
      nodes: [
        {
          availableForSale: true,
          compareAtPrice: {
            amount: '45.0',
            currencyCode: 'CAD',
          },
          id: 'gid://shopify/ProductVariant/43392154468534',
          image: {
            __typename: 'Image',
            id: 'gid://shopify/ProductImage/35458528346294',
            url: 'https://cdn.shopify.com/s/files/1/0586/4826/4886/files/7QfhZaUA.jpg?v=1722358402',
            altText: null,
            width: 640,
            height: 800,
          },
          price: {
            amount: '45.0',
            currencyCode: 'CAD',
          },
          product: {
            title: 'Body Wash',
            handle: 'body-wash',
          },
          selectedOptions: [
            {
              name: 'Scent',
              value: 'Warm Water',
            },
          ],
          sku: '',
          title: 'Warm Water',
          unitPrice: null,
        },
        {
          availableForSale: true,
          compareAtPrice: {
            amount: '45.0',
            currencyCode: 'CAD',
          },
          id: 'gid://shopify/ProductVariant/43392154501302',
          image: {
            __typename: 'Image',
            id: 'gid://shopify/ProductImage/35458528411830',
            url: 'https://cdn.shopify.com/s/files/1/0586/4826/4886/files/L0Xg-LrM.jpg?v=1720388569',
            altText: null,
            width: 640,
            height: 960,
          },
          price: {
            amount: '45.0',
            currencyCode: 'CAD',
          },
          product: {
            title: 'Body Wash',
            handle: 'body-wash',
          },
          selectedOptions: [
            {
              name: 'Scent',
              value: 'Unscented',
            },
          ],
          sku: '',
          title: 'Unscented',
          unitPrice: null,
        },
        {
          availableForSale: true,
          compareAtPrice: {
            amount: '45.0',
            currencyCode: 'CAD',
          },
          id: 'gid://shopify/ProductVariant/43392154534070',
          image: {
            __typename: 'Image',
            id: 'gid://shopify/ProductImage/35458528379062',
            url: 'https://cdn.shopify.com/s/files/1/0586/4826/4886/files/Instagram_post_-_13.jpg?v=1697658159',
            altText: null,
            width: 1080,
            height: 1080,
          },
          price: {
            amount: '45.0',
            currencyCode: 'CAD',
          },
          product: {
            title: 'Body Wash',
            handle: 'body-wash',
          },
          selectedOptions: [
            {
              name: 'Scent',
              value: 'Sandalwood',
            },
          ],
          sku: '',
          title: 'Sandalwood',
          unitPrice: null,
        },
      ],
    },
    seo: {}, // Add empty seo object
  };

  return (
    <Container align="center">
      <Box
        gridColumn="1 / span 6"
        width="calc(100% + var(--space-5))"
        height="100%"
        mx="-3"
        overflow="hidden"
        className="rounded"
      >
        <AspectRatio ratio={4 / 5}>
          <img
            src="https://cdn.shopify.com/s/files/1/0586/4826/4886/products/custom_resized_cbddde06-d41b-438e-877c-63747aa95e78.jpg"
            alt="product"
            className="object-cover w-full h-full"
          />
        </AspectRatio>
      </Box>
      <Flex direction="column" gap="7" gridColumn="8 / span 4">
        <Flex direction="column" gap="5">
          <Flex align="baseline" justify="between">
            <Heading as="h1">Body Wash</Heading>
            <Text>★ 5</Text>
          </Flex>
          <Text>
            A gentle, non-drying body wash that cleanses and refreshes the skin.
            Formulated with aloe vera, pineapple fruit extract, and glycerin to
            hydrate and soothe.
          </Text>
        </Flex>
        <ProductForm product={product} />
      </Flex>
    </Container>
  );
}
