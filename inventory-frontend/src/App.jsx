import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import DashboardNavbar from './components/DashboardNavbar';
import LandingNavbar from './components/LandingNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import ScrollToTop from './components/ScrollToTop';
import AddProductPage from './pages/AddProductPage';
import AboutPage from './pages/About';
import BlogPage from './pages/Blog';
import CareersPage from './pages/Careers';
import CookiesPage from './pages/Cookies';
import DashboardPage from './pages/DashboardPage';
import EditProductPage from './pages/EditProductPage';
import FeaturesPage from './pages/Features';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HelpPage from './pages/Help';
import InventoryUpdatePage from './pages/InventoryUpdatePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import LowStockPage from './pages/LowStockPage';
import PricingPage from './pages/Pricing';
import ProductsPage from './pages/ProductsPage';
import PrivacyPage from './pages/Privacy';
import RefundPage from './pages/Refund';
import SecurityPage from './pages/Security';
import ShopifyConnectPage from './pages/ShopifyConnectPage';
import SignupPage from './pages/SignupPage';
import TermsPage from './pages/Terms';
import { useAuth } from './context/AuthContext';

function AppLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-hero-grid opacity-90" />
      <div className="pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <main className="relative z-10 page-shell pt-28">
        <Outlet />
      </main>
    </div>
  );
}

function AppShell() {
  const location = useLocation();
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return null;
  }

  return (
    <>
      <ScrollToTop />
      {isAuthenticated ? (
        <DashboardNavbar key={`dashboard-${location.pathname}`} />
      ) : (
        <LandingNavbar key={`landing-${location.pathname}`} />
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/refund" element={<RefundPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/security" element={<SecurityPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/products/new" element={<AddProductPage />} />
            <Route path="/products/:id/edit" element={<EditProductPage />} />
            <Route path="/inventory-update" element={<InventoryUpdatePage />} />
            <Route path="/inventory/update" element={<InventoryUpdatePage />} />
            <Route path="/low-stock" element={<LowStockPage />} />
            <Route path="/shopify" element={<ShopifyConnectPage />} />
            <Route path="/shopify/connect" element={<ShopifyConnectPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <AppShell />;
}
