import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const shop = searchParams.get('shop');
  const host = searchParams.get('host') || new URLSearchParams(window.location.search).get("host");
  const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;
  const redirectStarted = useRef(false);

  useEffect(() => {
    if (redirectStarted.current) return;
    
    console.log("Shop:", shop);
    console.log("Host:", host);

    if (!shop) {
      console.error('Missing shop parameter for Shopify Auth initialization.');
      return;
    }

    if (!apiKey) {
      console.error('Missing VITE_SHOPIFY_API_KEY.');
      return;
    }

    redirectStarted.current = true;

    if (!host) {
      // If host is absent, we are not embedded in an Iframe yet. Proceed to standard backend OAuth init natively.
      window.location.href = `${API_URL}/shopify/connect?shop=${shop}`;
      return;
    }

    // Initialize App Bridge securely passing parameters from the Node.js interceptor
    const app = createApp({
      apiKey,
      host,
      forceRedirect: true
    });

    const redirect = Redirect.create(app);

    // Escape iframe by navigating top-level window to backend connect URL securely
    redirect.dispatch(Redirect.Action.REMOTE, {
      url: `${API_URL}/shopify/connect?shop=${shop}`,
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
          Please wait while we securely break out of the App iframe.
        </p>
      </div>
    </div>
  );
}
