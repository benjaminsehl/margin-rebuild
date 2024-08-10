import {Grid} from '@radix-ui/themes';

export default function Container({
  align = 'baseline',
  children,
}: {
  align?: 'baseline' | 'center' | 'start' | 'end';
  children?: React.ReactNode;
}) {
  return (
    <Grid align={align} columns="12" gap="4" maxWidth="83rem" mx="auto" p="4">
      {children}
    </Grid>
  );
}
