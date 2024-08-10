import Link from '@h2/Link';
import {Flex} from '@radix-ui/themes';
import {Container} from '~/components';
import Brand from '~/components/new/Brand';

export default function ProductDetails() {
  return (
    <Container align="center">
      <Flex
        justify="between"
        align="center"
        gridColumn={{initial: '1 / span 3'}}
        asChild
      >
        <Link to="/">
          <Brand.Wordmark />
          <Brand.Logo />
        </Link>
      </Flex>
      <Flex justify="between" gap="4" gridColumn={{initial: '7 / -1'}}>
        <Flex asChild gap="4">
          <nav>
            <Link to="/shop">Shop</Link>
            <Link to="/editorial">Editorial</Link>
            <Link to="/about">About</Link>
          </nav>
        </Flex>
        <Flex asChild gap="4">
          <nav>
            <Link to="/search">Search</Link>
            <Link to="/bag">Bag</Link>
          </nav>
        </Flex>
      </Flex>
    </Container>
  );
}
