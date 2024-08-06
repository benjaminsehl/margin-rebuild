// app/contexts/LocaleContext.tsx
import React, {createContext, useContext, useState} from 'react';
import type {CountryCode} from '@shopify/hydrogen/storefront-api-types';
import type {RootLoader} from '~/root'; // Import the loader type

export interface I18nLocale {
  language: string;
  country: CountryCode;
}

interface LocaleContextType {
  locale: I18nLocale;
  setLocale: React.Dispatch<React.SetStateAction<I18nLocale>>;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Update the prop type here
export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: I18nLocale; // Update the type to I18nLocale
}) {
  const [locale, setLocale] = useState<I18nLocale>(initialLocale);

  return (
    <LocaleContext.Provider value={{locale, setLocale}}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
