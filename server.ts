// @ts-ignore
// Virtual entry point for the app
import * as remixBuild from 'virtual:remix/server-build';
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  storefrontRedirect,
  createCustomerAccountClient,
} from '@shopify/hydrogen';
import {
  createRequestHandler,
  getStorefrontHeaders,
  type AppLoadContext,
} from '@shopify/remix-oxygen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';

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
      /**
       * Open a cache instance in the worker and a custom session instance.
       */
      if (!env?.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable is not set');
      }

      const waitUntil = executionContext.waitUntil.bind(executionContext);
      const [cache, session] = await Promise.all([
        caches.open('hydrogen'),
        AppSession.init(request, [env.SESSION_SECRET]),
      ]);

      const {locale, localizationCookie} = getLocaleFromRequest(request);

      /**
       * Create Hydrogen's Storefront client.
       */
      const {storefront} = createStorefrontClient({
        cache,
        waitUntil,
        i18n: locale,
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request),
      });

      /**
       * Create a client for Customer Account API.
       */
      const customerAccount = createCustomerAccountClient({
        waitUntil,
        request,
        session,
        customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
        customerAccountUrl: env.PUBLIC_CUSTOMER_ACCOUNT_API_URL,
      });

      /*
       * Create a cart handler that will be used to
       * create and update the cart in the session.
       */
      const cart = createCartHandler({
        storefront,
        customerAccount,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault(),
        cartQueryFragment: CART_QUERY_FRAGMENT,
      });

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: (): AppLoadContext => ({
          session,
          storefront,
          customerAccount,
          cart,
          env,
          waitUntil,
          locale,
        }),
      });

      const response = await handleRequest(request);

      if (session.isPending) {
        response.headers.set('Set-Cookie', await session.commit());
      }

      // Set the new cookie if necessary
      if (localizationCookie) {
        response.headers.append(
          'Set-Cookie',
          `${localizationCookie.name}=${localizationCookie.value}; Max-Age=${localizationCookie.maxAge}; Path=/; SameSite=Lax`,
        );
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({request, response, storefront});
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

interface LocaleResult {
  locale: I18nLocale;
  localizationCookie?: {name: string; value: string; maxAge: number};
}

export function getLocaleFromRequest(request: Request): LocaleResult {
  const defaultLocale: I18nLocale = {language: 'EN', country: 'CA'};
  const supportedCountries = ['US', 'CA', 'ES', 'FR', 'DE', 'JP'] as const;
  const supportedLanguages = ['EN', 'FR', 'ES', 'DE', 'JA'] as const;
  const oneYearInSeconds = 365 * 24 * 60 * 60;

  const url = new URL(request.url);
  const countryParam = url.searchParams.get('country');
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  const headerCountry = request.headers.get('oxygen-buyer-country');

  let country = defaultLocale.country as CountryCode;
  let language = defaultLocale.language;
  let localizationCookie:
    | {name: string; value: string; maxAge: number}
    | undefined;

  // Determine language from URL path
  const pathSegments = url.pathname.split('/').filter((segment) => segment);
  const firstPathSegment = pathSegments[0]?.toUpperCase();
  if (
    supportedLanguages.includes(
      firstPathSegment as (typeof supportedLanguages)[number],
    )
  ) {
    language = firstPathSegment as (typeof supportedLanguages)[number];
  }

  // Check URL parameter and set cookie only if it's provided
  if (
    countryParam &&
    supportedCountries.includes(
      countryParam as (typeof supportedCountries)[number],
    )
  ) {
    country = countryParam as CountryCode;
    localizationCookie = {
      name: 'localization',
      value: countryParam,
      maxAge: oneYearInSeconds,
    };
  }
  // Check existing cookie
  else if (
    cookies.localization &&
    supportedCountries.includes(
      cookies.localization as (typeof supportedCountries)[number],
    )
  ) {
    country = cookies.localization as CountryCode;
  }
  // Check header
  else if (
    headerCountry &&
    supportedCountries.includes(
      headerCountry as (typeof supportedCountries)[number],
    )
  ) {
    country = headerCountry as CountryCode;
  }

  return {
    locale: {language, country},
    localizationCookie,
  };
}

function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [name, value] = cookie.split('=').map((c) => c.trim());
    if (name && value) {
      cookies[name] = value;
    }
    return cookies;
  }, {} as Record<string, string>);
}
