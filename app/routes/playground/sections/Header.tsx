import Link from '@h2/Link';
import {Button, Flex} from '@radix-ui/themes';
import {Container} from '~/components';
import Brand from '~/components/new/Brand';

export default function Header() {
  return (
    <div className="fixed flex w-full h-20 z-max">
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
        <Flex
          justify="between"
          gap="4"
          gridColumn={{initial: '7 / -1'}}
          align="center"
        >
          <Flex asChild gap="4" align="center">
            <nav>
              <Link to="/shop">Shop</Link>
              <Link to="/editorial">Editorial</Link>
              <Link to="/about">About</Link>
            </nav>
          </Flex>
          <Flex asChild gap="4" align="center">
            <nav>
              <Link to="/search">Search</Link>
              <Flex asChild gap="2" align="center">
                <Link to="/bag">
                  Bag{' '}
                  <Button size="1" color="gray" variant="soft">
                    0
                  </Button>
                </Link>
              </Flex>
            </nav>
          </Flex>
        </Flex>
      </Container>
    </div>
  );
}
