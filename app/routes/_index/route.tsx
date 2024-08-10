import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {type MetaFunction} from '@remix-run/react';
import {Hero} from './sections';

export const handle = {
  layout: 'Default',
};

export const meta: MetaFunction = () => {
  return [{title: 'Margin'}];
};

export async function loader(args: LoaderFunctionArgs) {
  return defer({});
}

export default function Homepage() {
  return (
    <>
      <Hero />
    </>
  );
}
