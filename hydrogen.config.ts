type Redirect = {
  from: string;
  to: string;
};

export const redirects: Redirect[] = [
  {from: '/pages/*', to: '/*'},
  {from: '/collections/*', to: '/shop'},
  {from: '/products/*', to: '/shop/*'},
  {from: '/cart', to: '/bag'},
  {from: '/blogs/*', to: '/editorial/*'},
];

export function transformShopifyPath(type: string, handle: string): string {
  const defaultPath = `/${type}/${handle}`;

  for (const {from, to} of redirects) {
    // Convert wildcard pattern to regex
    const pattern = from.replace('*', '(.*)');
    const regex = new RegExp(`^${pattern}$`);

    const match = defaultPath.match(regex);
    if (match) {
      if (to.includes('*')) {
        return to.replace('*', match[1]);
      }
      return to;
    }
  }

  return defaultPath;
}
