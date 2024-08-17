import {Box, Flex, ScrollArea} from '@radix-ui/themes';
import {useLoaderData} from '@remix-run/react';
import {Container} from '~/components';
import {ProductForm} from '~/components/ProductForm';
import * as Accordion from '@radix-ui/react-accordion';
import type {loader} from '~/routes/shop.$handle/route';
import React from 'react';
import {Text} from '~/components/Text';
import {cx} from '@h2/utils';
import Link from '@h2/Link';
import RichText from '@h2/RichText';

export default function ProductDetails() {
  const {product} = useLoaderData<typeof loader>();

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
        gridColumn={{initial: '1', sm: '7 / span 6', lg: '8 / span 4'}}
      >
        <Flex direction="column">
          <Flex align="baseline" justify="between">
            <h1>
              <Text variant="heading">{product.title}</Text>{' '}
            </h1>
            {product?.subtitle?.value && (
              <Text className="opacity-50" variant="heading">
                {product.subtitle.value}
              </Text>
            )}
          </Flex>
          <Text className="prose text-balance">
            <span dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />
          </Text>
        </Flex>
        <ProductForm />
        <Box pt="7">
          <Accordion.Root type="single" collapsible>
            {product?.keyBenefits?.value && (
              <AccordionItem value={`item-1`}>
                <AccordionTrigger>Key Benefits</AccordionTrigger>
                <AccordionContent>
                  <RichText data={product.keyBenefits.value} />
                </AccordionContent>
              </AccordionItem>
            )}
            {product?.details?.value && (
              <AccordionItem value={`item-2`}>
                <AccordionTrigger>Product Details</AccordionTrigger>
                <AccordionContent>
                  <RichText data={product.details.value} />
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value={`item-1`}>
              <AccordionTrigger>Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                <Text as="p" variant="body" className="prose">
                  Free shipping on all orders over $50. For questions about
                  products or your order, visit our FAQ or Email us:{' '}
                  <Link to="mailto:info@margin.global">info@margin.global</Link>
                </Text>
              </AccordionContent>
            </AccordionItem>
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
            <Text variant="heading" trim="both" wrap="nowrap">
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
        className="relative sm:max-h-44 scrollFade"
      >
        <Box pr="6">
          <Text className="block mb-8 whitespace-pre-wrap">{children}</Text>
        </Box>
      </ScrollArea>
    </Accordion.Content>
  ),
);
