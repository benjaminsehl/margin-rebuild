import {Suspense} from 'react';
import {Await} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import Link from '@h2/Link';
import {Box, Flex, Text} from '@radix-ui/themes';
import Container from './Container';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="w-screen overflow-hidden">
            {footer?.menu && header.shop.primaryDomain?.url && (
              <FooterMenu
                menu={footer.menu}
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            )}
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <Container columns="1">
      <Flex asChild gapX="6" gapY="2" justify="between" wrap="wrap">
        <nav role="navigation">
          {(menu?.items?.length ?? 0) > 0 &&
            menu?.items.map((item) => {
              return item?.url ? (
                <Box key={item.id} gridColumn="span 3">
                  <Link
                    level="fine"
                    className="whitespace-nowrap"
                    to={item.url}
                  >
                    {item.title}
                  </Link>
                </Box>
              ) : null;
            })}
        </nav>
      </Flex>
    </Container>
  );
}
