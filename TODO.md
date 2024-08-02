# A list of fine print things that could be better

- `<Money>` formatting should default to what's provided for you in `shop.moneyFormat`: const locale = await response.json();
- Default Market should be set by default; this can be grabbed from https://shopify.dev/docs/api/admin-graphql/2024-07/queries/primaryMarket (but check with Cole Atkinson on this because Primary Markets are changing)
  - At minimum, today we could improve default country by looking to `shop.paymentSettings.countryCode` for the country where the shop is located
- Localization should work according to how Markets is set up in the Admin UI by default (https://shopify.dev/docs/api/admin-graphql/2024-07/objects/Market) — unavailable in the Admin API are the settings for how you want user behaviour to work, like redirecting to the correct locale by default, etc.
- In Storefront API, it's very weird to have different fields for each type of policy (`privacyPolicy`, `refundPolicy`, etc.) and even a `ShopPolicy` type and `ShopPolicyWithDefault` type; we can improve this in Hydrogen by abstracting so `policies.$handle.tsx` is nicer; but really this should be improved in SF API
- While [Brand Settings](https://shopify.dev/docs/api/storefront/2024-07/objects/Shop#field-brand) are kind of crap… we could improve our skeleton to pull from them, so if you have them set up the name is coming from there, logo, favicon, SEO, etc.
- Favicons could be set via a resource route, this would allow you to set it dynamically to the one uploaded in the Brand Settings — but also you could support SVGs with alternative colours for dark mode, etc.

- MiniOxygen always has `oxygen-buyer-country` as US in dev mode … this isn't communicated anywhere. In the proposed Locale function in this project, you set a default locale — it should be inherrited from there.
  - We should probably just have a `config.js` file like we used to, where you can set a lot of these things … and they can be used across the app; and then most folks won't have to poke their heads into `server.ts` at all and instead get a much simpler interface to reason about.
- Price on PDPs shows up in a very weird way … if compare at price is $0, it still shows up, though crossed out
