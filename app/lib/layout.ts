// app/lib/layout-utils.ts
import type {ReactNode} from 'react';
import {useMatches} from '@remix-run/react';
import * as Layouts from '~/components/layouts';
import type {LayoutType} from '~/components/layouts';

export interface RouteHandle {
  layout?: LayoutType;
}

export function useRouteLayout(): React.ComponentType<{children: ReactNode}> {
  const matches = useMatches();

  const layoutKey = matches
    .reverse()
    .find(
      (match) =>
        (match.handle as RouteHandle | undefined)?.layout as
          | LayoutType
          | undefined,
    )?.handle?.layout as LayoutType;

  if (!layoutKey || !(layoutKey in Layouts)) {
    return Layouts.Default as React.ComponentType<{children: ReactNode}>;
  }

  return Layouts[layoutKey] as React.ComponentType<{children: ReactNode}>;
}
