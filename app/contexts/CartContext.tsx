import {createContext, useContext, useEffect, useState} from 'react';
import {useFetcher} from '@remix-run/react';
import type {Cart} from '@shopify/hydrogen/storefront-api-types';

const CartContext = createContext<Cart | undefined>(undefined);

export function CartProvider({children}: {children: React.ReactNode}) {
  const fetcher = useFetcher();
  const [initialLoadTriggered, setInitialLoadTriggered] = useState(false);

  useEffect(() => {
    if (!initialLoadTriggered && fetcher.state === 'idle') {
      setInitialLoadTriggered(true);
      fetcher.load('/bag');
    }
  }, [fetcher.state, initialLoadTriggered]);

  return (
    <CartContext.Provider value={fetcher.data as Cart}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
