import { useEffect, useState } from 'react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import StatusMessage from '../components/StatusMessage';
import { formatCurrency } from '../lib/currency';
import { getApiErrorMessage } from '../services/api';
import { getLowStockProducts } from '../services/products';

export default function LowStockPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getLowStockProducts();
        setProducts(data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <section>
      <PageHeader
        badge="Reorder Queue"
        title="Find products that need attention before they run out"
        description="This page loads low inventory items directly from the backend low-stock endpoint so teams can prioritize replenishment quickly."
      />

      {error ? <StatusMessage type="error">{error}</StatusMessage> : null}

      {isLoading ? (
        <LoadingSpinner label="Scanning for low stock items..." />
      ) : products.length === 0 ? (
        <Card className="py-12 text-center fade-in-up">
          <h3 className="text-xl font-bold text-white">No low stock products right now</h3>
          <p className="mt-3 text-sm text-slate-300">
            Once any product drops below 10 units, it will appear here automatically.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="fade-in-up">
              <span className="inline-flex rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
                Low Stock
              </span>
              <h3 className="mt-4 text-xl font-bold text-white">{product.title}</h3>
              <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
                <span>Current stock</span>
                <span className="font-semibold text-white">{product.stock}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
                <span>Unit price</span>
                <span className="font-semibold text-white">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
