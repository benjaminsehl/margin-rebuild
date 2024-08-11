import type {I18nBase} from '@shopify/hydrogen';

interface LocaleResult {
  locale: I18nBase;
  localizationCookie?: {name: string; value: string; maxAge: number};
}

export function getLocaleFromRequest(request: Request): LocaleResult {
  const defaultLocale: I18nBase = {
    language: 'EN',
    country: 'CA',
  };
  const supportedCountries = ['US', 'CA', 'ES', 'FR', 'DE', 'JP'] as const;
  const supportedLanguages = ['EN', 'FR', 'ES', 'DE', 'JA'] as const;
  const oneYearInSeconds = 365 * 24 * 60 * 60;

  const url = new URL(request.url);
  const countryParam = url.searchParams.get('country');
  const cookies = parseCookies(request.headers.get('Cookie') || '');
  const headerCountry = request.headers.get('oxygen-buyer-country');

  let country = defaultLocale.country;
  let language = defaultLocale.language;
  let localizationCookie:
    | {name: string; value: string; maxAge: number}
    | undefined;

  // Determine language from URL path
  const pathSegments = url.pathname.split('/').filter((segment) => segment);
  const firstPathSegment = pathSegments[0]?.toUpperCase();
  if (
    supportedLanguages.includes(
      firstPathSegment as (typeof supportedLanguages)[number],
    )
  ) {
    language = firstPathSegment as (typeof supportedLanguages)[number];
  }

  // Check URL parameter and set cookie only if it's provided
  if (
    countryParam &&
    supportedCountries.includes(
      countryParam as (typeof supportedCountries)[number],
    )
  ) {
    country = countryParam as I18nBase['country'];
    localizationCookie = {
      name: 'localization',
      value: countryParam,
      maxAge: oneYearInSeconds,
    };
  }
  // Check existing cookie
  else if (
    cookies.localization &&
    supportedCountries.includes(
      cookies.localization as (typeof supportedCountries)[number],
    )
  ) {
    country = cookies.localization as I18nBase['country'];
  }
  // Check header
  else if (
    headerCountry &&
    supportedCountries.includes(
      headerCountry as (typeof supportedCountries)[number],
    )
  ) {
    country = headerCountry as I18nBase['country'];
  }

  return {
    locale: {language, country},
    localizationCookie,
  };
}

function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [name, value] = cookie.split('=').map((c) => c.trim());
    if (name && value) {
      cookies[name] = value;
    }
    return cookies;
  }, {} as Record<string, string>);
}
