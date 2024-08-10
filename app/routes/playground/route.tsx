import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {type MetaFunction} from '@remix-run/react';
import {Header, Hero, ProductDetails, OurIngredients} from './sections';

export const handle = {
  layout: 'Frameless',
};

export const meta: MetaFunction = () => {
  return [{title: 'Margin'}];
};

export async function loader(args: LoaderFunctionArgs) {
  return json({});
}

export default function Homepage() {
  return (
    <>
      <Header />
      <ProductDetails />
      {/* <Hero /> */}
      <OurIngredients />
    </>
  );
}
