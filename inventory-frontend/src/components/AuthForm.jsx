import { Link } from 'react-router-dom';
import Button from './Button';
import StatusMessage from './StatusMessage';

export default function AuthForm({
  title,
  subtitle,
  submitLabel,
  fields,
  values,
  statusMessage,
  statusType = 'info',
  error,
  isSubmitting,
  onChange,
  onSubmit,
  children,
  footerLabel,
  footerLinkLabel,
  footerTo
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_28%),linear-gradient(180deg,#020617_0%,#08111f_38%,#0a1020_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:80px_80px]" />
      <div className="pointer-events-none absolute left-[8%] top-28 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-20 h-96 w-96 rounded-full bg-indigo-500/12 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-brand-400 to-indigo-400 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-500/20">
              IF
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">InventoryFlow</p>
              <p className="text-sm text-slate-400">Inventory Management System</p>
            </div>
          </Link>

          <Link
            to={footerTo}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            {footerLinkLabel}
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
              Secure Workspace Access
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Manage inventory with one account that unlocks your whole dashboard
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Authenticate with Firebase, protect your dashboard routes, and keep your inventory
              operations ready for a larger MERN and Shopify workflow.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ['Route Protection', 'Only logged-in users can access inventory tools.'],
                ['Reusable Auth', 'Shared service and context built for scaling.'],
                ['Shopify Ready', 'Keeps auth isolated so store flows can plug in cleanly.']
              ].map(([heading, text]) => (
                <div
                  key={heading}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl"
                >
                  <p className="text-sm font-semibold text-white">{heading}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.55)] backdrop-blur-2xl">
            <div className="glass-panel rounded-[1.75rem] p-6 sm:p-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-100/80">
                  Account Access
                </p>
                <h2 className="mt-4 text-3xl font-bold text-white">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">{subtitle}</p>
              </div>

              {statusMessage ? (
                <div className="mt-6">
                  <StatusMessage type={statusType}>{statusMessage}</StatusMessage>
                </div>
              ) : null}

              {error ? <div className="mt-6"><StatusMessage type="error">{error}</StatusMessage></div> : null}

              <form className="mt-6 space-y-5" onSubmit={onSubmit}>
                {fields.map((field) => (
                  <label key={field.name} className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-200">
                      {field.label}
                    </span>
                    <input
                      name={field.name}
                      type={field.type}
                      value={values[field.name] ?? ''}
                      onChange={onChange}
                      autoComplete={field.autoComplete}
                      placeholder={field.placeholder}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-cyan-300/20"
                      required={field.required !== false}
                    />
                  </label>
                ))}

                {children}

                <Button type="submit" loading={isSubmitting} className="w-full py-3">
                  {submitLabel}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                {footerLabel}{' '}
                <Link to={footerTo} className="font-semibold text-cyan-200 transition hover:text-white">
                  {footerLinkLabel}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
