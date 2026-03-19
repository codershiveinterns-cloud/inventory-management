export default function Card({ children, className = '' }) {
  return (
    <div
      className={`glass-panel panel-outline rounded-3xl p-5 shadow-2xl shadow-slate-950/20 ${className}`}
    >
      {children}
    </div>
  );
}
