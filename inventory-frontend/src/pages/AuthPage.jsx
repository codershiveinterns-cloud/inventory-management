import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const shop = searchParams.get('shop');
  const host = searchParams.get('host');
  const apiKey = searchParams.get('apiKey');

  useEffect(() => {
    if (!shop || !apiKey) {
      console.error('Missing shop or apiKey parameter for Shopify Auth initialization.');
      return;
    }

    // Initialize App Bridge securely passing parameters from the Node.js interceptor
    const app = createApp({
      apiKey,
      host: host || btoa(`${shop}/admin`),
      forceRedirect: false
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
