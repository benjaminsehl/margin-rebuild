import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.page?.title ?? ''}`}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: 'stockists',
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return defer({page});
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="page">
      {page?.title && (
        <header>
          <h1>{page.title}</h1>
        </header>
      )}
      {page?.body && <main dangerouslySetInnerHTML={{__html: page?.body}} />}
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
