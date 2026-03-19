import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddProductPage from './pages/AddProductPage';
import DashboardPage from './pages/DashboardPage';
import EditProductPage from './pages/EditProductPage';
import InventoryUpdatePage from './pages/InventoryUpdatePage';
import LowStockPage from './pages/LowStockPage';
import ProductsPage from './pages/ProductsPage';
import ShopifyConnectPage from './pages/ShopifyConnectPage';

function AppLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-hero-grid opacity-90" />
      <div className="pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="relative z-10">
        <Navbar />
        <main className="page-shell">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<AddProductPage />} />
        <Route path="/products/:id/edit" element={<EditProductPage />} />
        <Route path="/inventory/update" element={<InventoryUpdatePage />} />
        <Route path="/low-stock" element={<LowStockPage />} />
        <Route path="/shopify/connect" element={<ShopifyConnectPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
