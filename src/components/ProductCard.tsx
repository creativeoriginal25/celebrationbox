import React from 'react';
import { Check, Info, Clock, ShoppingCart, Zap } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onBuyNow,
}) => {
  const { addToCart } = useCart();
  const isSignature = product.id === 'signature-celebration-box';
  const setupTime = isSignature ? '30–40 mins DIY' : '15–20 mins DIY';

  return (
    <div
      className={`surface-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between surface-card-hover transition-all ${
        isSignature ? 'border-2 border-brand-pink/30 shadow-card' : 'border border-brand-ink/10'
      }`}
    >
      <div>
        {/* Product Image Stage */}
        <div
          onClick={() => onViewDetails(product)}
          className="relative rounded-xl bg-brand-cream-100 p-4 mb-5 aspect-[4/3] flex items-center justify-center overflow-hidden border border-brand-ink/5 cursor-pointer group"
          title="Click to view full contents"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-102"
            loading="lazy"
          />
          <div className="absolute bottom-2.5 left-3">
            <span className="bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-brand-ink border border-brand-ink/10 shadow-xs">
              Theme: Pastel Pop
            </span>
          </div>
          <div className="absolute top-2.5 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-brand-ink/80 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xs">
              View Details
            </span>
          </div>
        </div>

        {/* Title & Price Header */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3
              onClick={() => onViewDetails(product)}
              className="text-xl sm:text-2xl font-bold text-brand-ink hover:text-brand-pink transition-colors cursor-pointer"
            >
              {product.name}
            </h3>
            <span className="text-2xl sm:text-3xl font-black text-brand-pink">
              {formatPrice(product.price)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs font-semibold text-brand-teal">{product.tagline}</p>
            <div className="flex items-center gap-1 text-[11px] text-brand-ink-muted">
              <Clock className="w-3 h-3 text-brand-marigold" />
              <span>{setupTime}</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-brand-ink-light mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Included Items Summary */}
        <div className="space-y-2 mb-5 pt-3 border-t border-brand-ink/10">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink-muted">
              Included In Box ({product.inclusions.length} items):
            </h4>
            <button
              type="button"
              onClick={() => onViewDetails(product)}
              className="text-[11px] font-semibold text-brand-pink hover:underline cursor-pointer"
            >
              View All Inclusions →
            </button>
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
        </div>

        {/* Honest Exclusions Notice */}
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

      {/* TWO PRIMARY SHOPPING BUTTONS: Buy Now & Add to Cart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-brand-ink/10">
        {/* 1. Buy Now (Primary rani-pink button, direct purchase) */}
        <button
          onClick={() => onBuyNow(product)}
          className="w-full py-3.5 px-4 min-h-[46px] rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Buy Now</span>
        </button>

        {/* 2. Add to Cart (White/warm off-white background, dark ink text, subtle dark/pink border) */}
        <button
          onClick={() => addToCart(product, 1)}
          className="w-full py-3.5 px-4 min-h-[46px] rounded-xl text-xs sm:text-sm font-bold text-brand-ink bg-white hover:bg-brand-cream-50 border border-brand-ink/20 hover:border-brand-pink/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4 text-brand-ink" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
