import {createCookie} from '@shopify/remix-oxygen';

export const localizationCookie = createCookie('localization', {
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
});
