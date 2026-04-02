const SHOPIFY_HOST_KEY = 'shopify_host';
const SHOPIFY_SHOP_KEY = 'shopify_shop';
const LEGACY_HOST_KEY = 'host';
const LEGACY_SHOP_KEY = 'shop';

function readStoredValue(primaryKey, legacyKey) {
  return (
    window.localStorage.getItem(primaryKey) ||
    window.localStorage.getItem(legacyKey) ||
    ''
  );
}

function persistValue(primaryKey, legacyKey, value) {
  if (!value) {
    return;
  }

  window.localStorage.setItem(primaryKey, value);
  window.localStorage.setItem(legacyKey, value);
}

export function getShopifyQueryContext(search = window.location.search) {
  const params = new URLSearchParams(search);
  const hostFromUrl = params.get('host') || '';
  const shopFromUrl = params.get('shop') || '';

  if (hostFromUrl) {
    persistValue(SHOPIFY_HOST_KEY, LEGACY_HOST_KEY, hostFromUrl);
  }

  if (shopFromUrl) {
    persistValue(SHOPIFY_SHOP_KEY, LEGACY_SHOP_KEY, shopFromUrl);
  }

  return {
    hostFromUrl,
    shopFromUrl,
    host: hostFromUrl || readStoredValue(SHOPIFY_HOST_KEY, LEGACY_HOST_KEY),
    shop: shopFromUrl || readStoredValue(SHOPIFY_SHOP_KEY, LEGACY_SHOP_KEY),
  };
}

export function syncShopifyQueryParamsInUrl({
  pathname = window.location.pathname,
  search = window.location.search,
  hash = window.location.hash,
} = {}) {
  const { host, shop } = getShopifyQueryContext(search);

  if (!host && !shop) {
    return;
  }

  const params = new URLSearchParams(search);
  let didChange = false;

  if (host && !params.get('host')) {
    params.set('host', host);
    didChange = true;
  }

  if (shop && !params.get('shop')) {
    params.set('shop', shop);
    didChange = true;
  }

  if (!didChange) {
    return;
  }

  const nextSearch = params.toString();
  const nextUrl = `${pathname}${nextSearch ? `?${nextSearch}` : ''}${hash || ''}`;

  window.history.replaceState(window.history.state, '', nextUrl);
}
