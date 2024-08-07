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
- `PageLayout` / `Layout` export / `Header` and `Footer` components feel messy … we should either just put `PageLayout` inside the `root` file and call out to specific Header/Footer components … or else we should just put the header & footer components all in a single `Layout` component … too much indirection
  - `Header` though is quite complicated and I think we could simplify this quite a bit … I'm not sure how yet.
  - the "asides" should probably become a generic `Drawer` component … knowing the pain Knix went through… this could be a good one to provide a dependency free headless UI component for … complete with hooks to add animation in/out … would need to support multi-level navigation
  - I think what will be best here is a few simple components that are more generic (like `Drawer`) … and those are imported into a single `Layout` folder
- We should have logic in place for when you're arriving on a page but we think you're in the wrong locale, and we want to present you with a banner to send you to the right place (see Skims, others)
- We should incapsulate all logic related to routes into a `Link` component, so we don't need `getInternalUrl`-like functions
  - We shouldn't have `publicStoreDomain` declared in 31 places … we should just have this stuff provided by the `<HydrogenProvider>`, with a `useHydrogen` hook (or something like that) you can grab all the common stuff you need throughout the app.
- Can we have `useAuth` or something so that there's an easy way to grab auth state? Or some easy way to grab auth context from within components instead of having to pass things through props everywhere
  - More generically a problem is it feels like there's a lot of prop drilling … and places where you have to dive into and pull out of components, to track where things are coming from … and it would be ideal if we could make every component as self contained as possible
- We should definitely just use Tailwind and rip out `app.css` and `reset.css` … it was good as an idea … but it's not very easy to build on top of, and if you want to rip it out then you end up as square 1 … we could still work towards a world where we support multiple CSS approaches through an LLM or something … but I think it's easiest to just say "Do you want to include basic styles with Tailwind?" and then either we do … or we don't. An alternative we could do is provide either tailwind or inline styles … (and ignore media queries) … and then at least it's obvious to you want to abstract. We could even pull them up into an object or something so it's like `style={styles.componentName}` … we could even take my `cva` approach from Utopia if we wanted to … and have it like `className={styles.componentName}` if using Tailwind … and that way always have styles pulled out, and markup look fairly simple … but I think inline is probably best

# Personal Todos

- Move all SVGs to a single resource route / endpoint so I can use the `use` stuff for better perf
