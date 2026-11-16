import React from 'react';
import { X, Check, AlertCircle, ShoppingCart, Zap, Clock, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onBuyNow,
}) => {
  const { addToCart } = useCart();
  if (!product) return null;

  const isSignature = product.id === 'signature-celebration-box';
  const setupTime = isSignature ? '30–40 minutes' : '15–20 minutes';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-brand-ink/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl p-4 sm:p-8 shadow-modal border border-brand-ink/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-lg text-brand-ink-muted hover:text-brand-pink hover:bg-brand-cream-50 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Content */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-start mb-6 pt-2 sm:pt-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-brand-cream-100 p-2 shrink-0 flex items-center justify-center border border-brand-ink/10">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase badge-pink">
              <Sparkles className="w-3 h-3" />
              <span>{isSignature ? 'Signature Edition' : 'Mini Edition'}</span>
            </div>
            <h2 id="product-modal-title" className="text-2xl sm:text-3xl font-extrabold text-brand-ink">
              {product.name}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-brand-teal">{product.tagline}</p>
            <div className="pt-1 flex items-baseline justify-center sm:justify-start gap-2">
              <span className="text-2xl sm:text-3xl font-black text-brand-pink">{formatPrice(product.price)}</span>
              <span className="text-xs text-brand-ink-muted">All-in-one DIY kit</span>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed mb-6 bg-brand-cream-50 p-3.5 rounded-xl border border-brand-ink/5">
          {product.description}
        </p>

        {/* Inclusions List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink flex items-center gap-2">
              <span>Complete Box Contents</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {product.inclusions.length} Items Included
              </span>
            </h3>
            <span className="text-xs text-brand-ink-muted flex items-center gap-1">
              <Clock className="w-3 h-3 text-brand-marigold" />
              <span>{setupTime} DIY</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {product.inclusions.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-brand-cream-50/60 border border-brand-ink/5 text-xs text-brand-ink font-medium leading-snug"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusions Notice */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200">
          <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Honest Note (What is NOT included)</span>
          </div>
          <ul className="space-y-1">
            {product.exclusions.map((item, idx) => (
              <li key={idx} className="text-xs text-amber-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions: Buy Now & Add to Cart */}
        <div className="pt-4 border-t border-brand-ink/10 flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-center justify-between">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-3 min-h-[44px] rounded-xl text-xs font-bold text-brand-ink bg-brand-cream-50 hover:bg-brand-cream-100 border border-brand-ink/10 transition-colors cursor-pointer order-2 sm:order-1"
          >
            Close
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
            <button
              onClick={() => {
                addToCart(product, 1);
                onClose();
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 min-h-[46px] rounded-xl text-xs font-bold text-brand-ink bg-white hover:bg-brand-cream-50 border border-brand-ink/20 shadow-xs cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onBuyNow(product);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-3 min-h-[46px] rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
