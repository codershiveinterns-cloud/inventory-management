import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConnectPage() {
  const [shop, setShop] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleConnect = (e) => {
    e.preventDefault();
    if (!shop.trim()) {
      setError('Please enter your Shopify store domain.');
      return;
    }

    let parsedShop = shop.trim().toLowerCase();

    // Auto-append .myshopify.com if they just typed the prefix
    if (!parsedShop.includes('.myshopify.com')) {
      parsedShop = `${parsedShop}.myshopify.com`;
    }

    // Basic domain validation
    if (!/^[a-zA-Z0-9-]+\.myshopify\.com$/.test(parsedShop)) {
      setError('Invalid store domain. Example: mystore.myshopify.com');
      return;
    }

    // Redirect to /auth route to handle App Bridge breakout safely
    navigate(`/auth?shop=${parsedShop}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 font-sans text-slate-300">
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-slate-900 p-8 shadow-2xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-6 flex justify-center">
            <img src="/logo.png" alt="Inventory Flow" className="h-10 w-10 rounded-full object-contain" />
          </div>

          <h1 className="mb-2 text-center text-2xl font-bold tracking-tight text-white">Connect Shopify Store</h1>
          <p className="mb-8 text-center text-sm text-slate-400">
            Enter your '.myshopify.com' domain below to securely install the app and sync your inventory.
          </p>

          <form onSubmit={handleConnect} className="space-y-6">
            <div>
              <label htmlFor="shop" className="block text-sm font-medium text-slate-300">
                Store Domain
              </label>
              <div className="mt-2 text-white">
                <input
                  id="shop"
                  type="text"
                  value={shop}
                  onChange={(e) => {
                    setShop(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. your-store-name.myshopify.com"
                  className="block w-full rounded-xl border border-white/10 bg-white/5 p-3 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] hover:shadow-cyan-500/25 active:scale-95"
            >
              Continue with Shopify
            </button>
          </form>

          {import.meta.env.VITE_DEV_LOGIN === 'true' && (
            <div className="mt-6 border-t border-white/10 pt-6">
              <button
                onClick={() => {
                  localStorage.setItem('dev_user', JSON.stringify({
                    shop: "test-shop.myshopify.com",
                    accessToken: "dev_token_123"
                  }));
                  window.location.href = '/dashboard';
                }}
                className="w-full rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-400 shadow-lg transition-transform hover:scale-[1.02] hover:bg-cyan-500/20 active:scale-95"
              >
                Login (test Mode)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
