import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  Heading,
  Section,
  Text,
} from '@radix-ui/themes';
import {Container} from '~/components';
import * as Accordion from '@radix-ui/react-accordion';
import React from 'react';
import {cx} from '@h2/utils';

export default function OurIngredients() {
  return (
    <Section>
      <Header />
      <Container align="start">
        <Box gridColumn={{initial: '1 / span 2'}}>
          <AspectRatio ratio={1 / 1}>
            <img
              alt="Ingredient"
              src="https://cdn.shopify.com/s/files/1/0586/4826/4886/products/custom_resized_cbddde06-d41b-438e-877c-63747aa95e78.jpg?v=1670272380&width=1800&height=2250&crop=center"
              style={{objectFit: 'cover', width: '100%', height: '100%'}}
            />
          </AspectRatio>
        </Box>
        <Box gridColumn={{initial: '4 / span 8'}}>
          <KeyIngredients />
        </Box>
      </Container>
      <Container>
        <Box gridColumn={{initial: '8 / span 4'}}>
          <Heading>Full Ingredients</Heading>
          <Text>
            AQUA, GLYCERIN, COCAMIDOPROPYL BETAINE, NIACINAMIDE, ALOE
            BARBADENSIS LEAF JUICE, CAFFEINE, ANANAS SATIVUS (PINEAPPLE) FRUIT
            EXTRACT, ALLANTOIN, SALIX NIGRA (WILLOW) BARK EXTRACT, PANTHENOL,
            SODIUM PCA, CELLULOSE GUM, XANTHAN GUM, INULIN, CELLULOSE, GLUCOSE,
            FRUCTOSE, HYDROXYETHYLCELLULOSE, SODIUM CITRATE, COCO GLUCOSIDE,
            POTASSIUM SORBATE, SODIUM BENZOATE, TOCOPHEROL, CITRIC ACID
          </Text>
        </Box>
      </Container>
    </Section>
  );
}

function Header() {
  return (
    <Container>
      <Box gridColumn={{initial: '1 / span 7'}}>
        <Heading>Our Ingredients</Heading>
      </Box>
      <Box gridColumn={{initial: '8 / span 4'}}>
        <Text>
          A scientifically sound approach to formula development and ingredient
          selection, prioritizing actives with proven benefits, sourced in their
          effective state, and tested against the strictest standards.
        </Text>
      </Box>
    </Container>
  );
}

function KeyIngredients() {
  return (
    <Accordion.Root
      className=""
      type="single"
      defaultValue="item-1"
      collapsible
    >
      <AccordionItem value="item-1">
        <AccordionTrigger index="1">Glycerin</AccordionTrigger>
        <AccordionContent>
          One of the body’s Natural Moisturizing Factors, protects the skin
          barrier, boosts and extends skin hydration, and prevents water loss.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger index="2">Coconut-based Surfactants</AccordionTrigger>
        <AccordionContent>
          Gentle, non-stripping cleansing agents derived from coconut oil that
          effectively remove dirt, oil, and makeup.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger index="3">Niacinamide</AccordionTrigger>
        <AccordionContent>
          A form of Vitamin B3 that visibly improves the appearance of enlarged
          pores, uneven skin tone, fine lines, and dullness.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4">
        <AccordionTrigger index="4">Pineapple Fruit Extract</AccordionTrigger>
        <AccordionContent>
          A natural source of AHAs that gently exfoliate, smooth, and brighten.
          Pineapple Fruit Extract is rich in antioxidants and enzymes that help
          to clarify and refine the skin.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-5">
        <AccordionTrigger index="4">Aloe Vera</AccordionTrigger>
        <AccordionContent>
          A soothing, hydrating, and anti-inflammatory botanical that calms
          irritation and redness. Aloe Vera is a natural source of salicylic
        </AccordionContent>
      </AccordionItem>
    </Accordion.Root>
  );
}

const AccordionItem = React.forwardRef(
  ({children, className, ...props}, forwardedRef) => (
    <Accordion.Item
      className={cx('border-t overflow-hidden', className)}
      {...props}
      ref={forwardedRef}
    >
      <Grid gap="4" columns="2" align="baseline">
        {children}
      </Grid>
    </Accordion.Item>
  ),
);

const AccordionTrigger = React.forwardRef(
  ({children, className, index = ' ', ...props}, forwardedRef) => (
    <Accordion.Header>
      <Accordion.Trigger
        className={cx(
          'group cursor-pointer outline-none text-left w-full',
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        <Grid gap="4" columns="4">
          <Box gridColumn="1 / 1">
            <Text>{index}</Text>
          </Box>
          <Box gridColumn="2 / 4">
            <Text wrap="nowrap">{children}</Text>
          </Box>
        </Grid>
      </Accordion.Trigger>
    </Accordion.Header>
  ),
);

const AccordionContent = React.forwardRef(
  ({children, className, ...props}, forwardedRef) => (
    <Accordion.Content
      className={cx(
        'data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <Text wrap="pretty" className="block">
        {children}
      </Text>
    </Accordion.Content>
  ),
);
