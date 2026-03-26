import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import StatusMessage from '../components/StatusMessage';

function normalizeApiBaseUrl(url) {
  return url.replace(/\/+$/, '');
}

function resolveBackendBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:5000';
  }

  if (!configuredUrl) {
    throw new Error('VITE_API_URL is required to connect Shopify in production.');
  }

  return normalizeApiBaseUrl(configuredUrl);
}

function normalizeShopDomain(shop) {
  return shop.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
}

function isValidShopDomain(shop) {
  return /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop);
}

function ShopifyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M17.615 6.558c-.012-.083-.084-.144-.168-.144-.012 0-.036 0-.048.012l-1.428.084c-.084-.264-.204-.516-.36-.756-.696-.972-1.776-1.464-3.216-1.464-.072 0-.144 0-.228.012-.036-.048-.084-.084-.132-.12C11.435 3.654 10.79 3.39 10.107 3.39c-1.32 0-2.628.984-3.696 2.772-.756 1.272-1.332 2.88-1.464 4.116L2.643 11c-.72.228-.744.252-.84.924l-.54 4.128c-.072.54-.012.588.492.672l10.104 1.752 5.46-1.188c.372-.084.468-.18.516-.528l1.98-9.948c.036-.24.012-.372-.204-.396l-1.992-.168Zm-2.208.132-2.724.168c.168-.648.48-1.308.936-1.86.168-.204.396-.432.672-.624.6.12.972.54 1.2 1.104.084.204.132.432.156.696-.072.144-.156.336-.24.516Zm-3.756-2.916c.216 0 .408.048.576.144-.24.18-.468.396-.684.648-.612.72-1.044 1.8-1.236 2.772l-1.8.108c.348-1.356 1.56-3.672 3.144-3.672Zm-1.572 3.816-3.012.192c.276-1.068 1.068-2.448 1.944-3.156.324-.264.636-.432.912-.516-.648.948-1.104 2.172-1.296 3.48Zm7.836 3.36-.672 3.072s-.912-.492-2.004-.492c-1.608 0-1.692 1.008-1.692 1.272 0 .696 1.824.96 1.824 2.592 0 1.284-.816 2.112-1.92 2.112-1.332 0-2.016-.828-2.016-.828l.468-1.548s.708.612 1.308.612c.396 0 .564-.312.564-.54 0-.912-1.5-.948-1.5-2.448 0-1.26.9-2.484 2.724-2.484 1.404 0 2.1.708 2.1.708Z" />
    </svg>
  );
}

export default function ShopifyConnectPage() {
  const [searchParams] = useSearchParams();
  const [shopDomain, setShopDomain] = useState('');
  const [error, setError] = useState(searchParams.get('error') || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const backendBaseUrl = resolveBackendBaseUrl();

  async function handleConnectShopify() {
    const normalizedShop = normalizeShopDomain(shopDomain);

    if (!normalizedShop) {
      setError('Enter your Shopify store domain.');
      return;
    }

    if (!isValidShopDomain(normalizedShop)) {
      setError('Enter a valid store like mystore.myshopify.com.');
      return;
    }

    setError('');
    setIsConnecting(true);

    try {
      window.location.href = `${backendBaseUrl}/shopify?shop=${encodeURIComponent(
        normalizedShop
      )}`;
    } catch (connectError) {
      setError(connectError?.message || 'Unable to start the Shopify connection.');
      setIsConnecting(false);
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <div className="w-full max-w-xl">
        {error ? <StatusMessage type="error">{error}</StatusMessage> : null}

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.55)] backdrop-blur-2xl">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-8 sm:p-10">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200/80">
                Shopify
              </p>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Connect your Shopify store
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Securely connect your store to sync products and inventory.
              </p>
            </div>

            <div className="mt-8">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-200">
                  Shopify store
                </span>
                <input
                  type="text"
                  value={shopDomain}
                  onChange={(event) => setShopDomain(event.target.value)}
                  placeholder="mystore.myshopify.com"
                  autoComplete="off"
                  spellCheck="false"
                  disabled={isConnecting}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-emerald-300/20 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </label>

              <p className="mt-3 text-sm text-slate-400">
                You will be redirected to Shopify to complete the connection.
              </p>
            </div>

            <div className="mt-8">
              <Button
                variant="success"
                className="w-full py-3"
                disabled={isConnecting}
                onClick={handleConnectShopify}
              >
                <ShopifyIcon />
                <span>{isConnecting ? 'Redirecting to Shopify...' : 'Connect Shopify'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
