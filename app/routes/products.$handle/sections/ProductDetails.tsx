import {
  AspectRatio,
  Box,
  Flex,
  Heading,
  Text,
  VisuallyHidden,
} from '@radix-ui/themes';
import {useLoaderData} from '@remix-run/react';
import {Container} from '~/components';
import {ProductForm} from '~/components/ProductForm';
import type {loader} from '~/routes/products.$handle/route';

export default function ProductDetails() {
  const {product} = useLoaderData<typeof loader>();

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
          <img
            src="https://cdn.shopify.com/s/files/1/0586/4826/4886/products/custom_resized_cbddde06-d41b-438e-877c-63747aa95e78.jpg"
            alt="product"
            className="object-cover w-full h-full"
          />
        </AspectRatio>
      </Box>
      <Flex direction="column" gap="7" gridColumn="8 / span 4">
        <Flex direction="column" gap="5">
          <Flex align="baseline" justify="between">
            <Heading as="h1">Body Wash</Heading>
            <Text>★ 5</Text>
          </Flex>
          <Text>
            A gentle, non-drying body wash that cleanses and refreshes the skin.
            Formulated with aloe vera, pineapple fruit extract, and glycerin to
            hydrate and soothe.
          </Text>
        </Flex>
        <ProductForm />
      </Flex>
    </Container>
  );
}
