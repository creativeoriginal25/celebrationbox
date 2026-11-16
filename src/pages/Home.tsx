import React, { useState } from 'react';
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
import { OrderCustomizerModal } from '../components/OrderCustomizerModal';
import { WhatsAppFallbackModal } from '../components/WhatsAppFallbackModal';
import { AdminTemplatesModal } from '../components/AdminTemplatesModal';
import { PolicyModal, PolicyType } from '../components/PolicyModal';
import { PRODUCTS } from '../config/products';
import { Product } from '../types';
import { Sparkles, MessageCircle } from 'lucide-react';

export const Home: React.FC = () => {
  // Modal states
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [orderModalProductId, setOrderModalProductId] = useState<
    'mini-celebration-box' | 'signature-celebration-box'
  >('signature-celebration-box');

  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);
  const [isFallbackConfigured, setIsFallbackConfigured] = useState<boolean>(false);
  const [isAdminTemplatesOpen, setIsAdminTemplatesOpen] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);

  const handleOpenOrder = (productId?: 'mini-celebration-box' | 'signature-celebration-box') => {
    if (productId) {
      setOrderModalProductId(productId);
    }
    setIsOrderModalOpen(true);
  };

  const handleOpenFallback = (message: string, isConfigured: boolean) => {
    setFallbackMessage(message);
    setIsFallbackConfigured(isConfigured);
  };

  const scrollToShop = () => {
    const el = document.getElementById('shop');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream-50 text-brand-ink selection:bg-brand-pink-100 selection:text-brand-pink">
      {/* Header */}
      <Header
        onOpenOrder={handleOpenOrder}
        onOpenAdminTemplates={() => setIsAdminTemplatesOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onExplore={scrollToShop} onOpenOrder={handleOpenOrder} />

        {/* Product Catalogue Section */}
        <section id="shop" className="py-16 md:py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Catalogue Header */}
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge-pink text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated DIY Kits</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-ink">
                Choose Your Celebration Box
              </h2>
              <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
                Initially offering two curated options in our signature{' '}
                <span className="font-bold text-brand-ink">Pastel Pop</span> theme (peach, lilac & cream).
                Packed with 100% of the decor accessories you need.
              </p>
            </div>

            {/* Product Cards Grid: Exactly Two Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={(prod) => setSelectedProductDetails(prod)}
                  onOrderNow={(prod) => handleOpenOrder(prod.id)}
                />
              ))}
            </div>

            {/* Bottom Quick Callout */}
            <div className="mt-12 text-center">
              <p className="text-xs text-brand-ink-muted">
                Need help deciding? Compare full item specifications below or ask us directly on WhatsApp.
              </p>
            </div>

          </div>
        </section>

        {/* Product Comparison Section */}
        <ProductComparison onOrderNow={handleOpenOrder} />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Why Celebration Box Section */}
        <WhyChooseUs />

        {/* FAQ Section */}
        <FAQ />

        {/* About Us Section */}
        <AboutUs />
      </main>

      {/* Footer */}
      <Footer
        onOpenOrder={handleOpenOrder}
        onOpenPolicy={(policy) => setActivePolicy(policy)}
        onOpenAdminTemplates={() => setIsAdminTemplatesOpen(true)}
      />

      {/* Modals */}
      {/* 1. Full Product View Details Modal */}
      <ProductModal
        product={selectedProductDetails}
        onClose={() => setSelectedProductDetails(null)}
        onOrderNow={(prod) => handleOpenOrder(prod.id)}
      />

      {/* 2. Order Customizer & Checkout Modal */}
      {isOrderModalOpen && (
        <OrderCustomizerModal
          initialProductId={orderModalProductId}
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

      {/* 4. Business Owner WhatsApp Response Templates Modal */}
      {isAdminTemplatesOpen && (
        <AdminTemplatesModal onClose={() => setIsAdminTemplatesOpen(false)} />
      )}

      {/* 5. Legal Policies Modal */}
      <PolicyModal
        policyType={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

      {/* Floating Sticky Mobile WhatsApp CTA */}
      <div className="fixed bottom-4 right-4 z-30 sm:hidden">
        <button
          onClick={() => handleOpenOrder()}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-brand-pink text-white font-bold text-xs shadow-float active:scale-95 transition-all"
          aria-label="Order on WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Order Box</span>
        </button>
      </div>
    </div>
  );
};

