import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from './Button';
import StatusMessage from './StatusMessage';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/app' },
  { label: 'Products', to: '/products' },
  { label: 'Add Product', to: '/products/new' },
  { label: 'Inventory Update', to: '/inventory/update' },
  { label: 'Low Stock', to: '/low-stock' },
  { label: 'Shopify', to: '/shopify/connect' }
];

function navClassName({ isActive }) {
  return `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-white/12 text-white shadow-lg shadow-slate-950/20'
      : 'text-slate-300 hover:bg-white/5 hover:text-white'
  }`;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const navigate = useNavigate();
  const { user, logout, getAuthErrorMessage } = useAuth();

  const accountLabel = user?.displayName || user?.email || 'Signed in';

  async function handleLogout() {
    setLogoutError('');
    setIsLoggingOut(true);

    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      setLogoutError(getAuthErrorMessage(error));
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {logoutError ? <StatusMessage type="error">{logoutError}</StatusMessage> : null}

        <div className="flex items-center justify-between gap-4">
          <Link to="/app" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-lg font-extrabold text-slate-950">
              IF
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                Inventory Management
              </p>
              <h1 className="text-lg font-bold text-white">Inventory Flow</h1>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navClassName}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-right">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Signed in</p>
              <p className="text-sm font-semibold text-white">{accountLabel}</p>
            </div>
            <Link to="/shopify/connect">
              <Button variant="success">Connect Store</Button>
            </Link>
            <Button variant="secondary" onClick={handleLogout} loading={isLoggingOut}>
              Logout
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex rounded-2xl border border-white/10 p-3 text-slate-200 lg:hidden"
            onClick={() => setIsOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            <span className="h-0.5 w-5 bg-current shadow-[0_6px_0_currentColor,0_-6px_0_currentColor]" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navClassName}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <Link to="/shopify/connect" onClick={() => setIsOpen(false)}>
              <Button variant="success" className="mt-2 w-full">
                Connect Store
              </Button>
            </Link>
            <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Signed in</p>
              <p className="mt-2 font-semibold text-white">{accountLabel}</p>
            </div>
            <Button
              variant="secondary"
              className="mt-2 w-full"
              onClick={async () => {
                setIsOpen(false);
                await handleLogout();
              }}
              loading={isLoggingOut}
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
