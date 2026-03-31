import { Link } from 'react-router-dom';

const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Careers', to: '/careers' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', to: '/blog' },
      { label: 'Help Center', to: '/help' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms & Conditions', to: '/terms' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Cookie Policy', to: '/cookies' },
      { label: 'Refund Policy', to: '/refund-policy' },
      { label: 'Security', to: '/security' }
    ]
  }
];

export default function Footer() {
  return (
    <footer id="privacy" className="border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-8 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-brand-400 to-indigo-400 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-500/20">
                IF
              </div>
              <p className="text-lg font-bold text-white">InventoryFlow</p>
            </div>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
              A modern inventory management system to track stock, sync Shopify stores, and
              make smarter business decisions.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/80">
                {section.title}
              </p>
              <div className="mt-5 space-y-3 text-sm text-gray-400">
                {section.links.map((link) => (
                  <Link key={link.to} to={link.to} className="block transition hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
          {'\u00A9'} 2026 InventoryFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
