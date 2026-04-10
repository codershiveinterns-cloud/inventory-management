import { Redirect } from '@shopify/app-bridge/actions';
import { useEffect, useState } from 'react';
import { getShopifyQueryContext, syncShopifyQueryParamsInUrl } from '../utils/shopifyQueryParams';
import { initializeShopifyAppBridge } from '../services/shopifyAppBridge';

export default function AuthPage() {
  const { shop, host } = getShopifyQueryContext();

  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    syncShopifyQueryParamsInUrl();
    console.log("Shop:", shop);
    console.log("Host:", host);

    if (!shop) {
      console.error('Missing shop parameter.');
      return;
    }

    if (!host) {
      console.warn('Missing host. Restarting OAuth natively.');
      // Securely hit the native backend OAuth entry
      window.location.href = `/auth?shop=${encodeURIComponent(shop)}`;
      return;
    }

    if (!redirected && host) {
      const app = initializeShopifyAppBridge({ host });

      if (!app) {
        return;
      }

      const redirect = Redirect.create(app);

      // The string-based payload naturally routes the top-level parent window, bypassing popup blockers cleanly
      redirect.dispatch(
        Redirect.Action.REMOTE,
        `/auth?shop=${encodeURIComponent(shop)}&host=${encodeURIComponent(host)}`
      );

      setRedirected(true);
    }
  }, [shop, host, redirected]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 font-sans">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
        <p className="mt-6 text-lg font-semibold tracking-wide text-slate-300">
          Authenticating with Shopify...
        </p>
      </div>
    </div>
  );
}
