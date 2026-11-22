import React, { useState } from 'react';
import { Zap, ShoppingCart, Sparkles, Check, Info } from 'lucide-react';
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

  // Active theme
  const currentTheme =
    AVAILABLE_THEMES.find((t) => product.availableThemes.includes(t.id)) ||
    AVAILABLE_THEMES[0];

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
      {/* 1. Product Name */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-brand-pink/10 text-brand-pink border border-brand-pink/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Celebration Kit</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink leading-tight font-display">
          {product.name}
        </h1>
      </div>

      {/* 2. Price */}
      <div className="flex items-baseline gap-3 pb-3 border-b border-brand-ink/10">
        <span className="text-3xl sm:text-4xl font-black text-brand-pink tracking-tight">
          {formatPrice(product.price)}
        </span>
        {product.compare_at_price && product.compare_at_price > product.price && (
          <span className="text-lg sm:text-xl text-brand-ink-muted line-through font-semibold">
            {formatPrice(product.compare_at_price)}
          </span>
        )}
        <span className="text-xs sm:text-sm text-brand-ink-muted">
          All-inclusive price • {product.totalPieces || 60} pieces total
        </span>
      </div>

      {/* 3. Tagline & Short Description */}
      <div className="space-y-1.5">
        <p className="text-base sm:text-lg font-bold text-brand-teal">
          "{product.tagline}"
        </p>
        <p className="text-sm text-brand-ink-light leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Theme Colors Indicator */}
      <div className="p-3.5 rounded-xl bg-brand-cream-50 border border-brand-ink/10 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-ink-muted block">
            Theme Palette
          </span>
          <span className="text-xs sm:text-sm font-bold text-brand-ink">
            {currentTheme.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {currentTheme.colors.map((c, idx) => (
            <span
              key={idx}
              className="w-5 h-5 rounded-full border border-brand-ink/20 shadow-xs"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* 4. What's Inside the Box & Exact Product Contents */}
      <div>
        <ProductContents product={product} defaultExpanded={true} />
      </div>

      {/* 5. Quantity + Buy Now & Add to Cart */}
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

        {/* Action Buttons: Buy Now & Add to Cart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Buy Now */}
          <button
            type="button"
            onClick={handleDirectBuy}
            className="w-full py-3.5 px-5 min-h-[48px] rounded-xl text-sm font-extrabold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-card active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Buy Now</span>
          </button>

          {/* Add to Cart */}
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

      {/* 6. Honest Preview Note (Section 9) */}
      <div className="p-3.5 rounded-xl bg-brand-cream-50 border border-brand-ink/10 flex items-start gap-2.5 text-xs text-brand-ink-muted leading-relaxed">
        <Info className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
        <p>
          <strong>Visual Note:</strong> The garland photograph is an illustrative setup preview. Please refer to the "What's Inside the Box" infographic and itemized list above for the exact verified contents included in your kit.
        </p>
      </div>
    </div>
  );
};
