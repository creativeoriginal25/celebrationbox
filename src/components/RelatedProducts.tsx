import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Check, Zap, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../config/products';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';

interface RelatedProductsProps {
  currentProductId: string;
  onSelectProduct: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  onSelectProduct,
  onBuyNow,
}) => {
  const { addToCart } = useCart();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter out the current product so it never recommends itself
  const relatedList = PRODUCTS.filter((p) => p.id !== currentProductId && p.active);

  if (relatedList.length === 0) return null;

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 border-t border-brand-ink/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-brand-pink" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
                Complementary DIY Kits
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-ink">
              You May Also Like
            </h2>
          </div>

          {/* Navigation Arrows for Carousel */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="p-2.5 rounded-xl border border-brand-ink/10 bg-white hover:bg-brand-cream-100 text-brand-ink hover:text-brand-pink transition-colors shadow-xs active:scale-95 cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2.5 rounded-xl border border-brand-ink/10 bg-white hover:bg-brand-cream-100 text-brand-ink hover:text-brand-pink transition-colors shadow-xs active:scale-95 cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Cards Scrollable Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
        >
          {relatedList.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-[290px] sm:w-[340px] snap-start surface-card rounded-2xl p-5 border border-brand-ink/10 hover:border-brand-pink/40 shadow-xs hover:shadow-card transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Product Thumbnail Stage */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="relative rounded-xl bg-gradient-to-b from-white to-brand-cream-100 p-3 mb-4 aspect-[4/3] flex items-center justify-center overflow-hidden border border-brand-ink/5 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-103"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-brand-ink border border-brand-ink/10">
                      {product.badge || 'DIY Kit'}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-brand-ink/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Quick View
                    </span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <div className="space-y-1 mb-3">
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="text-lg font-bold text-brand-ink hover:text-brand-pink transition-colors cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs font-semibold text-brand-teal line-clamp-1">
                    {product.tagline}
                  </p>
                </div>

                {/* Key Inclusions preview */}
                <ul className="space-y-1 mb-4 text-[11px] text-brand-ink-light">
                  {product.inclusions.slice(0, 2).map((inc, i) => (
                    <li key={i} className="flex items-center gap-1.5 truncate">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price & Actions */}
              <div className="pt-3 border-t border-brand-ink/10 space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-black text-brand-pink">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-[11px] text-brand-ink-muted">
                    {product.totalPieces ? `${product.totalPieces} Pieces` : 'All-in-one'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-brand-ink bg-white hover:bg-brand-cream-50 border border-brand-ink/20 hover:border-brand-pink/50 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Kit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => (onBuyNow ? onBuyNow(product) : addToCart(product, 1))}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-brand-pink hover:bg-brand-pink-hover transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};