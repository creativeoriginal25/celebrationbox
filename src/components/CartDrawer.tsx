import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  onCheckout: () => void;
  onExplore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onExplore }) => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, subtotal, totalCount } =
    useCart();

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-brand-ink/50 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Surface */}
      <div
        className="relative w-full max-w-md bg-white h-full shadow-modal flex flex-col justify-between z-10 animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-brand-ink/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-brand-ink">Your Celebration Cart</h2>
              <p className="text-xs text-brand-ink-muted">
                {totalCount} {totalCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-lg text-brand-ink-muted hover:text-brand-pink hover:bg-brand-cream-50 transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-brand-cream-100 flex items-center justify-center text-brand-ink-subtle">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-ink">Your cart is empty</h3>
                <p className="text-xs text-brand-ink-muted mt-1 max-w-xs mx-auto">
                  Looks like you haven't added any celebration kits yet.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onExplore();
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm transition-all cursor-pointer"
              >
                <span>Explore Celebration Boxes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="surface-card rounded-xl p-3.5 border border-brand-ink/10 flex items-center gap-3.5"
              >
                <div className="w-16 h-16 rounded-lg bg-brand-cream-100 shrink-0 p-1 flex items-center justify-center border border-brand-ink/5">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-brand-ink truncate">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-brand-ink-subtle hover:text-rose-500 p-1 transition-colors cursor-pointer"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-brand-ink-muted font-medium mt-0.5">
                    {formatPrice(item.price)} each
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-brand-ink/15 rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 px-2 text-xs font-bold text-brand-ink hover:bg-brand-cream-100 rounded-l-lg cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-brand-ink select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 px-2 text-xs font-bold text-brand-ink hover:bg-brand-cream-100 rounded-r-lg cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-black text-brand-pink">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-brand-ink/10 bg-brand-cream-50/80 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm font-bold text-brand-ink">
                <span>Subtotal ({totalCount} items):</span>
                <span className="text-lg font-black text-brand-pink">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-[11px] text-brand-ink-muted leading-tight">
                Delivery charges confirmed separately via WhatsApp (College Pickup is FREE).
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to WhatsApp Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-brand-ink bg-white hover:bg-brand-cream-100 border border-brand-ink/15 transition-all text-center cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
