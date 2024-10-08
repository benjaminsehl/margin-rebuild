import {createContext, type ReactNode, useContext, useState} from 'react';
import {Text} from './Text';
import {Button} from '@radix-ui/themes';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  return (
    <div
      aria-modal
      className={`overlay z-max ${expanded ? 'expanded' : ''}`}
      role="dialog"
    >
      <button className="close-outside" onClick={close} />
      <aside className="flex flex-col w-full h-dvh max-w-md shadow-xl bg-background">
        <header className="flex justify-between flex-shrink-0 p-4 border-b border-foreground/25">
          <Text asChild variant="heading">
            <h3>{heading}</h3>
          </Text>
          <Text asChild variant="heading">
            <Button size="1" color="gray" variant="soft" onClick={close}>
              &times;
            </Button>
          </Text>
        </header>
        {children}
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
