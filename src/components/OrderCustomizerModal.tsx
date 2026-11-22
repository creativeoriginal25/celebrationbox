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
  Calendar,
  Clock,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { OrderDetails, CartOrderDetails, DeliveryMethod, Product } from '../types';
import { PRODUCTS, AVAILABLE_THEMES } from '../config/products';
import { BUSINESS_CONFIG, isWhatsAppConfigured } from '../config/business';
import { formatPrice, calculateSubtotal } from '../utils/currency';
import { validateOrderForm, ValidationErrors } from '../utils/validation';
import {
  generateWhatsAppOrderMessage,
  generateCartWhatsAppOrderMessage,
  prepareWhatsAppOrder,
  prepareCartWhatsAppOrder,
  triggerWhatsAppChat,
} from '../services/whatsappService';
import { saveOrderToLocalHistory, getOrderSummary } from '../services/orderService';
import { getProductByIdOrSlug } from '../services/catalogService';
import { useCart } from '../context/CartContext';

interface OrderCustomizerModalProps {
  initialProductId?: string;
  mode?: 'buy-now' | 'cart';
  onClose: () => void;
  onOpenFallback: (message: string, isConfigured: boolean) => void;
}

const TIME_SLOTS = [
  'Morning (10:00 AM - 1:00 PM)',
  'Afternoon (1:00 PM - 4:00 PM)',
  'Evening (4:00 PM - 7:00 PM)',
  'Night (7:00 PM - 9:00 PM)',
];

export const OrderCustomizerModal: React.FC<OrderCustomizerModalProps> = ({
  initialProductId = 'signature-celebration-box',
  mode = 'buy-now',
  onClose,
  onOpenFallback,
}) => {
  const { items: cartItems, clearCart } = useCart();
  const isCartMode = mode === 'cart' && cartItems.length > 0;

  // Single-product Buy Now state
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedTheme] = useState<string>(AVAILABLE_THEMES[0]?.name || 'Pink × Lavender × Rose Gold');

  // Customer & celebration fields
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [celebrationDate, setCelebrationDate] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState<string>('Evening (4:00 PM - 7:00 PM)');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [birthdayMessage, setBirthdayMessage] = useState<string>('');

  // UI state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showConfigHelper, setShowConfigHelper] = useState<boolean>(false);
  const [customWhatsAppOverride, setCustomWhatsAppOverride] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState<boolean>(false);

  // Live verified product data
  const [activeProduct, setActiveProduct] = useState<Product>(() => {
    return PRODUCTS.find((p) => p.id === selectedProductId || p.slug === selectedProductId) || PRODUCTS[1] || PRODUCTS[0];
  });

  useEffect(() => {
    let isMounted = true;
    getProductByIdOrSlug(selectedProductId).then((p) => {
      if (isMounted && p) {
        setActiveProduct(p);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedProductId]);

  const activeTheme = AVAILABLE_THEMES.find((t) => t.name === selectedTheme) || AVAILABLE_THEMES[0];

  const subtotal = isCartMode
    ? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : calculateSubtotal(activeProduct.price, quantity);

  const summary = getOrderSummary({
    productPrice: isCartMode ? subtotal : activeProduct.price,
    quantity: isCartMode ? 1 : quantity,
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

  const currentCartOrderDetails: CartOrderDetails = {
    items: cartItems,
    customerName,
    customerPhone,
    celebrationDate,
    preferredTime,
    deliveryMethod,
    deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
    birthdayMessage: birthdayMessage ? birthdayMessage : undefined,
  };

  const handleOrderSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitAttempted(true);

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

    if (!isCartMode) {
      saveOrderToLocalHistory(currentOrderDetails);
    }

    const payload = isCartMode
      ? prepareCartWhatsAppOrder(currentCartOrderDetails, effectiveNumber)
      : prepareWhatsAppOrder(currentOrderDetails, effectiveNumber);

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

    if (isCartMode) {
      clearCart();
    }

    setSubmittedUrl(payload.waMeUrl);
    setIsSubmitting(true);

    // Launch WhatsApp directly
    triggerWhatsAppChat(payload.waMeUrl);

    // Close modal after brief delay so user sees confirmation and browser navigation begins cleanly
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleCopyMessage = () => {
    const message = isCartMode
      ? generateCartWhatsAppOrderMessage(currentCartOrderDetails)
      : generateWhatsAppOrderMessage(currentOrderDetails);
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Progress step completion indicators
  const isStep1Done = customerName.trim().length >= 2 && customerPhone.trim().length >= 10;
  const isStep2Done = Boolean(celebrationDate && preferredTime && (deliveryMethod === 'pickup' || deliveryAddress.trim().length >= 5));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-brand-ink/65 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[760px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-brand-ink/10 text-left max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================== */}
        {/* MODAL HEADER                                                   */}
        {/* ============================================================== */}
        <div className="shrink-0 px-5 sm:px-8 pt-5 sm:pt-6 pb-4 border-b border-brand-ink/10 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-pink" />
                <span className="text-[11px] font-bold tracking-wider uppercase text-brand-pink">
                  Quick Direct Checkout
                </span>
              </div>
              <h2 id="checkout-modal-title" className="text-xl sm:text-2xl font-black text-brand-ink mt-0.5 tracking-tight font-display">
                Complete Your Order
              </h2>
              <p className="text-xs sm:text-sm text-brand-ink-muted mt-0.5">
                A few details and your celebration box is on its way.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-1 -mt-1 rounded-xl text-brand-ink-muted hover:text-brand-pink hover:bg-brand-cream-50 transition-colors cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Compact 3-Step Progress Indicator */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-brand-ink/5">
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  isStep1Done
                    ? 'bg-emerald-500 text-white'
                    : 'bg-brand-pink/10 text-brand-pink'
                }`}
              >
                {isStep1Done ? <Check className="w-3 h-3 stroke-[3]" /> : '01'}
              </span>
              <span className={`text-[11px] sm:text-xs font-semibold truncate ${
                isStep1Done ? 'text-brand-ink font-bold' : 'text-brand-ink'
              }`}>
                Your Details
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  isStep2Done
                    ? 'bg-emerald-500 text-white'
                    : isStep1Done
                    ? 'bg-brand-pink/10 text-brand-pink'
                    : 'bg-brand-ink/5 text-brand-ink/50'
                }`}
              >
                {isStep2Done ? <Check className="w-3 h-3 stroke-[3]" /> : '02'}
              </span>
              <span className={`text-[11px] sm:text-xs font-semibold truncate ${
                isStep2Done ? 'text-brand-ink font-bold' : isStep1Done ? 'text-brand-ink' : 'text-brand-ink/60'
              }`}>
                Celebration Details
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  isStep1Done && isStep2Done
                    ? 'bg-brand-teal text-white'
                    : 'bg-brand-ink/5 text-brand-ink/50'
                }`}
              >
                03
              </span>
              <span className={`text-[11px] sm:text-xs font-semibold truncate ${
                isStep1Done && isStep2Done ? 'text-brand-ink font-bold' : 'text-brand-ink/60'
              }`}>
                Order Review
              </span>
            </div>
          </div>

          {/* Selected Product Pill / Top Summary */}
          <div className="mt-3.5 p-2.5 sm:p-3 rounded-xl bg-brand-cream-50/80 border border-brand-ink/10 flex items-center justify-between gap-3">
            {isCartMode ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white border border-brand-ink/10 flex items-center justify-center text-brand-pink shrink-0">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-brand-ink truncate">
                    {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} in Your Cart
                  </p>
                  <p className="text-[11px] text-brand-ink-muted truncate">
                    {cartItems.map((i) => `${i.name} (${i.quantity})`).join(', ')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  className="w-9 h-9 rounded-lg object-contain bg-white border border-brand-ink/10 shrink-0 p-0.5"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-brand-ink truncate">
                      {activeProduct.name}
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-teal/10 text-brand-teal shrink-0">
                      Qty: {quantity}
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-ink-muted truncate">
                    {formatPrice(activeProduct.price)} each • {activeTheme.name} Theme
                  </p>
                </div>
              </div>
            )}

            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink-muted block">
                Subtotal
              </span>
              <span className="text-sm sm:text-base font-black text-brand-pink">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SCROLLABLE MODAL BODY                                          */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 space-y-6 overscroll-contain">
          {/* WhatsApp Setup Notice (Displayed if placeholder) */}
          {!configured && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">WhatsApp Setup Notice:</span>
                  <span className="block mt-0.5">
                    Business WhatsApp is currently a placeholder (<code>{effectiveNumber || '91XXXXXXXXXX'}</code>). You can test ordering with a test number below or copy the formatted text.
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

          {/* BUY NOW PRODUCT PICKER (Allow switching/adjusting quantity for Buy Now) */}
          {!isCartMode && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink">
                  Selected Celebration Box
                </label>
                <div className="flex items-center gap-1 text-[11px] text-brand-ink-muted">
                  <span>Theme:</span>
                  <span className="font-bold text-brand-ink">{activeTheme.name}</span>
                </div>
              </div>

              <div className={`grid grid-cols-1 ${PRODUCTS.filter((p) => p.active !== false).length > 1 ? 'sm:grid-cols-2' : ''} gap-3`}>
                {PRODUCTS.filter((p) => p.active !== false).map((prod) => {
                  const isSelected = selectedProductId === prod.id;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProductId(prod.id)}
                      className={`cursor-pointer rounded-xl p-3 border-2 transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-brand-pink bg-brand-pink-50/40 shadow-xs ring-1 ring-brand-pink/20'
                          : 'border-brand-ink/10 bg-white hover:border-brand-ink/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 object-contain rounded-lg bg-brand-cream-50 p-1 border border-brand-ink/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-brand-ink truncate">
                            {prod.name}
                          </h4>
                          <p className="text-[11px] font-black text-brand-pink">
                            {formatPrice(prod.price)}
                          </p>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-brand-pink text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-brand-ink-muted hover:text-brand-pink shrink-0">
                          Select
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quantity Adjuster */}
              <div className="mt-3 p-3 rounded-xl bg-brand-cream-50/80 border border-brand-ink/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-ink block">Quantity</span>
                  <span className="text-[11px] text-brand-ink-muted">Need boxes for multiple celebrations?</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-white border border-brand-ink/15 flex items-center justify-center font-bold text-brand-ink disabled:opacity-30 hover:bg-brand-cream-100 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-black text-brand-ink w-6 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="w-8 h-8 rounded-lg bg-white border border-brand-ink/15 flex items-center justify-center font-bold text-brand-ink disabled:opacity-30 hover:bg-brand-cream-100 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION 1: CUSTOMER DETAILS                                    */}
          {/* ============================================================== */}
          <div className="pt-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-brand-ink/5 text-brand-ink flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                Your Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="field-customerName" className="block text-xs font-semibold text-brand-ink mb-1">
                  Full Name <span className="text-brand-pink">*</span>
                </label>
                <input
                  id="field-customerName"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: undefined }));
                  }}
                  className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm text-brand-ink transition-all placeholder:text-brand-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 ${
                    errors.customerName
                      ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/20'
                      : 'border-brand-ink/15 bg-white hover:border-brand-ink/30 focus:border-brand-pink'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label htmlFor="field-customerPhone" className="block text-xs font-semibold text-brand-ink mb-1">
                  WhatsApp Mobile Number <span className="text-brand-pink">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-brand-ink-muted select-none pointer-events-none">
                    +91
                  </span>
                  <input
                    id="field-customerPhone"
                    type="tel"
                    inputMode="tel"
                    placeholder="98765 43210"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (errors.customerPhone) setErrors((prev) => ({ ...prev, customerPhone: undefined }));
                    }}
                    className={`w-full pl-11 pr-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm text-brand-ink transition-all placeholder:text-brand-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 ${
                      errors.customerPhone
                        ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/20'
                        : 'border-brand-ink/15 bg-white hover:border-brand-ink/30 focus:border-brand-pink'
                    }`}
                  />
                </div>
                {errors.customerPhone && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.customerPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 2: CELEBRATION SCHEDULE                                */}
          {/* ============================================================== */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-brand-ink/5 text-brand-ink flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                Celebration Schedule
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="field-celebrationDate" className="block text-xs font-semibold text-brand-ink mb-1">
                  Celebration Date <span className="text-brand-pink">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="field-celebrationDate"
                    type="date"
                    min={todayString}
                    value={celebrationDate}
                    onChange={(e) => {
                      setCelebrationDate(e.target.value);
                      if (errors.celebrationDate) setErrors((prev) => ({ ...prev, celebrationDate: undefined }));
                    }}
                    className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm text-brand-ink transition-all focus:outline-none focus:ring-2 focus:ring-brand-pink/30 ${
                      errors.celebrationDate
                        ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/20'
                        : 'border-brand-ink/15 bg-white hover:border-brand-ink/30 focus:border-brand-pink'
                    }`}
                  />
                </div>
                {errors.celebrationDate && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.celebrationDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="field-preferredTime" className="block text-xs font-semibold text-brand-ink mb-1">
                  Preferred Time Slot <span className="text-brand-pink">*</span>
                </label>
                <div className="relative flex items-center">
                  <select
                    id="field-preferredTime"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border border-brand-ink/15 bg-white text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink cursor-pointer transition-all"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 3: FULFILMENT METHOD                                   */}
          {/* ============================================================== */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-brand-ink/5 text-brand-ink flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                How Would You Like to Receive Your Box?
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* CARD 1: COLLEGE CAMPUS PICKUP */}
              <div
                onClick={() => {
                  setDeliveryMethod('pickup');
                  if (errors.deliveryAddress) setErrors((prev) => ({ ...prev, deliveryAddress: undefined }));
                }}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col justify-between text-left relative ${
                  deliveryMethod === 'pickup'
                    ? 'border-brand-teal bg-teal-50/60 shadow-xs ring-1 ring-brand-teal/20'
                    : 'border-brand-ink/10 bg-white hover:border-brand-ink/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      FREE
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-brand-ink">
                    College Campus Pickup
                  </h4>
                  <p className="text-xs text-brand-ink-muted mt-1 leading-relaxed">
                    Collect your order from the agreed campus pickup point.
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-brand-ink/5 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-brand-teal">
                    Campus gate pickup
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      deliveryMethod === 'pickup'
                        ? 'bg-brand-teal text-white'
                        : 'border border-brand-ink/20'
                    }`}
                  >
                    {deliveryMethod === 'pickup' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>

              {/* CARD 2: NEARBY DELIVERY */}
              <div
                onClick={() => setDeliveryMethod('delivery')}
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all flex flex-col justify-between text-left relative ${
                  deliveryMethod === 'delivery'
                    ? 'border-brand-pink bg-pink-50/60 shadow-xs ring-1 ring-brand-pink/20'
                    : 'border-brand-ink/10 bg-white hover:border-brand-ink/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Charge confirmed separately
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-brand-ink">
                    Nearby Delivery
                  </h4>
                  <p className="text-xs text-brand-ink-muted mt-1 leading-relaxed">
                    Get your celebration box delivered to your hostel, room or home in Bhimavaram.
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-brand-ink/5 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-brand-pink">
                    Bhimavaram town only
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      deliveryMethod === 'delivery'
                        ? 'bg-brand-pink text-white'
                        : 'border border-brand-ink/20'
                    }`}
                  >
                    {deliveryMethod === 'delivery' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </div>
            </div>

            {/* FULFILMENT CONDITIONAL NOTES & ADDRESS INPUT */}
            <AnimatePresence mode="wait">
              {deliveryMethod === 'pickup' ? (
                <motion.div
                  key="pickup-note"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="mt-3 p-3 rounded-xl bg-teal-50/80 border border-brand-teal/20 text-xs text-teal-900 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                  <div className="leading-snug">
                    <span className="font-bold">Campus Pickup Confirmed:</span>{' '}
                    <span>Pickup details will be shared after order confirmation. Free campus gate collection in Bhimavaram.</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="delivery-address-block"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 space-y-2 overflow-hidden"
                >
                  <div>
                    <label htmlFor="field-deliveryAddress" className="block text-xs font-semibold text-brand-ink mb-1">
                      Delivery Address & Landmark in Bhimavaram <span className="text-brand-pink">*</span>
                    </label>
                    <textarea
                      id="field-deliveryAddress"
                      rows={2}
                      placeholder="e.g. Room 204, Royal Men's PG, near SRKR Engineering College, Chinna Amiram, Bhimavaram"
                      value={deliveryAddress}
                      onChange={(e) => {
                        setDeliveryAddress(e.target.value);
                        if (errors.deliveryAddress) setErrors((prev) => ({ ...prev, deliveryAddress: undefined }));
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-brand-ink transition-all placeholder:text-brand-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 ${
                        errors.deliveryAddress
                          ? 'border-rose-500 bg-rose-50/20 ring-1 ring-rose-500/20'
                          : 'border-brand-ink/15 bg-white hover:border-brand-ink/30 focus:border-brand-pink'
                      }`}
                    />
                    {errors.deliveryAddress && (
                      <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.deliveryAddress}</p>
                    )}
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Delivery charges will be confirmed through WhatsApp.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ============================================================== */}
          {/* SECTION 4: PERSONAL BIRTHDAY MESSAGE (OPTIONAL)                 */}
          {/* ============================================================== */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="field-birthdayMessage" className="block text-xs font-bold uppercase tracking-wider text-brand-ink">
                Add a Personal Message
              </label>
              <span className="text-[11px] font-semibold text-brand-ink-muted">Optional</span>
            </div>
            <textarea
              id="field-birthdayMessage"
              rows={2}
              placeholder="e.g. Happy 21st Birthday Sneha! Have the best day ever."
              value={birthdayMessage}
              onChange={(e) => setBirthdayMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-ink/15 bg-white text-sm text-brand-ink placeholder:text-brand-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink transition-all"
            />
          </div>

          {/* ============================================================== */}
          {/* SECTION 5: YOUR ORDER SUMMARY                                  */}
          {/* ============================================================== */}
          <div className="p-4 sm:p-5 rounded-2xl bg-brand-cream-50/90 border border-brand-ink/10 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                Your Order Summary
              </h4>
              <span className="text-[11px] font-semibold text-brand-ink-muted">
                {isCartMode ? `${cartItems.length} items` : '1 item'}
              </span>
            </div>

            <div className="space-y-2 pt-1 border-t border-brand-ink/5">
              {isCartMode ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm text-brand-ink">
                    <div className="min-w-0 pr-2">
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-brand-ink-muted text-xs block">
                        Qty: {item.quantity} • {formatPrice(item.price)} each
                      </span>
                    </div>
                    <span className="font-bold text-brand-ink shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-between text-xs sm:text-sm text-brand-ink">
                  <div>
                    <span className="font-semibold">{activeProduct.name}</span>
                    <span className="text-brand-ink-muted text-xs block">
                      Quantity: {quantity} • {formatPrice(activeProduct.price)} each
                    </span>
                  </div>
                  <span className="font-bold text-brand-ink shrink-0">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              )}

              {/* Fulfilment Line */}
              <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-brand-ink/5">
                <span className="text-brand-ink">
                  {deliveryMethod === 'pickup' ? 'College Campus Pickup' : 'Nearby Delivery'}:
                </span>
                <span className={`font-bold ${deliveryMethod === 'pickup' ? 'text-brand-teal' : 'text-amber-700'}`}>
                  {deliveryMethod === 'pickup' ? 'FREE' : 'To be confirmed'}
                </span>
              </div>

              {deliveryMethod === 'delivery' && (
                <p className="text-[11px] text-brand-ink-muted italic">
                  Delivery charges will be confirmed through WhatsApp.
                </p>
              )}
            </div>

            {/* Total Known Amount */}
            <div className="pt-3 border-t border-brand-ink/10 flex items-end justify-between">
              <div>
                <span className="text-xs sm:text-sm font-black text-brand-ink block">
                  {isCartMode ? 'Total Product Value:' : 'Total Known Amount:'}
                </span>
                <span className="text-[11px] text-brand-ink-muted">
                  Payable after WhatsApp confirmation
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-brand-pink tracking-tight block">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* STICKY BOTTOM MODAL FOOTER                                     */}
        {/* ============================================================== */}
        <div className="shrink-0 px-5 sm:px-8 py-3.5 sm:py-4 bg-white/95 backdrop-blur-md border-t border-brand-ink/10 z-10">
          {/* Validation Warning Alert if user tried to submit with missing fields */}
          {submitAttempted && Object.keys(errors).length > 0 && (
            <div className="mb-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Please enter your Full Name and WhatsApp Mobile Number above to continue to WhatsApp.</span>
            </div>
          )}

          {/* Success / Launch Status Banner */}
          {isSubmitting && (
            <div className="mb-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
                <span className="font-semibold">Opening WhatsApp with your order details...</span>
              </div>
              {submittedUrl && (
                <a
                  href={submittedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-brand-pink hover:text-brand-pink-hover shrink-0"
                >
                  Click here if not opening
                </a>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleOrderSubmit}
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 min-h-[48px] rounded-xl text-sm sm:text-base font-bold text-white bg-brand-pink hover:bg-brand-pink-hover disabled:opacity-80 shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-brand-pink/20"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{isSubmitting ? 'Opening WhatsApp...' : 'Confirm Order on WhatsApp'}</span>
          </button>

          <div className="flex items-center justify-between text-[11px] text-brand-ink-muted mt-2 px-1">
            <span>Direct WhatsApp coordination with our team</span>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="text-brand-pink hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Formatted Message</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
