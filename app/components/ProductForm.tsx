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
import type {loader} from '~/routes/shop.$handle/route';
import {Text} from './Text';
import {Price, PriceCompareAt} from '@h2/Price';

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
                (option: {values: string | any[]}) => option.values.length > 1,
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
          {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'} ·{' '}
          <Price variant={selectedVariant} />{' '}
          <PriceCompareAt variant={selectedVariant} />
        </Text>
      </AddToCartButton>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  return (
    <div className="flex items-baseline gap-4" key={option.name}>
      <Text asChild variant="fine">
        <h5>{option.name}</h5>
      </Text>
      <div className="flex gap-4">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className={`border-b ${
                isActive ? 'border-foreground/50' : 'border-transparent'
              } ${isAvailable ? '' : 'opacity-30'}`}
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
            >
              {value}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
