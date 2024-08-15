import {createContext, useContext, useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Cart} from '@shopify/hydrogen/storefront-api-types';

const CartContext = createContext<Cart | undefined>(undefined);

export function CartProvider({children}: {children: React.ReactNode}) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data || fetcher.state === 'loading') return;

    fetcher.load('/bag');
  }, [fetcher]);

  return (
    <CartContext.Provider value={fetcher.data as Cart}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
