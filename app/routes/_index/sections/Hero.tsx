import Link from '@h2/Link';
import {Flex} from '@radix-ui/themes';
import {lazy, Suspense} from 'react';
import {Container} from '~/components';
import {Text} from '~/components/Text';
const RainEffect = lazy(() => import('~/components/RainEffect'));
const Canvas = lazy(() =>
  import('@react-three/fiber').then((module) => ({default: module.Canvas})),
);

export default function Hero() {
  return (
    <div className="w-full overflow-hidden h-dvh">
      <Suspense fallback={<BackgroundFallback />}>
        <Canvas style={{width: '100%', height: '100%'}}>
          <RainEffect />
        </Canvas>
      </Suspense>
      <div className="absolute w-full bottom-[20vh]">
        <Container columns="1">
          <Flex className="text-background" direction="column" gap="2">
            <Text wrap="balance" className="uppercase">
              A biotech breakthrough for your barrier
            </Text>
            <Text wrap="balance">Reveal a younger you with DHK DEFENCE</Text>
            <Link prefetch="render" to="/shop/dhk-defence">
              <span className="inline pb-px border-b border-background/25">
                Shop now
              </span>
            </Link>
          </Flex>
        </Container>
      </div>
    </div>
  );
}

function BackgroundFallback() {
  return (
    <div
      className="w-full h-full bg-center bg-cover"
      style={{
        backgroundImage:
          'url(https://cdn.shopify.com/s/files/1/0817/9308/9592/files/background-image.jpg?v=1720660332)',
      }}
    ></div>
  );
}
