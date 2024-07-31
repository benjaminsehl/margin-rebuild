import {Link as RemixLink} from '@remix-run/react';

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
 */

export default function Link({prefetch = 'viewport', ...rest}) {
  return <RemixLink unstable_viewTransition prefetch={prefetch} {...rest} />;
}
