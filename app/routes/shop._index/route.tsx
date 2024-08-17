import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Pagination, getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {Container} from '~/components';
import {Grid} from '@radix-ui/themes';
import ProductCard from '~/components/ProductCard';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Margin · ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle: 'shop', ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(
      `We’re all sold out. Follow @margin.global on Instagram for updates.`,
      {
        status: 404,
      },
    );
  }

  return {
    collection,
  };
}

export default function Shop() {
  const {collection} = useLoaderData<typeof loader>();

  return (
    <Container fullScreen columns="1" pt="5rem">
      <Pagination connection={collection.products}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
            </PreviousLink>
            <Grid columns={{initial: '1', xs: '2', md: '3'}}>
              {nodes.map((product: any, index) => {
                return (
                  <ProductCard.Component
                    key={product.id}
                    product={product}
                    loading={index < 8 ? 'eager' : undefined}
                  />
                );
              })}
            </Grid>
            <NextLink>
              {isLoading ? 'Loading...' : <span>Load more ↓</span>}
            </NextLink>
          </>
        )}
      </Pagination>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </Container>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${ProductCard.Fragment}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;

// eslint-disable-next-line no-lone-blocks
{
  /* <Box width="100%">
        <Grid
          position="sticky"
          top="0"
          columns="2"
          gap="2"
          width="100%"
          mx="auto"
          px="5"
          py="4"
        >
          <Box gridColumn="2" className="pt-12 bg-white">
            <ScrollArea
              type="scroll"
              scrollbars="vertical"
              className="h-screen"
            >
              <Grid columns="3" height="calc(100vh - 5rem)">
                {collection.products.nodes.map((product, index) => {
                  return (
                    <ProductCard.Component
                      key={product.id}
                      product={product}
                      loading={index < 8 ? 'eager' : undefined}
                    />
                  );
                })}
                {[...Array(100)].map((_, index) => (
                  <div key={index} />
                ))}
              </Grid>
            </ScrollArea>
          </Box>
        </Grid>
      </Box> */
}
