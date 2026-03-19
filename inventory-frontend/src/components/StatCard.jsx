import Card from './Card';

export default function StatCard({ eyebrow, title, value, helper, tone = 'cyan' }) {
  const toneMap = {
    cyan: 'from-cyan-400/25 to-brand-500/10 text-cyan-200',
    amber: 'from-amber-400/25 to-orange-500/10 text-amber-200',
    emerald: 'from-emerald-400/25 to-teal-500/10 text-emerald-200'
  };

  return (
    <Card className="relative overflow-hidden fade-in-up">
      <div
        className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${toneMap[tone] ?? toneMap.cyan} opacity-70 blur-2xl`}
      />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          {eyebrow}
        </p>
        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-4xl font-extrabold text-white">{value}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-300">{helper}</p>
      </div>
    </Card>
  );
}
