import React from 'react';
import { Check, Info, Sparkles, Clock, ShoppingBag } from 'lucide-react';
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
  const setupTime = isSignature ? '30–40 mins DIY' : '15–20 mins DIY';

  return (
    <div
      className={`surface-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between surface-card-hover transition-all ${
        isSignature ? 'border-2 border-brand-pink/40 shadow-card' : 'border border-brand-ink/10'
      }`}
    >
      <div>
        {/* Top Header Badge & Price Row */}
        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
              isSignature ? 'badge-pink' : 'badge-yellow'
            }`}
          >
            {product.badge}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-brand-ink-muted">
            <Clock className="w-3.5 h-3.5 text-brand-ink-subtle" />
            <span>{setupTime}</span>
          </div>
        </div>

        {/* Product Image Box */}
        <div className="relative rounded-xl bg-brand-cream-100 p-4 mb-5 aspect-[4/3] flex items-center justify-center overflow-hidden border border-brand-ink/5">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />
          <div className="absolute bottom-2.5 left-3">
            <span className="bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-brand-ink border border-brand-ink/10 shadow-xs">
              Theme: Pastel Pop
            </span>
          </div>
        </div>

        {/* Title, Price, Subtitle */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xl sm:text-2xl font-bold text-brand-ink">{product.name}</h3>
            <span className="text-2xl sm:text-3xl font-black text-brand-pink">
              {formatPrice(product.price)}
            </span>
          </div>
          <p className="text-xs font-semibold text-brand-teal mt-0.5">{product.tagline}</p>
          <p className="text-xs sm:text-sm text-brand-ink-light mt-2 leading-relaxed">{product.description}</p>
        </div>

        {/* Contents Summary */}
        <div className="space-y-2 mb-5 pt-3 border-t border-brand-ink/10">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink-muted">
              What's Inside ({product.inclusions.length} items):
            </h4>
            <span className="text-[11px] font-medium text-brand-teal">
              {isSignature ? 'Includes Manual Pump' : 'Compact Setup'}
            </span>
          </div>

          <ul className="space-y-1.5">
            {product.inclusions.slice(0, 4).map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-brand-ink font-medium leading-tight">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {product.inclusions.length > 4 && (
            <p className="text-[11px] text-brand-ink-muted pl-5">
              + {product.inclusions.length - 4} more items (see full details below)
            </p>
          )}
        </div>

        {/* Exclusions Notice */}
        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/60 mb-6 text-left">
          <div className="flex items-center gap-1.5 text-amber-900 text-[11px] font-bold mb-0.5">
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
          className="w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold text-brand-ink bg-white hover:bg-brand-cream-50 border border-brand-ink/20 transition-all text-center cursor-pointer"
        >
          View Full List
        </button>

        <button
          onClick={() => onOrderNow(product)}
          className="w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order Now</span>
        </button>
      </div>
    </div>
  );
};
