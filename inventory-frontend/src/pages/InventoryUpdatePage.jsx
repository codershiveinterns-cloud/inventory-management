import { useEffect, useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import StatusMessage from '../components/StatusMessage';
import { formatCurrency } from '../lib/currency';
import { getApiErrorMessage } from '../services/api';
import { getProducts, updateInventory } from '../services/products';

export default function InventoryUpdatePage() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [activeProductId, setActiveProductId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  function handleQuantityChange(productId, value) {
    setQuantities((current) => ({
      ...current,
      [productId]: value
    }));
  }

  async function handleInventoryUpdate(product, type) {
    const quantity = Number(quantities[product.id] || 1);

    if (quantity <= 0) {
      setError('Quantity must be greater than zero before updating inventory.');
      setMessage('');
      return;
    }

    setActiveProductId(product.id);
    setMessage('');
    setError('');

    try {
      await updateInventory({
        productId: product.id,
        quantity,
        type
      });

      const refreshedProducts = await getProducts();
      setProducts(refreshedProducts);
      setMessage(
        `${type === 'increase' ? 'Increased' : 'Decreased'} stock for "${product.title}" by ${quantity}.`
      );
      setQuantities((current) => ({
        ...current,
        [product.id]: 1
      }));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setActiveProductId('');
    }
  }

  return (
    <section>
      <PageHeader
        badge="Inventory API"
        title="Adjust stock levels with focused inventory actions"
        description="Use the dedicated inventory update endpoint to increase or decrease stock without editing the entire product record."
      />

      {message ? <StatusMessage type="success">{message}</StatusMessage> : null}
      {error ? <StatusMessage type="error">{error}</StatusMessage> : null}

      {isLoading ? (
        <LoadingSpinner label="Loading inventory actions..." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {products.map((product) => (
            <Card key={product.id} className="fade-in-up">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{product.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {formatCurrency(product.price)} per item
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${
                    product.isLowStock === true
                      ? 'border border-rose-300/25 bg-rose-400/10 text-rose-200'
                      : 'border border-emerald-300/25 bg-emerald-300/10 text-emerald-200'
                  }`}
                >
                  Stock: {product.stock}
                </span>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <input
                  type="number"
                  min="1"
                  value={quantities[product.id] ?? 1}
                  onChange={(event) => handleQuantityChange(product.id, event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30 sm:max-w-[120px]"
                />
                <div className="flex flex-1 flex-wrap gap-3">
                  <Button
                    variant="success"
                    className="flex-1"
                    loading={activeProductId === product.id}
                    onClick={() => handleInventoryUpdate(product, 'increase')}
                  >
                    Increase
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    disabled={activeProductId === product.id}
                    onClick={() => handleInventoryUpdate(product, 'decrease')}
                  >
                    Decrease
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
