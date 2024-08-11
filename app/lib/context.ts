import {createHydrogenContext} from '@shopify/hydrogen';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';
import {AppSession} from '~/lib/session';
import {getLocaleFromRequest} from '~/lib/locale';

export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const {locale, localizationCookie} = getLocaleFromRequest(request);

  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: locale,
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });

  return {
    ...hydrogenContext,
    env,
    localizationCookie,
  };
}
