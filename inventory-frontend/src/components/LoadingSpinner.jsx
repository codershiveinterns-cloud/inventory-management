export default function LoadingSpinner({ label = 'Loading data...' }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center fade-in">
      <span className="h-11 w-11 animate-spin rounded-full border-4 border-brand-300/30 border-t-brand-300" />
      <p className="text-sm text-slate-300">{label}</p>
    </div>
  );
}
