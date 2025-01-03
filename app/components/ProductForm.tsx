import {Link, useNavigate} from '@remix-run/react';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {Text} from './Text';
import {Price, PriceCompareAt} from '@h2/Price';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  return (
    <div className="product-form">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <div className="flex items-baseline gap-4" key={option.name}>
            <Text asChild variant="fine">
              <h5>{option.name}</h5>
            </Text>
            <div className="flex gap-4">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                } = value;

                const className = `border-b ${
                  selected ? 'border-foreground/50' : 'border-transparent'
                } ${available ? '' : 'opacity-30'}`;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={className}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      {name}
                    </Link>
                  );
                }

                return (
                  <button
                    type="button"
                    className={className}
                    key={option.name + name}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) {
                        navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <br />
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        <Text>
          {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'} ·{' '}
          <Price variant={selectedVariant} />{' '}
          <PriceCompareAt variant={selectedVariant} />
        </Text>
      </AddToCartButton>
    </div>
  );
}
