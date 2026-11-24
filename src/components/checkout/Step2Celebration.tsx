import React from 'react';
import { Building2, MapPin, Check, CheckCircle2, Calendar, Clock } from 'lucide-react';
import { CHECKOUT_CONFIG } from './checkoutConfig';
import { FormFields, FormErrors, FulfilmentMethod } from './useCheckoutForm';
import { ReferralCodeInput } from './ReferralCodeInput';

interface Step2CelebrationProps {
  formData: FormFields;
  errors: FormErrors;
  onSetField: <K extends keyof FormFields>(key: K, value: FormFields[K]) => void;
  onMarkTouched: (key: keyof FormFields) => void;
}

export const Step2Celebration: React.FC<Step2CelebrationProps> = ({
  formData,
  errors,
  onSetField,
  onMarkTouched,
}) => {
  const todayString = new Date().toISOString().split('T')[0];

  const handleSelectFulfilment = (method: FulfilmentMethod) => {
    onSetField('deliveryMethod', method);
  };

  const messageLength = formData.personalMessage.length;
  const maxMessageLength = 200;

  return (
    <div className="space-y-4 sm:space-y-5 animate-fadeIn">
      {/* ============================================================== */}
      {/* 1. FULFILMENT RADIO CARDS (Campus Pickup vs Nearby Delivery)    */}
      {/* ============================================================== */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-brand-ink">
            How would you like to receive your box?
          </label>
          <span className="text-[11px] text-brand-ink-muted">Select an option</span>
        </div>

        <div
          role="radiogroup"
          aria-label="Fulfilment method options"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {/* OPTION 1: COLLEGE CAMPUS PICKUP */}
          <div
            role="radio"
            tabIndex={0}
            aria-checked={formData.deliveryMethod === 'pickup'}
            onClick={() => handleSelectFulfilment('pickup')}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleSelectFulfilment('pickup');
              }
            }}
            className={`cursor-pointer rounded-2xl p-3.5 sm:p-4 border-2 transition-all flex flex-col justify-between text-left relative min-h-[120px] select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink ${
              formData.deliveryMethod === 'pickup'
                ? 'border-brand-teal bg-[#F0FDF4] shadow-xs ring-1 ring-brand-teal/20'
                : 'border-brand-ink/10 bg-white hover:border-brand-ink/20 hover:bg-[#FFFDFB]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 tracking-wide">
                  FREE
                </span>
              </div>
              <h4 className="text-sm font-bold text-brand-ink leading-snug">
                College Campus Pickup
              </h4>
              <p className="text-xs text-brand-ink-muted mt-0.5">
                Campus gate pickup
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-brand-ink/5 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-brand-teal">
                Popular with students
              </span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  formData.deliveryMethod === 'pickup'
                    ? 'bg-brand-teal text-white'
                    : 'border border-brand-ink/20 bg-white'
                }`}
              >
                {formData.deliveryMethod === 'pickup' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>

          {/* OPTION 2: NEARBY DELIVERY */}
          <div
            role="radio"
            tabIndex={0}
            aria-checked={formData.deliveryMethod === 'delivery'}
            onClick={() => handleSelectFulfilment('delivery')}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleSelectFulfilment('delivery');
              }
            }}
            className={`cursor-pointer rounded-2xl p-3.5 sm:p-4 border-2 transition-all flex flex-col justify-between text-left relative min-h-[120px] select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink ${
              formData.deliveryMethod === 'delivery'
                ? 'border-brand-pink bg-[#FFF8F3] shadow-xs ring-1 ring-brand-pink/20'
                : 'border-brand-ink/10 bg-white hover:border-brand-ink/20 hover:bg-[#FFFDFB]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-brand-pink/10 text-brand-pink flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 tracking-wide">
                  Charge confirmed separately
                </span>
              </div>
              <h4 className="text-sm font-bold text-brand-ink leading-snug">
                Nearby Delivery
              </h4>
              <p className="text-xs text-brand-ink-muted mt-0.5">
                Bhimavaram town only
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-brand-ink/5 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-brand-pink">
                Hostels & rooms
              </span>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  formData.deliveryMethod === 'delivery'
                    ? 'bg-brand-pink text-white'
                    : 'border border-brand-ink/20 bg-white'
                }`}
              >
                {formData.deliveryMethod === 'delivery' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </div>
          </div>
        </div>

        {/* FULFILMENT CONDITIONAL: PICKUP CONFIRMATION NOTE OR DELIVERY ADDRESS */}
        {formData.deliveryMethod === 'pickup' ? (
          <div className="mt-3 p-3 rounded-xl bg-[#F0FDF4] border border-brand-teal/20 text-xs text-teal-900 flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
            <div className="leading-snug">
              <span className="font-bold">Campus Pickup Confirmed:</span>{' '}
              <span>Free college campus pickup at campus gate (Bhimavaram). Exact spot coordinated on WhatsApp.</span>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-2 animate-fadeIn">
            <div>
              <label htmlFor="checkout-deliveryAddress" className="block text-xs font-semibold text-brand-ink mb-1">
                Delivery Address & Landmark <span className="text-brand-pink">*</span>
              </label>
              <textarea
                id="checkout-deliveryAddress"
                rows={2}
                placeholder="e.g. Room 204, Royal Men's PG, near SRKR Engineering College, Chinna Amiram, Bhimavaram"
                value={formData.deliveryAddress}
                onChange={(e) => onSetField('deliveryAddress', e.target.value)}
                onBlur={() => onMarkTouched('deliveryAddress')}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-brand-ink transition-all placeholder:text-brand-ink-muted/50 bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink/25 ${
                  errors.deliveryAddress
                    ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400/20'
                    : 'border-brand-ink/15 hover:border-brand-ink/30 focus:border-brand-pink'
                }`}
                aria-invalid={Boolean(errors.deliveryAddress)}
                aria-describedby={errors.deliveryAddress ? 'deliveryAddress-error' : undefined}
              />
              {errors.deliveryAddress && (
                <p id="deliveryAddress-error" className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1" role="alert">
                  <span>⚠️</span> {errors.deliveryAddress}
                </p>
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
              <span className="font-bold">ℹ️ Note:</span>
              <span>Delivery charge, if any, is confirmed separately on WhatsApp depending on your distance.</span>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. OPTIONAL PERSONAL MESSAGE WITH CHARACTER COUNTER            */}
      {/* ============================================================== */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="checkout-personalMessage" className="text-xs font-bold uppercase tracking-wider text-brand-ink">
            Add a Personal Message <span className="text-brand-ink-muted font-normal text-[11px] lowercase">(optional)</span>
          </label>
          <span className={`text-[11px] font-mono ${messageLength >= maxMessageLength ? 'text-rose-500 font-bold' : 'text-brand-ink-muted'}`}>
            {messageLength}/{maxMessageLength}
          </span>
        </div>
        <textarea
          id="checkout-personalMessage"
          rows={2}
          maxLength={maxMessageLength}
          placeholder="e.g. Happy 21st Birthday Sneha! Wishing you the happiest year ahead 🎉"
          value={formData.personalMessage}
          onChange={(e) => onSetField('personalMessage', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-brand-ink/15 bg-white text-sm text-brand-ink placeholder:text-brand-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink transition-all"
        />
      </div>

      {/* ============================================================== */}
      {/* 3. OPTIONAL PREFERRED DATE & TIME SLOT                         */}
      {/* ============================================================== */}
      <div className="p-3.5 rounded-2xl bg-white border border-brand-ink/10 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-ink">
            Celebration Date & Time <span className="text-brand-ink-muted font-normal text-[11px] lowercase">(optional)</span>
          </span>
          <span className="text-[11px] text-brand-ink-muted">To prepare fresh</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="checkout-celebrationDate" className="block text-xs font-semibold text-brand-ink mb-1">
              Celebration Date
            </label>
            <div className="relative flex items-center">
              <input
                id="checkout-celebrationDate"
                type="date"
                min={todayString}
                value={formData.celebrationDate}
                onChange={(e) => onSetField('celebrationDate', e.target.value)}
                className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-brand-ink/15 bg-white text-xs text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink"
              />
            </div>
          </div>

          <div>
            <label htmlFor="checkout-preferredTime" className="block text-xs font-semibold text-brand-ink mb-1">
              Preferred Time Slot
            </label>
            <select
              id="checkout-preferredTime"
              value={formData.preferredTime}
              onChange={(e) => onSetField('preferredTime', e.target.value)}
              className="w-full px-3 py-2 min-h-[40px] rounded-xl border border-brand-ink/15 bg-white text-xs text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink cursor-pointer"
            >
              {CHECKOUT_CONFIG.timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. REFERRAL CODE ENTRY CARD (SYNCED ACROSS STEPS)              */}
      {/* ============================================================== */}
      <div className="p-3.5 rounded-2xl bg-white border border-brand-ink/10 shadow-xs">
        <ReferralCodeInput
          referralCode={formData.referralCode}
          onSetCode={(code) => onSetField('referralCode', code)}
        />
      </div>
    </div>
  );
};
