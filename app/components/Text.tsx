import React from 'react';
import {Text as RText, type TextProps} from '@radix-ui/themes';

import {cva} from '@h2/utils';
import type {VariantProps} from 'cva';

export type TypographyBaseProps = VariantProps<typeof typography>;
const typography = cva({
  base: ['max-w-prose'],
  variants: {
    variant: {
      heading: ['font-heading', 'text-heading', 'uppercase', 'tracking-wide'],
      body: ['font-body', 'text-body'],
      fine: ['font-fine', 'text-fine', 'uppercase', 'tracking-tight'],
    },
  },
});

export interface TypographyProps extends TypographyBaseProps {
  children?: React.ReactNode;
  className?: string;
}

// Define the Text component with forwardRef
export const Text = React.forwardRef<
  HTMLSpanElement,
  TextProps & TypographyProps
>(({variant = 'body', children, className, ...props}, ref) => {
  return (
    <RText ref={ref} className={typography({variant, className})} {...props}>
      {children}
    </RText>
  );
});
