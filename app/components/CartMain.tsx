import {type OptimisticCartLine, useOptimisticCart} from '@shopify/hydrogen';
import Link from '@h2/Link';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {useCart} from '~/contexts/CartContext';
import Container from './Container';
import {Text} from './Text';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout}: CartMainProps) {
  const originalCart = useCart();
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity! > 0;

  return (
    <>
      <main className="flex flex-col flex-1 p-4 overflow-y-auto">
        <CartEmpty hidden={linesCount} layout={layout} />
        <div aria-labelledby="cart-lines">
          <ul className="grid gap-4">
            {(cart?.lines?.nodes ?? []).map((line: OptimisticCartLine) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
      </main>
      {cartHasItems && (
        <footer className="flex-shrink-0">
          <CartSummary cart={cart} layout={layout} />
        </footer>
      )}
    </>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div className="flex flex-col items-start gap-4 pt-8" hidden={hidden}>
      <Text as="p" className="max-w-sm text-balance">
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </Text>
      <Link
        to="/shop"
        className="pb-1 border-b border-foreground/25"
        onClick={close}
        prefetch="viewport"
      >
        Continue shopping
      </Link>
    </div>
  );
}
