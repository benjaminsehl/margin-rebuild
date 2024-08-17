import {defer, json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Image, Pagination, getPaginationVariables} from '@shopify/hydrogen';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import {Container} from '~/components';
import {Text} from '~/components/Text';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Margin · ${data?.blog.title ?? ''}`}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [{blog}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        handle: 'editorial',
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  return json({blog});
}

export default function Blog() {
  const {blog} = useLoaderData<typeof loader>();
  const {articles} = blog;

  return (
    <Container columns="1" pt="8rem" fullScreen>
      <Text variant="heading" asChild>
        <h1>{blog.title}</h1>
      </Text>
      <Pagination connection={articles}>
        {({nodes, isLoading, PreviousLink, NextLink}) => {
          return (
            <>
              <PreviousLink>
                {isLoading ? 'Loading...' : <span>Load previous</span>}
              </PreviousLink>
              {nodes.map((article, index) => {
                return (
                  <ArticleItem
                    article={article}
                    key={article.id}
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                );
              })}
              <NextLink>
                {isLoading ? 'Loading...' : <span>Load more</span>}
              </NextLink>
            </>
          );
        }}
      </Pagination>
    </Container>
  );
}

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));
  return (
    <Link
      key={article.id}
      to={`/${article.blog.handle}/${article.handle}`}
      className="flex flex-col items-center gap-4 md:gap-12 md:flex-row-reverse"
    >
      {article.image && (
        <Image
          alt={article.image.altText || article.title}
          aspectRatio="3/2"
          data={article.image}
          loading={loading}
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      )}
      <div className="grid gap-4">
        <Text wrap="balance" variant="heading">
          <h3>{article.title}</h3>
        </Text>
        <Text wrap="balance" variant="body">
          {article.excerpt}
        </Text>
        <Text variant="fine">{publishedAt}</Text>
      </div>
    </Link>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $handle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $handle) {
      title
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    excerpt
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;
