import React, { useEffect } from 'react';
import { X, ShieldAlert, FileText, RotateCcw } from 'lucide-react';

export type PolicyType = 'terms' | 'privacy' | 'cancellation';

interface PolicyModalProps {
  policyType: PolicyType | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ policyType, onClose }) => {
  // Lock body scroll and trap ESC key when modal is open
  useEffect(() => {
    if (!policyType) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [policyType, onClose]);

  if (!policyType) return null;

  const contentMap = {
    terms: {
      title: 'Terms & Conditions',
      icon: FileText,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-brand-ink-light leading-relaxed">
          <p>
            Welcome to <strong className="text-brand-ink">Celebration Box</strong>! By ordering through our website or via our official WhatsApp channel, you agree to these terms:
          </p>
          <h4 className="font-bold text-brand-ink text-sm sm:text-base">1. Nature of Products</h4>
          <p>
            Celebration Box supplies curated DIY celebration decoration kits containing commercially sourced balloons, banners, candles, adhesive dots, ribbons, and styling accessories. We do not manufacture rubber or plastics; we curate, quality-inspect, and package all elements into a ready-to-use celebration box with instructions.
          </p>
          <h4 className="font-bold text-brand-ink text-sm sm:text-base">2. Ordering & Confirmation</h4>
          <p>
            Submitting an order via the website constructs an inquiry message for WhatsApp. An order is confirmed <strong className="text-brand-ink">only after</strong> our team checks product stock, confirms fulfillment timing, and receives payment confirmation via UPI.
          </p>
          <h4 className="font-bold text-brand-ink text-sm sm:text-base">3. DIY Setup Responsibility</h4>
          <p>
            All kits are self-assembled (DIY). Inflation, wall mounting, and garland styling are performed by the customer using the supplied instruction guide and wall-safe glue dots. Celebration Box is not responsible for punctures caused by over-inflation, sharp objects, or heat exposure.
          </p>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      icon: ShieldAlert,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-brand-ink-light leading-relaxed">
          <p>
            At <strong className="text-brand-ink">Celebration Box</strong>, we respect your privacy and handle your celebration details with utmost care.
          </p>
          <h4 className="font-bold text-brand-ink text-sm sm:text-base">1. Data We Collect</h4>
          <p>
            When preparing your order, you provide your name, phone number, celebration date, preferred timing, and delivery address. This data is used solely to coordinate your order, delivery, or campus pickup in Bhimavaram.
          </p>
          <h4 className="font-bold text-brand-ink text-sm sm:text-base">2. No Third-Party Selling</h4>
          <p>
            We will never sell, rent, or distribute your phone number or celebration details to advertisers or telemarketers.
          </p>
          <h4 className="font-bold text-brand-ink text-sm sm:text-base">3. WhatsApp Communications</h4>
          <p>
            Direct order messages, payment confirmations, and delivery updates occur through WhatsApp&apos;s end-to-end encrypted messaging service.
          </p>
        </div>
      ),
    },
    cancellation: {
      title: 'Cancellation & Return Policy',
      icon: RotateCcw,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-brand-ink-light leading-relaxed">
          <h4 className="font-bold text-brand-ink text-sm sm:text-base">1. Order Cancellation</h4>
          <p>
            Because our kits are hand-curated and packed specifically for your booked celebration date, orders can be cancelled with a full refund up to <strong className="text-brand-ink">12 hours prior</strong> to the scheduled pickup or delivery time.
          </p>
          <h4 className="font-bold text-brand-ink text-sm sm:text-base">2. Returns & Missing Items</h4>
          <p>
            Due to hygiene and the single-use nature of party items (balloons, candle packs), open boxes cannot be returned once delivered or picked up. However, if any item listed in your box is found missing or defective upon opening, notify us on WhatsApp with a photo within 4 hours of pickup/delivery, and we will immediately provide a replacement or pro-rated refund.
          </p>
        </div>
      ),
    },
  };

  const activePolicy = contentMap[policyType];
  const Icon = activePolicy.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/65 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-ink/10 text-left max-h-[85vh] overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl text-brand-ink-muted hover:text-brand-pink hover:bg-brand-cream-50 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-pink/10 text-brand-pink flex items-center justify-center shrink-0 border border-brand-pink/15">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 id="policy-modal-title" className="text-xl sm:text-2xl font-black text-brand-ink tracking-tight font-display">
              {activePolicy.title}
            </h3>
            <p className="text-xs text-brand-ink-muted mt-0.5">
              Celebration Box • Bhimavaram
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <div className="pt-1 border-t border-brand-ink/5">
          {activePolicy.body}
        </div>

        {/* Modal Footer */}
        <div className="mt-8 pt-4 border-t border-brand-ink/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
