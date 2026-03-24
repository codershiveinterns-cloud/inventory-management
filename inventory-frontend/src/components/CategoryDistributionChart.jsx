import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const categoryColors = ['#38bdf8', '#34d399', '#fb7185', '#f59e0b', '#818cf8', '#22d3ee'];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/95 px-4 py-3 shadow-2xl">
      <p className="text-sm font-semibold text-white">{label ?? payload[0].name}</p>
      {payload.map((entry) => (
        <p key={`${entry.name}-${entry.dataKey}`} className="mt-1 text-sm text-slate-300">
          {entry.name}: <span className="font-semibold text-white">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function CategoryDistributionChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 px-4 py-14 text-center text-sm text-slate-400">
        No category distribution data is available yet.
      </div>
    );
  }

  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell
                key={`${entry.name}-${index}`}
                fill={categoryColors[index % categoryColors.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ color: '#cbd5e1' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
