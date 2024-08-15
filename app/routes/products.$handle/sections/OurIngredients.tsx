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
    <Section pt={{initial: '0', sm: '9'}}>
      <Header />
      <Container align="start">
        <Grid
          columns={{initial: '4', sm: '1'}}
          gap="4"
          pb="8"
          gridColumn={{initial: '1', sm: '1 / span 2'}}
        >
          {ingredients.map((ingredient, index) => (
            <Box
              key={ingredient.id}
              display={{sm: value !== `item-${index + 1}` ? 'none' : 'block'}}
              onClick={() => setValue(`item-${index + 1}`)}
              position="relative"
            >
              <Box asChild pb="2" display={{sm: 'none'}}>
                <Text level="heading">{index + 1}</Text>
              </Box>
              <AspectRatio ratio={1 / 1}>
                <img
                  alt={ingredient.name}
                  src={ingredient.image}
                  className="object-cover w-full h-full border"
                />
              </AspectRatio>
            </Box>
          ))}
        </Grid>
        <Box gridColumn={{sm: '4 / span 8'}}>
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
        <Box gridColumn={{sm: '8 / span 4'}}>
          <h3>
            <Text level="fine">Full Ingredients</Text>
          </h3>
          <Text level="fine" as="p">
            Aqua, Glycerin, Cocamidopropyl Betaine, Niacinamide, Aloe
            Barbadensis Leaf Juice, Caffeine, Ananas Sativus (Pineapple) Fruit
            Extract, Allantoin, Salix Nigra (Willow) Bark Extract, Panthenol,
            Sodium PCA, Cellulose Gum, Xanthan Gum, Inulin, Cellulose, Glucose,
            Fructose, Hydroxyethylcellulose, Sodium Citrate, Coco Glucoside,
            Potassium Sorbate, Sodium Benzoate, Tocopherol, Citric Acid
          </Text>
        </Box>
      </Container>
    </Section>
  );
}

function Header() {
  return (
    <Container py={{initial: '0'}}>
      <Box gridColumn={{sm: '1 / span 7'}}>
        <h2>
          <Text level="heading">Our Ingredients</Text>
        </h2>
      </Box>
      <Box gridColumn={{sm: '8 / span 4'}}>
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
      className={cx('border-t border-foreground/25 overflow-hidden', className)}
      {...props}
      ref={forwardedRef}
    >
      <Grid
        gap={{initial: '2', sm: '8'}}
        columns={{initial: '1', sm: '2'}}
        align="baseline"
      >
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
        <Grid gap="4" columns="4" pb="5" pt="2">
          <Box gridColumn="1 / 1">
            <Text level="heading">{index}</Text>
          </Box>
          <Box gridColumn="2 / 4">
            <Text level="heading" wrap="nowrap">
              {children}
            </Text>
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
      <Box pb="5">
        <Text wrap="pretty" className="block">
          {children}
        </Text>
      </Box>
    </Accordion.Content>
  ),
);
