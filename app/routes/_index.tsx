import {Suspense, lazy} from 'react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {type MetaFunction} from '@remix-run/react';

const Canvas = lazy(() =>
  import('@react-three/fiber').then((module) => ({default: module.Canvas})),
);

const RainEffect = lazy(() => import('~/components/RainEffect'));

export const meta: MetaFunction = () => {
  return [{title: 'Margin'}];
};

export async function loader(args: LoaderFunctionArgs) {
  return defer({});
}

export default function Homepage() {
  return (
    <div className="home" style={{width: '100%', height: '100vh'}}>
      <Suspense fallback={<BackgroundFallback />}>
        <Canvas style={{width: '100%', height: '100%'}}>
          <RainEffect />
        </Canvas>
      </Suspense>
    </div>
  );
}

function BackgroundFallback() {
  return (
    <div
      style={{
        backgroundImage:
          'url(https://cdn.shopify.com/s/files/1/0817/9308/9592/files/background-image.jpg?v=1720660332)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
      }}
    ></div>
  );
}
