/** TODO:
 * - [ ] Add a comment explaining what this component does
 * - [ ] Add proper types
 * - [ ] Add a utility function for parsing `MenuItem` output, see Demo Store
 * - [ ] Add logic for handling localization properly
 * - [ ] Add logic for routing via "named routes", like <Link to={product} /> and it would take a `product.id`
 *       like gid://shopify/Product/1234567890 and a `product.handle` like "product-name" and then it would route
 *       to /products/product-name; but along with the points above it would correspond to 1: a localized route,
 *       2: overrides from Shopify's standard pathnames (e.g. `productos`)
 * - [ ] Should support routing within collections, like `/collections/all/products/product-name`, while keeping
 *       the canonical URL as `/products/product-name`
 * - [ ] Maybe not in this component, but adds support for preloading images in addition to data, see JP's PR
 */
import React from 'react';
import {Link as RemixLink, useLocation} from '@remix-run/react';
import type {LinkProps} from '@remix-run/react';
import {useLocale} from '~/contexts/LocaleContext';

/**
 * Props for the LocalizedLink component.
 * Extends Remix's LinkProps, but makes 'to' required and adds custom props.
 */
interface LocalizedLinkProps extends Omit<LinkProps, 'to'> {
  /**
   * The destination path or URL for the link.
   * For internal links, this can be a relative path.
   * For external links, use a full URL.
   */
  to: string;

  /**
   * If true, bypasses the automatic localization of the 'to' prop.
   * Useful for links that should remain the same across all locales.
   */
  ignoreLocale?: boolean;

  /**
   * If true, forces the link to be treated as an external link,
   * regardless of the 'to' prop format.
   */
  external?: boolean;
}

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
  to,
  ignoreLocale = false,
  external: forceExternal,
  ...rest
}: LocalizedLinkProps) {
  const {locale} = useLocale();
  const location = useLocation();

  /**
   * Determines if the link should be treated as external.
   */
  const isExternal = React.useMemo(() => {
    if (forceExternal) return true;
    return (
      to.startsWith('http') ||
      to.startsWith('//') ||
      to.startsWith('mailto:') ||
      to.startsWith('tel:')
    );
  }, [to, forceExternal]);

  /**
   * Localizes the 'to' prop if necessary.
   * Adds the current locale as a prefix to the path for non-English locales.
   */
  const localizedTo = React.useMemo(() => {
    if (isExternal || ignoreLocale || locale.language === 'EN') {
      return to;
    }

    const [pathname, query] = to.split('?');
    const segments = pathname.split('/').filter(Boolean);
    const localizedPath = `/${locale.language.toLowerCase()}/${segments.join(
      '/',
    )}`;

    return query ? `${localizedPath}?${query}` : localizedPath;
  }, [to, locale.language, ignoreLocale, isExternal]);

  if (isExternal) {
    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a
        href={localizedTo}
        rel="noopener noreferrer"
        target="_blank"
        {...rest}
      />
    );
  }

  return (
    <RemixLink
      unstable_viewTransition
      prefetch={prefetch}
      to={localizedTo}
      {...rest}
    />
  );
}
