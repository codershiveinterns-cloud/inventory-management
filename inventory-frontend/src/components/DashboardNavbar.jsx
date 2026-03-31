import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', to: '/app' },
  { label: 'Products', to: '/products' },
  { label: 'Add Product', to: '/add-product' },
  { label: 'Inventory Update', to: '/inventory-update' },
  { label: 'Low Stock', to: '/low-stock' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Contact', to: '/dashboard/contact' }
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

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/10 shadow-[0_24px_65px_rgba(2,6,23,0.35)] backdrop-blur-lg">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6">
            <Link to="/app" className="flex items-center gap-3">
              <img src="/logo.png" alt="Inventory Flow" className="h-10 w-10 rounded-full object-contain" />
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
              
              {localStorage.getItem('app_plan') && (
                <div className="ml-4 flex items-center gap-3 border-l border-white/10 pl-4">
                  <span className="text-sm font-medium text-slate-300">
                    Plan: <span className="font-bold text-white capitalize">{localStorage.getItem('app_plan')}</span>
                  </span>
                  {localStorage.getItem('app_plan') === 'basic' && (
                    <Link to="/pricing" className="rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105">
                      Upgrade
                    </Link>
                  )}
                </div>
              )}
              {import.meta.env.VITE_DEV_LOGIN === 'true' && localStorage.getItem('dev_user') && (
                <button 
                  onClick={() => {
                    localStorage.removeItem('dev_user');
                    window.location.href = '/connect';
                  }}
                  className="rounded-full px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition duration-300 ml-2"
                >
                  Dev Logout
                </button>
              )}
            </nav>



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

                {localStorage.getItem('app_plan') && (
                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-sm font-medium text-slate-300">
                      Plan: <span className="font-bold text-white capitalize">{localStorage.getItem('app_plan')}</span>
                    </span>
                    {localStorage.getItem('app_plan') === 'basic' && (
                      <Link to="/pricing" onClick={() => setIsOpen(false)} className="rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-1.5 text-xs font-bold text-white">
                        Upgrade
                      </Link>
                    )}
                  </div>
                )}
                {import.meta.env.VITE_DEV_LOGIN === 'true' && localStorage.getItem('dev_user') && (
                  <button 
                    onClick={() => {
                      localStorage.removeItem('dev_user');
                      window.location.href = '/connect';
                    }}
                    className="rounded-full px-4 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition duration-300 text-left"
                  >
                    Dev Logout
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
