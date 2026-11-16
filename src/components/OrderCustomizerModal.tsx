import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  Copy,
  Check,
  Info,
  Building2,
  MapPin,
  ShoppingBag,
  Settings,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OrderDetails, DeliveryMethod } from '../types';
import { PRODUCTS, AVAILABLE_THEMES } from '../config/products';
import { BUSINESS_CONFIG, isWhatsAppConfigured } from '../config/business';
import { formatPrice, calculateSubtotal } from '../utils/currency';
import { validateOrderForm, ValidationErrors } from '../utils/validation';
import {
  generateWhatsAppOrderMessage,
  prepareWhatsAppOrder,
} from '../services/whatsappService';
import { saveOrderToLocalHistory, getOrderSummary } from '../services/orderService';

interface OrderCustomizerModalProps {
  initialProductId?: 'mini-celebration-box' | 'signature-celebration-box';
  onClose: () => void;
  onOpenFallback: (message: string, isConfigured: boolean) => void;
}

export const OrderCustomizerModal: React.FC<OrderCustomizerModalProps> = ({
  initialProductId = 'signature-celebration-box',
  onClose,
  onOpenFallback,
}) => {
  // Form State
  const [selectedProductId, setSelectedProductId] = useState<'mini-celebration-box' | 'signature-celebration-box'>(
    initialProductId
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedTheme] = useState<string>('Pastel Pop');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [celebrationDate, setCelebrationDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('Evening (4:00 PM - 7:00 PM)');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [birthdayMessage, setBirthdayMessage] = useState<string>('');

  // UI & Validation State
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showConfigHelper, setShowConfigHelper] = useState<boolean>(false);
  const [customWhatsAppOverride, setCustomWhatsAppOverride] = useState<string>('');

  const activeProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[1];
  const activeTheme = AVAILABLE_THEMES.find((t) => t.name === selectedTheme) || AVAILABLE_THEMES[0];
  const subtotal = calculateSubtotal(activeProduct.price, quantity);
  const summary = getOrderSummary({
    productPrice: activeProduct.price,
    quantity,
    deliveryMethod,
  });

  const effectiveNumber = customWhatsAppOverride || BUSINESS_CONFIG.whatsappNumber;
  const configured = isWhatsAppConfigured(effectiveNumber);
  const todayString = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!celebrationDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setCelebrationDate(tomorrow.toISOString().split('T')[0]);
    }
  }, []);

  useEffect(() => {
    setSelectedProductId(initialProductId);
  }, [initialProductId]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const currentOrderDetails: OrderDetails = {
    productId: selectedProductId,
    productName: activeProduct.name,
    productPrice: activeProduct.price,
    quantity,
    theme: selectedTheme,
    customerName,
    customerPhone,
    celebrationDate,
    preferredTime,
    deliveryMethod,
    deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
    birthdayMessage: birthdayMessage ? birthdayMessage : undefined,
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateOrderForm(currentOrderDetails);
    setErrors(validationErrors);

    if (!isValid) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    saveOrderToLocalHistory(currentOrderDetails);
    const payload = prepareWhatsAppOrder(currentOrderDetails, effectiveNumber);

    if (!payload.isConfigured) {
      onOpenFallback(payload.formattedMessage, false);
      return;
    }

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E91E63', '#FFB400', '#00A8A8', '#FFBE98', '#D8B4E2'],
      });
    } catch {
      // ignore
    }

    const opened = window.open(payload.waMeUrl, '_blank', 'noopener,noreferrer');
    if (!opened) {
      onOpenFallback(payload.formattedMessage, true);
    }
  };

  const handleCopyMessage = () => {
    const message = generateWhatsAppOrderMessage(currentOrderDetails);
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-brand-ink/60 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl my-6 bg-white rounded-2xl p-6 sm:p-8 shadow-modal border border-brand-ink/10 text-left max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-ink/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-ink">
                Customize Your Celebration Box
              </h2>
              <p className="text-xs text-brand-ink-muted">
                Order via WhatsApp • Direct coordination with student founders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-brand-ink-muted hover:text-brand-pink hover:bg-brand-cream-50 transition-colors cursor-pointer"
            aria-label="Close customizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Setup Notice (Displayed if placeholder) */}
        {!configured && (
          <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">WhatsApp Setup Notice:</span>
                <span className="block mt-0.5">
                  Business WhatsApp is currently a placeholder (<code>{effectiveNumber || '91XXXXXXXXXX'}</code>). You can test ordering with your test phone number below or use copy message fallback.
                </span>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowConfigHelper(!showConfigHelper)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-200/80 hover:bg-amber-300 font-bold text-amber-900 text-[11px] cursor-pointer"
              >
                <Settings className="w-3 h-3" />
                <span>{showConfigHelper ? 'Hide Test Input' : 'Enter Test WhatsApp Number'}</span>
              </button>
            </div>

            {showConfigHelper && (
              <div className="pt-1">
                <input
                  type="text"
                  placeholder="Enter 10 or 12 digit number (e.g. 919876543210)"
                  value={customWhatsAppOverride}
                  onChange={(e) => setCustomWhatsAppOverride(e.target.value)}
                  className="w-full sm:w-72 px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs font-mono"
                />
              </div>
            )}
          </div>
        )}

        {/* Customization Form */}
        <form onSubmit={handleOrderSubmit} className="space-y-5">
          
          {/* 1. SELECT PRODUCT */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
              1. Choose Box Option
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRODUCTS.map((prod) => {
                const isSelected = selectedProductId === prod.id;
                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProductId(prod.id)}
                    className={`cursor-pointer rounded-xl p-3.5 border-2 transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-brand-pink bg-brand-pink-50/40 shadow-xs'
                        : 'border-brand-ink/10 bg-white hover:border-brand-ink/20'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-brand-cream-100 shrink-0 p-1 flex items-center justify-center border border-brand-ink/10">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-brand-ink truncate">{prod.name}</h4>
                        <span className="text-sm font-black text-brand-pink">{formatPrice(prod.price)}</span>
                      </div>
                      <p className="text-[11px] text-brand-ink-muted truncate mt-0.5">{prod.tagline}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-brand-teal/10 text-brand-teal">
                        {prod.inclusions.length} items included
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. QUANTITY & THEME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Quantity */}
            <div className="p-3.5 rounded-xl bg-brand-cream-50 border border-brand-ink/10">
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-1.5">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg bg-white border border-brand-ink/15 flex items-center justify-center font-bold text-brand-ink disabled:opacity-40 hover:bg-brand-cream-100 cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="text-base font-extrabold text-brand-ink w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                  className="w-8 h-8 rounded-lg bg-white border border-brand-ink/15 flex items-center justify-center font-bold text-brand-ink disabled:opacity-40 hover:bg-brand-cream-100 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span className="text-xs text-brand-ink-muted ml-auto font-medium">
                  Subtotal: <strong className="text-brand-ink">{formatPrice(subtotal)}</strong>
                </span>
              </div>
            </div>

            {/* Theme */}
            <div className="p-3.5 rounded-xl bg-brand-cream-50 border border-brand-ink/10">
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-1.5">
                Curated Theme
              </label>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-brand-ink/10 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {activeTheme.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-brand-ink">{activeTheme.name}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Included
                </span>
              </div>
            </div>
          </div>

          {/* 3. CUSTOMER DETAILS */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
              2. Contact Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-brand-ink mb-1">
                  Full Name *
                </label>
                <input
                  id="field-customerName"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink ${
                    errors.customerName ? 'border-rose-500 bg-rose-50/30' : 'border-brand-ink/20 bg-white'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-ink mb-1">
                  WhatsApp Mobile Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-brand-ink-muted">
                    +91
                  </span>
                  <input
                    id="field-customerPhone"
                    type="tel"
                    placeholder="98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className={`w-full pl-11 pr-3.5 py-2.5 rounded-lg border text-xs sm:text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink ${
                      errors.customerPhone ? 'border-rose-500 bg-rose-50/30' : 'border-brand-ink/20 bg-white'
                    }`}
                  />
                </div>
                {errors.customerPhone && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.customerPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* 4. DATE & TIME */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
              3. Celebration Schedule
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-brand-ink mb-1">
                  Celebration Date *
                </label>
                <input
                  id="field-celebrationDate"
                  type="date"
                  min={todayString}
                  value={celebrationDate}
                  onChange={(e) => setCelebrationDate(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink ${
                    errors.celebrationDate ? 'border-rose-500 bg-rose-50/30' : 'border-brand-ink/20 bg-white'
                  }`}
                />
                {errors.celebrationDate && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.celebrationDate}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-brand-ink mb-1">
                  Preferred Time Slot *
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-brand-ink/20 bg-white text-xs sm:text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
                >
                  <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                  <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                  <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                  <option value="Night (7:00 PM - 9:00 PM)">Night (7:00 PM - 9:00 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. FULFILLMENT METHOD */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
              4. Fulfillment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* College Pickup */}
              <div
                onClick={() => setDeliveryMethod('pickup')}
                className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all ${
                  deliveryMethod === 'pickup'
                    ? 'border-brand-teal bg-brand-teal-50/50 shadow-xs'
                    : 'border-brand-ink/10 bg-white hover:border-brand-ink/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-brand-ink">
                    <Building2 className="w-4 h-4 text-brand-teal" />
                    <span>College Campus Pickup</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    FREE
                  </span>
                </div>
                <p className="text-[11px] text-brand-ink-muted leading-tight">
                  Collect near campus gate in Bhimavaram. Zero delivery fee.
                </p>
                <p className="text-[11px] font-semibold text-brand-teal mt-1.5">
                  "Pickup details will be shared after order confirmation."
                </p>
              </div>

              {/* Nearby Delivery */}
              <div
                onClick={() => setDeliveryMethod('delivery')}
                className={`cursor-pointer p-3.5 rounded-xl border-2 transition-all ${
                  deliveryMethod === 'delivery'
                    ? 'border-brand-pink bg-brand-pink-50/40 shadow-xs'
                    : 'border-brand-ink/10 bg-white hover:border-brand-ink/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-brand-ink">
                    <MapPin className="w-4 h-4 text-brand-pink" />
                    <span>Nearby Delivery</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Bhimavaram
                  </span>
                </div>
                <p className="text-[11px] text-brand-ink-muted leading-tight">
                  Doorstep drop to your hostel, room, or home in Bhimavaram town.
                </p>
                <p className="text-[11px] font-semibold text-brand-pink mt-1.5">
                  "Delivery charges will be confirmed through WhatsApp."
                </p>
              </div>
            </div>

            {deliveryMethod === 'delivery' && (
              <div className="mt-3">
                <label className="block text-xs font-medium text-brand-ink mb-1">
                  Delivery Address & Landmark in Bhimavaram *
                </label>
                <textarea
                  id="field-deliveryAddress"
                  rows={2}
                  placeholder="e.g. Room 204, Royal Men's PG, near SRKR Engineering College, Chinna Amiram, Bhimavaram"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className={`w-full px-3.5 py-2 rounded-lg border text-xs sm:text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink ${
                    errors.deliveryAddress ? 'border-rose-500 bg-rose-50/30' : 'border-brand-ink/20 bg-white'
                  }`}
                />
                {errors.deliveryAddress && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.deliveryAddress}</p>
                )}
              </div>
            )}
          </div>

          {/* 6. OPTIONAL BIRTHDAY MESSAGE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-1">
              5. Birthday Message or Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 'Happy 21st Birthday Sneha! Best roommate ever!'"
              value={birthdayMessage}
              onChange={(e) => setBirthdayMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-brand-ink/20 bg-white text-xs sm:text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink"
            />
          </div>

          {/* LIVE ORDER SUMMARY */}
          <div className="p-4 rounded-xl bg-brand-cream-50 border border-brand-ink/10 space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-ink-muted">
              Live Order Breakdown
            </h4>

            <div className="flex items-center justify-between text-xs sm:text-sm text-brand-ink">
              <span>{activeProduct.name} (x{quantity})</span>
              <span className="font-bold">{formatPrice(summary.subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-brand-ink-muted">
              <span>Fulfillment Charge:</span>
              <span className="font-medium text-brand-ink">{summary.deliveryChargeNote}</span>
            </div>

            <div className="pt-2 border-t border-brand-ink/10 flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-bold text-brand-ink block">Total Known Amount:</span>
                <span className="text-[10px] text-brand-ink-muted">Payable after WhatsApp confirmation</span>
              </div>
              <span className="text-xl sm:text-2xl font-black text-brand-pink">
                {formatPrice(summary.totalKnownAmount)}
              </span>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="space-y-2.5 pt-1">
            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-xl text-sm sm:text-base font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Order on WhatsApp</span>
            </button>

            <div className="flex items-center justify-between text-xs text-brand-ink-muted pt-1">
              <span>Confirmed manually via WhatsApp</span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-brand-pink hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Formatted Message</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
