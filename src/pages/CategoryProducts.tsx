import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { OccasionCategory, Product } from '../types';
import { OCCASION_CATEGORIES } from '../config/categories';
import { PRODUCTS } from '../config/products';
import { getProductsForCategory } from '../services/catalogService';
import { AnimatedContent } from '../components/react-bits/AnimatedContent';
import { useCart } from '../context/CartContext';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppLink, triggerWhatsAppChat } from '../services/whatsappService';
import { formatPrice } from '../utils/currency';

interface CategoryProductsProps {
  categorySlug?: string;
}

export const CategoryProducts: React.FC<CategoryProductsProps> = ({
  categorySlug: propSlug,
}) => {
  const params = useParams<{ categorySlug: string }>();
  const { addToCart } = useCart();

  const activeSlug = propSlug || params.categorySlug || 'kids-birthday';

  const category: OccasionCategory =
    OCCASION_CATEGORIES.find((c) => c.slug === activeSlug || c.id === activeSlug) ||
    OCCASION_CATEGORIES[0];

  const [productsToDisplay, setProductsToDisplay] = useState<Product[]>(() =>
    PRODUCTS.filter((p) => p.active)
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let isMounted = true;
    const fetchCategoryProducts = async () => {
      try {
        const fetched = await getProductsForCategory(activeSlug);
        if (isMounted && fetched && fetched.length > 0) {
          setProductsToDisplay(fetched);
        }
      } catch (err) {
        console.warn('Failed to load category products dynamically:', err);
      }
    };
    fetchCategoryProducts();
    return () => {
      isMounted = false;
    };
  }, [activeSlug]);

  const handleWhatsAppNotify = () => {
    const text = `Hi Celebration Box team! 👋 I'm interested in the upcoming *${category.name}* collection. Please notify me when it launches!`;
    const url = buildWhatsAppLink(BUSINESS_CONFIG.whatsappNumber, text);
    triggerWhatsAppChat(url);
  };

  return (
    <div className="min-h-screen bg-brand-cream-50 text-brand-ink pb-16 sm:pb-24">
      {/* Breadcrumb Navigation: Home / Occasions / Category */}
      <div className="bg-white/80 border-b border-brand-ink/5 backdrop-blur-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs text-brand-ink-muted">
            <Link to="/" className="hover:text-brand-pink font-medium transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
            <Link to="/celebration-boxes" className="hover:text-brand-pink font-medium transition-colors">
              Occasions
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
            <span className="text-brand-ink font-bold">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Hero Banner */}
      <section className="bg-white border-b border-brand-ink/5 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-brand-pink-50 to-brand-cream-100 flex items-center justify-center p-3 border border-brand-ink/10 shadow-xs shrink-0">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold badge-pink">
                <span>{category.isAvailable ? 'Available Collection' : 'Upcoming Launch'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink">
                {category.name}
              </h1>
              <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product List */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        {category.isAvailable ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-brand-ink/10">
              <h2 className="text-base sm:text-lg font-bold text-brand-ink">
                Available Celebration Kits ({productsToDisplay.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productsToDisplay.map((product, idx) => (
                <AnimatedContent key={product.id} delay={idx * 0.1}>
                  <div className="rounded-2xl bg-white border border-brand-ink/10 shadow-xs p-5 flex flex-col justify-between space-y-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover border border-brand-ink/10 shrink-0"
                      />
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-base font-extrabold text-brand-ink truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-brand-ink-light line-clamp-2">
                          {product.description}
                        </p>
                        <span className="text-base font-black text-brand-pink block">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-brand-ink/5">
                      <Link
                        to="/celebration-boxes/pastel-rose"
                        className="flex-1 py-2.5 px-4 rounded-xl text-center text-xs font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-card transition-all"
                      >
                        View Details
                      </Link>
                      <button
                        type="button"
                        onClick={() => addToCart(product, 1)}
                        className="py-2.5 px-4 rounded-xl text-xs font-bold text-brand-ink bg-white hover:bg-brand-cream-50 border border-brand-ink/15 transition-all"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 px-6 rounded-3xl bg-white border border-brand-ink/10 shadow-xs max-w-lg mx-auto space-y-4">
            <h3 className="text-xl font-bold text-brand-ink">
              {category.name} Collection in Progress
            </h3>
            <p className="text-xs sm:text-sm text-brand-ink-light">
              We are currently crafting dedicated decoration kits for {category.name}. Tap below to be notified upon launch!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleWhatsAppNotify}
                className="w-full sm:w-auto py-3 px-6 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
              >
                Notify Me on WhatsApp
              </button>
              <Link
                to="/celebration-boxes"
                className="w-full sm:w-auto py-3 px-6 rounded-xl text-xs font-bold text-brand-ink bg-white border border-brand-ink/20"
              >
                Explore Celebration Boxes
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
