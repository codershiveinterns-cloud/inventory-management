import api from './api';

function extractCollection(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  return [];
}

function normalizeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeTrendPoint(point = {}, index) {
  return {
    date: point.date ?? point.label ?? `Point ${index + 1}`,
    label: point.label ?? point.date ?? `Point ${index + 1}`,
    value: normalizeNumber(
      point.value ?? point.totalQuantity ?? point.totalStock ?? point.quantity ?? point.stock
    ),
    productCount: normalizeNumber(point.productCount)
  };
}

function normalizeCategoryPoint(point = {}, index) {
  return {
    name: point.name ?? point.category ?? `Category ${index + 1}`,
    value: normalizeNumber(
      point.value ?? point.totalQuantity ?? point.totalStock ?? point.quantity ?? point.count
    ),
    productCount: normalizeNumber(point.productCount)
  };
}

export async function getStockTrend() {
  const response = await api.get('/analytics/stock-trend');
  console.log('Stock trend API response:', response.data);
  return extractCollection(response.data).map(normalizeTrendPoint);
}

export async function getCategoryDistribution() {
  const response = await api.get('/analytics/category-distribution');
  console.log('Category distribution API response:', response.data);
  return extractCollection(response.data).map(normalizeCategoryPoint);
}
