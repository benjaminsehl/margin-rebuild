import Link from '@h2/Link';
import {Await, useLoaderData} from '@remix-run/react';
import {
  useOptimisticVariant,
  type VariantOption,
  VariantSelector,
} from '@shopify/hydrogen';
import {Suspense} from 'react';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import type {loader} from '~/routes/products.$handle/route';
import {Text} from './Text';

export function ProductForm() {
  const {product, variants} = useLoaderData<typeof loader>();
  const selectedVariant = useOptimisticVariant(
    product.selectedVariant,
    variants,
  );

  const {open} = useAside();
  return (
    <div className="product-form">
      <Suspense>
        <Await resolve={variants}>
          {(data) => (
            <VariantSelector
              handle={product.handle}
              options={product.options.filter(
                (option) => option.values.length > 1,
              )}
              variants={data?.product?.variants.nodes || []}
            >
              {({option}) => (
                <ProductOptions key={option.name} option={option} />
              )}
            </VariantSelector>
          )}
        </Await>
      </Suspense>
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
          {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
        </Text>
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="product-options" key={option.name}>
      <h5>{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive ? '1px solid black' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}
