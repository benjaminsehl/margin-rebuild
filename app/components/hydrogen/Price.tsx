import {Money} from '@shopify/hydrogen';
import {cx} from '@h2/utils';
import {Text} from '@h2/Text';
import type {
  Maybe,
  MoneyV2,
  Product,
  ProductVariant,
} from '@shopify/hydrogen/storefront-api-types';

export function Price({
  variant,
  as = Text,
  ...props
}: {
  variant: ProductVariant;
  as?: React.ElementType;
}) {
  variant = variant || {
    availableForSale: true,
    price: {
      amount: '38.00',
      currencyCode: 'CAD',
    },
    compareAtPrice: {
      amount: '42.00',
      currencyCode: 'CAD',
    },
  };

  return <Money data={variant.price} as={as} {...props} />;
}

export function isDiscounted(
  price: MoneyV2,
  compareAtPrice: Maybe<MoneyV2> | undefined,
) {
  if (compareAtPrice?.amount > price?.amount) {
    return true;
  }
  return false;
}

export function PriceCompareAt({
  variant,
  as = Text,
  className,
  ...props
}: {
  variant: ProductVariant;
  as?: React.ElementType;
  className?: string;
}) {
  variant = variant || {
    availableForSale: true,
    price: {
      amount: '38.00',
      currencyCode: 'CAD',
    },
    compareAtPrice: {
      amount: '42.00',
      currencyCode: 'CAD',
    },
  };

  return isDiscounted(variant.price, variant.compareAtPrice) ? (
    <Money
      as={as}
      className={cx('line-through', className)}
      data={variant.compareAtPrice}
      {...props}
    />
  ) : null;
}

export function PriceRange({
  as: Component = 'span',
  product,
  separator = '-',
  className,
  ...props
}: {
  as?: React.ElementType;
  product: Product;
  separator?: string;
  className?: string;
}) {
  const {minVariantPrice, maxVariantPrice} = product.priceRange;

  if (!minVariantPrice || !maxVariantPrice) {
    return null;
  }

  return (
    <Component {...props}>
      <Money data={minVariantPrice} />
      {` ${separator} `}
      <Money data={maxVariantPrice} />
    </Component>
  );
}
