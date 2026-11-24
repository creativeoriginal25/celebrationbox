import React, { useState } from 'react';
import {
  Zap,
  ShoppingCart,
  Sparkles,
  MessageCircle,
  Lightbulb,
  Info,
  ShieldAlert,
  Cake,
} from 'lucide-react';
import { Product } from '../types';
import { AVAILABLE_THEMES } from '../config/products';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { ProductContents } from './ProductContents';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppLink, triggerWhatsAppChat } from '../services/whatsappService';

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

  const handleRentalEnquiryWhatsApp = () => {
    const text =
      'Hello Celebration Box! ✨ I would like to enquire about the Milky-White Decorative Lighting String rental for my birthday celebration setup.';
    const url = buildWhatsAppLink(BUSINESS_CONFIG.whatsappNumber, text);
    triggerWhatsAppChat(url);
  };

  const handleGeneralEnquiryWhatsApp = () => {
    const text = `Hello Celebration Box! 🎉 I would like to enquire about the ${product.name} (₹${product.price}) and check delivery/pickup availability.`;
    const url = buildWhatsAppLink(BUSINESS_CONFIG.whatsappNumber, text);
    triggerWhatsAppChat(url);
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* ============================================================== */}
      {/* 1. PRODUCT TITLE & CATEGORY                                    */}
      {/* ============================================================== */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-brand-pink/10 text-brand-pink border border-brand-pink/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Birthday Decoration Kits</span>
          </span>
          <span className="text-[11px] font-bold text-brand-teal uppercase tracking-wider">
            Official Kit
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink leading-tight font-display">
          {product.name}
        </h1>
      </div>

      {/* ============================================================== */}
      {/* 2. PRICE (₹399)                                                */}
      {/* ============================================================== */}
      <div className="flex items-baseline gap-3 pb-3 border-b border-brand-ink/10 flex-wrap">
        <span className="text-3xl sm:text-4xl font-black text-brand-pink tracking-tight">
          {formatPrice(product.price)}
        </span>
        {product.compare_at_price && product.compare_at_price > product.price && (
          <span className="text-lg sm:text-xl text-brand-ink-muted line-through font-semibold">
            {formatPrice(product.compare_at_price)}
          </span>
        )}
        <span className="text-xs sm:text-sm text-brand-ink-muted">
          All-inclusive kit price • 56 balloons included
        </span>
      </div>

      {/* ============================================================== */}
      {/* 3. SHORT PRODUCT DESCRIPTION                                   */}
      {/* ============================================================== */}
      <div className="space-y-1.5">
        <p className="text-sm sm:text-base text-brand-ink leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* ============================================================== */}
      {/* 4. COLOUR-THEME SWATCHES                                       */}
      {/* ============================================================== */}
      <div className="p-3.5 rounded-xl bg-brand-cream-50 border border-brand-ink/10 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-ink-muted block">
            Theme Colours
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

      {/* ============================================================== */}
      {/* 5. WHAT'S INSIDE THE BOX (EXACT PURCHASED QUANTITIES)          */}
      {/* ============================================================== */}
      <div>
        <ProductContents product={product} defaultExpanded={true} />
      </div>

      {/* ============================================================== */}
      {/* 6. OPTIONAL LIGHTING RENTAL (MAKE IT GLOW ✨)                   */}
      {/* ============================================================== */}
      <div className="rounded-2xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/50 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-brand-ink font-display">
                  Make It Glow ✨
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
                  Lighting Available on Rent
                </span>
              </div>
              <p className="text-xs text-brand-ink-muted mt-0.5">
                Milky-White Decorative Lighting String
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-brand-ink leading-relaxed">
          Want to add a warm glow to your birthday setup? Ask us about our optional milky-white decorative lighting rental.
        </p>

        <div className="rounded-xl bg-white/90 p-3 border border-amber-200/80 text-[11px] sm:text-xs text-amber-950/90 space-y-1">
          <p className="font-semibold text-amber-900">Important Rental Details:</p>
          <ul className="list-disc pl-4 space-y-0.5 text-amber-900/80">
            <li>Lighting is <strong>not included</strong> in the ₹399 kit price.</li>
            <li>Rental duration, security deposit, and return arrangements must be confirmed before accepting the rental.</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={handleRentalEnquiryWhatsApp}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-100/70 text-xs font-bold text-amber-950 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Enquire on WhatsApp</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 7. STYLING INSPIRATION DISCLAIMER                              */}
      {/* ============================================================== */}
      <div className="p-3.5 rounded-xl bg-brand-cream-50 border border-brand-ink/10 flex items-start gap-2.5 text-xs text-brand-ink-light leading-relaxed">
        <Info className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
        <p>
          <strong className="font-semibold text-brand-ink">Styling inspiration.</strong> Cake, table and additional props are not included. Decorative lighting is available separately on rent.
        </p>
      </div>

      {/* ============================================================== */}
      {/* 7B. CELEBRATIONBOX × CHOCOLOOM CAKE COMBO CALLOUT              */}
      {/* ============================================================== */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50/70 to-amber-50/40 border-2 border-brand-pink/25 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-brand-pink text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Cake className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-black text-brand-ink block">
                Make it a Birthday Combo ✨
              </span>
              <p className="text-[11px] text-brand-pink font-semibold">
                Cakes by Chocoloom • from +₹219
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDirectBuy}
            className="px-3 py-1.5 rounded-xl bg-brand-pink text-white text-xs font-extrabold hover:bg-brand-pink-hover transition-colors shadow-2xs cursor-pointer active:scale-95"
          >
            Add a Cake
          </button>
        </div>
        <p className="text-[11px] text-brand-ink-light">
          Pair this kit with a fresh Dutch Truffle, Belgian Silk, or Bento cake. Choose size & flavor during checkout!
        </p>
      </div>

      {/* ============================================================== */}
      {/* 8. QUANTITY + BUY NOW & ADD TO CART                            */}
      {/* ============================================================== */}
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

      {/* ============================================================== */}
      {/* 9. WHATSAPP ENQUIRY ACTION                                     */}
      {/* ============================================================== */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleGeneralEnquiryWhatsApp}
          className="w-full py-3 px-4 rounded-xl border border-emerald-600/30 bg-emerald-50/60 hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-2xs"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Have questions? Chat directly on WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
