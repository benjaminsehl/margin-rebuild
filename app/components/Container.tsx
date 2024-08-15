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
        gap={{initial: '2', sm: '8'}}
        columns={{initial: '1', sm: '12'}}
        maxWidth=""
        width="100%"
        mx="auto"
        px={{initial: '4', sm: '8'}}
        py={{initial: '9', sm: '4'}}
        className={className}
        {...props}
      >
        {children}
      </Grid>
    </Box>
  );
}
