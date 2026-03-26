import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import ProductForm from '../components/ProductForm';
import StatusMessage from '../components/StatusMessage';
import { CURRENCY_SYMBOL } from '../lib/currency';
import { getApiErrorMessage } from '../services/api';
import { getProduct, getProducts, updateProduct } from '../services/products';

function normalizeSku(value) {
  return value.trim().toUpperCase();
}

function getDuplicateSkuMessage(error) {
  const message = getApiErrorMessage(error);
  return /duplicate|sku/i.test(message)
    ? 'That SKU already exists. Please use a unique SKU.'
    : message;
}

export default function EditProductPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product ?? null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      if (location.state?.product) {
        setProduct(location.state.product);
        setIsLoading(false);
        return;
      }

      try {
        const data = await getProduct(id);
        if (!data) {
          setError('Product not found.');
          return;
        }
        setProduct(data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [id, location.state]);

  async function handleUpdate(updatedProduct) {
    setIsSubmitting(true);
    setError('');

    try {
      const normalizedSku = normalizeSku(updatedProduct.sku);
      const products = await getProducts();
      const duplicateProduct = products.find(
        (existingProduct) =>
          existingProduct.id !== id &&
          normalizeSku(existingProduct.sku ?? '') === normalizedSku
      );

      if (duplicateProduct) {
        setError('That SKU already exists. Please use a unique SKU.');
        return;
      }

      await updateProduct(id, {
        ...updatedProduct,
        sku: normalizedSku
      });
      navigate('/products', {
        replace: true,
        state: { message: `"${updatedProduct.title}" was updated successfully.` }
      });
    } catch (requestError) {
      setError(getDuplicateSkuMessage(requestError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <PageHeader
        badge="Product Editor"
        title="Refresh product details without leaving the flow"
        description={`Load the current product data, adjust title, stock, or price in ${CURRENCY_SYMBOL}, and send the update to your backend in one save.`}
      />

      {error ? <StatusMessage type="error">{error}</StatusMessage> : null}

      {isLoading ? (
        <LoadingSpinner label="Loading product details..." />
      ) : product ? (
        <ProductForm
          submitLabel="Update Product"
          description="Changes are sent to the product update endpoint and then routed back to the products list."
          initialData={product}
          onSubmit={handleUpdate}
          submitting={isSubmitting}
        />
      ) : null}
    </section>
  );
}
