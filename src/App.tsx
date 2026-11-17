import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { CategoryProducts } from './pages/CategoryProducts';
import { CartProvider, useCart } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { OrderCustomizerModal } from './components/OrderCustomizerModal';
import { WhatsAppFallbackModal } from './components/WhatsAppFallbackModal';
import { AdminTemplatesModal } from './components/AdminTemplatesModal';
import { PolicyModal, PolicyType } from './components/PolicyModal';
import { Product } from './types';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

type RouteState =
  | { type: 'home' }
  | { type: 'product'; id: string }
  | { type: 'category'; slug: string };

const parseHash = (): RouteState => {
  if (typeof window === 'undefined') return { type: 'home' };
  const hash = window.location.hash.replace(/^#\/?/, '');

  if (hash.startsWith('product/')) {
    const id = hash.replace('product/', '').split('?')[0].split('/')[0];
    if (id) return { type: 'product', id };
  }

  if (hash.startsWith('category/')) {
    const slug = hash.replace('category/', '').split('?')[0].split('/')[0];
    if (slug) return { type: 'category', slug };
  }

  return { type: 'home' };
};

const AppRouter: React.FC = () => {
  const { toastMessage, totalCount, setIsCartOpen } = useCart();
  const [route, setRoute] = useState<RouteState>(parseHash);

  // Modals state (accessible across all pages)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [orderModalMode, setOrderModalMode] = useState<'buy-now' | 'cart'>('buy-now');
  const [orderModalProductId, setOrderModalProductId] = useState<
    'mini-celebration-box' | 'signature-celebration-box'
  >('signature-celebration-box');

  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);
  const [isFallbackConfigured, setIsFallbackConfigured] = useState<boolean>(false);
  const [isAdminTemplatesOpen, setIsAdminTemplatesOpen] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);

  // Handle hash changes & browser back/forward
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Founder admin modal shortcut (Alt + Shift + A or ?admin=templates)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'templates') {
        setIsAdminTemplatesOpen(true);
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.altKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
          e.preventDefault();
          setIsAdminTemplatesOpen((prev) => !prev);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  // Navigation handlers
  const navigateToHome = () => {
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (productId: string) => {
    window.location.hash = `/product/${productId}`;
  };

  const navigateToCategory = (slug: string) => {
    window.location.hash = `/category/${slug}`;
  };

  // Purchase Handlers
  const handleBuyNow = (product: Product) => {
    setOrderModalProductId(product.id);
    setOrderModalMode('buy-now');
    setIsOrderModalOpen(true);
  };

  const handleCartCheckout = () => {
    setOrderModalMode('cart');
    setIsOrderModalOpen(true);
  };

  const handleDirectWhatsAppOrder = (
    productId?: 'mini-celebration-box' | 'signature-celebration-box'
  ) => {
    if (productId) {
      setOrderModalProductId(productId);
    }
    setOrderModalMode('buy-now');
    setIsOrderModalOpen(true);
  };

  const handleOpenFallback = (message: string, isConfigured: boolean) => {
    setFallbackMessage(message);
    setIsFallbackConfigured(isConfigured);
  };

  const handleExploreShop = () => {
    if (route.type !== 'home') {
      window.location.hash = '';
      setTimeout(() => {
        const el = document.getElementById('shop');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      const el = document.getElementById('shop');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Toast Notification for Add-to-Cart Confirmation */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brand-ink text-white px-4 py-2.5 rounded-xl shadow-card flex items-center gap-2 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 text-brand-pink font-bold underline hover:text-white cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}

          {/* Route Views */}
          {route.type === 'product' ? (
            <ProductDetails
              productId={route.id}
              onNavigateHome={navigateToHome}
              onSelectProduct={(prod) => navigateToProduct(prod.id)}
              onBuyNow={handleBuyNow}
              onOpenOrderModal={handleDirectWhatsAppOrder}
              onOpenPolicy={(policy) => setActivePolicy(policy)}
            />
          ) : route.type === 'category' ? (
            <CategoryProducts
              categorySlug={route.slug}
              onNavigateHome={navigateToHome}
              onSelectProduct={(prod) => navigateToProduct(prod.id)}
              onBuyNow={handleBuyNow}
              onOpenOrderModal={handleDirectWhatsAppOrder}
              onOpenPolicy={(policy) => setActivePolicy(policy)}
            />
          ) : (
            <Home
              onNavigateToProduct={navigateToProduct}
              onNavigateToCategory={navigateToCategory}
            />
          )}

          {/* Global Modals & Drawers */}
          {/* 1. Shopping Cart Drawer */}
          <CartDrawer
            onCheckout={handleCartCheckout}
            onExplore={handleExploreShop}
          />

          {/* 2. Order Customizer & WhatsApp Checkout Modal */}
          {isOrderModalOpen && (
            <OrderCustomizerModal
              initialProductId={orderModalProductId}
              mode={orderModalMode}
              onClose={() => setIsOrderModalOpen(false)}
              onOpenFallback={handleOpenFallback}
            />
          )}

          {/* 3. WhatsApp Fallback Modal */}
          {fallbackMessage && (
            <WhatsAppFallbackModal
              message={fallbackMessage}
              isConfigured={isFallbackConfigured}
              onClose={() => setFallbackMessage(null)}
            />
          )}

          {/* 4. Founder Message Templates Modal */}
          {isAdminTemplatesOpen && (
            <AdminTemplatesModal onClose={() => setIsAdminTemplatesOpen(false)} />
          )}

          {/* 5. Policies Modal */}
          <PolicyModal
            policyType={activePolicy}
            onClose={() => setActivePolicy(null)}
          />

          {/* Sticky Mobile Cart Floating Pill on all views */}
          {totalCount > 0 && (
            <div className="fixed bottom-5 right-4 z-40 lg:hidden animate-fadeIn pb-[env(safe-area-inset-bottom)]">
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2.5 px-5 py-3.5 min-h-[48px] rounded-full bg-brand-pink text-white font-extrabold text-xs shadow-modal active:scale-95 transition-all cursor-pointer border-2 border-white/40"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Cart ({totalCount})</span>
              </button>
            </div>
          )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CartProvider>
      <AppRouter />
    </CartProvider>
  );
};

export default App;