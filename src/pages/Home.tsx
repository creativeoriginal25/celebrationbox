import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';
import { ProductComparison } from '../components/ProductComparison';
import { HowItWorks } from '../components/HowItWorks';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { FAQ } from '../components/FAQ';
import { AboutUs } from '../components/AboutUs';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { OrderCustomizerModal } from '../components/OrderCustomizerModal';
import { WhatsAppFallbackModal } from '../components/WhatsAppFallbackModal';
import { AdminTemplatesModal } from '../components/AdminTemplatesModal';
import { PolicyModal, PolicyType } from '../components/PolicyModal';
import { ScrollReveal } from '../components/react-bits/ScrollReveal';
import { OccasionCategoryGrid } from '../components/OccasionCategoryGrid';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppLink, triggerWhatsAppChat } from '../services/whatsappService';
import { Product, OccasionCategory } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';

export interface HomeProps {
  onNavigateToProduct?: (productId: string) => void;
  onNavigateToCategory?: (categorySlug: string) => void;
}

export const HomeContent: React.FC<HomeProps> = ({
  onNavigateToProduct,
  onNavigateToCategory,
}) => {
  const { toastMessage, totalCount, setIsCartOpen } = useCart();

  // Modals & Drawers state
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [orderModalMode, setOrderModalMode] = useState<'buy-now' | 'cart'>('buy-now');
  const [orderModalProductId, setOrderModalProductId] = useState<
    'mini-celebration-box' | 'signature-celebration-box'
  >('signature-celebration-box');

  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);
  const [isFallbackConfigured, setIsFallbackConfigured] = useState<boolean>(false);
  const [isAdminTemplatesOpen, setIsAdminTemplatesOpen] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);

  // Founder access via URL param `?admin=templates` or keyboard shortcut `Alt + Shift + A`
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

  const handleViewDetails = (product: Product) => {
    if (onNavigateToProduct) {
      onNavigateToProduct(product.id);
    } else {
      window.location.hash = `/product/${product.id}`;
    }
  };

  const handleSelectCategory = (category: OccasionCategory) => {
    if (onNavigateToCategory) {
      onNavigateToCategory(category.slug);
    } else {
      window.location.hash = `/category/${category.slug}`;
    }
  };

  const scrollToShop = () => {
    const el = document.getElementById('shop');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream-50 text-brand-ink selection:bg-brand-pink-100 selection:text-brand-pink relative">
      {/* Toast Confirmation for Cart additions */}
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

      {/* Header */}
      <Header onShopClick={scrollToShop} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Centered Hero Section with X Buddy visual hierarchy */}
        <Hero
          onExplore={scrollToShop}
          onOpenOrder={handleDirectWhatsAppOrder}
        />

        {/* Visual Celebration Categories Discovery Grid */}
        <OccasionCategoryGrid onSelectCategory={handleSelectCategory} />

        {/* Shop Kits Section */}
        <section id="shop" className="py-16 md:py-24 relative scroll-mt-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Catalogue Header with ScrollReveal */}
            <ScrollReveal yOffset={20}>
              <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink">
                  Shop Celebration Boxes
                </h2>
                <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
                  Everything you need to style a birthday setup, packed into one box. Choose your kit below and purchase with <strong>Buy Now</strong> or <strong>Add to Cart</strong>.
                </p>
              </div>
            </ScrollReveal>

            {/* Product Cards Grid: Active Products */}
            <div className={`grid grid-cols-1 ${PRODUCTS.filter((p) => p.active !== false).length > 1 ? 'md:grid-cols-2 max-w-5xl' : 'max-w-xl'} gap-8 mx-auto`}>
              {PRODUCTS.filter((p) => p.active !== false).map((product, idx) => (
                <ScrollReveal key={product.id} delay={idx * 0.1} yOffset={24}>
                  <ProductCard
                    product={product}
                    onViewDetails={handleViewDetails}
                    onBuyNow={handleBuyNow}
                  />
                </ScrollReveal>
              ))}
            </div>

            {/* Bottom Inclusions Note */}
            {PRODUCTS.filter((p) => p.active !== false).length > 1 && (
              <div className="mt-12 text-center">
                <p className="text-xs text-brand-ink-muted">
                  Need to compare full kit items side-by-side? See the complete comparison table below.
                </p>
              </div>
            )}

          </div>
        </section>

        {/* Product Comparison Section with ScrollReveal */}
        {PRODUCTS.filter((p) => p.active !== false).length > 1 && (
          <ScrollReveal yOffset={24}>
            <ProductComparison onOrderNow={handleDirectWhatsAppOrder} />
          </ScrollReveal>
        )}

        {/* How It Works Section with ScrollReveal */}
        <ScrollReveal yOffset={24}>
          <HowItWorks />
        </ScrollReveal>

        {/* Why Celebration Box Section with ScrollReveal */}
        <ScrollReveal yOffset={24}>
          <WhyChooseUs />
        </ScrollReveal>

        {/* FAQ Section with ScrollReveal */}
        <ScrollReveal yOffset={24}>
          <FAQ />
        </ScrollReveal>

        {/* About Us Section */}
        <ScrollReveal yOffset={24}>
          <AboutUs />
        </ScrollReveal>
      </main>

      {/* Footer */}
      <Footer
        onOpenOrder={handleDirectWhatsAppOrder}
        onOpenPolicy={(policy) => setActivePolicy(policy)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        onCheckout={handleCartCheckout}
        onExplore={scrollToShop}
      />

      {/* Modals */}
      {/* 1. Full Product View Details Modal */}
      <ProductModal
        product={selectedProductDetails}
        onClose={() => setSelectedProductDetails(null)}
        onBuyNow={handleBuyNow}
      />

      {/* 2. Order Customizer & Checkout Modal (Handles both Buy Now and Cart Checkout) */}
      {isOrderModalOpen && (
        <OrderCustomizerModal
          initialProductId={orderModalProductId}
          mode={orderModalMode}
          onClose={() => setIsOrderModalOpen(false)}
          onOpenFallback={handleOpenFallback}
        />
      )}

      {/* 3. WhatsApp Message Fallback Modal */}
      {fallbackMessage && (
        <WhatsAppFallbackModal
          message={fallbackMessage}
          isConfigured={isFallbackConfigured}
          onClose={() => setFallbackMessage(null)}
        />
      )}

      {/* 4. Internal Founder Response Templates Modal (accessible via Alt+Shift+A or ?admin=templates) */}
      {isAdminTemplatesOpen && (
        <AdminTemplatesModal onClose={() => setIsAdminTemplatesOpen(false)} />
      )}

      {/* 5. Legal Policies Modal */}
      <PolicyModal
        policyType={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </div>
  );
};

export const Home: React.FC<HomeProps> = (props) => {
  return <HomeContent {...props} />;
};
