import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', to: '/app' },
  { label: 'Products', to: '/products' },
  { label: 'Add Product', to: '/add-product' },
  { label: 'Inventory Update', to: '/inventory-update' },
  { label: 'Low Stock', to: '/low-stock' },
  { label: 'Shopify', to: '/shopify' }
];

function navClassName({ isActive }) {
  return `rounded-full px-4 py-2 text-sm font-medium transition duration-300 ${
    isActive
      ? 'bg-white/15 text-white shadow-lg shadow-slate-950/20'
      : 'text-slate-300 hover:bg-white/10 hover:text-white'
  }`;
}

export default function DashboardNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/', { replace: true });
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/10 shadow-[0_24px_65px_rgba(2,6,23,0.35)] backdrop-blur-lg">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6">
            <Link to="/app" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-brand-400 to-indigo-400 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-500/20">
                IF
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                  InventoryFlow
                </p>
                <p className="text-sm font-semibold text-white">Inventory Dashboard</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={navClassName}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/shopify"
                className="inline-flex items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/15 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-400/20 hover:text-white"
              >
                Connect Store
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-slate-100 transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
              >
                Logout
              </button>
            </div>

            <button
              type="button"
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100 lg:hidden"
              onClick={() => setIsOpen((current) => !current)}
              aria-label="Toggle navigation"
            >
              <span className="h-0.5 w-5 bg-current shadow-[0_6px_0_currentColor,0_-6px_0_currentColor]" />
            </button>
          </div>

          {isOpen ? (
            <div className="border-t border-white/10 px-4 py-4 lg:hidden">
              <div className="flex flex-col gap-3">
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
                <Link
                  to="/shopify"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/15 px-5 py-3 text-sm font-semibold text-emerald-100 transition duration-300 hover:bg-emerald-400/20 hover:text-white"
                >
                  Connect Store
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-slate-100 transition duration-300 hover:bg-white/10 hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
