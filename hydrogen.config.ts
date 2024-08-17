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
