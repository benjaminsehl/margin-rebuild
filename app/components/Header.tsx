import {Suspense} from 'react';
import {Await} from '@remix-run/react';
import Link from '@h2/Link';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  return (
    <header className="flex items-center px-4 py-6 gap-4 fixed top-0 z-50">
      <Header.Logo />
      <Header.Navigation
        menu={header.menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
      <Header.Actions isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

function Logo() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="99"
        height="23"
        fill="none"
      >
        <title>Margin</title>
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M64.6.83c-3.5.4-5.68 1.82-7.04 4.58-.94 1.9-1.18 3.13-1.18 6.13 0 2.34.09 3.06.6 4.72a8.03 8.03 0 0 0 3.82 4.92c1.06.55 1.68.75 2.94.93 2.22.33 4.48-.1 6.08-1.17a7.74 7.74 0 0 0 3.01-3.76c.39-.93.54-1.19.63-1.1.02.02-.06.66-.2 1.41a26.2 26.2 0 0 0-.43 3.84v.63h1.66v-4.27c0-2.35-.03-4.89-.07-5.64l-.06-1.38h-9.97v1.26h4.2c2.3 0 4.25.03 4.31.07.26.17-.42 3.24-1.04 4.68a6.97 6.97 0 0 1-4.56 4.1c-.9.23-3.09.23-4.1-.01-2.71-.63-4.42-2.68-4.97-5.95-.37-2.22-.28-5.68.19-7.43.36-1.33.9-2.37 1.71-3.23a5.8 5.8 0 0 1 2.7-1.7 6.22 6.22 0 0 1 2.48-.35c2.3-.06 3.7.22 4.86.98 1.32.87 2 2.03 2.38 4 .07.34.18.63.25.66.19.07 1.19-.35 1.3-.55.11-.21-.11-1.16-.48-2.03a6.6 6.6 0 0 0-3.83-3.65A12.34 12.34 0 0 0 64.6.83Zm-64.43.3c-.16.1-.17.7-.17 10.46v10.38h1.48v-.04l-.06-8.63c-.04-4.76-.1-9-.12-9.4-.07-.89.04-.97.38-.3.28.55 1.65 4 4.87 12.23l2.37 6.08h1.32l3.42-8.78c3.94-10.1 3.9-9.98 4.08-9.98.12 0 .14.08.09.41-.17 1.13-.25 4.84-.25 11.23 0 5.5 0 6.77.1 7.04.02.04.05.13.07.14h1.51v-.07l-.06-5.31c-.04-2.95-.07-7.64-.07-10.42V1.13h-2.28l-2.7 6.97a664.35 664.35 0 0 0-3.26 8.55c-.81 2.26-1.18 3.19-1.27 3.19-.05 0-.2-.34-.35-.75A950.12 950.12 0 0 0 2.3 1.17c-.1-.1-1.99-.14-2.14-.04Zm28.66.02c-.08.07-.31.55-.51 1.08l-3.87 10.18-3.55 9.38c-.04.16.03.17.76.15l.81-.03 1.03-2.7 1.02-2.7 5.06-.03 5.06-.02 1.02 2.72 1.02 2.73.85.03c.78.02.85.01.8-.15-.03-.14-6.99-18.5-7.65-20.2l-.21-.56h-.75c-.45 0-.8.05-.9.12Zm11.7-.05-.4.03-.06 1.9c-.03 1.04-.06 5.72-.06 10.41v8.52l.8-.02.8-.03.03-5.1.02-5.1 3.23.05c3.56.05 3.99.1 4.79.65.83.57 1.1 1.1 2.28 4.44a29.56 29.56 0 0 0 1.8 4.5l.34.6h1.06c.58 0 1.08-.03 1.11-.08.03-.05-.17-.36-.44-.69-.96-1.14-1.53-2.28-2.66-5.25-1.05-2.77-1.58-3.6-2.72-4.22-.32-.18-.56-.36-.53-.41.02-.05.51-.2 1.09-.35a4.78 4.78 0 0 0 2.56-1.32c.85-.83 1.2-1.8 1.2-3.38 0-1.5-.4-2.54-1.4-3.54-1.02-1.02-2.18-1.43-4.47-1.59-1.2-.08-7.52-.1-8.36-.02Zm37.45 10.4v10.46h1.55V1.03h-1.55v10.46Zm5.05 0v10.46h1.55v-4.9c0-2.69-.04-6.98-.08-9.52-.04-2.55-.06-4.65-.04-4.67.07-.1.33.28.93 1.34.77 1.38 2.02 3.38 7.13 11.4l4.05 6.35h2.03l-.06-2.82c-.04-1.56-.07-6.24-.07-10.42v-7.6h-1.45v8.23a353.44 353.44 0 0 0 .12 10.8c-.08.15-.3-.13-.59-.73-.15-.33-.56-1.06-.9-1.61-.77-1.28-9.8-15.48-10.3-16.23l-.38-.55h-1.94v10.46ZM49.61 2.46c1.53.18 2.63.9 3.19 2.08.25.54.27.66.27 1.78 0 1.42-.15 1.96-.73 2.7a3.6 3.6 0 0 1-1.87 1.18c-.55.17-1 .2-4.7.24l-4.1.06V2.38h3.56c1.96 0 3.93.04 4.38.1Zm-19.67 1.1 1.37 3.79c.61 1.7 1.5 4.12 1.98 5.4l.87 2.31-.5.06c-.65.09-7.24.1-8 .02l-.58-.06.22-.63c.12-.36.83-2.3 1.58-4.3.74-2.02 1.58-4.34 1.85-5.17.7-2.1.7-2.12.84-2.12.06 0 .23.32.37.7Z"
          clipRule="evenodd"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="31"
        fill="none"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M27.46 24.26a17.23 17.23 0 0 0 1.58-5.76c.18-1.7.16-3.54-.04-5.82-.1-1.24-.29-2.36-.6-3.44-.34-1.2-.8-2.29-1.4-3.34a9.1 9.1 0 0 0-2.97-3.07 12.2 12.2 0 0 0-3.96-1.61 18.63 18.63 0 0 0-8.43.16c-.99.25-1.9.6-2.71 1.02-.76.4-1.46.89-2.07 1.45-1.08 1-1.9 2.21-2.53 3.75-.54 1.2-.9 2.48-1.1 3.9-.17 1.22-.22 2.52-.17 4.1a24.3 24.3 0 0 0 .29 4.38c.27 1.65.74 3.1 1.44 4.48a9.41 9.41 0 0 0 2.4 3.02c.95.79 2.07 1.43 3.33 1.88a16.69 16.69 0 0 0 5.3.84c1.02 0 2.08-.08 3.15-.23 2.11-.29 3.93-.95 5.38-1.98a9.75 9.75 0 0 0 3.1-3.73Zm3.81-12.74c.22 1.2.33 2.51.33 3.86 0 1.8-.15 3.39-.47 4.8a15.4 15.4 0 0 1-1.66 4.39c-.54.97-1.24 1.86-2.09 2.64a13.3 13.3 0 0 1-2.9 2c-1.1.54-2.3.98-3.58 1.27-1.3.31-2.68.48-4.11.5-.21.02-.41.02-.62.02a19.1 19.1 0 0 1-8.14-1.61A12.67 12.67 0 0 1 5 27.42a11.16 11.16 0 0 1-2.15-2.58 15.32 15.32 0 0 1-2.12-6.93 26.01 26.01 0 0 1 0-5.24c.21-1.85.66-3.52 1.38-5.1a11.43 11.43 0 0 1 6.38-6.2 16.1 16.1 0 0 1 3.63-1 24.1 24.1 0 0 1 7.72-.1c1.1.18 2.14.45 3.11.82 1.6.59 3 1.4 4.17 2.45 1.22 1.1 2.2 2.42 2.89 3.96.57 1.24 1 2.58 1.26 4.02Zm-19.32-.14c-.02 0-.03 1.88-.03 4.15v4.11h.64l-.03-3.61c0-1.99-.03-3.68-.05-3.75-.02-.12-.02-.13.05-.12.08 0 .2.28 1.74 3.89l.1.22a84.48 84.48 0 0 1 .85 1.97l.59 1.38h.59l.78-1.83 1.74-4.07.4-.93c.18-.44.3-.64.34-.64.05 0 .05.04.03.3a51.6 51.6 0 0 0-.11 4.45c0 1.44 0 2.65.02 2.68.02.05.1.06.36.06h.33V15.5l-.02-4.14h-.99l-.33.77-1.49 3.49-.31.74-.23.56-.14.36a11.9 11.9 0 0 1-.66 1.55c-.03.01-.11-.18-.2-.42-.22-.57-.45-1.13-2.14-5.07l-.85-1.97-.47-.01c-.27 0-.49 0-.5.02Z"
          clipRule="evenodd"
        />
      </svg>
    </>
  );
}

Header.Logo = function HeaderLogo() {
  return (
    <Link to="/" className="flex items-center gap-8">
      <Logo />
    </Link>
  );
};

Header.Navigation = function HeaderNavigation({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: 'desktop' | 'mobile';
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;

  const handleClose = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  };

  const getInternalUrl = (url: string) => {
    if (
      url.includes('myshopify.com') ||
      url.includes(publicStoreDomain) ||
      url.includes(primaryDomainUrl)
    ) {
      return new URL(url).pathname;
    }
    return url;
  };

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <Link onClick={handleClose} to="/">
          Home
        </Link>
      )}
      {menu?.items.map((item) => {
        if (!item.url) return null;
        const url = getInternalUrl(item.url);
        return (
          <Link
            className="header-menu-item"
            key={item.id}
            onClick={handleClose}
            to={url}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

Header.Actions = function HeaderActions({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex gap-4" role="navigation">
      <Header.MobileMenuToggle />
      <Header.AccountLink isLoggedIn={isLoggedIn} />
      <Header.SearchToggle />
      <Header.CartToggle cart={cart} />
    </nav>
  );
};

Header.MobileMenuToggle = function HeaderMobileMenuToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
};

Header.AccountLink = function HeaderAccountLink({
  isLoggedIn,
}: {
  isLoggedIn: Promise<boolean>;
}) {
  return (
    <Link to="/account">
      <Suspense fallback="Sign in">
        <Await resolve={isLoggedIn} errorElement="Sign in">
          {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
        </Await>
      </Suspense>
    </Link>
  );
};

Header.SearchToggle = function HeaderSearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
};

Header.CartToggle = function HeaderCartToggle({
  cart,
}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<Header.CartBadge count={null} />}>
      <Await resolve={cart}>
        {(cart) => <Header.CartBadge count={cart?.totalQuantity || 0} />}
      </Await>
    </Suspense>
  );
};

Header.CartBadge = function HeaderCartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    open('cart');
    publish('cart_viewed', {
      cart,
      prevCart,
      shop,
      url: window.location.href || '',
    } as CartViewPayload);
  };

  return (
    <a href="/cart" onClick={handleClick}>
      Cart {count === null ? <span>&nbsp;</span> : count}
    </a>
  );
};
