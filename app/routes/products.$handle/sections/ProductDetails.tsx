import {AspectRatio, Box, Flex, ScrollArea} from '@radix-ui/themes';
import {useLoaderData} from '@remix-run/react';
import {Container} from '~/components';
import {ProductForm} from '~/components/ProductForm';
import * as Accordion from '@radix-ui/react-accordion';
import type {loader} from '~/routes/products.$handle/route';
import React from 'react';
import {Text, Heading} from '~/components/Text';
import {cx} from '@h2/utils';

export default function ProductDetails() {
  const {product} = useLoaderData<typeof loader>();

  const notes = [
    {
      id: 'gid://shopify/Metaobject/1234567890',
      title: 'Details & Usage',
      description:
        'Experience: Awakening, Hydrating, Smoothing, and Softening Application: Day and night, gently massage an almond-sized amount onto your face and neck. A product that plays as well with others as it does by itself, we recommend applying to recently cleansed, dry or damp skin following any less viscous supplemental treatments. For daytime use, finish with a generous amount of your favourite sunscreen. Specifications: * Skin ideal pH of 5.2 * Dermatologist Tested, Non-Irritating, Non-Comedogenic * Vegan & Cruelty-Free * Travel Safe * Free From: Parabens, Sulfates, Phthalates, PEGs, Mineral Oils, Artificial Colours and Fragrances * Made in Canada',
    },
    {
      id: 'gid://shopify/Metaobject/1234567891',
      title: 'Development Notes',
      description:
        'Experience: Awakening, Hydrating, Smoothing, and Softening Application: Day and night, gently massage an almond-sized amount onto your face and neck. A product that plays as well with others as it does by itself, we recommend applying to recently cleansed, dry or damp skin following any less viscous supplemental treatments. For daytime use, finish with a generous amount of your favourite sunscreen. Specifications: * Skin ideal pH of 5.2 * Dermatologist Tested, Non-Irritating, Non-Comedogenic * Vegan & Cruelty-Free * Travel Safe * Free From: Parabens, Sulfates, Phthalates, PEGs, Mineral Oils, Artificial Colours and Fragrances * Made in Canada',
    },
    {
      id: 'gid://shopify/Metaobject/1234567892',
      title: 'Shipping & Returns',
      description: 'It’s free.',
    },
  ];

  return (
    <Container align="center">
      <Box
        gridColumn="1 / span 6"
        width="calc(100% + var(--space-5))"
        height="100%"
        mx="-3"
        overflow="hidden"
        className="rounded"
      >
        <AspectRatio ratio={4 / 5}>
          {product.selectedVariant.image.url && (
            <img
              src={product.selectedVariant.image.url}
              alt="product"
              className="object-cover w-full h-full"
            />
          )}
        </AspectRatio>
      </Box>
      <Flex direction="column" gap="7" gridColumn="8 / span 4">
        <Flex direction="column" gap="5">
          <Flex align="baseline" justify="between">
            <Heading as="h1">{product.title}</Heading>
            <Text>★ 5</Text>
          </Flex>
          <Text>
            <span dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />
          </Text>
        </Flex>
        <ProductForm />
        <Accordion.Root type="single">
          {notes.map((note, index) => (
            <AccordionItem value={`item-${index + 1}`} key={note.id}>
              <AccordionTrigger>
                <Heading as="h3">{note.title}</Heading>
              </AccordionTrigger>
              <AccordionContent>{note.description}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion.Root>
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
      className={cx('border-t overflow-hidden', className)}
      {...props}
      ref={forwardedRef}
    >
      <Flex py="3" gap="3" direction="column">
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
    <Accordion.Header>
      <Accordion.Trigger
        className={cx(
          'group cursor-pointer outline-none text-left w-full',
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        <Text trim="both" wrap="nowrap">
          {children}
        </Text>
      </Accordion.Trigger>
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
        type="auto"
        scrollbars="vertical"
        className="relative max-h-32 scrollFade"
      >
        <Box pr="6">
          <Text wrap="pretty" className="block">
            {children}
          </Text>
        </Box>
      </ScrollArea>
    </Accordion.Content>
  ),
);
