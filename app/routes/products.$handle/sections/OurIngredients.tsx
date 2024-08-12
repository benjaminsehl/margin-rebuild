import {AspectRatio, Box, Grid, Section} from '@radix-ui/themes';
import {Text, Heading} from '~/components/Text';
import {Container} from '~/components';
import * as Accordion from '@radix-ui/react-accordion';
import React from 'react';
import {cx} from '@h2/utils';

export default function OurIngredients() {
  const [value, setValue] = React.useState('item-1');

  const ingredients = [
    {
      id: 'gid://shopify/Metaobject/1234567890',
      image:
        'https://cdn.shopify.com/s/files/1/0586/4826/4886/products/custom_resized_cbddde06-d41b-438e-877c-63747aa95e78.jpg',
      name: 'Glycerin',
      description:
        'One of the body’s Natural Moisturizing Factors, protects the skin barrier, boosts and extends skin hydration, and prevents water loss.',
    },
    {
      id: 'gid://shopify/Metaobject/1234567891',
      image:
        'https://cdn.shopify.com/s/files/1/0586/4826/4886/products/custom_resized_cbddde06-d41b-438e-877c-63747aa95e78.jpg',
      name: 'Coconut-based Surfactants',
      description:
        'Gentle, non-stripping cleansing agents derived from coconut oil that effectively remove dirt, oil, and makeup.',
    },
    {
      id: 'gid://shopify/Metaobject/1234567892',
      image:
        'https://cdn.shopify.com/s/files/1/0586/4826/4886/products/custom_resized_cbddde06-d41b-438e-877c-63747aa95e78.jpg',
      name: 'Niacinamide',
      description:
        'A form of Vitamin B3 that visibly improves the appearance of enlarged pores, uneven skin tone, fine lines, and dullness.',
    },
    {
      id: 'gid://shopify/Metaobject/1234567893',
      image:
        'https://cdn.shopify.com/s/files/1/0586/4826/4886/products/custom_resized_cbddde06-d41b-438e-877c-63747aa95e78.jpg',
      name: 'Pineapple Fruit Extract',
      description:
        'A natural source of AHAs that gently exfoliate, smooth, and brighten. Pineapple Fruit Extract is rich in antioxidants and enzymes that help to clarify and refine the skin.',
    },
    {
      id: 'gid://shopify/Metaobject/1234567894',
      image:
        'https://cdn.shopify.com/s/files/1/0586/4826/4886/products/custom_resized_cbddde06-d41b-438e-877c-63747aa95e78.jpg',
      name: 'Aloe Vera',
      description:
        'A soothing, hydrating, and anti-inflammatory botanical that calms irritation and redness. Aloe Vera is a natural source of salicylic acid, which helps to gently exfoliate and unclog pores.',
    },
  ];

  return (
    <Section>
      <Header />
      <Container align="start">
        <Box gridColumn={{initial: '1 / span 2'}}>
          {ingredients.map((ingredient, index) => (
            <Box
              key={ingredient.id}
              display={{md: value !== `item-${index + 1}` ? 'none' : 'block'}}
              onClick={() => setValue(`item-${index + 1}`)}
              position="relative"
            >
              <AspectRatio ratio={1 / 1}>
                <img
                  alt={ingredient.name}
                  src={ingredient.image}
                  className="object-cover w-full h-full border"
                />
              </AspectRatio>
            </Box>
          ))}
        </Box>
        <Box gridColumn={{initial: '4 / span 8'}}>
          <Accordion.Root
            className=""
            type="single"
            value={value}
            onValueChange={setValue}
          >
            {ingredients.map((ingredient, index) => (
              <AccordionItem value={`item-${index + 1}`} key={ingredient.id}>
                <AccordionTrigger index={`${index + 1}`}>
                  {ingredient.name}
                </AccordionTrigger>
                <AccordionContent>{ingredient.description}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion.Root>
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
      <Grid gap="8" columns="2" align="baseline">
        {children}
      </Grid>
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
      <Text wrap="pretty" className="block">
        {children}
      </Text>
    </Accordion.Content>
  ),
);
