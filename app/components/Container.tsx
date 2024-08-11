import {Grid, type GridProps} from '@radix-ui/themes';

export default function Container({
  align = 'baseline',
  children,
  className,
  ...props
}: GridProps) {
  return (
    <Grid
      align={align}
      columns="12"
      gap="8"
      maxWidth="83rem"
      width="100%"
      mx="auto"
      p="4"
      className={className}
      {...props}
    >
      {children}
    </Grid>
  );
}
