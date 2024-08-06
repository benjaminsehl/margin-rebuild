import {Money, type OptimisticCartLine} from '@shopify/hydrogen';
import {cx} from '@h2/utils';
import {Text} from '@h2/Text';
import type {
  CartLine,
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
  variant: Maybe<ProductVariant | CartLine | OptimisticCartLine>;
  as?: React.ElementType;
}) {
  return (
    <Money
      data={variant?.price || variant?.merchandise?.price || undefined}
      as={as}
      {...props}
    />
  );
}

export function Cost({
  variant,
  type = 'totalAmount',
  as = Text,
  ...props
}: {
  variant: Maybe<CartLine | OptimisticCartLine>;
  type: 'amountPerQuantity' | 'subtotalAmount' | 'totalAmount';
  as?: React.ElementType;
}) {
  const {amountPerQuantity, subtotalAmount, totalAmount} = variant?.cost || {};

  return <Money data={variant?.cost[type] || undefined} as={as} {...props} />;
}

export type CartLineCost = {
  __typename?: 'CartLineCost';
  /** The amount of the merchandise line. */
  amountPerQuantity: MoneyV2;
  /** The compare at amount of the merchandise line. */
  compareAtAmountPerQuantity?: Maybe<MoneyV2>;
  /** The cost of the merchandise line before line-level discounts. */
  subtotalAmount: MoneyV2;
  /** The total cost of the merchandise line. */
  totalAmount: MoneyV2;
};

export function isDiscounted(
  price: MoneyV2,
  compareAtPrice: Maybe<MoneyV2> | undefined,
) {
  if (compareAtPrice?.amount && compareAtPrice?.amount > price?.amount) {
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
