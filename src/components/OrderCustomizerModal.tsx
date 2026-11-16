import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  Copy,
  Check,
  AlertCircle,
  Info,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Sparkles,
  ShoppingBag,
  ExternalLink,
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
  buildWhatsAppLink,
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
  const [selectedTheme, setSelectedTheme] = useState<string>('Pastel Pop');
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

  // Active product details
  const activeProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[1];
  const activeTheme = AVAILABLE_THEMES.find((t) => t.name === selectedTheme) || AVAILABLE_THEMES[0];
  const subtotal = calculateSubtotal(activeProduct.price, quantity);
  const summary = getOrderSummary({
    productPrice: activeProduct.price,
    quantity,
    deliveryMethod,
  });

  // Check if target number is configured
  const effectiveNumber = customWhatsAppOverride || BUSINESS_CONFIG.whatsappNumber;
  const configured = isWhatsAppConfigured(effectiveNumber);

  // Set min date to today
  const todayString = new Date().toISOString().split('T')[0];

  // Pre-fill next day by default if empty
  useEffect(() => {
    if (!celebrationDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setCelebrationDate(tomorrow.toISOString().split('T')[0]);
    }
  }, []);

  // Update product if initialProductId changes
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
      // Scroll to first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Save order history locally
    saveOrderToLocalHistory(currentOrderDetails);

    // Prepare WhatsApp Message
    const payload = prepareWhatsAppOrder(currentOrderDetails, effectiveNumber);

    // If WhatsApp number is not configured (e.g. 91XXXXXXXXXX default)
    if (!payload.isConfigured) {
      onOpenFallback(payload.formattedMessage, false);
      return;
    }

    // Trigger celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E91E63', '#FFB400', '#00A8A8', '#FFBE98', '#D8B4E2'],
      });
    } catch (e) {
      // ignore
    }

    // Open WhatsApp
    const opened = window.open(payload.waMeUrl, '_blank', 'noopener,noreferrer');
    if (!opened) {
      // If browser blocked popup or WhatsApp unavailable, open fallback modal
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-brand-ink/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div
        className="relative w-full max-w-3xl my-6 glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-white text-left max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-ink/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-pink/15 text-brand-pink flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-ink">
                Customize Your Celebration Box
              </h2>
              <p className="text-xs text-brand-ink-muted">
                Fast WhatsApp-assisted booking • Direct student coordination
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-brand-ink-muted hover:text-brand-pink hover:bg-white/80 transition-colors"
            aria-label="Close customizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Setup Notice (Displayed if VITE_WHATSAPP_NUMBER is unconfigured) */}
        {!configured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 text-xs space-y-2">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">WhatsApp Business Number Notice:</span>
                <span>
                  The business WhatsApp number is currently set to the placeholder{' '}
                  <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-950 font-mono">
                    {effectiveNumber || 'VITE_WHATSAPP_NUMBER'}
                  </code>
                  . You can still test ordering! Click below to enter your test phone number or test the copy-message fallback.
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowConfigHelper(!showConfigHelper)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-200/80 hover:bg-amber-300 font-bold text-amber-900 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{showConfigHelper ? 'Hide Test Number Setting' : 'Enter Test WhatsApp Number'}</span>
              </button>
            </div>

            {showConfigHelper && (
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Enter 10 or 12 digit WhatsApp number (e.g. 919876543210)"
                  value={customWhatsAppOverride}
                  onChange={(e) => setCustomWhatsAppOverride(e.target.value)}
                  className="w-full sm:w-80 px-3 py-1.5 rounded-lg border border-amber-300 bg-white text-xs font-mono"
                />
              </div>
            )}
          </div>
        )}

        {/* Order Customization Form */}
        <form onSubmit={handleOrderSubmit} className="space-y-6">
          
          {/* 1. SELECT PRODUCT */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2.5">
              1. Select Your Box
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {PRODUCTS.map((prod) => {
                const isSelected = selectedProductId === prod.id;
                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProductId(prod.id)}
                    className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border-2 relative flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-brand-pink bg-brand-pink-50/50 shadow-sm'
                        : 'border-white/80 bg-white/60 hover:bg-white hover:border-brand-ink/20'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl bg-brand-cream shrink-0 p-1 flex items-center justify-center border border-brand-ink/10">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-brand-ink truncate">{prod.name}</h4>
                        <span className="text-sm font-black text-brand-pink">{formatPrice(prod.price)}</span>
                      </div>
                      <p className="text-[11px] text-brand-ink-muted line-clamp-1 mt-0.5">{prod.tagline}</p>
                      <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-teal/15 text-brand-teal">
                        {prod.inclusions.length} Party Essentials Inside
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-brand-pink bg-brand-pink text-white' : 'border-brand-ink/30'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. QUANTITY & THEME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Quantity */}
            <div className="glass-panel p-4 rounded-2xl">
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center font-extrabold text-brand-ink disabled:opacity-40 hover:bg-white active:scale-95 transition-all"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="text-xl font-black text-brand-ink w-8 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center font-extrabold text-brand-ink disabled:opacity-40 hover:bg-white active:scale-95 transition-all"
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span className="text-xs text-brand-ink-muted">
                  (= {formatPrice(subtotal)})
                </span>
              </div>
            </div>

            {/* Theme Selector (Pastel Pop only) */}
            <div className="glass-panel p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                  Celebration Theme
                </label>
                <span className="text-[10px] font-bold text-brand-teal uppercase">Initial Launch</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-brand-pink/40 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-1">
                      {activeTheme.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-4 h-4 rounded-full border border-white shadow-xs"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-brand-ink">{activeTheme.name}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-brand-ink-muted italic">
                  Peach, lilac & cream palette. Additional themes coming soon!
                </p>
              </div>
            </div>

          </div>

          {/* 3. CUSTOMER DETAILS */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2.5">
              2. Your Contact Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-brand-ink mb-1">
                  Your Full Name *
                </label>
                <input
                  id="field-customerName"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl glass-panel text-sm text-brand-ink placeholder:text-brand-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-pink ${
                    errors.customerName ? 'border-rose-500 bg-rose-50/50' : 'border-white/80'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-xs text-rose-500 mt-1">{errors.customerName}</p>
                )}
              </div>

              {/* WhatsApp Phone */}
              <div>
                <label className="block text-xs font-medium text-brand-ink mb-1">
                  WhatsApp Mobile Number *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-xs font-bold text-brand-ink-muted">
                    +91
                  </span>
                  <input
                    id="field-customerPhone"
                    type="tel"
                    placeholder="98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl glass-panel text-sm text-brand-ink placeholder:text-brand-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-pink ${
                      errors.customerPhone ? 'border-rose-500 bg-rose-50/50' : 'border-white/80'
                    }`}
                  />
                </div>
                {errors.customerPhone && (
                  <p className="text-xs text-rose-500 mt-1">{errors.customerPhone}</p>
                )}
              </div>

            </div>
          </div>

          {/* 4. DATE & TIME */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2.5">
              3. Celebration Schedule
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-brand-ink mb-1">
                  Celebration Date *
                </label>
                <div className="relative">
                  <input
                    id="field-celebrationDate"
                    type="date"
                    min={todayString}
                    value={celebrationDate}
                    onChange={(e) => setCelebrationDate(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl glass-panel text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink ${
                      errors.celebrationDate ? 'border-rose-500 bg-rose-50/50' : 'border-white/80'
                    }`}
                  />
                </div>
                {errors.celebrationDate && (
                  <p className="text-xs text-rose-500 mt-1">{errors.celebrationDate}</p>
                )}
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-xs font-medium text-brand-ink mb-1">
                  Preferred Pickup / Delivery Slot *
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass-panel text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink border-white/80"
                >
                  <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                  <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
                  <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                  <option value="Night (7:00 PM - 9:00 PM)">Night (7:00 PM - 9:00 PM)</option>
                </select>
              </div>

            </div>
          </div>

          {/* 5. DELIVERY OR PICKUP */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2.5">
              4. Fulfillment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* College Pickup */}
              <div
                onClick={() => setDeliveryMethod('pickup')}
                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                  deliveryMethod === 'pickup'
                    ? 'border-brand-teal bg-brand-teal-50/50 shadow-sm'
                    : 'border-white/80 bg-white/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-brand-teal" />
                    <span className="text-sm font-bold text-brand-ink">College Pickup</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    FREE
                  </span>
                </div>
                <p className="text-xs text-brand-ink-muted">
                  Collect near campus gate/student centre in Bhimavaram. Zero delivery charge.
                </p>
                <p className="text-[11px] font-semibold text-brand-teal mt-2">
                  "Pickup details will be shared after order confirmation."
                </p>
              </div>

              {/* Nearby Delivery */}
              <div
                onClick={() => setDeliveryMethod('delivery')}
                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all ${
                  deliveryMethod === 'delivery'
                    ? 'border-brand-pink bg-brand-pink-50/50 shadow-sm'
                    : 'border-white/80 bg-white/60 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-pink" />
                    <span className="text-sm font-bold text-brand-ink">Nearby Delivery</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Bhimavaram Area
                  </span>
                </div>
                <p className="text-xs text-brand-ink-muted">
                  Doorstep drop to your room, PG, or home in Bhimavaram town.
                </p>
                <p className="text-[11px] font-semibold text-brand-pink mt-2">
                  "Delivery charges will be confirmed through WhatsApp."
                </p>
              </div>

            </div>

            {/* Delivery Address Field (if Delivery is selected) */}
            {deliveryMethod === 'delivery' && (
              <div className="mt-3.5">
                <label className="block text-xs font-medium text-brand-ink mb-1">
                  Delivery Address & Landmark in Bhimavaram *
                </label>
                <textarea
                  id="field-deliveryAddress"
                  rows={2}
                  placeholder="e.g. Room 204, Royal Men's PG, near SRKR Engineering College, Chinna Amiram, Bhimavaram"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl glass-panel text-sm text-brand-ink placeholder:text-brand-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-pink ${
                    errors.deliveryAddress ? 'border-rose-500 bg-rose-50/50' : 'border-white/80'
                  }`}
                />
                {errors.deliveryAddress && (
                  <p className="text-xs text-rose-500 mt-1">{errors.deliveryAddress}</p>
                )}
              </div>
            )}
          </div>

          {/* 6. OPTIONAL BIRTHDAY MESSAGE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-1">
              5. Birthday Message or Note (Optional)
            </label>
            <p className="text-[11px] text-brand-ink-muted mb-2">
              Tell us who you're celebrating or any special request to tuck into the box!
            </p>
            <input
              type="text"
              placeholder="e.g. 'Happy 21st Birthday Sneha! You are the best friend ever!'"
              value={birthdayMessage}
              onChange={(e) => setBirthdayMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl glass-panel text-sm text-brand-ink placeholder:text-brand-ink-subtle focus:outline-none focus:ring-2 focus:ring-brand-pink border-white/80"
            />
          </div>

          {/* ORDER SUMMARY & PRICING BREAKDOWN */}
          <div className="p-5 rounded-2xl glass-panel border border-brand-ink/10 space-y-2.5 bg-gradient-to-br from-white/90 to-brand-cream-100/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink-muted">
              Live Order Breakdown
            </h4>

            <div className="flex items-center justify-between text-sm text-brand-ink">
              <span>
                {activeProduct.name} (x{quantity})
              </span>
              <span className="font-bold">{formatPrice(summary.subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-brand-ink-muted">
              <span>Fulfillment Charge:</span>
              <span className="font-medium text-brand-ink">{summary.deliveryChargeNote}</span>
            </div>

            <div className="pt-2 border-t border-brand-ink/10 flex items-center justify-between">
              <div>
                <span className="text-sm font-extrabold text-brand-ink block">Total Known Amount:</span>
                <span className="text-[11px] text-brand-ink-muted">Payable after WhatsApp confirmation</span>
              </div>
              <span className="text-2xl font-black text-brand-pink">
                {formatPrice(summary.totalKnownAmount)}
              </span>
            </div>
          </div>

          {/* SUBMIT BUTTONS */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl text-base font-extrabold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-lg shadow-brand-pink/25 hover:shadow-xl hover:shadow-brand-pink/35 active:scale-98 transition-all flex items-center justify-center gap-2.5"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Order on WhatsApp</span>
            </button>

            <div className="flex items-center justify-between gap-3 text-xs text-brand-ink-muted">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-brand-ink-muted" />
                <span>Orders confirmed manually by founder</span>
              </span>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="inline-flex items-center gap-1 text-brand-pink hover:underline font-semibold"
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

