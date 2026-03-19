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

function extractDashboardSource(payload) {
  return payload?.data ?? payload;
}

function normalizeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeTrendPoint(point = {}, index) {
  return {
    label:
      point.label ??
      point.date ??
      point.day ??
      point.month ??
      point.name ??
      `Point ${index + 1}`,
    value:
      normalizeNumber(
        point.value ?? point.stock ?? point.totalStock ?? point.quantity ?? point.count
      ) ?? 0
  };
}

function normalizeCategoryPoint(point = {}, index) {
  return {
    name: point.name ?? point.category ?? point.label ?? `Category ${index + 1}`,
    value: normalizeNumber(point.value ?? point.count ?? point.total ?? point.stock)
  };
}

function normalizeRecentUpdate(item = {}, index) {
  return {
    id: item.id ?? item._id ?? `update-${index}`,
    title: item.title ?? item.productTitle ?? item.name ?? 'Product updated',
    sku: item.sku ?? 'N/A',
    change: item.change ?? item.action ?? item.type ?? 'Updated',
    quantity: normalizeNumber(item.quantity ?? item.stockChange ?? item.delta ?? item.stock),
    timestamp: item.updatedAt ?? item.createdAt ?? item.timestamp ?? item.date ?? ''
  };
}

export async function getDashboardData() {
  const response = await api.get('http://localhost:5000/api/dashboard');
  const source = extractDashboardSource(response.data);
  const dashboard = source.dashboard ?? source;
  const stats = dashboard.stats ?? dashboard.summary ?? dashboard.overview ?? {};
  const recentUpdates = extractCollection(
    dashboard.recentUpdates ?? dashboard.updates ?? dashboard.activities
  ).map(normalizeRecentUpdate);
  const stockTrend = extractCollection(
    dashboard.stockTrend ?? dashboard.trend ?? dashboard.stockHistory
  ).map(normalizeTrendPoint);
  const categoryDistribution = extractCollection(
    dashboard.categoryDistribution ?? dashboard.categoryBreakdown ?? dashboard.categories
  ).map(normalizeCategoryPoint);

  return {
    totalProducts: normalizeNumber(stats.totalProducts ?? dashboard.totalProducts),
    totalStock: normalizeNumber(stats.totalStock ?? dashboard.totalStock),
    lowStockItems: normalizeNumber(
      stats.lowStockItems ??
        stats.lowStockCount ??
        dashboard.lowStockItems ??
        dashboard.lowStockCount
    ),
    recentUpdatesCount: normalizeNumber(
      stats.recentUpdates ?? dashboard.recentUpdatesCount ?? recentUpdates.length
    ),
    recentUpdates,
    stockTrend,
    categoryDistribution
  };
}
