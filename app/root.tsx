import {useNonce, getShopAnalytics, Analytics, Script} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
  useRouteLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import favicon from '~/assets/favicon.svg';
import '@radix-ui/themes/styles.css';
import appStyles from '~/styles/app.css?url';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import {LocaleProvider} from '~/contexts/LocaleContext';
import {getLocaleFromRequest} from '~/lib/locale';
import {Box, Theme} from '@radix-ui/themes';
import {Text} from '~/components/Text';
import {useRouteLayout} from './lib/layout';
import {CartProvider, useCart} from './contexts/CartContext';
import {Container} from './components';
import {GoogleTagManager} from '~/components/GoogleTagManager';

export type RootLoader = typeof loader;

// Determine if we should revalidate the data on navigation
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // Always revalidate for non-GET form submissions
  if (formMethod && formMethod !== 'GET') return true;
  // Revalidate if the URL hasn't changed (e.g., only hash changed)
  return currentUrl.toString() === nextUrl.toString();
};

// Define stylesheets and other link tags for the app
export function links() {
  return [
    {rel: 'stylesheet', href: appStyles},
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'preconnect', href: 'https://shop.app'},
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export async function loader({request, context}: LoaderFunctionArgs) {
  const {locale, localizationCookie} = getLocaleFromRequest(request);
  const {storefront, env} = context;

  // Load critical data first
  const criticalData = await loadCriticalData(context);

  // Start loading deferred data without waiting for it
  const deferredData = loadDeferredData(context);

  const loaderData = {
    // Load basic context required for the app
    locale,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    },
    // Load the critical data first
    ...criticalData,
    // Defer the non-critical data
    ...deferredData,
  };

  // Create a deferred response with all the loader data
  const response = new Response(null, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Set localization cookie if available
  if (localizationCookie) {
    response.headers.set(
      'Set-Cookie',
      `${localizationCookie.name}=${localizationCookie.value}; Max-Age=${localizationCookie.maxAge}; Path=/; SameSite=Lax`,
    );
  }

  return defer(loaderData, {headers: response.headers});
}

async function loadCriticalData({storefront}: LoaderFunctionArgs['context']) {
  const header = await storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {headerMenuHandle: 'main-menu'},
  });
  return {header};
}

function loadDeferredData({
  storefront,
  customerAccount,
}: LoaderFunctionArgs['context']) {
  return {
    footer: storefront
      .query(FOOTER_QUERY, {
        cache: storefront.CacheLong(),
        variables: {footerMenuHandle: 'footer'},
      })
      .catch(console.error),
    isLoggedIn: customerAccount.isLoggedIn(),
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');
  const Layout = useRouteLayout();

  const cart = useCart();

  if (!data || !data.locale) {
    // Handle the case where data or locale is undefined
    return <div>Loading...</div>;
  }

  return (
    <html lang={data.locale.language.toLowerCase()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <Script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KHNJ4MH7');`,
          }}
        ></Script>
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KHNJ4MH7"
            height="0"
            width="0"
            style={{
              display: 'none',
              visibility: 'hidden',
            }}
          ></iframe>
        </noscript>
        {/* TODO: Dark Mode support https://www.mattstobbs.com/remix-dark-mode/ */}
        <Theme appearance="light" accentColor="yellow">
          <LocaleProvider initialLocale={data.locale}>
            <CartProvider>
              <Analytics.Provider
                cart={cart}
                shop={data.shop}
                consent={data.consent}
              >
                <Layout {...data}>{children}</Layout>
                <GoogleTagManager />
              </Analytics.Provider>
            </CartProvider>
          </LocaleProvider>
        </Theme>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const errorMessage = isRouteErrorResponse(error)
    ? error?.data?.message ?? error.data
    : error instanceof Error
    ? error.message
    : 'Something went wrong.';

  return (
    <Container columns="1" height="100svh">
      {errorMessage && (
        <Box position="sticky" top="1rem" pt="8rem">
          <Text>{errorMessage}</Text>
        </Box>
      )}
    </Container>
  );
}
