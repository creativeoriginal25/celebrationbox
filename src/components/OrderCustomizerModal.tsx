import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Product } from '../types';
import { PRODUCTS } from '../config/products';
import { useCart } from '../context/CartContext';
import { getProductByIdOrSlug } from '../services/catalogService';
import { triggerWhatsAppChat } from '../services/whatsappService';
import { CHECKOUT_CONFIG } from './checkout/checkoutConfig';
import { useCheckoutForm, CheckoutStep } from './checkout/useCheckoutForm';
import { formatOrderWhatsAppMessage, buildWhatsAppUrl } from './checkout/formatWhatsAppMessage';
import { Step1Details } from './checkout/Step1Details';
import { Step2Celebration } from './checkout/Step2Celebration';
import { Step3Review } from './checkout/Step3Review';
import {
  CakeCustomizationState,
  DEFAULT_CAKE_CUSTOMIZATION,
  calculateCakePrice,
} from '../config/chocoloomCakes';

export interface OrderCustomizerModalProps {
  initialProductId?: string;
  initialCakeCustomization?: Partial<CakeCustomizationState>;
  mode?: 'buy-now' | 'cart';
  onClose: () => void;
  onOpenFallback?: (message: string, isConfigured: boolean) => void;
}

export const OrderCustomizerModal: React.FC<OrderCustomizerModalProps> = ({
  initialProductId = 'signature-celebration-box',
  initialCakeCustomization,
  mode = 'buy-now',
  onClose,
  onOpenFallback,
}) => {
  const { items: cartItems, clearCart } = useCart();
  const isCartMode = mode === 'cart' && cartItems.length > 0;

  // Checkout form state machine & draft persistence
  const {
    currentStep,
    formData,
    touched,
    errors,
    isStep1Valid,
    isStep2Valid,
    hasUnsavedChanges,
    setField,
    markTouched,
    setQuantity,
    nextStep,
    prevStep,
    goToStep,
    clearDraft,
  } = useCheckoutForm(initialProductId);

  // Live product data resolution
  const [activeProduct, setActiveProduct] = useState<Product>(() => {
    return (
      PRODUCTS.find((p) => p.id === formData.selectedProductId || p.slug === formData.selectedProductId) ||
      PRODUCTS.find((p) => p.id === CHECKOUT_CONFIG.defaultProductId) ||
      PRODUCTS[0]
    );
  });

  useEffect(() => {
    if (initialCakeCustomization) {
      setField('cakeCustomization', {
        ...DEFAULT_CAKE_CUSTOMIZATION,
        ...initialCakeCustomization,
        includeCake: initialCakeCustomization.includeCake !== false,
      });
    }
  }, [initialCakeCustomization, setField]);

  useEffect(() => {
    let isMounted = true;
    getProductByIdOrSlug(formData.selectedProductId).then((p) => {
      if (isMounted && p) {
        setActiveProduct(p);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [formData.selectedProductId]);

  // Submission & modal UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while modal is mounted
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Trap focus & listen for ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleRequestClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges]);

  const handleRequestClose = () => {
    if (hasUnsavedChanges && !isSubmitting) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    onClose();
  };

  // Submit order to WhatsApp & record in Google Sheets
  const handleConfirmOrder = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const cakePrice = formData.cakeCustomization?.includeCake
      ? calculateCakePrice(formData.cakeCustomization)
      : 0;

    const kitTotal = isCartMode
      ? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      : activeProduct.price * formData.quantity;

    const total = kitTotal + cakePrice;

    let serverOrderId: string | undefined = undefined;
    let validatedCode: string | undefined = formData.referralCode?.trim().toUpperCase();

    // 1. Record order in Google Sheets tracker via secure serverless endpoint
    try {
      const response = await fetch('/api/referral/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          productId: activeProduct.id,
          quantity: formData.quantity,
          deliveryMethod: formData.deliveryMethod,
          deliveryAddress: formData.deliveryAddress,
          personalMessage: formData.personalMessage,
          celebrationDate: formData.celebrationDate,
          preferredTime: formData.preferredTime,
          referralCode: validatedCode || undefined,
          cartItems: isCartMode ? cartItems : undefined,
          cakeCustomization: formData.cakeCustomization,
          totalAmount: total,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.savedToDurableStorage && data.orderId) {
          serverOrderId = data.orderId;
          validatedCode = data.referralCode || validatedCode;
        }
      }
    } catch (apiErr) {
      console.warn('Google Sheets order recording endpoint offline, continuing with WhatsApp direct order:', apiErr);
    }

    // Client fallback ID if durable storage was unconfigured
    if (!serverOrderId) {
      serverOrderId = `CBX-INQ-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    }

    // 2. Format official WhatsApp message with Order ID and Referral Code (if present)
    const formattedMessage = formatOrderWhatsAppMessage({
      productName: activeProduct.name,
      quantity: formData.quantity,
      unitPrice: activeProduct.price,
      total,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      fulfilment: formData.deliveryMethod,
      deliveryAddress: formData.deliveryAddress,
      personalMessage: formData.personalMessage,
      celebrationDate: formData.celebrationDate,
      preferredTime: formData.preferredTime,
      orderId: serverOrderId,
      referralCode: validatedCode || undefined,
      wantsLightingRental: formData.wantsLightingRental,
      cartItems: isCartMode ? cartItems : undefined,
      cakeCustomization: formData.cakeCustomization,
    });

    const waUrl = buildWhatsAppUrl(formattedMessage, CHECKOUT_CONFIG.whatsappNumber);
    setSubmittedUrl(waUrl);
    setSubmitError(null);

    // Festive confetti feedback
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#E91E63', '#FFB400', '#00A8A8', '#FFBE98', '#D8B4E2'],
      });
    } catch {
      // ignore
    }

    // Clear cart & draft after successful order initiation
    if (isCartMode) {
      clearCart();
    }
    clearDraft();

    // Trigger WhatsApp deep link
    try {
      triggerWhatsAppChat(waUrl);
    } catch (err) {
      console.error('Could not trigger WhatsApp link:', err);
      setSubmitError('Unable to open WhatsApp automatically. Please use the button below or copy the message.');
      if (onOpenFallback) {
        onOpenFallback(formattedMessage, true);
      }
    }

    // Auto-close modal after brief grace period so user perceives confirmation
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  // Stepper calculations
  const steps: Array<{ step: CheckoutStep; title: string; shortTitle: string }> = [
    { step: 1, title: 'Your Details', shortTitle: 'Details' },
    { step: 2, title: 'Celebration Details', shortTitle: 'Fulfilment' },
    { step: 3, title: 'Order Review', shortTitle: 'Review' },
  ];

  const progressPercent = currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-brand-ink/65 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      onClick={handleRequestClose}
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full sm:max-w-[560px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-brand-ink/10 text-left max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============================================================== */}
        {/* MOBILE DRAG HANDLE BAR                                         */}
        {/* ============================================================== */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-white shrink-0">
          <div className="w-10 h-1 rounded-full bg-brand-ink/20" />
        </div>

        {/* ============================================================== */}
        {/* COMPACT MODAL HEADER WITH ANIMATED STEPPER                     */}
        {/* ============================================================== */}
        <div className="shrink-0 px-4 sm:px-6 pt-3 sm:pt-4 pb-3 border-b border-brand-ink/10 bg-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-brand-pink">
                  Quick Direct Checkout
                </span>
              </div>
              <h2 id="checkout-modal-title" className="text-lg sm:text-xl font-black text-brand-ink tracking-tight font-display">
                Complete Your Order
              </h2>
            </div>

            <button
              type="button"
              onClick={handleRequestClose}
              className="p-1.5 -mr-1 rounded-xl text-brand-ink-muted hover:text-brand-pink hover:bg-brand-cream-50 transition-colors cursor-pointer"
              aria-label="Close checkout modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-brand-ink/5 h-1 rounded-full overflow-hidden mb-2.5">
              <div
                className="bg-brand-pink h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Stepper Steps (Completed / Active / Upcoming) */}
            <div className="grid grid-cols-3 gap-1">
              {steps.map(({ step, title, shortTitle }) => {
                const isCompleted = currentStep > step;
                const isActive = currentStep === step;
                const isUpcoming = currentStep < step;

                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => isCompleted && goToStep(step)}
                    disabled={isUpcoming}
                    className={`flex items-center gap-1.5 text-left transition-all ${
                      isCompleted ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : isActive
                          ? 'bg-brand-pink text-white shadow-xs ring-2 ring-brand-pink/20'
                          : 'bg-brand-ink/10 text-brand-ink/50'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : `0${step}`}
                    </span>
                    <span
                      className={`text-xs truncate ${
                        isActive
                          ? 'font-bold text-brand-ink'
                          : isCompleted
                          ? 'font-semibold text-brand-ink/80'
                          : 'text-brand-ink-muted'
                      }`}
                    >
                      <span className="hidden sm:inline">{title}</span>
                      <span className="sm:hidden">{shortTitle}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SCROLLABLE STEP BODY (SHOWS ONLY ONE STEP AT A TIME)           */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 overscroll-contain">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
              >
                <Step1Details
                  formData={formData}
                  errors={errors}
                  product={activeProduct}
                  onSetField={setField}
                  onMarkTouched={markTouched}
                  onSetQuantity={setQuantity}
                  isCartMode={isCartMode}
                  cartItemCount={cartItems.length}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Step2Celebration
                  formData={formData}
                  errors={errors}
                  onSetField={setField}
                  onMarkTouched={markTouched}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <Step3Review
                  formData={formData}
                  product={activeProduct}
                  onGoToStep={goToStep}
                  isCartMode={isCartMode}
                  cartItems={cartItems}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ============================================================== */}
        {/* STICKY BOTTOM FOOTER WITH CLEAN SPACING & SAFE-AREA PADDING    */}
        {/* ============================================================== */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 bg-white/95 backdrop-blur-md border-t border-brand-ink/10 z-10 pb-safe">
          
          {/* Submission Feedback Banner */}
          {isSubmitting && (
            <div className="mb-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
                <span className="font-semibold">Opening WhatsApp with your order...</span>
              </div>
              {submittedUrl && (
                <a
                  href={submittedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-brand-pink hover:text-brand-pink-hover shrink-0"
                >
                  Click if not opening
                </a>
              )}
            </div>
          )}

          {submitError && (
            <div className="mb-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Button Layout: Steps 1 & 2 vs Step 3 */}
          {currentStep === 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRequestClose}
                className="py-3 px-4 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold text-brand-ink-muted hover:text-brand-ink hover:bg-brand-cream-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStep1Valid}
                className="flex-1 py-3 px-6 min-h-[44px] rounded-xl text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-brand-pink/20"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={prevStep}
                className="py-3 px-4 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold text-brand-ink hover:bg-brand-cream-50 transition-all flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStep2Valid}
                className="flex-1 py-3 px-6 min-h-[44px] rounded-xl text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-brand-pink/20"
              >
                <span>Continue to Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="py-3 px-4 min-h-[48px] rounded-xl text-xs sm:text-sm font-semibold text-brand-ink hover:bg-brand-cream-50 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-6 min-h-[48px] rounded-xl text-sm sm:text-base font-bold text-white bg-brand-pink hover:bg-brand-pink-hover disabled:opacity-80 shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-4 focus:ring-brand-pink/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Opening WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5 fill-white/20" />
                      <span>Confirm Order on WhatsApp</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Line Below CTA */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-ink-muted text-center pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>You&apos;ll chat directly with our team. No payment is taken here.</span>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* UNSAVED CHANGES CONFIRMATION MODAL OVERLAY                     */}
        {/* ============================================================== */}
        {showExitConfirm && (
          <div className="absolute inset-0 z-50 bg-brand-ink/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-brand-ink/10 text-center space-y-3">
              <h4 className="text-sm font-bold text-brand-ink">
                Discard Order Details?
              </h4>
              <p className="text-xs text-brand-ink-muted">
                You have unsaved details in this order. Your draft will stay saved in your browser.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-brand-cream-50 text-brand-ink hover:bg-brand-cream-100 transition-colors cursor-pointer"
                >
                  Keep Editing
                </button>
                <button
                  type="button"
                  onClick={handleConfirmExit}
                  className="flex-1 py-2 rounded-xl text-xs font-bold bg-brand-pink text-white hover:bg-brand-pink-hover transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
