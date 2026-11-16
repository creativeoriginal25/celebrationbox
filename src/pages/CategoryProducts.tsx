import React, { useEffect } from 'react';
import { ArrowLeft, Home, ChevronRight, Sparkles, MessageCircle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { OccasionCategory, Product } from '../types';
import { OCCASION_CATEGORIES } from '../config/categories';
import { PRODUCTS } from '../config/products';
import { ProductCard } from '../components/ProductCard';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BUSINESS_CONFIG } from '../config/business';

interface CategoryProductsProps {
  categorySlug: string;
  onNavigateHome: () => void;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onOpenOrderModal: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
  onOpenPolicy: (policy: any) => void;
}

export const CategoryProducts: React.FC<CategoryProductsProps> = ({
  categorySlug,
  onNavigateHome,
  onSelectProduct,
  onBuyNow,
  onOpenOrderModal,
  onOpenPolicy,
}) => {
  const category: OccasionCategory =
    OCCASION_CATEGORIES.find((c) => c.slug === categorySlug || c.id === categorySlug) ||
    OCCASION_CATEGORIES[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug]);

  // Matching products
  const matchingProducts: Product[] = category.relatedProductIds
    ? PRODUCTS.filter((p) => category.relatedProductIds?.includes(p.id))
    : PRODUCTS;

  const handleWhatsAppNotify = () => {
    const text = encodeURIComponent(
      `Hi Celebration Box team! 👋 I would love updates on the upcoming *${category.name}* collection.`
    );
    window.open(`https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream-50 text-brand-ink selection:bg-brand-pink-100 selection:text-brand-pink">
      <Header onShopClick={onNavigateHome} />

      <main className="flex-1">
        {/* Breadcrumb Navigation */}
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
                Celebrations
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
              <span className="text-brand-ink font-bold">{category.name}</span>
            </nav>

            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 font-bold text-brand-pink hover:text-brand-pink-hover transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all celebrations</span>
            </button>
          </div>
        </div>

        {/* Category Hero Banner */}
        <section className="py-10 sm:py-14 bg-gradient-to-b from-white to-brand-cream-100 border-b border-brand-ink/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 max-w-4xl mx-auto text-center md:text-left">
              {/* Circular Emblem Artwork */}
              <div
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-3 shrink-0 flex items-center justify-center shadow-card border-2 border-white"
                style={{ backgroundColor: category.bgColor }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Text Info */}
              <div className="space-y-2 flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase badge-pink">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{category.badge || (category.isAvailable ? 'Available Now' : 'Coming Soon')}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink">
                  {category.name} Celebrations
                </h1>
                <p className="text-sm sm:text-base font-semibold text-brand-teal">
                  {category.tagline}
                </p>
                <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed max-w-2xl">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Availability Guidance Banner */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-8">
          <div className="p-4 rounded-2xl bg-white border border-brand-ink/10 shadow-xs flex items-start gap-3 text-xs sm:text-sm">
            <Info className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
            <div className="leading-relaxed text-brand-ink">
              <strong className="text-brand-ink font-bold">Catalog Note: </strong>
              {category.availableNotice ||
                'Celebration Box offers universal DIY birthday decoration kits designed with cohesive pastel color harmonies.'}
            </div>
          </div>
        </div>

        {/* Content Section: Active vs Coming Soon */}
        <section className="py-8 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {category.isAvailable ? (
              <div>
                <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-brand-ink">
                    Available Kits for {category.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-brand-ink-muted">
                    Choose from our ready-to-ship DIY celebration kits below:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {matchingProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={(prod) => onSelectProduct(prod)}
                      onBuyNow={onBuyNow}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Coming Soon Placeholder Box with WhatsApp Notify CTA */
              <div className="max-w-xl mx-auto text-center surface-card p-8 sm:p-12 rounded-3xl border border-brand-ink/10 shadow-sm space-y-5">
                <div
                  className="w-20 h-20 rounded-full mx-auto p-2 flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: category.bgColor }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                    Launching Soon
                  </span>
                  <h3 className="text-2xl font-extrabold text-brand-ink pt-2">
                    {category.name} Collection in Progress
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed">
                    We are currently crafting and styling dedicated decoration kits for {category.name}. To ensure highest quality and aesthetic perfection, this collection is not yet purchasable.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={handleWhatsAppNotify}
                    className="py-3 px-6 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Notify Me on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={onNavigateHome}
                    className="py-3 px-6 rounded-xl text-xs sm:text-sm font-bold text-brand-ink bg-white hover:bg-brand-cream-50 border border-brand-ink/20 transition-all cursor-pointer"
                  >
                    <span>Explore Available Birthday Kits</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer
        onOpenOrder={onOpenOrderModal}
        onOpenPolicy={onOpenPolicy}
      />
    </div>
  );
};