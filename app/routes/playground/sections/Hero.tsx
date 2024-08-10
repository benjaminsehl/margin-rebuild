import {lazy, Suspense} from 'react';
const RainEffect = lazy(() => import('~/components/RainEffect'));
const Canvas = lazy(() =>
  import('@react-three/fiber').then((module) => ({default: module.Canvas})),
);

export default function Hero() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Suspense fallback={<BackgroundFallback />}>
        <Canvas style={{width: '100%', height: '100%'}}>
          <RainEffect />
        </Canvas>
      </Suspense>
      <div>
        <h1 className="absolute bottom-0 left-0 text-white text-4xl font-bold text-center mt-20">
          Margin
        </h1>
      </div>
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
