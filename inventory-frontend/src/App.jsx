import { Navigate, Outlet, Route, Routes, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import createApp from '@shopify/app-bridge';
import { setupApiInterceptor } from './services/api';
import DashboardNavbar from './components/DashboardNavbar';
import LandingNavbar from './components/LandingNavbar';
import ScrollToTop from './components/ScrollToTop';
import AddProductPage from './pages/AddProductPage';
import AboutPage from './pages/About';
import BlogPage from './pages/Blog';
import CareersPage from './pages/Careers';
import ContactPage from './pages/Contact';
import CookiesPage from './pages/Cookies';
import DashboardPage from './pages/DashboardPage';
import EditProductPage from './pages/EditProductPage';
import FeaturesPage from './pages/Features';
import HelpPage from './pages/Help';
import InventoryUpdatePage from './pages/InventoryUpdatePage';
import LandingPage from './pages/LandingPage';
import LowStockPage from './pages/LowStockPage';
import ProductsPage from './pages/ProductsPage';
import PrivacyPage from './pages/Privacy';
import RefundPage from './pages/Refund';
import SecurityPage from './pages/Security';
import TermsPage from './pages/Terms';
import AuthPage from './pages/AuthPage';
import ConnectPage from './pages/ConnectPage';

function AppLayout() {
  const location = useLocation();
  const [params] = useSearchParams();
  const shop = params.get('shop') || localStorage.getItem('shop');
  const host = params.get('host') || localStorage.getItem('host');
  const apiKey = import.meta.env.VITE_SHOPIFY_API_KEY;
  const navigate = useNavigate();
  const [isAppBridgeReady, setIsAppBridgeReady] = useState(false);

  useEffect(() => {
    if (!shop) {
      navigate('/connect', { replace: true });
      return;
    }
    
    if (shop) localStorage.setItem('shop', shop);
    if (host) localStorage.setItem('host', host);

    if (!host) {
      window.location.href = `/auth?shop=${shop}`;
      return;
    }

    if (host && apiKey) {
      try {
        const app = createApp({
          apiKey,
          host,
          forceRedirect: true,
        });
        setupApiInterceptor(app);
        setIsAppBridgeReady(true);
      } catch (err) {
        console.error("AppBridge Init Error:", err);
      }
    }
  }, [host, shop, apiKey, navigate]);

  if (!isAppBridgeReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 font-sans">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          <p className="mt-6 text-sm font-semibold tracking-wide text-slate-400">
            Establishing Secure Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardNavbar key={`dashboard-${location.pathname}`} />
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-hero-grid opacity-90" />
        <div className="pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <main className="relative z-10 page-shell pt-28">
          <Outlet />
        </main>
      </div>
    </>
  );
}

function LandingLayout() {
  const location = useLocation();
  return (
    <>
      <LandingNavbar key={`landing-${location.pathname}`} />
      <Outlet />
    </>
  );
}

function AppShell() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund" element={<RefundPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/security" element={<SecurityPage />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/products/new" element={<AddProductPage />} />
          <Route path="/products/:id/edit" element={<EditProductPage />} />
          <Route path="/inventory-update" element={<InventoryUpdatePage />} />
          <Route path="/inventory/update" element={<InventoryUpdatePage />} />
          <Route path="/low-stock" element={<LowStockPage />} />
          <Route path="/dashboard/contact" element={<ContactPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/connect" element={<ConnectPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <AppShell />;
}
