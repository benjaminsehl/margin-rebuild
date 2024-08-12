import {Box, Grid, type GridProps} from '@radix-ui/themes';

export default function Container({
  align = 'baseline',
  children,
  className,
  fullScreen = false,
  ...props
}: GridProps & {fullScreen?: boolean}) {
  return (
    <Box width="100%" minHeight={fullScreen ? '100vh' : undefined}>
      <Grid
        position="sticky"
        top="0"
        align={align}
        columns="12"
        gap="8"
        maxWidth=""
        width="100%"
        mx="auto"
        px="8"
        py="4"
        className={className}
        {...props}
      >
        {children}
      </Grid>
    </Box>
  );
}
