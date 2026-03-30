import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AuthPage() {
  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");
  const host = params.get("host") || localStorage.getItem("host");

  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    console.log("Shop:", shop);
    console.log("Host:", host);

    if (!shop) {
      console.error('Missing shop parameter.');
      return;
    }

    if (!host) {
      console.warn('Missing host. Restarting OAuth natively.');
      // Securely hit the native backend OAuth entry
      window.location.href = `${API_URL}/auth?shop=${shop}`;
      return;
    }

    if (!redirected && host) {
      const app = createApp({
        apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
        host,
        forceRedirect: true
      });

      const redirect = Redirect.create(app);

      // The string-based payload naturally routes the top-level parent window, bypassing popup blockers cleanly
      redirect.dispatch(Redirect.Action.REMOTE, `${API_URL}/auth?shop=${shop}`);

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
