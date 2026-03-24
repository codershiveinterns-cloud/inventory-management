import { Link } from 'react-router-dom';
import Footer from './Footer';

export default function MarketingPageLayout({
  eyebrow,
  title,
  description,
  sections,
  ctaTitle = 'Bring your inventory workflow into one focused system',
  ctaDescription = 'InventoryFlow gives teams a cleaner way to manage stock, streamline operations, and make faster decisions with confidence.',
  ctaTo = '/signup'
}) {
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
              {eyebrow}
            </span>
            <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-slate-300 sm:text-xl">
              {description}
            </p>
          </section>

          <section className="mt-16 grid gap-6 lg:grid-cols-2">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-[0_24px_60px_rgba(15,23,42,0.28)] backdrop-blur-xl"
              >
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                <p className="mt-4 text-base leading-8 text-slate-300">{section.body}</p>
                {section.points?.length ? (
                  <div className="mt-6 space-y-3">
                    {section.points.map((point) => (
                      <div key={point} className="flex items-start gap-3 text-sm text-slate-300">
                        <span className="mt-2 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.6)]" />
                        <span className="leading-7">{point}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
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
                  {ctaTitle}
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
                  {ctaDescription}
                </p>
                <Link
                  to={ctaTo}
                  className="mt-9 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-300 via-brand-500 to-indigo-500 px-7 py-4 text-sm font-semibold text-white shadow-[0_24px_60px_rgba(29,166,255,0.34)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_75px_rgba(29,166,255,0.4)]"
                >
                  Get Started Free
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
