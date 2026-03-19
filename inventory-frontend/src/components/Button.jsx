const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60';

const variants = {
  primary:
    'bg-brand-500 text-white shadow-glow hover:-translate-y-0.5 hover:bg-brand-400 focus:ring-brand-300',
  secondary:
    'border border-white/10 bg-white/5 text-slate-100 hover:border-white/20 hover:bg-white/10 focus:ring-white/20',
  ghost:
    'text-slate-300 hover:bg-white/5 hover:text-white focus:ring-white/20',
  danger:
    'bg-rose-500/90 text-white hover:bg-rose-400 focus:ring-rose-300',
  success:
    'bg-emerald-500/90 text-white hover:bg-emerald-400 focus:ring-emerald-300'
};

export default function Button({
  children,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  variant = 'primary',
  ...props
}) {
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant] ?? variants.primary} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
          <span>Working...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
