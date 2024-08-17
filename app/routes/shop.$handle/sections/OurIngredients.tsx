import {AspectRatio, Box, Grid, Section} from '@radix-ui/themes';
import {Text} from '~/components/Text';
import {Container} from '~/components';
import * as Accordion from '@radix-ui/react-accordion';
import React from 'react';
import {cx} from '@h2/utils';
import {useLoaderData} from '@remix-run/react';
import type {loader} from '~/routes/shop.$handle/route';
import {Image} from '@shopify/hydrogen';

type IngredientNode = {
  id: string;
  title: {value: string};
  description: {value: string};
  image: {
    reference: {
      image: {
        altText: string | null;
        height: number;
        width: number;
        url: string;
      };
    };
  } | null;
};

type KeyIngredientsRaw = {
  references: {
    nodes: IngredientNode[];
  };
};

type Ingredient = {
  id: string;
  title?: string;
  description?: string;
  image?: {
    altText: string | null;
    height: number;
    width: number;
    url: string;
  } | null;
};

type KeyIngredientsParsed = Ingredient[];

function parseKeyIngredients(
  response: KeyIngredientsRaw,
): KeyIngredientsParsed {
  const parsedIngredients: Ingredient[] = response.references.nodes.map(
    (node) => ({
      id: node.id,
      title: node.title.value || undefined,
      description: node.description.value || undefined,
      image: node.image ? node.image.reference.image : null,
    }),
  );

  return parsedIngredients;
}

export default function OurIngredients() {
  const {
    product: {ingredientsHeadline, keyIngredients, fullIngredients},
  } = useLoaderData<typeof loader>();
  const [value, setValue] = React.useState('item-1');

  const headline = ingredientsHeadline?.value || null;
  const ingredients = keyIngredients
    ? parseKeyIngredients(keyIngredients)
    : null;
  const other = fullIngredients?.value || null;

  if (!ingredients && !other) {
    return null;
  }

  return (
    <Section pt={{initial: '0', sm: '9'}}>
      {headline && <Header>{headline}</Header>}
      {ingredients.length > 0 && (
        <Container align="start">
          <Grid
            columns={{initial: '4', sm: '1'}}
            gap="4"
            pb="8"
            gridColumn={{initial: '1', sm: '1 / span 2'}}
          >
            {ingredients.map(
              (ingredient, index) =>
                ingredient?.image && (
                  <Box
                    key={ingredient.id}
                    display={{
                      sm: value !== `item-${index + 1}` ? 'none' : 'block',
                    }}
                    onClick={() => setValue(`item-${index + 1}`)}
                    position="relative"
                    className="cursor-pointer sm:cursor-default"
                  >
                    <Box asChild pb="2" display={{sm: 'none'}}>
                      <Text variant="heading">{index + 1}</Text>
                    </Box>
                    <AspectRatio ratio={1 / 1}>
                      <Image
                        data={ingredient.image}
                        aspectRatio="1 / 1"
                        className="object-cover w-full h-full border"
                      />
                    </AspectRatio>
                  </Box>
                ),
            )}
          </Grid>
          <Box gridColumn={{sm: '4 / span 8'}}>
            <Accordion.Root
              className=""
              type="single"
              value={value}
              onValueChange={setValue}
            >
              {ingredients.map((ingredient, index) => {
                if (ingredient.title && ingredient.description) {
                  return (
                    <AccordionItem
                      value={`item-${index + 1}`}
                      key={ingredient.id}
                    >
                      <AccordionTrigger index={`${index + 1}`}>
                        {ingredient.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        {ingredient.description}
                      </AccordionContent>
                    </AccordionItem>
                  );
                } else {
                  return null;
                }
              })}
            </Accordion.Root>
          </Box>
        </Container>
      )}
      {other && (
        <Container>
          <Box gridColumn={{sm: '8 / span 4'}}>
            <h3>
              <Text variant="fine">Full Ingredients</Text>
            </h3>
            <Text variant="fine" as="p">
              {other}
            </Text>
          </Box>
        </Container>
      )}
    </Section>
  );
}

function Header({children}: {children: React.ReactNode}) {
  return (
    <Container py={{initial: '0'}}>
      <Box gridColumn={{sm: '1 / span 7'}}>
        <h2>
          <Text variant="heading">Our Ingredients</Text>
        </h2>
      </Box>
      <Box gridColumn={{sm: '8 / span 4'}}>
        <Text>{children}</Text>
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
      ref={forwardedRef}
      {...props}
    >
      <Grid gap={{initial: '2', sm: '8'}} columns={{sm: '2'}} align="baseline">
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
            <Text variant="heading">{index}</Text>
          </Box>
          <Box gridColumn="2 / 4">
            <Text variant="heading" wrap="nowrap">
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
