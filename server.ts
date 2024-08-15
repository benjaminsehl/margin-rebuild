// @ts-ignore
// Virtual entry point for the app
import * as remixBuild from 'virtual:remix/server-build';
import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/remix-oxygen';
import {createAppLoadContext} from '~/lib/context';
import {redirects} from 'hydrogen.config';

function handleRedirects(request: Request): Response | null {
  const url = new URL(request.url);

  for (const redirect of redirects) {
    if (redirect.from === url.pathname) {
      // Exact match
      return Response.redirect(`${url.origin}${redirect.to}`, 301);
    } else if (redirect.from.endsWith('*')) {
      // Wildcard match
      const prefix = redirect.from.slice(0, -1);
      if (url.pathname.startsWith(prefix)) {
        const newPath = url.pathname.replace(prefix, redirect.to.slice(0, -1));
        return Response.redirect(`${url.origin}${newPath}`, 301);
      }
    }
  }

  return null; // No redirect found
}

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      if (!env?.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable is not set');
      }

      // Check for redirects first
      const redirectResponse = handleRedirects(request);
      if (redirectResponse) {
        return redirectResponse;
      }

      const appLoadContext = await createAppLoadContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => appLoadContext,
      });

      const response = await handleRequest(request);

      if (appLoadContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await appLoadContext.session.commit(),
        );
      }

      // Set the new cookie if necessary
      if (appLoadContext.localizationCookie) {
        response.headers.append(
          'Set-Cookie',
          `${appLoadContext.localizationCookie.name}=${appLoadContext.localizationCookie.value}; Max-Age=${appLoadContext.localizationCookie.maxAge}; Path=/; SameSite=Lax`,
        );
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: appLoadContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
