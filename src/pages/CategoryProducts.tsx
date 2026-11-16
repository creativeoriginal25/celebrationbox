import React, { useEffect } from 'react';
import { ChevronRight, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { OccasionCategory, Product } from '../types';
import { OCCASION_CATEGORIES } from '../config/categories';
import { PRODUCTS } from '../config/products';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AnimatedContent } from '../components/react-bits/AnimatedContent';
import { useCart } from '../context/CartContext';
import { BUSINESS_CONFIG } from '../config/business';

interface CategoryProductsProps {
  categorySlug: string;
  onNavigateHome: () => void;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onOpenOrderModal: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
  onOpenPolicy: (policy: any) => void;
}

// Clean itemized contents according to exact retail specification
const PRODUCT_INCLUSIONS: Record<string, string[]> = {
  'mini-celebration-box': [
    '12 latex balloons (4 Peach, 4 Lilac, 4 Cream)',
    '1 Happy Birthday banner',
    '1 six-piece cake candle pack',
    '1 metre balloon arch strip',
    '10 balloon glue dots',
    '2 metres curling ribbon',
    '1 DIY instruction card',
    '1 branded sticker',
  ],
  'signature-celebration-box': [
    '20 latex balloons',
    '1 Happy Birthday banner',
    '1 six-foot shimmer backdrop curtain',
    '1 18-inch birthday foil balloon',
    '2 metres balloon arch strip',
    '20 balloon glue dots',
    '6 photo booth props',
    '1 manual balloon hand pump',
    '1 six-piece cake candle pack',
    '3 metres curling ribbon',
    '1 DIY instruction card',
    '1 branded sticker',
  ],
};

const PRODUCT_EXCLUSIONS: Record<string, string> = {
  'mini-celebration-box': 'Balloon pump, cake and helium are not included.',
  'signature-celebration-box': 'Cake and helium are not included.',
};

export const CategoryProducts: React.FC<CategoryProductsProps> = ({
  categorySlug,
  onNavigateHome,
  onSelectProduct,
  onBuyNow,
  onOpenOrderModal,
  onOpenPolicy,
}) => {
  const { addToCart } = useCart();

  const category: OccasionCategory =
    OCCASION_CATEGORIES.find((c) => c.slug === categorySlug || c.id === categorySlug) ||
    OCCASION_CATEGORIES[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categorySlug]);

  // Matching products (Mini and Signature boxes)
  const productsToDisplay: Product[] = PRODUCTS.filter((p) => p.active);

  const handleWhatsAppNotify = () => {
    const text = encodeURIComponent(
      `Hi Celebration Box team! 👋 I'm interested in the upcoming *${category.name}* collection. Please notify me when it launches!`
    );
    window.open(`https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream-50 text-brand-ink selection:bg-brand-pink-100 selection:text-brand-pink">
      <Header onShopClick={onNavigateHome} />

      <main className="flex-1 pb-16 sm:pb-24">
        {/* Breadcrumb Navigation: Home / Occasions / Category */}
        <div className="bg-white/80 border-b border-brand-ink/5 backdrop-blur-xs">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <nav className="flex items-center space-x-2 text-xs text-brand-ink-muted">
              <button
                onClick={onNavigateHome}
                className="hover:text-brand-pink font-medium transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
              <button
                onClick={onNavigateHome}
                className="hover:text-brand-pink font-medium transition-colors cursor-pointer"
              >
                Occasions
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
              <span className="text-brand-ink font-bold">{category.name}</span>
            </nav>
          </div>
        </div>

        {/* Compact, Shopping-Focused Collection Header */}
        <section className="pt-8 pb-6 sm:pt-10 sm:pb-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-brand-ink tracking-tight mb-2">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-brand-ink-light">
              Explore our DIY birthday decoration kits.
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {category.isAvailable ? (
            /* Desktop: Two columns, Mobile: One column */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {productsToDisplay.map((product, index) => {
                const inclusions = PRODUCT_INCLUSIONS[product.id] || product.inclusions;
                const exclusions = PRODUCT_EXCLUSIONS[product.id] || product.exclusions?.join('. ');

                return (
                  <AnimatedContent
                    key={product.id}
                    delay={index * 0.1}
                    distance={20}
                    direction="vertical"
                    className="h-full"
                  >
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-ink/10 shadow-xs hover:shadow-card transition-shadow flex flex-col justify-between h-full">
                      
                      {/* Top Content Area */}
                      <div>
                        {/* 1. Large Product Photograph */}
                        <div
                          onClick={() => onSelectProduct(product)}
                          className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-cream-50/70 border border-brand-ink/5 mb-5 cursor-pointer group flex items-center justify-center p-4"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-103 select-none"
                            loading="eager"
                          />
                        </div>

                        {/* 2. Product Name */}
                        <h2
                          onClick={() => onSelectProduct(product)}
                          className="font-display font-extrabold text-xl sm:text-2xl text-brand-ink hover:text-brand-pink transition-colors cursor-pointer mb-2 leading-snug"
                        >
                          {product.name}
                        </h2>

                        {/* 3. Clearly Visible Price */}
                        <div className="flex items-baseline gap-1.5 mb-5">
                          <span className="text-2xl sm:text-3xl font-extrabold text-brand-pink tracking-tight">
                            ₹{product.price}
                          </span>
                          <span className="text-xs font-semibold text-brand-ink-muted">
                            all inclusive
                          </span>
                        </div>

                        {/* 4. Small Heading: "What's Inside the Box?" */}
                        <div className="border-t border-brand-ink/10 pt-4 mb-3">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink-muted flex items-center justify-between">
                            <span>What's Inside the Box?</span>
                            {product.totalPieces && (
                              <span className="text-brand-pink font-extrabold normal-case text-xs">
                                {product.totalPieces} pcs
                              </span>
                            )}
                          </h3>
                        </div>

                        {/* 5. Complete actual list of included items with quantities */}
                        <ul className="space-y-2 mb-5">
                          {inclusions.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-ink-light leading-relaxed">
                              <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Bottom Action Area */}
                      <div>
                        {/* 6. Short honest exclusions note */}
                        {exclusions && (
                          <div className="bg-brand-cream-50/70 border border-brand-ink/5 rounded-xl px-3.5 py-2.5 mb-5 text-xs text-brand-ink-muted leading-relaxed">
                            <span className="font-bold text-brand-ink">Note: </span>
                            <span>{exclusions}</span>
                          </div>
                        )}

                        {/* 7 & 8. Buy Now & Add to Cart Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          {/* Buy Now Button */}
                          <button
                            type="button"
                            onClick={() => onBuyNow(product)}
                            className="w-full py-3.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-xs active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Buy Now</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          {/* Add to Cart Button */}
                          <button
                            type="button"
                            onClick={() => addToCart(product, 1)}
                            className="w-full py-3.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-brand-ink bg-brand-cream-50 hover:bg-brand-cream-100 border border-brand-ink/15 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingBag className="w-4 h-4 text-brand-pink" />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </AnimatedContent>
                );
              })}
            </div>
          ) : (
            /* Coming Soon Placeholder for upcoming categories */
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
                <h2 className="text-2xl font-extrabold text-brand-ink pt-2">
                  {category.name} Collection in Progress
                </h2>
                <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed">
                  We are currently crafting and styling dedicated decoration kits for {category.name}.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleWhatsAppNotify}
                  className="py-3 px-6 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Notify Me on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="py-3 px-6 rounded-xl text-xs sm:text-sm font-bold text-brand-ink bg-white hover:bg-brand-cream-50 border border-brand-ink/20 transition-all cursor-pointer"
                >
                  <span>Explore Birthday Kits</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer
        onOpenOrder={onOpenOrderModal}
        onOpenPolicy={onOpenPolicy}
      />
    </div>
  );
};
