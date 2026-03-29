import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AuthPage() {
  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");
  const host = params.get("host");
  const urlApiKey = params.get("apiKey");
  const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY || urlApiKey;

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    console.log("Shop:", shop);
    console.log("Host:", host);

    // Add validation: If host OR shop is missing
    if (!shop || !host) {
      console.warn('Missing shop or host. Redirecting to start OAuth natively (top-level).');
      window.location.href = `${API_URL}/shopify/connect?shop=${shop}`;
      return;
    }

    if (!apiKey) {
      console.error('Missing apiKey for Shopify Auth initialization.');
      return;
    }

    initialized.current = true;

    // Fix App Bridge initialization exactly as specified
    const app = createApp({
      apiKey: apiKey,
      host: host,
      forceRedirect: true
    });

    const redirect = Redirect.create(app);

    // Escape iframe by navigating top-level window to backend connect URL securely
    redirect.dispatch(Redirect.Action.REMOTE, {
      url: `${API_URL}/shopify/connect?shop=${shop}&host=${host}`,
      newContext: true
    });
  }, [shop, host, apiKey]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 font-sans">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
        <p className="mt-6 text-lg font-semibold tracking-wide text-slate-300">
          Authenticating with Shopify...
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Please wait while we securely connect your store.
        </p>
      </div>
    </div>
  );
}
