import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusMessage from '../components/StatusMessage';
import { getApiErrorMessage } from '../services/api';
import { getLowStockProducts, getProducts } from '../services/products';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [allProducts, lowStock] = await Promise.all([
          getProducts(),
          getLowStockProducts()
        ]);
        setProducts(allProducts);
        setLowStockProducts(lowStock);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);
  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  );

  return (
    <section>
      <PageHeader
        badge="Operations Overview"
        title="Stay ahead of stock gaps with a live control center"
        description="Track product totals, spot at-risk inventory, and jump into the parts of the system that need action right now."
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
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <StatCard
              eyebrow="Catalog"
              title="Total Products"
              value={products.length}
              helper="The number of products currently available in the inventory API."
              tone="cyan"
            />
            <StatCard
              eyebrow="Attention"
              title="Low Stock"
              value={lowStockProducts.length}
              helper="Products with stock below 10 are highlighted for quick follow-up."
              tone="amber"
            />
            <StatCard
              eyebrow="Value"
              title="Inventory Worth"
              value={formatCurrency(inventoryValue)}
              helper="A quick estimate based on current stock multiplied by product price."
              tone="emerald"
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
            <Card className="fade-in-up">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Low stock watchlist</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    Items that may need reordering soon.
                  </p>
                </div>
                <Link to="/low-stock">
                  <Button variant="secondary">View all</Button>
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {lowStockProducts.length > 0 ? (
                  lowStockProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-white">{product.title}</p>
                        <p className="text-sm text-slate-400">
                          {formatCurrency(product.price)} per item
                        </p>
                      </div>
                      <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
                        {product.stock} left
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-emerald-400/20 bg-emerald-400/10 px-4 py-10 text-center text-sm text-emerald-100">
                    All products are comfortably stocked right now.
                  </div>
                )}
              </div>
            </Card>

            <Card className="fade-in-up">
              <h3 className="text-xl font-bold text-white">Workflow shortcuts</h3>
              <p className="mt-2 text-sm text-slate-300">
                Move quickly between product maintenance, stock adjustments, and future store connection steps.
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
        </div>
      )}
    </section>
  );
}
