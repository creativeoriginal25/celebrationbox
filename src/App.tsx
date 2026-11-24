import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CelebrationBoxes } from './pages/CelebrationBoxes';
import { ProductDetails } from './pages/ProductDetails';
import { CakesCatalogue } from './pages/CakesCatalogue';
import { CakeCustomizationPage } from './pages/CakeCustomizationPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CategoryProducts } from './pages/CategoryProducts';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { BrandSplashScreen, SPLASH_STORAGE_KEY } from './components/splash/BrandSplashScreen';
import { SplashToHomeTransition } from './components/splash/SplashToHomeTransition';

// Admin Container: handles auth check & redirects to /admin/login if unauthenticated
const AdminRouteView: React.FC = () => {
  const { user, isLoading } = useAdminAuth();
  const location = useLocation();
  const subroute = location.pathname.replace(/^\/admin\/?/, '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-xs font-bold text-slate-500 space-y-2">
        <div className="w-8 h-8 rounded-full border-2 border-brand-pink border-t-transparent animate-spin" />
        <span>Authenticating admin session...</span>
      </div>
    );
  }

  if (!user || subroute === 'login') {
    return (
      <AdminLogin
        onSuccess={() => {
          window.location.href = '/admin';
        }}
        onNavigateHome={() => {
          window.location.href = '/';
        }}
      />
    );
  }

  return (
    <AdminLayout
      onNavigateHome={() => {
        window.location.href = '/';
      }}
      initialTab={subroute && subroute !== 'login' ? subroute : 'overview'}
    />
  );
};

export const AppContent: React.FC = () => {
  const location = useLocation();

  // Smart branded splash screen state: show once per tab session on initial homepage visit
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (location.pathname !== '/') return false;
    try {
      return !sessionStorage.getItem(SPLASH_STORAGE_KEY);
    } catch {
      return false;
    }
  });

  // Admin route robots tag
  useEffect(() => {
    const existingMeta = document.querySelector('meta[data-admin-robots]');
    if (location.pathname.startsWith('/admin')) {
      if (!existingMeta) {
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        meta.setAttribute('data-admin-robots', 'true');
        document.head.appendChild(meta);
      }
    } else if (existingMeta) {
      existingMeta.remove();
    }
  }, [location.pathname]);

  return (
    <>
      <Routes>
        {/* 1. Home Page */}
        <Route
          path="/"
          element={
            <SplashToHomeTransition isSplashActive={showSplash}>
              <Layout>
                <Home />
              </Layout>
            </SplashToHomeTransition>
          }
        />

        {/* 2. Celebration Boxes Catalogue */}
        <Route
          path="/celebration-boxes"
          element={
            <Layout>
              <CelebrationBoxes />
            </Layout>
          }
        />

        {/* 3. Pastel Rose Product Page */}
        <Route
          path="/celebration-boxes/pastel-rose"
          element={
            <Layout>
              <ProductDetails />
            </Layout>
          }
        />

        {/* Dynamic Product Page alias for compatibility */}
        <Route
          path="/celebration-boxes/:slug"
          element={
            <Layout>
              <ProductDetails />
            </Layout>
          }
        />

        {/* 4. Cakes & Combos Catalogue */}
        <Route
          path="/cakes"
          element={
            <Layout>
              <CakesCatalogue />
            </Layout>
          }
        />

        {/* 5. Cake Customization Page */}
        <Route
          path="/cakes/customize/:cakeId"
          element={
            <Layout>
              <CakeCustomizationPage />
            </Layout>
          }
        />

        {/* 6. Shopping Cart Page */}
        <Route
          path="/cart"
          element={
            <Layout>
              <CartPage />
            </Layout>
          }
        />

        {/* 7. Checkout Page */}
        <Route
          path="/checkout"
          element={
            <Layout>
              <CheckoutPage />
            </Layout>
          }
        />

        {/* 8. Order Confirmation Page */}
        <Route
          path="/order-confirmation"
          element={
            <Layout>
              <OrderConfirmationPage />
            </Layout>
          }
        />

        {/* 9. About Us Page */}
        <Route
          path="/about"
          element={
            <Layout>
              <AboutPage />
            </Layout>
          }
        />

        {/* 10. Contact Us Page */}
        <Route
          path="/contact"
          element={
            <Layout>
              <ContactPage />
            </Layout>
          }
        />

        {/* Category Products */}
        <Route
          path="/category/:categorySlug"
          element={
            <Layout>
              <CategoryProducts />
            </Layout>
          }
        />

        {/* Admin Panel Routes */}
        <Route path="/admin/*" element={<AdminRouteView />} />

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Branded Splash Screen */}
      {showSplash && (
        <BrandSplashScreen onComplete={() => setShowSplash(false)} />
      )}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
};

export default App;
