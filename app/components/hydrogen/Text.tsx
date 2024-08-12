import {forwardRef} from 'react';
import {compose, cva} from './utils';
import type {VariantProps} from 'cva';

export type TypographyProps = VariantProps<typeof typography>;
const typography = cva({
  base: ['max-w-prose'],
  variants: {
    width: {
      narrow: 'max-w-prose-narrow', // 45ch / 720px / 28.125rem
      base: 'max-w-prose', // 65ch / 1040px / 65rem
      wide: 'max-w-prose-wide', // 80ch / 1280px / 80rem
      full: 'max-w-full', // 100%
    },
    weight: {
      light: 'font-light',
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    wrap: {
      wrap: 'text-wrap',
      nowrap: 'text-nowrap',
      pretty: 'text-pretty',
      balance: 'text-balance',
    },
    color: {
      heading: 'text-foreground',
      text: 'text-foreground/90',
      subtle: 'text-foreground/50',
    },
    truncate: {
      true: 'truncate',
      false: null,
    },
    uppercase: {
      true: 'uppercase',
      false: null,
    },
    fontStyle: {
      italic: 'italic',
      underline: 'underline',
      lineThrough: 'line-through',
      strike: 'strike', // Custom alternative to line-through
    },
    font: {
      heading: 'font-heading',
      display: 'font-display',
      body: 'font-body',
      fine: 'font-fine',
    },
    size: {
      fine: 'text-fine',
      body: 'text-body',
      heading: 'text-heading',
    },
    leading: {
      none: 'leading-none', // 1
      tight: 'leading-tight', // 1.25
      snug: 'leading-snug', // 1.375
      normal: 'leading-normal', // 1.5
      relaxed: 'leading-relaxed', // 1.625
      loose: 'leading-loose', // 2
    },
  },
  defaultVariants: {
    truncate: false,
    uppercase: false,
    wrap: 'pretty',
  },
});

export interface TextProps extends TypographyProps {
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
}
export const Text = forwardRef(
  (
    {
      as: Component = 'span',
      children,
      size = 'body',
      truncate = false,
      uppercase = false,
      leading = 'snug',
      color = 'text',
      className,
      ...props
    }: TextProps,
    ref,
  ) => {
    const styles = compose(typography);

    return (
      <Component
        ref={ref}
        data-h2="Text"
        className={styles({
          ...props,
          truncate,
          uppercase,
          size,
          leading,
          color,
          className,
        })}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
export interface HeadingProps extends TypographyProps {
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
}

export const Heading = forwardRef(
  (
    {
      as: Component = 'h2',
      children,
      truncate = false,
      uppercase = true,
      leading = 'tight',
      font = 'heading',
      size = 'heading',
      width,
      weight,
      align,
      wrap,
      color,
      fontStyle,
      className,
      ...props
    }: HeadingProps,
    ref,
  ) => {
    const styles = compose(typography);

    return (
      <Component
        ref={ref}
        data-h2="Heading"
        className={styles({
          truncate,
          uppercase,
          leading,
          width,
          weight,
          size,
          font,
          align,
          wrap,
          color,
          fontStyle,
          ...props,
          className,
        })}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

const span = cva({
  base: 'inline',
  variants: {
    pill: {
      true: ['px-5', 'rounded-full'],
      false: null,
    },
  },
});

export interface SpanProps extends TypographyProps {
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  pill?: boolean;
}
export const Span = forwardRef(
  (
    {
      as: Component = 'span',
      children,
      truncate = false,
      uppercase = false,
      pill = false,
      className,
      ...props
    }: SpanProps,
    ref,
  ) => {
    const styles = compose(span, typography);

    return (
      <Component
        ref={ref}
        className={styles({
          ...props,
          truncate,
          uppercase,
          pill,
          className,
        })}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

export interface EmProps extends TypographyProps {
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
}
export const Em = forwardRef(
  (
    {
      as: Component = 'em',
      children,
      truncate = false,
      uppercase = false,
      fontStyle = 'italic',
      className,
      ...props
    }: EmProps,
    ref,
  ) => {
    const styles = compose(typography);

    return (
      <Component
        ref={ref}
        className={styles({
          ...props,
          truncate,
          fontStyle,
          uppercase,
          className,
        })}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

export interface StrongProps extends TypographyProps {
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
}
export const Strong = forwardRef(
  (
    {
      as: Component = 'strong',
      weight = 'bold',
      children,
      truncate = false,
      uppercase = false,
      className,
      ...props
    }: StrongProps,
    ref,
  ) => {
    const styles = compose(typography);

    return (
      <Component
        ref={ref}
        className={styles({
          ...props,
          truncate,
          weight,
          uppercase,
          className,
        })}
        {...props}
      >
        {children}
      </Component>
    );
  },
);
