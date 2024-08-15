import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import Link from '@h2/Link';
import {useAside} from './Aside';
import {Text} from './Text';
import {Button, Flex} from '@radix-ui/themes';

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: OptimisticCartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <li key={id} className="flex items-center w-full gap-4">
      {image && (
        <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={100}
          loading="lazy"
          width={100}
        />
      )}

      <div className="flex flex-col justify-center w-full gap-3">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              close();
            }
          }}
        >
          <Text trim="both" asChild level="heading">
            <h4>{product.title}</h4>
          </Text>
        </Link>
        {/* <div>
          <LineCost variant={line} />
          <LineCostCompareAt variant={line} />
        </div> */}
        <ul>
          {selectedOptions.map(
            (option) =>
              option.value !== 'Default Title' && (
                <Text trim="both" key={option.name} asChild>
                  <li>{option.value}</li>
                </Text>
              ),
          )}
        </ul>
        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({line}: {line: OptimisticCartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <Flex align="baseline" gap="3" justify="between">
      <Flex align="baseline" gap="3">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <Button
            size="1"
            color="gray"
            variant="soft"
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
          >
            <span>&#8722;</span>
          </Button>
        </CartLineUpdateButton>
        <Text>{quantity}</Text>
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <Button
            size="1"
            color="gray"
            variant="soft"
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
          >
            <span>&#43;</span>
          </Button>
        </CartLineUpdateButton>
      </Flex>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </Flex>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      route="/bag"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <Text asChild level="heading">
        <Button
          size="1"
          color="gray"
          variant="soft"
          disabled={disabled}
          type="submit"
        >
          &times;
        </Button>
      </Text>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/bag"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
