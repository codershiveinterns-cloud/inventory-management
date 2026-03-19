import { useEffect, useState } from 'react';
import Button from './Button';
import Card from './Card';

const emptyForm = {
  title: '',
  sku: '',
  stock: '',
  price: '',
  lowStockThreshold: ''
};

export default function ProductForm({
  description,
  initialData = emptyForm,
  onSubmit,
  submitLabel,
  submitting = false
}) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      title: initialData.title ?? '',
      sku: initialData.sku ?? '',
      stock: initialData.stock ?? '',
      price: initialData.price ?? '',
      lowStockThreshold: initialData.lowStockThreshold ?? ''
    });
    setErrors({});
  }, [initialData]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
    setErrors((current) => ({
      ...current,
      [name]: ''
    }));
  }

  function validateForm() {
    const nextErrors = {};

    if (formData.lowStockThreshold === '') {
      nextErrors.lowStockThreshold = 'Low Stock Alert is required.';
    } else if (Number(formData.lowStockThreshold) < 0) {
      nextErrors.lowStockThreshold = 'Low Stock Alert must be 0 or greater.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit({
      title: formData.title.trim(),
      sku: formData.sku.trim(),
      stock: Number(formData.stock),
      price: Number(formData.price),
      lowStockThreshold: Number(formData.lowStockThreshold)
    });
  }

  return (
    <Card className="max-w-3xl fade-in-up">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">{submitLabel}</h3>
        <p className="mt-2 text-sm text-slate-300">{description}</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Product title
            </span>
            <input
              required
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Wireless barcode scanner"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">SKU</span>
            <input
              required
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="INV-1001"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 uppercase text-white placeholder:text-slate-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Stock quantity
            </span>
            <input
              required
              min="0"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="25"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Price
            </span>
            <input
              required
              min="0"
              step="0.01"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="149.99"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300/30"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Low Stock Alert
            </span>
            <input
              required
              min="0"
              type="number"
              name="lowStockThreshold"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              placeholder="Enter threshold value (e.g., 10)"
              className={`w-full rounded-2xl border bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                errors.lowStockThreshold
                  ? 'border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/30'
                  : 'border-white/10 focus:border-brand-300 focus:ring-brand-300/30'
              }`}
            />
            <p className="mt-2 text-xs leading-6 text-slate-400">
              Set the minimum quantity at which this product will be considered low in stock.
            </p>
            {errors.lowStockThreshold ? (
              <p className="mt-1 text-sm font-medium text-rose-300">
                {errors.lowStockThreshold}
              </p>
            ) : null}
          </label>
        </div>

        <div className="flex items-center justify-start pt-2">
          <Button type="submit" loading={submitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
