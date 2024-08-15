import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {cx} from '@h2/utils';
import {Text} from './Text';
import {Button, TextField} from '@radix-ui/themes';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
  className?: string;
};

export function CartSummary({cart, layout, className}: CartSummaryProps) {
  return (
    <div
      aria-labelledby="cart-summary"
      className={cx(
        layout !== 'page' &&
          'w-full bg-background px-4 py-6 gap-4 grid border-t border-foreground/25 pt-4',
        className,
      )}
    >
      <dl className="flex justify-between">
        <Text level="heading" asChild>
          <dt>Subtotal</dt>
        </Text>
        <Text level="heading" asChild>
          <dd>
            {cart.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </Text>
      </dl>
      {/* <CartDiscounts discountCodes={cart.discountCodes} /> */}
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
    </div>
  );
}
function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <Text level="heading" asChild>
      <a
        className="flex items-center justify-center w-full py-3 rounded bg-foreground text-background"
        href={checkoutUrl}
        target="_self"
      >
        Continue to Checkout
      </a>
    </Text>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-4">
          <TextField.Root
            className="w-full"
            size="2"
            type="text"
            name="discountCode"
            placeholder="Discount code"
          />
          <Button size="2" color="gray" variant="soft" type="submit">
            Apply
          </Button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/bag"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}
