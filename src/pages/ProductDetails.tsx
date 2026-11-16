import React, { useEffect } from 'react';
import { ArrowLeft, Home, ChevronRight, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../config/products';
import { getProductImages } from '../config/productImages';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { ProductInformation } from '../components/ProductInformation';
import { RelatedProducts } from '../components/RelatedProducts';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface ProductDetailsProps {
  productId: string;
  onNavigateHome: () => void;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onOpenOrderModal: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
  onOpenPolicy: (policy: any) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  productId,
  onNavigateHome,
  onSelectProduct,
  onBuyNow,
  onOpenOrderModal,
  onOpenPolicy,
}) => {
  // Find product from single source of truth
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];
  const galleryImages = getProductImages(product.id, product.image, product.name);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream-50 text-brand-ink selection:bg-brand-pink-100 selection:text-brand-pink">
      {/* Header with Home and Shop Kits actions */}
      <Header onShopClick={onNavigateHome} />

      <main className="flex-1">
        {/* Breadcrumb Navigation & Back Link */}
        <div className="bg-white border-b border-brand-ink/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
            <nav className="flex items-center space-x-2 text-brand-ink-muted">
              <button
                onClick={onNavigateHome}
                className="hover:text-brand-pink flex items-center gap-1 font-semibold transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
              <button
                onClick={onNavigateHome}
                className="hover:text-brand-pink font-semibold transition-colors cursor-pointer"
              >
                Kits
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
              <span className="text-brand-ink font-bold truncate max-w-[180px] sm:max-w-none">
                {product.name}
              </span>
            </nav>

            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 font-bold text-brand-pink hover:text-brand-pink-hover transition-colors cursor-pointer text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all kits</span>
            </button>
          </div>
        </div>

        {/* Dedicated Two-Column Product Detail Section */}
        <section className="py-8 sm:py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* LEFT COLUMN — Product Image Gallery (5 cols on lg) */}
              <div className="lg:col-span-6 xl:col-span-6 w-full lg:sticky lg:top-24">
                <ProductImageGallery
                  images={galleryImages}
                  productName={product.name}
                />
              </div>

              {/* RIGHT COLUMN — Product Information & Contents (6 cols on lg) */}
              <div className="lg:col-span-6 xl:col-span-6 w-full">
                <ProductInformation
                  product={product}
                  onBuyNow={(prod) => onBuyNow(prod)}
                />
              </div>

            </div>
          </div>
        </section>

        {/* Quality & Trust Badges Strip */}
        <section className="py-8 bg-white border-y border-brand-ink/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-extrabold text-brand-ink">Damage-Free Celebration</h4>
                <p className="text-xs text-brand-ink-light max-w-xs">
                  Wall-safe removable balloon glue dots included in every kit. No paint peeling.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-brand-pink-100 text-brand-pink flex items-center justify-center mb-1">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-extrabold text-brand-ink">Curated Color Harmony</h4>
                <p className="text-xs text-brand-ink-light max-w-xs">
                  Pastel Pop aesthetic tones designed for cheerful, Instagrammable party pictures.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-extrabold text-brand-ink">Direct WhatsApp Support</h4>
                <p className="text-xs text-brand-ink-light max-w-xs">
                  Personal assistance with order tracking, styling advice, and campus pickups.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RELATED PRODUCTS — HORIZONTAL CAROUSEL */}
        <RelatedProducts
          currentProductId={product.id}
          onSelectProduct={onSelectProduct}
          onBuyNow={onBuyNow}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenOrder={onOpenOrderModal}
        onOpenPolicy={onOpenPolicy}
      />
    </div>
  );
};