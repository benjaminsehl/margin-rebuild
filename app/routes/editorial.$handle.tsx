import {defer, json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {Text} from '~/components/Text';
import {Container} from '~/components';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Margin · ${data?.article.title ?? ''} article`}];
};

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {handle} = params;

  if (!handle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blog: 'editorial', handle},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  const article = blog.articleByHandle;

  return json({article});
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <Container columns="1" py="8rem" fullScreen>
      <Text wrap="balance" align="center" mx="auto" variant="heading" asChild>
        <h1>
          {title}
          <div>
            {publishedDate} &middot; {author?.name}
          </div>
        </h1>
      </Text>

      {image && (
        <Image
          className="object-cover max-w-4xl mx-auto"
          aspectRatio="3 / 2"
          data={image}
          sizes="90vw"
          loading="eager"
        />
      )}
      <div
        className="mx-auto prose text-pretty"
        dangerouslySetInnerHTML={{__html: contentHtml}}
      />
    </Container>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $handle: String!
    $blog: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blog) {
      articleByHandle(handle: $handle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;
