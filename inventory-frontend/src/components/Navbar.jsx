import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Login', to: '/login' }
];

function navClassName({ isActive }) {
  return `rounded-full px-4 py-2 text-sm font-medium transition duration-300 ${
    isActive
      ? 'bg-white/15 text-white shadow-lg shadow-slate-950/20'
      : 'text-slate-300 hover:bg-white/10 hover:text-white'
  }`;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/10 shadow-[0_24px_65px_rgba(2,6,23,0.35)] backdrop-blur-lg">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Inventory Flow" className="h-10 w-10 rounded-full object-contain" />
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">
                  InventoryFlow
                </p>
                <p className="text-sm font-semibold text-white">Inventory Management System</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={navClassName}>
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/connect"
                className="ml-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-brand-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(29,166,255,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(29,166,255,0.35)]"
              >
                Get Started
              </Link>
            </nav>

            <button
              type="button"
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100 md:hidden"
              onClick={() => setIsOpen((current) => !current)}
              aria-label="Toggle navigation"
            >
              <span className="h-0.5 w-5 bg-current shadow-[0_6px_0_currentColor,0_-6px_0_currentColor]" />
            </button>
          </div>

          {isOpen ? (
            <div className="border-t border-white/10 px-4 py-4 md:hidden">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={navClassName}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Link
                  to="/connect"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-brand-500 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(29,166,255,0.28)] transition duration-300 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
