const styles = {
  success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
  error: 'border-rose-400/20 bg-rose-400/10 text-rose-100',
  info: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100'
};

export default function StatusMessage({ children, type = 'info' }) {
  return (
    <div
      className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-medium fade-in ${
        styles[type] ?? styles.info
      }`}
    >
      {children}
    </div>
  );
}
