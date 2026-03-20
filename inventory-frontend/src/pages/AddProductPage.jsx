import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ProductForm from '../components/ProductForm';
import StatusMessage from '../components/StatusMessage';
import { getApiErrorMessage } from '../services/api';
import { createProduct, getProducts } from '../services/products';

function normalizeSku(value) {
  return value.trim().toUpperCase();
}

function getDuplicateSkuMessage(error) {
  const message = getApiErrorMessage(error);
  return /duplicate|sku/i.test(message)
    ? 'That SKU already exists. Please use a unique SKU.'
    : message;
}

export default function AddProductPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleCreateProduct(product) {
    setIsSubmitting(true);
    setError('');

    try {
      if (!product.category?.trim()) {
        setError('Category is required.');
        return;
      }

      const normalizedSku = normalizeSku(product.sku);
      const products = await getProducts();
      const duplicateProduct = products.find(
        (existingProduct) => normalizeSku(existingProduct.sku ?? '') === normalizedSku
      );

      if (duplicateProduct) {
        setError('That SKU already exists. Please use a unique SKU.');
        return;
      }

      await createProduct({
        ...product,
        sku: normalizedSku
      });
      navigate('/products', {
        replace: true,
        state: { message: `"${product.title}" was created successfully.` }
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
        badge="New Product"
        title="Add inventory without slowing down your team"
        description="Create a product record, sync it to the backend, and return to the live catalog with the new item ready to manage."
      />

      {error ? <StatusMessage type="error">{error}</StatusMessage> : null}

      <ProductForm
        submitLabel="Create Product"
        description="Use this form to add products into your inventory catalog. After a successful save, the app routes back to the products list."
        onSubmit={handleCreateProduct}
        submitting={isSubmitting}
      />
    </section>
  );
}
