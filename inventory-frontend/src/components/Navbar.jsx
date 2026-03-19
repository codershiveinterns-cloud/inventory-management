import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Button from './Button';

const navItems = [
  { label: 'Dashboard', to: '/' },
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

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
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

        <div className="hidden lg:block">
          <Link to="/shopify/connect">
            <Button variant="success">Connect Store</Button>
          </Link>
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
          </div>
        </div>
      )}
    </header>
  );
}
