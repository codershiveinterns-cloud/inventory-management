import api from './api';

function extractCollection(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function extractItem(payload) {
  return payload?.product ?? payload?.data ?? payload;
}

function normalizeProduct(product = {}) {
  return {
    id: product.id ?? product._id ?? product.productId ?? '',
    title: product.title ?? product.name ?? 'Untitled product',
    sku: product.sku ?? '',
    lowStockThreshold:
      product.lowStockThreshold !== undefined && product.lowStockThreshold !== null
        ? Number(product.lowStockThreshold)
        : '',
    isLowStock: Boolean(product.isLowStock),
    stock: Number(product.stock ?? product.quantity ?? 0),
    price: Number(product.price ?? 0)
  };
}

function serializeProductInput(product) {
  const payload = {
    title: product.title,
    sku: product.sku,
    stock: Number(product.stock),
    price: Number(product.price),
    lowStockThreshold: Number(product.lowStockThreshold)
  };

  return payload;
}

export async function getProducts() {
  const response = await api.get('/products');
  return extractCollection(response.data).map(normalizeProduct);
}

export async function getProduct(id) {
  const products = await getProducts();
  return products.find((product) => product.id === id) ?? null;
}

export async function createProduct(product) {
  const payload = serializeProductInput(product);

  console.log({
    title: payload.title,
    sku: payload.sku,
    stock: payload.stock,
    price: payload.price,
    lowStockThreshold: payload.lowStockThreshold
  });

  const response = await api.post('/products', payload);
  return normalizeProduct(extractItem(response.data));
}

export async function updateProduct(id, product) {
  const payload = serializeProductInput(product);
  const response = await api.put(`/products/${id}`, payload);
  return normalizeProduct(extractItem(response.data));
}

export async function deleteProduct(id) {
  return api.delete(`/products/${id}`);
}

export async function updateInventory({ productId, quantity, type }) {
  const response = await api.post('/inventory/update', {
    productId,
    quantity: Number(quantity),
    type
  });

  return normalizeProduct(extractItem(response.data));
}

export async function getLowStockProducts() {
  const response = await api.get('/products/low-stock');
  return extractCollection(response.data).map(normalizeProduct);
}
