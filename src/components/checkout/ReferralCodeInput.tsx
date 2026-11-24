import React, { useState, useEffect } from 'react';
import { Check, Tag, Loader2, X } from 'lucide-react';

interface ReferralCodeInputProps {
  referralCode?: string;
  onSetCode: (code: string) => void;
  className?: string;
}

export const ReferralCodeInput: React.FC<ReferralCodeInputProps> = ({
  referralCode = '',
  onSetCode,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState(referralCode);
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(referralCode);
    if (referralCode && status === 'idle') {
      validate(referralCode);
    }
  }, [referralCode]);

  const validate = async (codeToTest: string) => {
    const clean = codeToTest.trim().toUpperCase();
    if (!clean) {
      setStatus('idle');
      setMessage(null);
      return;
    }

    setIsValidating(true);
    try {
      const res = await fetch(`/api/referral/validate?code=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (data.valid) {
        setStatus('valid');
        setMessage(data.message || 'Referral code applied!');
        onSetCode(data.code || clean);
      } else {
        setStatus('invalid');
        setMessage(data.error || 'Invalid or inactive referral code');
      }
    } catch {
      // In offline or local fallback, check known format
      if (/^CBX-[A-Z0-9]{4}$/.test(clean)) {
        setStatus('valid');
        setMessage('Referral code applied!');
        onSetCode(clean);
      } else {
        setStatus('invalid');
        setMessage('Invalid referral code');
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/\s+/g, '');
    setInputValue(val);
    onSetCode(val);
    setStatus('idle');
    setMessage(null);
  };

  const handleClear = () => {
    setInputValue('');
    onSetCode('');
    setStatus('idle');
    setMessage(null);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor="checkout-referral-code-input" className="text-xs font-semibold text-brand-ink flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-brand-pink" />
          <span>Have a Referral Code?</span>
        </label>
        <span className="text-[10px] text-brand-ink-muted/80">Optional</span>
      </div>

      <div className="relative flex items-center">
        <input
          id="checkout-referral-code-input"
          type="text"
          autoCapitalize="characters"
          placeholder="e.g. CBX-K7M2"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={() => {
            if (inputValue.trim()) {
              validate(inputValue);
            }
          }}
          className={`w-full px-3.5 py-2.5 min-h-[44px] rounded-xl border text-sm text-brand-ink transition-all placeholder:text-brand-ink-muted/50 bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink/25 font-mono tracking-wider uppercase pr-24 ${
            status === 'valid'
              ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500/20'
              : status === 'invalid'
              ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400/20'
              : 'border-brand-ink/15 hover:border-brand-ink/30 focus:border-brand-pink'
          }`}
        />

        <div className="absolute right-2 flex items-center gap-1">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-brand-ink-muted hover:text-brand-ink hover:bg-brand-ink/5"
              title="Clear referral code"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => validate(inputValue)}
            disabled={isValidating || !inputValue.trim()}
            className="px-2.5 py-1 text-xs font-bold rounded-lg text-white bg-brand-pink hover:bg-brand-pink-hover active:scale-95 transition-all disabled:opacity-40 cursor-pointer shrink-0"
          >
            {isValidating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
          </button>
        </div>
      </div>

      {status === 'valid' && (
        <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1 animate-fadeIn" role="status">
          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> {message || 'Referral code applied!'}
        </p>
      )}

      {status === 'invalid' && (
        <p className="text-[11px] text-rose-600 font-medium mt-1 flex items-center gap-1 animate-fadeIn" role="alert">
          <span>⚠️</span> {message || 'Invalid or inactive referral code'}
        </p>
      )}

      {status === 'idle' && !inputValue && (
        <p className="text-[11px] text-brand-ink-muted mt-0.5">
          Referred by a friend? Enter their code here.
        </p>
      )}
    </div>
  );
};
