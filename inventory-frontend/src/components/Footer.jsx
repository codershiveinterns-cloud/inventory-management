import { Link } from 'react-router-dom';

function SocialIcon({ kind }) {
  if (kind === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (kind === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-12h4v2" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M22 5.9c-.7.3-1.5.5-2.3.7.8-.5 1.4-1.2 1.7-2.1-.8.5-1.7.8-2.6 1-1.5-1.6-4.1-1.1-5.2.9-.5.9-.5 1.9-.2 2.8-3.1-.2-6-1.8-7.9-4.3-1 1.8-.5 4 1.1 5.1-.6 0-1.2-.2-1.7-.5 0 2 1.4 3.7 3.4 4.1-.6.2-1.2.2-1.8.1.5 1.7 2.1 2.9 3.9 2.9A8.5 8.5 0 0 1 2 19.5a12 12 0 0 0 6.5 1.9c7.9 0 12.4-6.7 12.1-12.6.8-.5 1.4-1.1 1.9-1.9Z" />
    </svg>
  );
}

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
      { label: 'Refund Policy', to: '/refund' },
      { label: 'Cookie Policy', to: '/cookies' },
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

            <div className="mt-6 flex items-center gap-3">
              {['instagram', 'linkedin', 'twitter'].map((social) => (
                <button
                  key={social}
                  type="button"
                  aria-label={social}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-gray-400 transition duration-300 hover:scale-110 hover:text-white"
                >
                  <SocialIcon kind={social} />
                </button>
              ))}
            </div>
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
