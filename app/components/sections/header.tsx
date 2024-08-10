import Link from '@h2/Link';
import {Flex} from '@radix-ui/themes';
import Brand from '~/components/new/Brand';

export default function Header() {
  return (
    <Flex>
      <Link to="/">
        <Brand.Wordmark />
        <Brand.Logo />
      </Link>
    </Flex>
  );
}
