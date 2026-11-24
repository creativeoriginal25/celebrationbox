import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Package,
  Cake,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalCount } = useCart();

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB]">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-brand-ink/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs text-brand-ink-muted">
            <Link to="/" className="hover:text-brand-pink font-semibold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
            <span className="text-brand-ink font-bold">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-ink/10">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-ink font-display">
              Your Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-brand-ink-muted mt-1">
              {totalCount} {totalCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="max-w-md mx-auto py-16 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-pink-50 text-brand-pink flex items-center justify-center mx-auto shadow-xs">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-brand-ink font-display">
              Your cart is currently empty
            </h3>
            <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed">
              Looks like you haven&apos;t added any celebration boxes or cakes yet. Explore our curated catalogue below!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Link
                to="/celebration-boxes"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white text-xs sm:text-sm font-extrabold shadow-card transition-all"
              >
                Explore Celebration Boxes
              </Link>
              <Link
                to="/cakes"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-brand-cream-50 border border-brand-ink/15 text-brand-ink text-xs sm:text-sm font-bold shadow-2xs transition-all"
              >
                Explore Cakes &amp; Combos
              </Link>
            </div>
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl bg-white border-2 transition-all shadow-xs ${
                    item.isCombo ? 'border-brand-pink/30 bg-gradient-to-b from-white to-pink-50/15' : 'border-brand-ink/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    {/* Item Thumbnail & Information */}
                    <div className="flex items-start gap-4 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-brand-ink/10 shrink-0"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.isCombo ? (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-pink text-white flex items-center gap-1 shadow-2xs">
                              <Sparkles className="w-3 h-3 fill-white" />
                              <span>Celebration Combo</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-cream-100 text-brand-ink border border-brand-ink/10">
                              Celebration Kit
                            </span>
                          )}
                          <span className="text-xs text-brand-ink-muted">
                            {formatPrice(item.price)} each
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-extrabold text-brand-ink font-display leading-snug">
                          {item.name}
                        </h3>

                        {/* Combo Breakdown Details */}
                        {item.isCombo && item.cakeDetails && (
                          <div className="p-2.5 rounded-xl bg-pink-50/70 border border-brand-pink/20 text-xs text-brand-ink-light space-y-1">
                            <p className="font-semibold text-brand-ink flex items-center gap-1">
                              <Cake className="w-3.5 h-3.5 text-brand-pink" />
                              <span>
                                {item.cakeDetails.flavourName} ({item.cakeDetails.size}) • {item.cakeDetails.dietType === 'eggless' ? 'Eggless 🟢' : 'Egg 🥚'}
                              </span>
                            </p>
                            <p className="text-[11px] text-brand-ink-muted">
                              Design: {item.cakeDetails.designName}
                            </p>
                            {item.cakeDetails.nameOnCake && (
                              <p className="text-[11px] text-brand-pink font-semibold">
                                Name on Cake: &ldquo;{item.cakeDetails.nameOnCake}&rdquo;
                              </p>
                            )}
                            {item.cakeDetails.referenceImage && (
                              <p className="text-[10px] text-emerald-700 font-semibold">
                                ✓ Custom reference photo attached
                              </p>
                            )}
                          </div>
                        )}

                        {item.wantsLightingRental && (
                          <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                            <span>Decorative lighting rental enquiry included</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price, Quantity & Delete */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-brand-ink/5">
                      <div className="text-base sm:text-lg font-black text-brand-pink font-display">
                        {formatPrice(item.price * item.quantity)}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-xl border border-brand-ink/20 bg-white p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-lg text-brand-ink hover:bg-brand-cream-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-7 text-center text-xs font-black text-brand-ink">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-lg text-brand-ink hover:bg-brand-cream-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-2 rounded-xl text-brand-ink-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary & Checkout CTA */}
            <div className="lg:col-span-4">
              <div className="p-6 rounded-3xl bg-white border border-brand-ink/10 shadow-card space-y-5 sticky top-24">
                <h3 className="text-base font-black uppercase tracking-wider text-brand-ink font-display border-b border-brand-ink/10 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-brand-ink">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-ink-light">Items Subtotal</span>
                    <span className="font-bold">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-brand-ink-light">Campus Pickup (SRKR Gate)</span>
                    <span className="font-extrabold text-emerald-700">FREE</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-brand-ink-muted">
                    <span>Nearby Bhimavaram Delivery</span>
                    <span>Confirmed on WhatsApp</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-brand-ink/10 flex items-baseline justify-between">
                  <div>
                    <span className="text-sm font-black text-brand-ink block">Grand Total</span>
                    <span className="text-[10px] text-brand-ink-muted">All taxes included</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-brand-pink font-display">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-pink via-pink-600 to-rose-600 hover:from-brand-pink-hover hover:to-rose-700 text-white font-extrabold text-sm sm:text-base shadow-card hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2 text-center">
                  <Link
                    to="/celebration-boxes"
                    className="text-xs font-bold text-brand-pink hover:underline"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
