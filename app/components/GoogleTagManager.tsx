import {
  type CartUpdatePayload,
  type CartViewPayload,
  type PageViewPayload,
  type ProductViewPayload,
  type SearchViewPayload,
  useAnalytics,
} from '@shopify/hydrogen';
import {useEffect} from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function GoogleTagManager() {
  const {subscribe, register} = useAnalytics();
  const {ready} = register('Google Tag Manager');

  function getCookie(name: string) {
    if (typeof document === 'undefined') {
      return null; // We're on the server
    }
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  }

  const gaClientId = getCookie('_ga')?.split('.').slice(-2).join('.');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Page View
    subscribe('page_viewed', (data: PageViewPayload) => {
      if (!window.dataLayer) return;
      window.dataLayer.push({
        event: 'page_view',
        page_location: data.url,
        page_title: document.title,
        client_id: gaClientId,
      });
    });

    // Product View
    subscribe('product_viewed', (data: ProductViewPayload) => {
      if (!window.dataLayer) return;
      window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
          currency: data.shop?.currency || 'USD',
          value: Number(data.products[0]?.price) || 0,
          items: [
            {
              item_id: data.products[0]?.id,
              item_name: data.products[0]?.title,
              price: Number(data.products[0]?.price) || 0,
              item_variant: data.products[0]?.variantTitle,
              item_brand: data.products[0]?.vendor,
            },
          ],
        },
      });
    });
    // CART VIEW
    subscribe('cart_viewed', (data: CartViewPayload) => {
      if (!window.dataLayer) return;
      window.dataLayer.push({
        event: 'view_cart',
        ecommerce: {
          currency: data.cart?.cost?.totalAmount?.currencyCode || 'USD',
          value: Number(data.cart?.cost?.totalAmount?.amount) || 0,
          items: data.cart?.lines.nodes.map((line) => ({
            item_id: line.merchandise.id,
            item_name: line.merchandise.product.title,
            price: Number(line.cost.amountPerQuantity.amount),
            quantity: line.quantity,
            item_variant: line.merchandise.title,
          })),
        },
      });
    });

    // Search
    subscribe('search_viewed', (data: SearchViewPayload) => {
      if (!window.dataLayer) return;
      window.dataLayer.push({
        event: 'search',
        search_term: data.searchTerm,
        client_id: gaClientId,
      });
    });

    // Add to Cart
    subscribe('product_added_to_cart', (data: CartUpdatePayload) => {
      if (!window.dataLayer) return;
      const newItems = data.cart?.lines.nodes.filter(
        (node) =>
          !data.prevCart?.lines.nodes.some(
            (prevNode) => prevNode.id === node.id,
          ),
      );

      window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: data.cart?.cost?.totalAmount?.currencyCode || 'USD',
          value: Number(data.cart?.cost?.totalAmount?.amount) || 0,
          items: newItems?.map((item) => ({
            item_id: item.merchandise.id,
            item_name: item.merchandise.product.title,
            price: Number(item.cost.amountPerQuantity.amount),
            quantity: item.quantity,
            item_variant: item.merchandise.title,
          })),
        },
      });
    });

    // Remove from Cart
    subscribe('product_removed_from_cart', (data: CartUpdatePayload) => {
      if (!window.dataLayer) return;
      const removedItems = data.prevCart?.lines.nodes.filter(
        (node) =>
          !data.cart?.lines.nodes.some(
            (currentNode) => currentNode.id === node.id,
          ),
      );

      window.dataLayer.push({
        event: 'remove_from_cart',
        ecommerce: {
          currency: data.cart?.cost?.totalAmount?.currencyCode || 'USD',
          value: Number(data.cart?.cost?.totalAmount?.amount) || 0,
          items: removedItems?.map((item) => ({
            item_id: item.merchandise.id,
            item_name: item.merchandise.product.title,
            price: Number(item.cost.amountPerQuantity.amount),
            quantity: item.quantity,
            item_variant: item.merchandise.title,
          })),
        },
      });
    });

    ready();
  }, [subscribe, register, ready, gaClientId]);

  return null;
}
