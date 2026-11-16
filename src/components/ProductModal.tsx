import React from 'react';
import { X, Check, AlertCircle, ShoppingBag, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/currency';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onOrderNow: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onOrderNow,
}) => {
  if (!product) return null;

  const isSignature = product.id === 'signature-celebration-box';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-brand-ink-muted hover:text-brand-pink hover:bg-white/80 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Content */}
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
          <div className="w-36 h-36 rounded-2xl bg-gradient-to-b from-brand-cream to-white p-3 shrink-0 flex items-center justify-center border border-brand-ink/10 shadow-inner">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>

          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-brand-pink/10 text-brand-pink">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSignature ? 'Complete Party Edition' : 'Compact Hostel Pick'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-ink">{product.name}</h2>
            <p className="text-xs sm:text-sm font-semibold text-brand-teal">{product.tagline}</p>
            <div className="pt-1">
              <span className="text-3xl font-black text-brand-pink">{formatPrice(product.price)}</span>
              <span className="text-xs text-brand-ink-muted ml-2">All-in-one DIY kit</span>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-sm text-brand-ink-light leading-relaxed mb-6 bg-brand-cream/60 p-3.5 rounded-xl border border-brand-cream-200/50">
          {product.description}
        </p>

        {/* Inclusions List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-ink flex items-center gap-2">
              <span>Complete Box Contents</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-teal/15 text-brand-teal">
                {product.inclusions.length} Items Included
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {product.inclusions.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/70 border border-brand-ink/5 text-xs text-brand-ink font-medium leading-snug"
              >
                <div className="w-4 h-4 rounded-full bg-brand-teal text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Exclusions Notice */}
        <div className="mb-6 p-4 rounded-2xl bg-rose-50/70 border border-rose-200/60">
          <div className="flex items-center gap-2 text-rose-900 text-xs font-bold uppercase tracking-wider mb-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Important Notice (What is NOT included)</span>
          </div>
          <ul className="space-y-1.5">
            {product.exclusions.map((item, idx) => (
              <li key={idx} className="text-xs text-rose-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Specifications */}
        {product.dimensionsOrSpecs && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
            {product.dimensionsOrSpecs.map((spec, index) => (
              <div key={index} className="p-2.5 rounded-xl glass-panel text-[11px] font-semibold text-brand-ink-light">
                {spec}
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-brand-ink/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="text-xs text-brand-ink-muted text-center sm:text-left">
            <span>Theme: </span>
            <span className="font-bold text-brand-ink">Pastel Pop (Peach, Lilac, Cream)</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl text-xs font-bold text-brand-ink glass-panel hover:bg-white transition-colors"
            >
              Back to Catalog
            </button>
            <button
              onClick={() => {
                onClose();
                onOrderNow(product);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-md shadow-brand-pink/25 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customize & Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

