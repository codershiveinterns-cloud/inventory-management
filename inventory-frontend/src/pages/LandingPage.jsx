import { useState } from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Login', to: '/login' }
];

const features = [
  ['tracking', 'Inventory Tracking', 'Keep products, variants, and stock levels organized in one live workspace.'],
  ['sync', 'Real-time Updates', 'See stock changes instantly across your team and connected storefronts.'],
  ['shopify', 'Shopify Integration', 'Sync your Shopify store without manual exports or disconnected tools.'],
  ['alerts', 'Low Stock Alerts', 'Flag risky inventory levels early and restock before sales are affected.'],
  ['analytics', 'Analytics Dashboard', 'Understand movement, trends, and inventory health from one dashboard.'],
  ['secure', 'Secure Authentication', 'Protect store operations with secure access for internal teams.']
];

const steps = [
  ['account', 'Create Account', 'Set up your workspace and get your operations team aligned.'],
  ['connect', 'Connect Shopify Store', 'Link your Shopify store once and start syncing inventory.'],
  ['dashboard', 'Manage Inventory from Dashboard', 'Track stock and act on alerts from one smart interface.']
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For teams getting inventory visibility in place.',
    points: ['Up to 100 SKUs', 'Basic stock tracking', 'Email low stock alerts'],
    cta: 'Start Free'
  },
  {
    name: 'Pro',
    price: '$49',
    description: 'For growing stores that need live sync and faster decisions.',
    points: ['Unlimited SKUs', 'Shopify real-time sync', 'Advanced analytics dashboard'],
    cta: 'Get Started',
    popular: true
  },
  {
    name: 'Business',
    price: '$129',
    description: 'For larger teams managing more complexity and volume.',
    points: ['Multi-user access', 'Priority support', 'Custom reporting workflows'],
    cta: 'Contact Sales'
  }
];

const rows = [
  ['Classic Tee', 'CT-204', '248', 'Healthy'],
  ['Canvas Tote', 'BG-188', '42', 'Low'],
  ['Travel Bottle', 'WB-091', '316', 'Healthy']
];

function sectionIntro(label, title, description, center = false) {
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
        {label}
      </span>
      <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
    </div>
  );
}

function buttonClass(primary = true) {
  return primary
    ? 'inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-brand-500 to-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(29,166,255,0.28)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(29,166,255,0.35)]'
    : 'inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.05] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]';
}

function NavLinkItem({ item, onClick }) {
  if (item.to) {
    return (
      <Link to={item.to} onClick={onClick} className="text-sm font-medium text-slate-300 transition hover:text-white">
        {item.label}
      </Link>
    );
  }

  return (
    <a href={item.href} onClick={onClick} className="text-sm font-medium text-slate-300 transition hover:text-white">
      {item.label}
    </a>
  );
}

function Icon({ kind, className = 'h-6 w-6' }) {
  if (kind === 'tracking') {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><path d="M12 3 3.5 7.5 12 12l8.5-4.5L12 3Z" /><path d="M3.5 12.5 12 17l8.5-4.5" /><path d="M3.5 17.5 12 22l8.5-4.5" /></svg>;
  }
  if (kind === 'sync') {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><path d="M21 12a9 9 0 0 1-15.36 6.36L3 16" /><path d="M3 21v-5h5" /><path d="M3 12A9 9 0 0 1 18.36 5.64L21 8" /><path d="M16 3h5v5" /></svg>;
  }
  if (kind === 'shopify') {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><path d="M4 10V6.5L5.5 4h13L20 6.5V10" /><path d="M4 10a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" /><path d="M5 10v9h14v-9" /></svg>;
  }
  if (kind === 'alerts') {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10.5 20a1.5 1.5 0 0 0 3 0" /></svg>;
  }
  if (kind === 'analytics') {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><path d="M4 19h16" /><path d="M7 16V9" /><path d="M12 16V5" /><path d="M17 16v-4" /></svg>;
  }
  if (kind === 'secure') {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" /><path d="m9.5 12 1.7 1.7 3.8-4.2" /></svg>;
  }
  if (kind === 'account') {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M19 8v6" /><path d="M16 11h6" /></svg>;
  }
  if (kind === 'connect') {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><path d="M8 7V3" /><path d="M16 7V3" /><path d="M5 11h14" /><path d="M12 11v10" /><path d="M8 7h8v4a4 4 0 0 1-8 0V7Z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="5" rx="2" /><rect x="13" y="10" width="8" height="11" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /></svg>;
}

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute inset-x-10 -top-10 h-28 rounded-full bg-brand-500/25 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-slate-950/70 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.65)] backdrop-blur-2xl">
        <div className="glass-panel rounded-[1.6rem] p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">InventoryFlow</p>
              <h3 className="mt-2 text-xl font-bold text-white">Operations Dashboard</h3>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-right">
              <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-200/80">Sync</p>
              <p className="mt-1 text-sm font-semibold text-emerald-100">Shopify Live</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ['Tracked SKUs', '1,248'],
                  ['Low Stock', '18'],
                  ['Orders Synced', '924']
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.35rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
                    <p className="mt-3 text-2xl font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.4rem] border border-white/10 bg-slate-900/80 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Inventory Snapshot</p>
                    <p className="mt-1 text-xs text-slate-400">Live product activity</p>
                  </div>
                  <div className="flex gap-2"><span className="h-2.5 w-2.5 rounded-full bg-cyan-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-300" /></div>
                </div>
                <div className="mt-6 flex h-40 items-end gap-3">
                  {[40, 62, 54, 76, 58, 88, 72].map((height, index) => (
                    <div key={index} className="flex-1">
                      <div className="w-full rounded-t-2xl bg-gradient-to-t from-brand-600 via-cyan-400 to-emerald-300" style={{ height: `${height}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Alerts</p>
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-100">6 Active</span>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    ['Canvas Tote', 'Only 42 left in stock'],
                    ['Travel Mug', 'Variant stock changed 2 min ago'],
                    ['Warehouse Sync', 'Shopify inventory updated']
                  ].map(([title, detail]) => (
                    <div key={title} className="rounded-2xl border border-white/8 bg-slate-950/70 px-3 py-3">
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-white/10 bg-slate-900/80 p-4">
                <p className="text-sm font-semibold text-white">Activity Pulse</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[70, 30, 60, 48, 82, 54, 68, 44].map((width, index) => (
                    <div key={index} className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-cyan-300" style={{ width: `${width}px` }} />
                  ))}
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-400">Store activity, sync events, and stock changes in one stream.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-slate-950/75 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.5)] backdrop-blur-xl">
      <div className="glass-panel rounded-[1.6rem] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-cyan-200/80">Unified View</p>
            <h3 className="mt-2 text-xl font-bold text-white">Everything in one place</h3>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">Updated every 15 seconds</div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-950/65">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.24em] text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">SKU</th>
                  <th className="px-4 py-3 font-semibold">Stock</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([name, sku, stock, status]) => (
                  <tr key={sku} className="border-t border-white/6 text-slate-300">
                    <td className="px-4 py-4 font-semibold text-white">{name}</td>
                    <td className="px-4 py-4">{sku}</td>
                    <td className="px-4 py-4">{stock}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status === 'Low' ? 'border border-amber-300/20 bg-amber-300/10 text-amber-100' : 'border border-emerald-300/20 bg-emerald-300/10 text-emerald-100'}`}>{status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Stock Performance</p>
                  <p className="mt-1 text-xs text-slate-400">7 day trend</p>
                </div>
                <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">+18.2%</span>
              </div>
              <div className="mt-6 flex h-28 items-end gap-2">
                {[32, 46, 40, 58, 64, 75, 88].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-sky-500 to-cyan-300" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-semibold text-white">Workflow Coverage</p>
              <div className="mt-4 space-y-3">
                {[
                  ['Catalog visibility', '92%'],
                  ['Auto-sync coverage', '87%'],
                  ['Alert response rate', '96%']
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{label}</span>
                      <span className="font-semibold text-white">{value}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/8">
                      <div className="h-2 rounded-full bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-300" style={{ width: value }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div id="top" className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_50%_75%,rgba(14,165,233,0.12),transparent_24%),linear-gradient(180deg,#020617_0%,#08111f_38%,#0a1020_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:80px_80px]" />
      <div className="pointer-events-none absolute left-[8%] top-28 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-40 h-96 w-96 rounded-full bg-indigo-500/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="relative z-10">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/65 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-brand-400 to-indigo-400 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-500/20">IF</div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">InventoryFlow</p>
                <p className="text-sm text-slate-400">Inventory Management System</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              {navItems.map((item) => <NavLinkItem key={item.label} item={item} />)}
            </nav>

            <div className="hidden lg:block">
              <Link to="/signup" className={buttonClass(true)}>Get Started</Link>
            </div>

            <button type="button" className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-100 lg:hidden" onClick={() => setMenuOpen((current) => !current)} aria-label="Toggle navigation">
              <span className="h-0.5 w-5 bg-current shadow-[0_6px_0_currentColor,0_-6px_0_currentColor]" />
            </button>
          </div>

          {menuOpen ? (
            <div className="border-t border-white/10 px-4 py-4 lg:hidden">
              <div className="flex flex-col gap-4">
                {navItems.map((item) => <NavLinkItem key={item.label} item={item} onClick={() => setMenuOpen(false)} />)}
                <Link to="/signup" onClick={() => setMenuOpen(false)} className={buttonClass(true)}>Get Started</Link>
              </div>
            </div>
          ) : null}
        </header>

        <main>
          <section className="mx-auto grid max-w-7xl gap-16 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-28 lg:pt-20">
            <div className="flex max-w-2xl flex-col justify-center">
              <span className="inline-flex w-fit rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">Smart Inventory Operations</span>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Monitor and Manage Your Inventory in One Smart Dashboard</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Track stock, get low stock alerts, and sync your Shopify store in real-time.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/signup" className={buttonClass(true)}>Get Started Free</Link>
                <Link to="/login" className={buttonClass(false)}>Connect Store</Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ['Live Sync', 'Shopify updates in real time'],
                  ['Alerts', 'Low stock warnings that stand out'],
                  ['Visibility', 'Products, stock, and activity together']
                ].map(([title, text]) => (
                  <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-xl">
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <HeroPreview />
            </div>
          </section>

          <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            {sectionIntro(
              'Features',
              'Built for teams that need instant inventory clarity',
              'InventoryFlow combines product visibility, live sync, and actionable alerts in a clean interface built to move fast.',
              true
            )}
            <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map(([kind, title, description]) => (
                <div key={title} className="group rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_22px_55px_rgba(15,23,42,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-cyan-300/20 hover:bg-white/[0.08]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 via-brand-500/20 to-indigo-400/20 text-cyan-100 ring-1 ring-white/10 transition duration-300 group-hover:scale-105">
                    <Icon kind={kind} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
            <div className="flex flex-col justify-center">
              {sectionIntro(
                'Product Preview',
                'Everything you need in one place',
                'Manage products, track stock, and monitor activity in real-time.'
              )}
              <div className="mt-8 space-y-4">
                {[
                  'Centralized stock visibility across products and variants',
                  'Actionable alerts for low stock before revenue is at risk',
                  'Live operational insight from a dashboard your team can trust'
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur-xl">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    <p className="text-sm leading-7 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <ProductPreview />
          </section>

          <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            {sectionIntro(
              'How It Works',
              'Set up fast, sync instantly, manage confidently',
              'InventoryFlow is designed to get stores operational quickly without adding complexity to daily workflows.',
              true
            )}
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {steps.map(([kind, title, description], index) => (
                <div key={title} className="relative rounded-[1.8rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
                  <div className="absolute left-6 top-6 text-5xl font-extrabold text-white/5">0{index + 1}</div>
                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 via-brand-500/20 to-indigo-400/20 text-cyan-100 ring-1 ring-white/10">
                      <Icon kind={kind} className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            {sectionIntro(
              'Pricing',
              'Simple plans for every stage of inventory growth',
              'Start free, upgrade when your workflow needs deeper automation, and keep your team aligned from day one.',
              true
            )}
            <div className="mt-14 grid gap-6 xl:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.name} className={`relative flex h-full flex-col rounded-[2rem] border p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 ${plan.popular ? 'border-cyan-300/30 bg-gradient-to-b from-brand-500/18 to-white/[0.08] shadow-[0_25px_80px_rgba(29,166,255,0.2)]' : 'border-white/10 bg-white/[0.05]'}`}>
                  {plan.popular ? <span className="absolute right-6 top-6 rounded-full border border-cyan-300/20 bg-cyan-300/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">Most Popular</span> : null}
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100/80">{plan.name} Plan</p>
                    <div className="mt-5 flex items-end gap-2">
                      <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                      <span className="pb-2 text-sm text-slate-400">/month</span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{plan.description}</p>
                  </div>
                  <div className="mt-8 space-y-3">
                    {plan.points.map((point) => (
                      <div key={point} className="flex items-start gap-3 text-sm text-slate-200">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-cyan-300" />
                        <span className="leading-6">{point}</span>
                      </div>
                    ))}
                  </div>
                  <Link to={plan.name === 'Business' ? '/login' : '/signup'} className={`mt-8 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition ${plan.popular ? 'bg-white text-slate-950 hover:bg-cyan-50' : 'border border-white/12 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.08]'}`}>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.2),transparent_30%),rgba(15,23,42,0.75)] px-6 py-14 shadow-[0_28px_80px_rgba(15,23,42,0.45)] backdrop-blur-2xl sm:px-10 lg:px-14">
              <div className="relative max-w-3xl">
                <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">Start Today</span>
                <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">Start Managing Your Inventory Today</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Give your team one modern dashboard for stock visibility, Shopify sync, and faster decisions.</p>
                <Link to="/signup" className="mt-8 inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50">
                  Get Started Free
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer id="privacy" className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <p>InventoryFlow. Modern inventory operations for fast-moving stores.</p>
            <div className="flex flex-wrap items-center gap-5">
              <a href="#features" className="transition hover:text-white">About</a>
              <a href="mailto:hello@inventoryflow.app" className="transition hover:text-white">Contact</a>
              <a href="#privacy" className="transition hover:text-white">Privacy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
