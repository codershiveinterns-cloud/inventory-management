import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import CategoryDistributionChart from '../components/CategoryDistributionChart';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StockTrendChart from '../components/StockTrendChart';
import StatusMessage from '../components/StatusMessage';
import { getCategoryDistribution, getStockTrend } from '../services/analytics';
import { getApiErrorMessage } from '../services/api';
import { getDashboardData } from '../services/dashboard';
import { socket } from '../services/socket';

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

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [stockTrend, setStockTrend] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const activePlan = localStorage.getItem('app_plan') || 'basic';

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [dashboardData, stockTrendData, categoryDistributionData] = await Promise.all([
          getDashboardData(),
          getStockTrend(),
          getCategoryDistribution()
        ]);

        console.log('Dashboard stats response:', dashboardData);
        console.log('Stock trend chart data:', stockTrendData);
        console.log('Category distribution chart data:', categoryDistributionData);

        setDashboard(dashboardData);
        setStockTrend(stockTrendData);
        setCategoryDistribution(categoryDistributionData);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('joinGlobal');

    function handleInventoryUpdated() {
      console.log('Real-time inventory update received on dashboard!');
      // Re-fetch dashboard data automatically
      async function reloadDashboard() {
        try {
          const [dashboardData, stockTrendData, categoryDistributionData] = await Promise.all([
            getDashboardData(),
            getStockTrend(),
            getCategoryDistribution()
          ]);
          setDashboard(dashboardData);
          setStockTrend(stockTrendData);
          setCategoryDistribution(categoryDistributionData);
        } catch (err) {
          console.error("Failed to refresh dashboard on socket event", err);
        }
      }
      reloadDashboard();
    }

    socket.on('inventoryUpdated', handleInventoryUpdated);

    return () => {
      socket.off('inventoryUpdated', handleInventoryUpdated);
    };
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

          </div>
        }
      />

      {error ? <StatusMessage type="error">{error}</StatusMessage> : null}

      {isLoading ? (
        <LoadingSpinner label="Building your dashboard..." />
      ) : (
        <div className="space-y-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {activePlan !== 'basic' && (
              <StatCard
                eyebrow="Catalog"
                title="Total Products"
                value={dashboard?.totalProducts ?? 0}
                helper="The total number of products currently tracked by the dashboard API."
                tone="cyan"
              />
            )}
            {activePlan !== 'basic' && (
              <StatCard
                eyebrow="Inventory"
                title="Total Stock"
                value={dashboard?.totalStock ?? 0}
                helper="The combined quantity currently available across all products."
                tone="emerald"
              />
            )}
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

              </div>
            </Card>
          </div>

          {activePlan !== 'basic' && (
            <div className="grid gap-5 xl:grid-cols-2">
              <Card className="fade-in-up">
                <div className="mb-5">
                  <h3 className="text-xl font-bold text-white">Stock Trend</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    A line chart showing inventory movement over time from the analytics API.
                  </p>
                </div>
                <StockTrendChart data={stockTrend} />
              </Card>

              <Card className="fade-in-up">
                <div className="mb-5">
                  <h3 className="text-xl font-bold text-white">Category Distribution</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    A pie chart showing how inventory is distributed across categories.
                  </p>
                </div>
                <CategoryDistributionChart data={categoryDistribution} />
              </Card>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
