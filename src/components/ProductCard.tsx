import React from 'react';
import { Check, Info, Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onOrderNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onOrderNow,
}) => {
  const isSignature = product.id === 'signature-celebration-box';

  return (
    <div
      className={`relative glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-glass-hover ${
        isSignature
          ? 'ring-2 ring-brand-pink/50 shadow-glass-hover bg-gradient-to-b from-white/95 to-brand-pink-50/30'
          : 'hover:border-brand-pink/30'
      }`}
    >
      {/* Top Badge */}
      {product.badge && (
        <div className="absolute -top-3.5 left-7">
          <span
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${
              isSignature ? 'bg-brand-pink text-white' : 'glass-badge-yellow'
            }`}
          >
            {isSignature && <Sparkles className="w-3.5 h-3.5" />}
            {product.badge}
          </span>
        </div>
      )}

      <div>
        {/* Product Image Stage */}
        <div className="relative rounded-2xl bg-gradient-to-b from-brand-cream/80 to-white/90 p-4 mb-6 aspect-[4/3] flex items-center justify-center overflow-hidden group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute bottom-2.5 left-3">
            <span className="glass-pill px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-brand-ink">
              Theme: Pastel Pop
            </span>
          </div>
        </div>

        {/* Header Info */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-brand-ink">{product.name}</h3>
            <span className="text-2xl sm:text-3xl font-black text-brand-pink">
              {formatPrice(product.price)}
            </span>
          </div>
          <p className="text-xs font-semibold text-brand-teal mt-0.5">{product.tagline}</p>
          <p className="text-sm text-brand-ink-light mt-2.5 leading-relaxed">{product.description}</p>
        </div>

        {/* Inclusions Section */}
        <div className="space-y-2.5 mb-6 pt-3 border-t border-brand-ink/10">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink-muted">
              What's Inside ({product.inclusions.length} items):
            </h4>
            <span className="text-[11px] font-medium text-brand-pink">100% In-Box</span>
          </div>

          <ul className="space-y-2">
            {product.inclusions.slice(0, 5).map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-brand-ink font-medium leading-tight">
                <div className="w-4 h-4 rounded-full bg-brand-teal/15 text-brand-teal flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {product.inclusions.length > 5 && (
            <p className="text-xs text-brand-ink-muted pl-6 italic">
              + {product.inclusions.length - 5} more party essentials...
            </p>
          )}
        </div>

        {/* Exclusions Notice */}
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/50 mb-6 text-left">
          <div className="flex items-center gap-1.5 text-amber-900 text-xs font-semibold mb-1">
            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Honest Note:</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-snug">
            {product.exclusions[0]}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => onViewDetails(product)}
          className="w-full py-3 px-3 rounded-xl text-xs sm:text-sm font-bold text-brand-ink glass-panel hover:bg-white border border-brand-ink/15 hover:border-brand-ink/30 transition-all text-center"
        >
          View Full List
        </button>

        <button
          onClick={() => onOrderNow(product)}
          className="w-full py-3 px-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-md shadow-brand-pink/20 hover:shadow-lg hover:shadow-brand-pink/30 active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Order Now</span>
        </button>
      </div>
    </div>
  );
};

