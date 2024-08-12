import React from 'react';
import {
  Text as RText,
  Heading as RHeading,
  type TextProps,
  type HeadingProps,
} from '@radix-ui/themes';

import {cva} from '@h2/utils';
import type {VariantProps} from 'cva';

export type TypographyBaseProps = VariantProps<typeof typography>;
const typography = cva({
  base: ['max-w-prose'],
  variants: {
    level: {
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
>(({level = 'body', children, className, ...props}, ref) => {
  return (
    <RText ref={ref} className={typography({level, className})} {...props}>
      {children}
    </RText>
  );
});

// Define the Heading component with forwardRef
export const Heading = React.forwardRef<
  HTMLHeadingElement,
  HeadingProps & TypographyProps
>(({level = 'heading', children, className, ...props}, ref) => {
  return (
    <RHeading
      weight="regular"
      ref={ref}
      className={typography({level, className})}
      {...props}
    >
      {children}
    </RHeading>
  );
});
