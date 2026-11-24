import React, { useState } from 'react';
import { ShoppingBag, Copy, Check, Edit2, ShieldCheck, MessageCircle, MapPin, Building2, User, Phone, FileText, Cake, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/currency';
import { FormFields, CheckoutStep } from './useCheckoutForm';
import { formatOrderWhatsAppMessage } from './formatWhatsAppMessage';
import {
  calculateCakePrice,
  getCakeFlavour,
  getCakeDesign,
  CHOCOLOOM_CONFIG,
} from '../../config/chocoloomCakes';

interface Step3ReviewProps {
  formData: FormFields;
  product: Product;
  onGoToStep: (step: CheckoutStep) => void;
  isCartMode?: boolean;
  cartItems?: Array<{ id: string; name: string; price: number; quantity: number }>;
}

export const Step3Review: React.FC<Step3ReviewProps> = ({
  formData,
  product,
  onGoToStep,
  isCartMode = false,
  cartItems = [],
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const hasCake = !!formData.cakeCustomization?.includeCake;
  const cakePrice = hasCake && formData.cakeCustomization
    ? calculateCakePrice(formData.cakeCustomization)
    : 0;

  const kitSubtotal = isCartMode
    ? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : product.price * formData.quantity;

  const total = kitSubtotal + cakePrice;

  const handleCopy = () => {
    const formatted = formatOrderWhatsAppMessage({
      productName: product.name,
      quantity: formData.quantity,
      unitPrice: product.price,
      total,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      fulfilment: formData.deliveryMethod,
      deliveryAddress: formData.deliveryAddress,
      personalMessage: formData.personalMessage,
      celebrationDate: formData.celebrationDate,
      preferredTime: formData.preferredTime,
      referralCode: formData.referralCode?.trim() || undefined,
      wantsLightingRental: formData.wantsLightingRental,
      cartItems: isCartMode ? cartItems : undefined,
      cakeCustomization: formData.cakeCustomization,
    });

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(formatted);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* ============================================================== */}
      {/* 1. ORDER SUMMARY CARD                                          */}
      {/* ============================================================== */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-ink/10 shadow-xs space-y-4">
        
        {/* SECTION A: PRODUCT & QUANTITY */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-ink-muted">
              Item Details
            </span>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="text-xs font-bold text-brand-pink hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit Details</span>
            </button>
          </div>

          {isCartMode ? (
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-brand-ink">{item.name}</span>
                    <span className="text-brand-ink-muted text-xs block">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </span>
                  </div>
                  <span className="font-black text-brand-ink">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF8F3] border border-brand-pink/15">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-contain rounded-lg bg-white p-0.5 border border-brand-pink/20 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-brand-ink truncate">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-brand-ink-muted">
                    Qty: {formData.quantity} × {formatPrice(product.price)}
                  </p>
                </div>
              </div>
              <span className="text-sm font-black text-brand-pink shrink-0">
                {formatPrice(kitSubtotal)}
              </span>
            </div>
          )}

          {/* CHOCOLOOM CAKE COMBO CARD IN REVIEW */}
          {hasCake && formData.cakeCustomization && (() => {
            const flavour = getCakeFlavour(formData.cakeCustomization.flavourId);
            const design = getCakeDesign(formData.cakeCustomization.designId);
            const sizeObj = CHOCOLOOM_CONFIG.sizes.find((s) => s.id === formData.cakeCustomization!.size);
            return (
              <div className="mt-2.5 p-3 rounded-xl bg-gradient-to-r from-pink-50/70 via-rose-50/50 to-amber-50/30 border border-brand-pink/25">
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <img
                      src={flavour.image}
                      alt={flavour.name}
                      className="w-11 h-11 object-cover rounded-lg border border-brand-pink/30 shrink-0 mt-0.5"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-brand-ink">
                          {flavour.name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-brand-pink/15 text-brand-pink">
                          Cakes by Chocoloom
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-ink-light mt-0.5">
                        {sizeObj?.label || formData.cakeCustomization.size} • {formData.cakeCustomization.dietType === 'eggless' ? '100% Eggless 🟢' : 'Regular 🥚'} • {design.name}
                      </p>
                      {formData.cakeCustomization.nameOnCake && (
                        <p className="text-[11px] text-brand-pink font-semibold mt-0.5">
                          Name on Cake: &ldquo;{formData.cakeCustomization.nameOnCake}&rdquo;
                        </p>
                      )}
                      {formData.cakeCustomization.referenceImage && (
                        <p className="text-[10px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                          ✓ Custom reference photo attached
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-brand-pink shrink-0">
                    +{formatPrice(cakePrice)}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* SECTION B: CUSTOMER CONTACT */}
        <div className="pt-3 border-t border-brand-ink/5 space-y-1.5 text-xs text-brand-ink">
          <div className="flex items-center justify-between text-brand-ink-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Customer</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-brand-pink shrink-0" />
              <span className="font-semibold truncate">{formData.customerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-brand-teal shrink-0" />
              <span className="font-mono text-brand-ink-light">+91 {formData.customerPhone}</span>
            </div>
          </div>
        </div>

        {/* SECTION C: FULFILMENT & CELEBRATION DETAILS */}
        <div className="pt-3 border-t border-brand-ink/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-ink-muted">
              Fulfilment & Timing
            </span>
            <button
              type="button"
              onClick={() => onGoToStep(2)}
              className="text-xs font-bold text-brand-pink hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit Details</span>
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-brand-cream-50/80 border border-brand-ink/10 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-brand-ink flex items-center gap-1.5">
                {formData.deliveryMethod === 'pickup' ? (
                  <>
                    <Building2 className="w-3.5 h-3.5 text-brand-teal" />
                    <span>College Campus Pickup</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-brand-pink" />
                    <span>Nearby Delivery (Bhimavaram)</span>
                  </>
                )}
              </span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                formData.deliveryMethod === 'pickup'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {formData.deliveryMethod === 'pickup' ? 'FREE' : 'Charges confirmed on WhatsApp'}
              </span>
            </div>

            {formData.deliveryMethod === 'delivery' && formData.deliveryAddress && (
              <p className="text-[11px] text-brand-ink-light pl-5 leading-relaxed">
                📍 {formData.deliveryAddress}
              </p>
            )}

            {formData.celebrationDate && (
              <p className="text-[11px] text-brand-ink-muted pl-5 pt-1 border-t border-brand-ink/5">
                📅 {formData.celebrationDate} • {formData.preferredTime}
              </p>
            )}
          </div>
        </div>

        {/* SECTION D: PERSONAL MESSAGE (IF ENTERED) */}
        {formData.personalMessage.trim().length > 0 && (
          <div className="pt-3 border-t border-brand-ink/5 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-ink-muted block">
              Personal Message
            </span>
            <div className="p-2.5 rounded-xl bg-[#FFFDFB] border border-brand-ink/10 text-xs text-brand-ink-light italic">
              &ldquo;{formData.personalMessage.trim()}&rdquo;
            </div>
          </div>
        )}

        {/* SECTION: REFERRAL CODE (IF APPLIED) */}
        {formData.referralCode && (
          <div className="pt-3 border-t border-brand-ink/5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-ink-muted block">
              Referral Code
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
              <span>🎟️</span>
              <span>{formData.referralCode}</span>
            </div>
          </div>
        )}

        {/* SECTION: OPTIONAL LIGHTING RENTAL */}
        <div className="pt-3 border-t border-brand-ink/5 flex items-center justify-between text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-ink-muted block">
            Lighting Rental Enquiry
          </span>
          <span
            className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
              formData.wantsLightingRental
                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                : 'bg-brand-cream-100 text-brand-ink-muted'
            }`}
          >
            {formData.wantsLightingRental ? '✨ Yes (Enquiry Included)' : 'No'}
          </span>
        </div>
        {formData.wantsLightingRental && (
          <p className="text-[10px] text-amber-800/90 italic -mt-2">
            * Lighting is rented separately and its price is not included in the kit total.
          </p>
        )}

        {/* SECTION E: TOTAL */}
        <div className="pt-3.5 border-t border-brand-ink/10 flex items-baseline justify-between">
          <div>
            <span className="text-sm font-black text-brand-ink block">
              {hasCake ? 'Total (Box + Chocoloom Cake)' : 'Total'}
            </span>
            <span className="text-[11px] text-brand-ink-muted">
              {hasCake ? `Kit: ${formatPrice(kitSubtotal)} + Cake: ${formatPrice(cakePrice)}` : 'Delivery charge, if any, is confirmed on WhatsApp.'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-brand-pink tracking-tight block font-display">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SECONDARY ACTION: COPY FORMATTED MESSAGE (WITH TOAST)        */}
      {/* ============================================================== */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-brand-ink-muted">
          Need the message text directly?
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs font-bold text-brand-pink hover:text-brand-pink-hover inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-pink/20 bg-white hover:bg-brand-pink-50 transition-all cursor-pointer active:scale-95"
          aria-label="Copy formatted order message to clipboard"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span className="text-emerald-700 font-bold">Copied to clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Formatted Message</span>
            </>
          )}
        </button>
      </div>

      {/* Inline Copied Toast Banner */}
      {isCopied && (
        <div
          role="status"
          aria-live="polite"
          className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-center gap-2 animate-fadeIn"
        >
          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
          <span className="font-semibold">Formatted WhatsApp message copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};
