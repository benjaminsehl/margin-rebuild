import React, {createContext, useContext, useState} from 'react';
import type {I18nBase} from '@shopify/hydrogen';

interface LocaleContextType {
  locale: I18nBase;
  setLocale: React.Dispatch<React.SetStateAction<I18nBase>>;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: I18nBase;
}) {
  const [locale, setLocale] = useState<I18nBase>(initialLocale);

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
