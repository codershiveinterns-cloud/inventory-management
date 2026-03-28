import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

const supportEmail = 'tusharpalaria2@gmail.com';

const initialForm = {
  name: '',
  email: '',
  message: ''
};

export default function ContactPage() {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const location = useLocation();

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitted(true);
    setFormData(initialForm);
  }

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
              Contact
            </span>
            <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Send us a message
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-slate-300 sm:text-xl">
              Reach out with support questions, sales requests, or anything you want to discuss
              about InventoryFlow.
            </p>
          </section>

          <section className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-[0_24px_60px_rgba(15,23,42,0.28)] backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white">Send us a message</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Fill out the form below and we will get back to you as soon as possible.
              </p>

              {isSubmitted ? (
                <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-medium text-emerald-100">
                  Your message has been captured. Please also use the support email card if you
                  want to reach us directly.
                </div>
              ) : null}

              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Name</span>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">Message</span>
                  <textarea
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help."
                    rows={6}
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-300 via-brand-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(29,166,255,0.3)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_65px_rgba(29,166,255,0.36)]"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-7 shadow-[0_24px_60px_rgba(15,23,42,0.28)] backdrop-blur-xl">
              <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
                Support
              </span>
              <h2 className="mt-5 text-2xl font-bold text-white">Email card</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                For support, reach us directly at the email below.
              </p>

              <div className="mt-6 rounded-[1.75rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/80">
                  Support Email
                </p>
                <p
                  className="mt-3 block break-all text-lg font-semibold text-white"
                >
                  {supportEmail}
                </p>
                <p className="mt-3 text-sm text-slate-300">
                  Send your issue, feature request, or account question here.
                </p>
              </div>
            </div>
          </section>
        </main>

        {!location.pathname.startsWith('/dashboard') && <Footer />}
      </div>
    </div>
  );
}
