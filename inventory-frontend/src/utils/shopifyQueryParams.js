const SHOPIFY_HOST_KEY = 'shopify_host';
const SHOPIFY_SHOP_KEY = 'shopify_shop';
const LEGACY_HOST_KEY = 'host';
const LEGACY_SHOP_KEY = 'shop';

function isBrowser() {
  return typeof window !== 'undefined';
}

function readStoredValue(primaryKey, legacyKey) {
  if (!isBrowser()) {
    return '';
  }

  return (
    window.localStorage.getItem(primaryKey) ||
    window.localStorage.getItem(legacyKey) ||
    ''
  );
}

function persistValue(primaryKey, legacyKey, value) {
  if (!isBrowser() || !value) {
    return;
  }

  window.localStorage.setItem(primaryKey, value);
  window.localStorage.setItem(legacyKey, value);
}

export function getShopifyQueryContext(search = '') {
  if (!isBrowser()) {
    return {
      hostFromUrl: '',
      shopFromUrl: '',
      host: '',
      shop: '',
    };
  }

  const resolvedSearch = search || window.location.search;
  const params = new URLSearchParams(resolvedSearch);
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

export function syncShopifyQueryParamsInUrl(location = {}) {
  if (!isBrowser()) {
    return;
  }

  const pathname = location.pathname || window.location.pathname;
  const search = location.search || window.location.search;
  const hash = location.hash || window.location.hash;
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
