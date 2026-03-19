import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import StatusMessage from '../components/StatusMessage';
import { getApiErrorMessage } from '../services/api';
import { deleteProduct, getProducts } from '../services/products';

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

export default function ProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDeleteId, setActiveDeleteId] = useState('');
  const [message, setMessage] = useState(location.state?.message ?? '');
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

  useEffect(() => {
    if (location.state?.message) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  async function handleDelete(product) {
    const confirmed = window.confirm(`Delete "${product.title}" from inventory?`);

    if (!confirmed) {
      return;
    }

    setActiveDeleteId(product.id);
    setError('');
    setMessage('');

    try {
      await deleteProduct(product.id);
      setProducts((current) => current.filter((item) => item.id !== product.id));
      setMessage(`"${product.title}" was deleted successfully.`);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    } finally {
      setActiveDeleteId('');
    }
  }

  return (
    <section>
      <PageHeader
        badge="Product Catalog"
        title="Manage every product from one responsive workspace"
        description="Browse inventory items from the API, review low stock flags, update details, and remove products that are no longer needed."
        actions={
          <Link to="/products/new">
            <Button>Add Product</Button>
          </Link>
        }
      />

      {message ? <StatusMessage type="success">{message}</StatusMessage> : null}
      {error ? <StatusMessage type="error">{error}</StatusMessage> : null}

      {isLoading ? (
        <LoadingSpinner label="Loading products..." />
      ) : products.length === 0 ? (
        <Card className="py-12 text-center fade-in-up">
          <h3 className="text-xl font-bold text-white">No products found</h3>
          <p className="mt-3 text-sm text-slate-300">
            Create your first item to start tracking inventory and low stock alerts.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="fade-in-up">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{product.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Product ID: {product.id || 'Unavailable'}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    SKU: {product.sku || 'Unavailable'}
                  </p>
                </div>
                {product.isLowStock === true ? (
                  <span className="rounded-full border border-rose-300/25 bg-rose-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-rose-200">
                    Low Stock
                  </span>
                ) : null}
              </div>

              <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Stock</span>
                  <span className="font-semibold text-white">{product.stock}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Price</span>
                  <span className="font-semibold text-white">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Low stock alert</span>
                  <span className="font-semibold text-white">
                    {product.lowStockThreshold}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to={`/products/${product.id}/edit`}
                  state={{ product }}
                  className="flex-1"
                >
                  <Button variant="secondary" className="w-full">
                    Update
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  className="flex-1"
                  loading={activeDeleteId === product.id}
                  onClick={() => handleDelete(product)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
