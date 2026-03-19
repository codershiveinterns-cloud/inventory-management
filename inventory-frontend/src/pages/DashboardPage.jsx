import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusMessage from '../components/StatusMessage';
import { getApiErrorMessage } from '../services/api';
import { getDashboardData } from '../services/dashboard';

const categoryColors = ['#38bdf8', '#34d399', '#fb7185', '#f59e0b', '#818cf8', '#22d3ee'];

function formatDate(value) {
  if (!value) {
    return 'Just now';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/95 px-4 py-3 shadow-2xl">
      <p className="text-sm font-semibold text-white">{label ?? payload[0].name}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="mt-1 text-sm text-slate-300">
          {entry.name}: <span className="font-semibold text-white">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboardData();
        setDashboard(data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <section>
      <PageHeader
        badge="Operations Overview"
        title="Monitor inventory health from one live dashboard"
        description="Pull key metrics, recent backend activity, and visual stock breakdowns directly from the dashboard API."
        actions={
          <div className="flex flex-wrap gap-3">
            <Link to="/products/new">
              <Button>Add Product</Button>
            </Link>
            <Link to="/shopify/connect">
              <Button variant="success">Connect Store</Button>
            </Link>
          </div>
        }
      />

      {error ? <StatusMessage type="error">{error}</StatusMessage> : null}

      {isLoading ? (
        <LoadingSpinner label="Building your dashboard..." />
      ) : (
        <div className="space-y-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              eyebrow="Catalog"
              title="Total Products"
              value={dashboard?.totalProducts ?? 0}
              helper="The total number of products currently tracked by the dashboard API."
              tone="cyan"
            />
            <StatCard
              eyebrow="Inventory"
              title="Total Stock"
              value={dashboard?.totalStock ?? 0}
              helper="The combined quantity currently available across all products."
              tone="emerald"
            />
            <StatCard
              eyebrow="Attention"
              title="Low Stock Items"
              value={dashboard?.lowStockItems ?? 0}
              helper="Products currently flagged as low in stock and needing attention."
              tone="amber"
            />
            <StatCard
              eyebrow="Activity"
              title="Recent Updates"
              value={dashboard?.recentUpdatesCount ?? 0}
              helper="The latest inventory or product changes returned by the dashboard endpoint."
              tone="cyan"
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.95fr]">
            <Card className="fade-in-up">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Recent updates</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    A live view of the latest product and inventory changes returned by the backend.
                  </p>
                </div>
                <Link to="/products">
                  <Button variant="secondary">Open catalog</Button>
                </Link>
              </div>

              <div className="mt-6 overflow-x-auto">
                {dashboard?.recentUpdates?.length ? (
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      <tr className="border-b border-white/10">
                        <th className="px-3 py-3 font-semibold">Product</th>
                        <th className="px-3 py-3 font-semibold">SKU</th>
                        <th className="px-3 py-3 font-semibold">Action</th>
                        <th className="px-3 py-3 font-semibold">Qty</th>
                        <th className="px-3 py-3 font-semibold">Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.recentUpdates.map((update) => (
                        <tr
                          key={update.id}
                          className="border-b border-white/5 text-slate-300 last:border-b-0"
                        >
                          <td className="px-3 py-4">
                            <p className="font-semibold text-white">{update.title}</p>
                          </td>
                          <td className="px-3 py-4">{update.sku}</td>
                          <td className="px-3 py-4">
                            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                              {update.change}
                            </span>
                          </td>
                          <td className="px-3 py-4 font-semibold text-white">
                            {update.quantity}
                          </td>
                          <td className="px-3 py-4">{formatDate(update.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="rounded-2xl border border-dashed border-emerald-400/20 bg-emerald-400/10 px-4 py-10 text-center text-sm text-emerald-100">
                    No recent dashboard updates were returned by the API yet.
                  </div>
                )}
              </div>
            </Card>

            <Card className="fade-in-up">
              <h3 className="text-xl font-bold text-white">Quick actions</h3>
              <p className="mt-2 text-sm text-slate-300">
                Jump into the most common inventory tasks from the dashboard.
              </p>

              <div className="mt-6 grid gap-3">
                <Link
                  to="/products"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:border-white/20 hover:bg-white/10"
                >
                  <p className="font-semibold text-white">Manage products</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Edit details, review prices, and delete outdated items.
                  </p>
                </Link>
                <Link
                  to="/inventory/update"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:border-white/20 hover:bg-white/10"
                >
                  <p className="font-semibold text-white">Update inventory</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Increase or decrease stock using the dedicated inventory API.
                  </p>
                </Link>
                <Link
                  to="/shopify/connect"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:border-white/20 hover:bg-white/10"
                >
                  <p className="font-semibold text-white">Prepare Shopify</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Use the connect store button and placeholder OAuth screen for the next integration step.
                  </p>
                </Link>
              </div>
            </Card>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <Card className="fade-in-up">
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">Stock Trend</h3>
                <p className="mt-2 text-sm text-slate-300">
                  A line chart showing inventory movement over time from the dashboard endpoint.
                </p>
              </div>

              {dashboard?.stockTrend?.length ? (
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboard.stockTrend}>
                      <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Stock"
                        stroke="#38bdf8"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#38bdf8', strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 px-4 py-14 text-center text-sm text-slate-400">
                  No stock trend data is available yet.
                </div>
              )}
            </Card>

            <Card className="fade-in-up">
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">Category Distribution</h3>
                <p className="mt-2 text-sm text-slate-300">
                  A pie chart showing how inventory is distributed across categories.
                </p>
              </div>

              {dashboard?.categoryDistribution?.length ? (
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboard.categoryDistribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={4}
                      >
                        {dashboard.categoryDistribution.map((entry, index) => (
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
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 px-4 py-14 text-center text-sm text-slate-400">
                  No category distribution data is available yet.
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}
