import {AspectRatio, Box, Flex, ScrollArea} from '@radix-ui/themes';
import {useLoaderData} from '@remix-run/react';
import {Container} from '~/components';
import {ProductForm} from '~/components/ProductForm';
import * as Accordion from '@radix-ui/react-accordion';
import type {loader} from '~/routes/products.$handle/route';
import React from 'react';
import {Text} from '~/components/Text';
import {cx} from '@h2/utils';

export default function ProductDetails() {
  const {product} = useLoaderData<typeof loader>();

  const notes = [
    {
      id: 'gid://shopify/Metaobject/1234567890',
      title: 'Key Benefits',
      description:
        'Cleansing without stripping: \nA skin-enriching formulation of 5% Glycerin plus Hyaluronic Acid, Argan Oil and Jojoba Oil replenishes the skin. \nSmoothing without over-exfoliating: \n1% Gluconolactone, the polyhydroxy acid (PHA) powerhouse, gently exfoliates the skin while drawing in moisture \nBarrier balancing & inflamation reducing: \nA barrier building complex of 2% Niacinamide (Vitamin B3), Allantoin and Tocopherol (Vitamin E) soothes and balances the skin, reducing the signs of irritation and inflammation while also supporting barrier function. \nGood for: \nFrequent showers \nTotal-body cleansing without a dry, stripped sensation \nPre-shave prep, and as a shaving medium',
    },
    {
      id: 'gid://shopify/Metaobject/1234567891',
      title: 'Product Details',
      description:
        'Made for daily or more-than-daily showerers, this body wash improves the skin impact and experience of body cleansing without stripping the skin. \nDispense onto hands or bathing tool and massage into damp skin to develop a rich foam. Rinse well. Intended for use from the neck down. In the event of contact with eyes, rinse thoroughly with water. \npH: 4.8 - 5.4 \nFree from Parabens, Sulfates, Phthalates, PEGs, Mineral Oils, and Artificial Colours.',
    },
    {
      id: 'gid://shopify/Metaobject/1234567892',
      title: 'Shipping & Returns',
      description:
        'Free shipping on all orders over $50. For questions about products or your order, visit our FAQ or Email us: info@margin.global',
    },
  ];

  return (
    <Container align="center">
      <Box
        gridColumn={{initial: '1', sm: '1 / span 6'}}
        width={{initial: '100%', sm: 'calc(100% + var(--space-5))'}}
        height="100%"
        mx={{sm: '-3'}}
        overflow="hidden"
        className="rounded"
      >
        {product.selectedVariant?.image?.url && (
          <img
            src={product.selectedVariant.image.url}
            alt="product"
            className="object-cover w-full h-full max-h-[calc(100vh-2rem)]"
          />
        )}
      </Box>
      <Flex
        direction="column"
        gap="3"
        py={{initial: '2rem', sm: '6rem'}}
        gridColumn={{initial: '1', sm: '7 / span 6', md: '8 / span 4'}}
      >
        <Flex direction="column">
          <Flex align="baseline" justify="between">
            <h1>
              <Text level="heading">{product.title}</Text>
            </h1>
            <Text level="heading">&#9733; 5</Text>
          </Flex>
          <Text className="prose text-balance">
            <span dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />
          </Text>
        </Flex>
        <ProductForm />
        <Box pt="7">
          <Accordion.Root type="single" collapsible>
            {notes.map((note, index) => (
              <AccordionItem value={`item-${index + 1}`} key={note.id}>
                <AccordionTrigger>{note.title}</AccordionTrigger>
                <AccordionContent>{note.description}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion.Root>
        </Box>
      </Flex>
    </Container>
  );
}

const AccordionItem = React.forwardRef(
  (
    {children, className, ...props}: Accordion.AccordionItemProps,
    forwardedRef: React.Ref<HTMLDivElement>,
  ) => (
    <Accordion.Item
      className={cx(
        'border-t border-foreground/25 overflow-hidden [data',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <Flex pt="1" gap="3" direction="column">
        {children}
      </Flex>
    </Accordion.Item>
  ),
);

const AccordionTrigger = React.forwardRef(
  (
    {
      children,
      className,
      index = ' ',
      ...props
    }: Accordion.AccordionTriggerProps & {index?: string},
    forwardedRef: React.Ref<HTMLButtonElement>,
  ) => (
    <Accordion.Header asChild>
      <h3 className="flex pt-2 data-[state=open]:pb-2 data-[state=closed]:pb-6 leading-none">
        <Accordion.Trigger
          className={cx(
            'group cursor-pointer outline-none text-left w-full',
            className,
          )}
          {...props}
          ref={forwardedRef}
        >
          <Flex align="center" justify="between">
            <Text level="heading" trim="both" wrap="nowrap">
              {children}
            </Text>
            <Text
              trim="both"
              className="inline-block ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=closed]:rotate-45 origin-center"
            >
              &times;
            </Text>
          </Flex>
        </Accordion.Trigger>
      </h3>
    </Accordion.Header>
  ),
);

const AccordionContent = React.forwardRef(
  (
    {children, className, ...props}: Accordion.AccordionContentProps,
    forwardedRef: React.Ref<HTMLDivElement>,
  ) => (
    <Accordion.Content
      className={cx(
        'data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <ScrollArea
        type="scroll"
        scrollbars="vertical"
        className="relative max-h-32 scrollFade"
      >
        <Box pr="6">
          <Text className="block mb-8 whitespace-pre-wrap">{children}</Text>
        </Box>
      </ScrollArea>
    </Accordion.Content>
  ),
);
