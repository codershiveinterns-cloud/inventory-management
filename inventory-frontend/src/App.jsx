import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import AddProductPage from './pages/AddProductPage';
import DashboardPage from './pages/DashboardPage';
import EditProductPage from './pages/EditProductPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import InventoryUpdatePage from './pages/InventoryUpdatePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import LowStockPage from './pages/LowStockPage';
import ProductsPage from './pages/ProductsPage';
import ShopifyConnectPage from './pages/ShopifyConnectPage';
import SignupPage from './pages/SignupPage';

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
      <Route path="/" element={<LandingPage />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/app" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<AddProductPage />} />
          <Route path="/products/:id/edit" element={<EditProductPage />} />
          <Route path="/inventory/update" element={<InventoryUpdatePage />} />
          <Route path="/low-stock" element={<LowStockPage />} />
          <Route path="/shopify/connect" element={<ShopifyConnectPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
