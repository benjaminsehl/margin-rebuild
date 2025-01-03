import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getSitemap} from '@shopify/hydrogen';
import {transformShopifyPath} from '../../hydrogen.config';

export async function loader({
  request,
  params,
  context: {storefront},
}: LoaderFunctionArgs) {
  const response = await getSitemap({
    storefront,
    request,
    params,
    getLink: ({type, baseUrl, handle}) => {
      const transformedPath = transformShopifyPath(type, handle || '');
      return `${baseUrl}${transformedPath}`;
    },
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}
