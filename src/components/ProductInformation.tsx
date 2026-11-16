import React, { useState } from 'react';
import { Zap, ShoppingCart, Check, Clock, ShieldCheck, Sparkles, Truck, HelpCircle } from 'lucide-react';
import { Product } from '../types';
import { AVAILABLE_THEMES } from '../config/products';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { ProductContents } from './ProductContents';

interface ProductInformationProps {
  product: Product;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductInformation: React.FC<ProductInformationProps> = ({
  product,
  onBuyNow,
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  const isSignature = product.id === 'signature-celebration-box';
  const setupTime = isSignature ? '30–40 mins DIY' : '15–20 mins DIY';

  // Get active theme
  const currentTheme = AVAILABLE_THEMES.find((t) => product.availableThemes.includes(t.id)) || AVAILABLE_THEMES[0];

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQty = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleDirectBuy = () => {
    onBuyNow(product, quantity);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Title & Badge */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase badge-pink">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{product.badge || (isSignature ? 'Signature Edition' : 'Budget Pick')}</span>
          </span>

          {/* Actual Inventory Availability Status */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>In Stock • Ready to Dispatch</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink leading-tight">
          {product.name}
        </h1>

        <p className="text-sm sm:text-base font-semibold text-brand-teal">
          {product.tagline}
        </p>
      </div>

      {/* Price & Value Proposition */}
      <div className="flex items-baseline gap-3 pb-4 border-b border-brand-ink/10">
        <span className="text-3xl sm:text-4xl font-black text-brand-pink tracking-tight">
          {formatPrice(product.price)}
        </span>
        <span className="text-xs sm:text-sm text-brand-ink-muted">
          All taxes included • 100% complete kit
        </span>
      </div>

      {/* Short Description */}
      <div className="text-xs sm:text-sm text-brand-ink-light leading-relaxed space-y-2">
        <p>{product.description}</p>
        <p className="text-xs text-brand-ink-muted">
          <strong>Ideal For:</strong> {product.idealFor}
        </p>
      </div>

      {/* Theme Configuration */}
      <div className="p-3.5 rounded-xl bg-brand-cream-50 border border-brand-ink/10 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-ink">
              Theme: {currentTheme.name}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-pink/15 text-brand-pink">
              Active Color Palette
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {currentTheme.colors.map((c, idx) => (
              <span
                key={idx}
                className="w-4 h-4 rounded-full border border-brand-ink/20 shadow-2xs"
                style={{ backgroundColor: c.hex }}
                title={`${c.name} (${c.hex})`}
              />
            ))}
          </div>
        </div>
        <p className="text-[11px] text-brand-ink-muted">
          {currentTheme.description}
        </p>
      </div>

      {/* Setup Highlights & Quick Specs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="p-2.5 rounded-xl bg-white border border-brand-ink/10 text-center">
          <Clock className="w-4 h-4 text-brand-marigold mx-auto mb-1" />
          <span className="text-[11px] font-bold text-brand-ink block">{setupTime}</span>
          <span className="text-[10px] text-brand-ink-muted">Foolproof DIY</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-brand-ink/10 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
          <span className="text-[11px] font-bold text-brand-ink block">Wall-Safe Dots</span>
          <span className="text-[10px] text-brand-ink-muted">Zero wall marks</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-brand-ink/10 text-center col-span-2 sm:col-span-1">
          <Truck className="w-4 h-4 text-brand-teal mx-auto mb-1" />
          <span className="text-[11px] font-bold text-brand-ink block">Fast Dispatch</span>
          <span className="text-[10px] text-brand-ink-muted">Campus &amp; Local</span>
        </div>
      </div>

      {/* Purchase Actions: Quantity + Buy Now + Add to Cart */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity selector */}
          <div className="flex items-center rounded-xl border border-brand-ink/20 bg-white p-1">
            <button
              type="button"
              onClick={handleDecreaseQty}
              disabled={quantity <= 1}
              className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-lg text-brand-ink hover:bg-brand-cream-100 disabled:opacity-40 flex items-center justify-center font-bold text-base cursor-pointer"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-10 text-center text-sm font-extrabold text-brand-ink">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncreaseQty}
              disabled={quantity >= 10}
              className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-lg text-brand-ink hover:bg-brand-cream-100 disabled:opacity-40 flex items-center justify-center font-bold text-base cursor-pointer"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="text-xs text-brand-ink-muted">
            Total: <span className="font-bold text-brand-ink">{formatPrice(product.price * quantity)}</span>
          </div>
        </div>

        {/* TWO PRIMARY SHOPPING BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 1. Buy Now (Primary rani-pink button, direct purchase) */}
          <button
            type="button"
            onClick={handleDirectBuy}
            className="w-full py-3.5 px-5 min-h-[48px] rounded-xl text-sm font-extrabold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-card active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Buy Now</span>
          </button>

          {/* 2. Add to Cart (White/warm off-white background, dark ink text, subtle dark/pink border) */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full py-3.5 px-5 min-h-[48px] rounded-xl text-sm font-extrabold text-brand-ink bg-white hover:bg-brand-cream-50 border border-brand-ink/20 hover:border-brand-pink/60 transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-brand-ink" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* What's Inside the Pack (Collapsible / structured panel) */}
      <div className="pt-2">
        <ProductContents product={product} defaultExpanded={true} />
      </div>
    </div>
  );
};