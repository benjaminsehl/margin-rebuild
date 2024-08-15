/** TODO:
 * - [ ] Add a utility function for parsing `MenuItem` output, see Demo Store
 * - [ ] Add logic for handling localization properly
 * - [ ] Add logic for routing via "named routes", like <Link to={product} /> and it would take a `product.id`
 *       like gid://shopify/Product/1234567890 and a `product.handle` like "product-name" and then it would route
 *       to /products/product-name; but along with the points above it would correspond to 1: a localized route,
 *       2: overrides from Shopify's standard pathnames (e.g. `productos`)
 * - [ ] Should support routing within collections, like `/collections/all/products/product-name`, while keeping
 *       the canonical URL as `/products/product-name`
 * - [ ] Maybe not in this component, but adds support for preloading images in addition to data, see JP's PR
 * - [ ] Improve types
 */
import React from 'react';
import {Link as RemixLink} from '@remix-run/react';
import type {LinkProps} from '@remix-run/react';
import {useLocale} from '~/contexts/LocaleContext';
import {Text} from '~/components/Text';
import {redirects} from 'hydrogen.config';

/**
 * Props for the LocalizedLink component.
 * Extends Remix's LinkProps, but makes 'to' required and adds custom props.
 */
interface LocalizedLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  ignoreLocale?: boolean;
  external?: boolean;
  children: React.ReactNode;
  level?: 'heading' | 'body' | 'fine';
}

/**
 * Returns the redirect path for the given path, if one exists.
 */
function getRedirect(path: string): string | null {
  for (const redirect of redirects) {
    if (redirect.from === path) {
      // Exact match
      return redirect.to;
    } else if (redirect.from.endsWith('*')) {
      // Wildcard match
      const prefix = redirect.from.slice(0, -1);
      if (path.startsWith(prefix)) {
        return redirect.to.replace('*', path.slice(prefix.length));
      }
    }
  }
  return null; // No redirect found
}

/**
 * Strips the specified base URL from the given URL.
 */
const stripUrl = (url: string) => {
  const baseUrl = 'https://checkout.margin.global';
  return url.replace(baseUrl, '');
};

/**
 * A localized and enhanced version of Remix's Link component.
 *
 * This component automatically handles:
 * - Localization of internal links based on the current locale
 * - Proper attributes and behavior for external links
 * - Prefetching and view transitions for internal links
 *
 * @example
 * // Internal link (will be localized)
 * <Link to="/products">Products</Link>
 *
 * // External link
 * <Link to="https://example.com">External Site</Link>
 *
 * // Internal link treated as external
 * <Link to="/some-path" external>Forced External</Link>
 *
 * // Internal link without localization
 * <Link to="/about" ignoreLocale>About</Link>
 */
export default function Link({
  prefetch = 'viewport',
  level,
  to,
  ignoreLocale = false,
  children,
  external: forceExternal,
  ...rest
}: LocalizedLinkProps) {
  const {locale} = useLocale();

  // Strip the specified base URL from the 'to' prop
  const strippedTo = stripUrl(to);

  /**
   * Determines if the link should be treated as external.
   */
  const isExternal = React.useMemo(() => {
    if (forceExternal) return true;
    return (
      strippedTo.startsWith('http') ||
      strippedTo.startsWith('//') ||
      strippedTo.startsWith('mailto:') ||
      strippedTo.startsWith('tel:')
    );
  }, [strippedTo, forceExternal]);

  /**
   * Localizes the 'to' prop if necessary.
   * Adds the current locale as a prefix to the path for non-English locales.
   */
  const localizedTo = React.useMemo(() => {
    // Check for redirects
    const redirectPath = getRedirect(strippedTo);
    const pathToUse = redirectPath || strippedTo;

    if (isExternal || ignoreLocale || locale.language === 'EN') {
      return pathToUse;
    }

    const [pathname, query] = pathToUse.split('?');
    const segments = pathname.split('/').filter(Boolean);
    const localizedPath = `/${locale.language.toLowerCase()}/${segments.join(
      '/',
    )}`;

    return query ? `${localizedPath}?${query}` : localizedPath;
  }, [strippedTo, isExternal, ignoreLocale, locale.language]);

  if (isExternal) {
    return (
      <Text level={level} asChild>
        <a
          href={localizedTo}
          rel="noopener noreferrer"
          target="_blank"
          {...rest}
        >
          {children}
        </a>
      </Text>
    );
  }

  return (
    <Text level={level} asChild>
      <RemixLink
        unstable_viewTransition
        prefetch={prefetch}
        to={localizedTo}
        {...rest}
      >
        {children}
      </RemixLink>
    </Text>
  );
}
