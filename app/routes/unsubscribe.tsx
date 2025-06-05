import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {type MetaFunction} from '@remix-run/react';
import {Container} from '~/components';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Margin · Bye!`}];
};

export async function loader(args: LoaderFunctionArgs) {
  return {};
}

export default function Page() {
  return (
    <>
      <Container columns="1" pt="8rem" fullScreen>
        <h1 className="sr-only">Unsubscribe</h1>
        <main className="prose">
          <p>
            You have been unsubscribed from the Margin newsletter. You will no
            longer receive emails from us.
          </p>
        </main>
      </Container>
    </>
  );
}
