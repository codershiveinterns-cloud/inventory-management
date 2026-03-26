import { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const BILLING_OPTIONS = {
  monthly: 'monthly',
  yearly: 'yearly'
};

const plans = [
  {
    name: 'Starter',
    ctaLabel: 'Get Started',
    ctaTo: '/signup',
    monthlyPrice: 59,
    yearlyPrice: 47,
    yearlyTotal: 564,
    description: 'For smaller teams that need structured inventory control without extra overhead.',
    features: [
      'Up to 100 SKUs',
      'Basic inventory tracking',
      'Low stock alerts',
      'Manual stock updates',
      'Single user'
    ]
  },
  {
    name: 'Growth',
    ctaLabel: 'Get Started',
    ctaTo: '/signup',
    monthlyPrice: 199,
    yearlyPrice: 159,
    yearlyTotal: 1908,
    popular: true,
    description: 'For scaling brands that need faster sync, better visibility, and stronger team workflows.',
    features: [
      'Up to 1000 SKUs',
      'Real-time inventory sync',
      'Shopify integration',
      'Analytics dashboard',
      'Up to 5 users',
      'Priority support'
    ]
  },
  {
    name: 'Enterprise',
    ctaLabel: 'Contact Sales',
    ctaTo: '/help',
    monthlyPrice: 299,
    yearlyPrice: 239,
    yearlyTotal: 2868,
    description: 'For high-volume operations managing multiple stores, custom reporting, and broader access.',
    features: [
      'Unlimited SKUs',
      'Multi-store management',
      'Custom reports',
      'API access',
      'Unlimited users',
      'Dedicated support'
    ]
  }
];

function formatEuro(value) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
}

function PricingCard({ plan, billingCycle }) {
  const isYearly = billingCycle === BILLING_OPTIONS.yearly;
  const displayPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <article
      className={`relative flex h-full flex-col rounded-[2rem] border p-7 shadow-[0_24px_60px_rgba(15,23,42,0.28)] backdrop-blur-xl transition-all duration-300 ${
        plan.popular
          ? 'border-cyan-300/30 bg-gradient-to-b from-brand-500/18 to-white/[0.08] shadow-[0_28px_90px_rgba(29,166,255,0.2)]'
          : 'border-white/10 bg-white/[0.05] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100/80">
            {plan.name}
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white">{plan.name} Plan</h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          {plan.popular ? (
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
              Most Popular
            </span>
          ) : null}
          {isYearly ? (
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-100">
              Save 20%
            </span>
          ) : null}
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-300">{plan.description}</p>

      <div className="mt-8 min-h-[104px] rounded-[1.5rem] border border-white/10 bg-slate-950/55 px-5 py-5 transition-all duration-300">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-extrabold tracking-tight text-white transition-all duration-300">
            {formatEuro(displayPrice)}
          </span>
          <span className="pb-2 text-sm text-slate-400">/month</span>
        </div>
        <p className="mt-3 text-sm text-slate-400 transition-all duration-300">
          {isYearly ? `Billed yearly ${formatEuro(plan.yearlyTotal)}` : 'Billed monthly'}
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-start gap-3 text-sm text-slate-200">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.5)]" />
            <span className="leading-6">{feature}</span>
          </div>
        ))}
      </div>

      <Link
        to={plan.ctaTo}
        className={`mt-8 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition duration-300 ${
          plan.popular
            ? 'bg-white text-slate-950 hover:-translate-y-0.5 hover:bg-cyan-50'
            : 'border border-white/12 bg-white/[0.04] text-white hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]'
        }`}
      >
        {plan.ctaLabel}
      </Link>
    </article>
  );
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState(BILLING_OPTIONS.monthly);
  const isYearly = billingCycle === BILLING_OPTIONS.yearly;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_50%_75%,rgba(14,165,233,0.12),transparent_24%),linear-gradient(180deg,#020617_0%,#08111f_38%,#0a1020_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:80px_80px]" />
      <div className="pointer-events-none absolute left-[8%] top-28 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-40 h-96 w-96 rounded-full bg-indigo-500/12 blur-3xl" />

      <div className="relative z-10">
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <section className="mx-auto max-w-4xl text-center">
            <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100 shadow-[0_10px_30px_rgba(34,211,238,0.12)]">
              Pricing
            </span>
            <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Plans that match how your inventory operation scales
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-slate-300 sm:text-xl">
              Start with a clean operational foundation, then upgrade into deeper sync,
              analytics, and team capacity as your catalog grows.
            </p>
          </section>

          <section className="mt-14 flex flex-col items-center gap-5">
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.05] p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.3)] backdrop-blur-xl">
              {[
                { id: BILLING_OPTIONS.monthly, label: 'Monthly' },
                { id: BILLING_OPTIONS.yearly, label: 'Yearly' }
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setBillingCycle(option.id)}
                  className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    billingCycle === option.id
                      ? 'bg-gradient-to-r from-cyan-300 via-brand-500 to-indigo-500 text-white shadow-[0_14px_35px_rgba(29,166,255,0.28)]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  aria-pressed={billingCycle === option.id}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {isYearly ? (
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100 transition-all duration-300">
                Save 20%
              </span>
            ) : null}
          </section>

          <section className="mt-14 grid gap-6 xl:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} billingCycle={billingCycle} />
            ))}
          </section>

          <section className="mt-20">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.2),transparent_30%),rgba(15,23,42,0.75)] px-6 py-14 text-center shadow-[0_28px_80px_rgba(15,23,42,0.45)] backdrop-blur-2xl sm:px-10 lg:px-14">
              <div className="pointer-events-none absolute left-10 top-8 h-32 w-32 rounded-full bg-cyan-400/12 blur-3xl" />
              <div className="pointer-events-none absolute bottom-8 right-10 h-40 w-40 rounded-full bg-indigo-500/14 blur-3xl" />
              <div className="relative mx-auto max-w-3xl">
                <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
                  InventoryFlow
                </span>
                <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Choose the billing cycle that fits your planning horizon
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
                  Start monthly for flexibility or switch to yearly to lock in lower effective
                  pricing while keeping the same feature access.
                </p>
                <Link
                  to="/signup"
                  className="mt-9 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-300 via-brand-500 to-indigo-500 px-7 py-4 text-sm font-semibold text-white shadow-[0_24px_60px_rgba(29,166,255,0.34)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_75px_rgba(29,166,255,0.4)]"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
