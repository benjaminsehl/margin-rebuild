import {Canvas} from '@react-three/fiber';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {type MetaFunction} from '@remix-run/react';

import RainEffect from '~/components/ShowerDoor';

export const meta: MetaFunction = () => {
  return [{title: 'Margin'}];
};

export async function loader(args: LoaderFunctionArgs) {
  return defer({});
}

export default function Homepage() {
  return (
    <div className="home" style={{width: '100vw', height: '100vh'}}>
      <Canvas style={{width: '100%', height: '100%'}}>
        <RainEffect />
      </Canvas>
    </div>
  );
}
