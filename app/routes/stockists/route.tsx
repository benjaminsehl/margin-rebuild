import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Container} from '~/components';
import {Text} from '~/components/Text';
import {parseMetaobjects} from '~/lib/utils';
import Link from '@h2/Link';
import {Box, Flex, Grid} from '@radix-ui/themes';

export const meta: MetaFunction<typeof loader> = () => {
  return [{title: `Margin | Stockists`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{stockists}] = await Promise.all([
    context.storefront.query(STOCKISTS_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!stockists) {
    throw new Response('Not Found', {status: 404});
  }

  return {
    stockists,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Page() {
  const {stockists} = useLoaderData<typeof loader>();

  const parsedStockists: Stockist[] = parseMetaobjects(stockists);

  const stockistsByCountry = groupByCountry(parsedStockists);

  return (
    <>
      <Container columns="1" pt="8rem" fullScreen>
        {stockistsByCountry.map((country) => (
          <Flex gap="8" direction="column" key={country.country}>
            <Text level="heading">{country.country}</Text>
            <Grid columns="4">
              {country.stockists.map((stockist) => (
                <Flex gap="2" direction="column" key={stockist.company}>
                  {stockist.website ? (
                    <Link to={stockist.website}>{stockist.company}</Link>
                  ) : (
                    <Text>{stockist.company}</Text>
                  )}
                  {stockist.map ? (
                    <Link to={stockist.map}>
                      <Flex direction="column">
                        <Text className="whitespace-pre-wrap">
                          {stockist.address}
                        </Text>
                        <Text>
                          {stockist.city}, {stockist.country}
                        </Text>
                      </Flex>
                    </Link>
                  ) : (
                    <Flex direction="column">
                      <Text className="whitespace-pre-wrap">
                        {stockist.address}
                      </Text>
                      <Text>
                        {stockist.city}, {stockist.country}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              ))}
            </Grid>
          </Flex>
        ))}
      </Container>
    </>
  );
}

type Stockist = {
  company: string;
  city: string;
  country: string;
  address: string;
  website: string;
  map: string;
};

type CountryGroup = {
  country: string;
  stockists: Stockist[];
};

function groupByCountry(data: Stockist[]): CountryGroup[] {
  const groupedData: {[country: string]: Stockist[]} = data.reduce(
    (acc, item) => {
      const country = item.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(item);
      return acc;
    },
    {} as {[country: string]: Stockist[]},
  );

  return Object.keys(groupedData).map((country) => ({
    country,
    stockists: groupedData[country],
  }));
}

const STOCKISTS_QUERY = `#graphql
  query Stockists(
    $language: LanguageCode,
    $country: CountryCode,
  )
  @inContext(language: $language, country: $country) {
    stockists: metaobjects(type:"stockists" first:250) {
      nodes {
        company: field(key:"company") {
          value
        }
        city: field(key:"city") {
          value
        }
        country: field(key:"country") {
          value
        }
        address:field(key:"address") {
          value
        }
        website:field(key:"website") {
          value
        }
        map: field(key:"google_maps_link") {
          value
        }
      }
    }
  }
` as const;
