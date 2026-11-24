import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag, Sparkles, Check, ChevronDown } from 'lucide-react';
import { Product } from '../../types';
import { PRODUCTS } from '../../config/products';
import { formatPrice } from '../../utils/currency';
import { FormFields, FormErrors, cleanPhoneDigits } from './useCheckoutForm';

interface Step1DetailsProps {
  formData: FormFields;
  errors: FormErrors;
  product: Product;
  onSetField: <K extends keyof FormFields>(key: K, value: FormFields[K]) => void;
  onMarkTouched: (key: keyof FormFields) => void;
  onSetQuantity: (delta: number) => void;
  isCartMode?: boolean;
  cartItemCount?: number;
}

export const Step1Details: React.FC<Step1DetailsProps> = ({
  formData,
  errors,
  product,
  onSetField,
  onMarkTouched,
  onSetQuantity,
  isCartMode = false,
  cartItemCount = 1,
}) => {
  const [isChangingProduct, setIsChangingProduct] = useState(false);
  const activeProducts = PRODUCTS.filter((p) => p.active !== false);
  const hasMultipleProducts = activeProducts.length > 1;

  const subtotal = product.price * formData.quantity;

  // Referral code live validation state
  const [validatingReferral, setValidatingReferral] = useState(false);
  const [referralStatus, setReferralStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [referralMessage, setReferralMessage] = useState<string | null>(null);

  const handleReferralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase().replace(/\s+/g, '');
    onSetField('referralCode', code);
    if (!code) {
      setReferralStatus('idle');
      setReferralMessage(null);
    } else {
      setReferralStatus('idle');
      setReferralMessage(null);
    }
  };

  const handleValidateReferral = async (codeToVerify?: string) => {
    const code = (codeToVerify ?? formData.referralCode ?? '').trim().toUpperCase();
    if (!code) {
      setReferralStatus('idle');
      setReferralMessage(null);
      return;
    }

    setValidatingReferral(true);
    setReferralMessage(null);

    try {
      const res = await fetch(`/api/referral/validate?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.valid) {
        setReferralStatus('valid');
        setReferralMessage('✓ Referral code applied');
      } else {
        setReferralStatus('invalid');
        setReferralMessage(data.error || 'Invalid or unassigned referral code');
      }
    } catch {
      // Fallback: If network is offline or static preview, check standard pattern
      if (/^CBX-[A-Z0-9]{4}$/i.test(code)) {
        setReferralStatus('valid');
        setReferralMessage('✓ Referral code applied');
      } else {
        setReferralStatus('invalid');
        setReferralMessage('Invalid code format. Expected CBX-XXXX');
      }
    } finally {
      setValidatingReferral(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = cleanPhoneDigits(raw);
    onSetField('customerPhone', digits);
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fadeIn">
      {/* ============================================================== */}
      {/* 1. SINGLE COMPACT PRODUCT BAR                                  */}
      {/* ============================================================== */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FFF8F3] border border-brand-pink/15 shadow-xs transition-all">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {isCartMode ? (
              <div className="w-11 h-11 rounded-xl bg-white border border-brand-pink/20 flex items-center justify-center text-brand-pink shrink-0 shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="w-11 h-11 rounded-xl object-contain bg-white border border-brand-pink/20 shrink-0 p-1 shadow-xs"
              />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-pink">
                  {isCartMode ? 'Cart Order' : 'Selected Celebration Box'}
                </span>
                {!isCartMode && product.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-pink/10 text-brand-pink">
                    {product.badge}
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-brand-ink truncate">
                {isCartMode ? `${cartItemCount} Items in Cart` : product.name}
              </h3>
              <p className="text-xs text-brand-ink-muted">
                {isCartMode ? 'Items curated for celebrations' : `${formatPrice(product.price)} each • Campus favourite`}
              </p>
            </div>
          </div>

          {!isCartMode && hasMultipleProducts && (
            <button
              type="button"
              onClick={() => setIsChangingProduct((prev) => !prev)}
              className="px-2.5 py-1.5 rounded-lg border border-brand-pink/30 bg-white hover:bg-brand-pink-50 text-xs font-bold text-brand-pink transition-all shrink-0 cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <span>{isChangingProduct ? 'Done' : 'Change'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isChangingProduct ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* Change Product Drawer / Dropdown */}
        {isChangingProduct && !isCartMode && (
          <div className="mt-3 pt-3 border-t border-brand-pink/15 space-y-2">
            <p className="text-[11px] font-semibold text-brand-ink-muted">Select an alternate celebration box:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeProducts.map((p) => {
                const isSelected = p.id === product.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSetField('selectedProductId', p.id);
                      setIsChangingProduct(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-brand-pink bg-white shadow-xs ring-1 ring-brand-pink/20'
                        : 'border-brand-ink/10 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-contain bg-brand-cream-50 p-0.5 border border-brand-ink/10 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-brand-ink truncate">{p.name}</p>
                        <p className="text-[11px] font-bold text-brand-pink">{formatPrice(p.price)}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-pink stroke-[2.5] shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. CUSTOMER DETAILS FORM                                       */}
      {/* ============================================================== */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-brand-ink">
            Your Contact Info
          </label>
          <span className="text-[11px] text-brand-ink-muted">For WhatsApp confirmation</span>
        </div>

        {/* Full Name Field */}
        <div>
          <label htmlFor="checkout-customerName" className="block text-xs font-semibold text-brand-ink mb-1">
            Full Name <span className="text-brand-pink">*</span>
          </label>
          <input
            id="checkout-customerName"
            type="text"
            autoComplete="name"
            placeholder="e.g. Rahul Sharma"
            value={formData.customerName}
            onChange={(e) => onSetField('customerName', e.target.value)}
            onBlur={() => onMarkTouched('customerName')}
            className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm text-brand-ink transition-all placeholder:text-brand-ink-muted/50 bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink/25 ${
              errors.customerName
                ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400/20'
                : 'border-brand-ink/15 hover:border-brand-ink/30 focus:border-brand-pink'
            }`}
            aria-invalid={Boolean(errors.customerName)}
            aria-describedby={errors.customerName ? 'customerName-error' : undefined}
          />
          {errors.customerName && (
            <p id="customerName-error" className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1" role="alert">
              <span>⚠️</span> {errors.customerName}
            </p>
          )}
        </div>

        {/* WhatsApp Mobile Number Field */}
        <div>
          <label htmlFor="checkout-customerPhone" className="block text-xs font-semibold text-brand-ink mb-1">
            WhatsApp Mobile Number <span className="text-brand-pink">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-xs font-bold text-brand-ink/70 select-none pointer-events-none">
              🇮🇳 +91
            </span>
            <input
              id="checkout-customerPhone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              placeholder="98765 43210"
              value={formData.customerPhone}
              onChange={handlePhoneChange}
              onBlur={() => onMarkTouched('customerPhone')}
              className={`w-full pl-16 pr-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm text-brand-ink transition-all placeholder:text-brand-ink-muted/50 bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink/25 font-mono ${
                errors.customerPhone
                  ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400/20'
                  : 'border-brand-ink/15 hover:border-brand-ink/30 focus:border-brand-pink'
              }`}
              aria-invalid={Boolean(errors.customerPhone)}
              aria-describedby={errors.customerPhone ? 'customerPhone-error' : undefined}
            />
          </div>
          {errors.customerPhone ? (
            <p id="customerPhone-error" className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1" role="alert">
              <span>⚠️</span> {errors.customerPhone}
            </p>
          ) : (
            <p className="text-[11px] text-brand-ink-muted mt-1">
              We&apos;ll open your order details directly in WhatsApp with this number.
            </p>
          )}
        </div>

        {/* Have a Referral Code Field (Optional) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="checkout-referralCode" className="block text-xs font-semibold text-brand-ink">
              Have a Referral Code?
            </label>
            <span className="text-[10px] text-brand-ink-muted/80">Optional</span>
          </div>
          <div className="relative flex items-center">
            <input
              id="checkout-referralCode"
              type="text"
              autoCapitalize="characters"
              placeholder="Enter referral code (optional)"
              value={formData.referralCode || ''}
              onChange={handleReferralChange}
              onBlur={() => {
                if (formData.referralCode) {
                  handleValidateReferral(formData.referralCode);
                }
              }}
              className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm text-brand-ink transition-all placeholder:text-brand-ink-muted/50 bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink/25 font-mono tracking-wider uppercase pr-20 ${
                referralStatus === 'valid'
                  ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500/20'
                  : referralStatus === 'invalid'
                  ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400/20'
                  : 'border-brand-ink/15 hover:border-brand-ink/30 focus:border-brand-pink'
              }`}
            />
            {formData.referralCode && (
              <button
                type="button"
                onClick={() => handleValidateReferral(formData.referralCode)}
                disabled={validatingReferral}
                className="absolute right-2 px-2.5 py-1 text-xs font-bold rounded-lg text-white bg-brand-pink hover:bg-brand-pink-hover active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              >
                {validatingReferral ? 'Checking...' : 'Apply'}
              </button>
            )}
          </div>
          {referralStatus === 'valid' && referralMessage && (
            <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1" role="status">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> {referralMessage}
            </p>
          )}
          {referralStatus === 'invalid' && referralMessage && (
            <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1" role="alert">
              <span>⚠️</span> {referralMessage}
            </p>
          )}
          {referralStatus === 'idle' && (
            <p className="text-[11px] text-brand-ink-muted mt-1">
              Referred by a friend? Enter their code here.
            </p>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. QUANTITY STEPPER (MIN 1, MAX 10) & LIVE SUBTOTAL            */}
      {/* ============================================================== */}
      {!isCartMode && (
        <div className="p-3.5 rounded-2xl bg-white border border-brand-ink/10 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-brand-ink block">
              Quantity
            </span>
            <span className="text-[11px] text-brand-ink-muted">
              {formData.quantity} × {formatPrice(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-brand-cream-50 rounded-xl p-1 border border-brand-ink/10">
              <button
                type="button"
                onClick={() => onSetQuantity(-1)}
                disabled={formData.quantity <= 1}
                className="w-8 h-8 rounded-lg bg-white border border-brand-ink/15 flex items-center justify-center font-bold text-brand-ink disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-pink-50 hover:text-brand-pink transition-all active:scale-95 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-black text-brand-ink select-none font-mono">
                {formData.quantity}
              </span>
              <button
                type="button"
                onClick={() => onSetQuantity(1)}
                disabled={formData.quantity >= 10}
                className="w-8 h-8 rounded-lg bg-white border border-brand-ink/15 flex items-center justify-center font-bold text-brand-ink disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-pink-50 hover:text-brand-pink transition-all active:scale-95 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-right pl-2 border-l border-brand-ink/10 min-w-[70px]">
              <span className="text-[10px] font-bold uppercase text-brand-ink-muted block">
                Subtotal
              </span>
              <span className="text-sm sm:text-base font-black text-brand-pink">
                {formatPrice(subtotal)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
