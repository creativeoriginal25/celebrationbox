import React from 'react';
import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { PolicyType } from './PolicyModal';
import { CelebrationBoxLogo } from './CelebrationBoxLogo';

interface FooterProps {
  onOpenOrder: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
  onOpenPolicy: (type: PolicyType) => void;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onOpenOrder, onOpenPolicy }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-brand-ink text-white pt-14 pb-10">
      {/* Top Gradient Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-pink via-brand-marigold to-brand-teal" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-10 border-b border-white/10">
          
          {/* Column 1: Brand Identity & Description (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Logo in clean white container for crisp rendering on dark backdrop */}
            <div className="bg-white px-3.5 py-1.5 rounded-xl inline-flex items-center shadow-xs border border-white/10">
              <CelebrationBoxLogo className="h-8 sm:h-9 w-auto" animated={false} interactive={false} />
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm">
              <strong>{BUSINESS_CONFIG.name}</strong> — {BUSINESS_CONFIG.tagline}
              <br />
              {BUSINESS_CONFIG.descriptor}. Curated DIY birthday party kits designed for students, hostels, and bedrooms in Bhimavaram, AP.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={BUSINESS_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-pink flex items-center justify-center transition-colors text-white"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${BUSINESS_CONFIG.email}`}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-teal flex items-center justify-center transition-colors text-white"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>

              <button
                onClick={() => onOpenOrder()}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-emerald-600 flex items-center justify-center transition-colors text-white cursor-pointer"
                aria-label="Order on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column 2: Celebration Kits (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-marigold">
              Celebration Kits
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
              <li>
                <button
                  onClick={() => onOpenOrder('mini-celebration-box')}
                  className="hover:text-brand-pink transition-colors text-left cursor-pointer"
                >
                  Mini Celebration Box (₹249)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenOrder('signature-celebration-box')}
                  className="hover:text-brand-pink transition-colors text-left cursor-pointer"
                >
                  Signature Celebration Box (₹499)
                </button>
              </li>
              <li>
                <a href="#compare" className="hover:text-brand-pink transition-colors">
                  Side-by-Side Comparison
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-brand-pink transition-colors">
                  How It Works (DIY Setup)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Local Service (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Local Bhimavaram Hub
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                <span>{BUSINESS_CONFIG.campusLocation}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-teal shrink-0" />
                <a href={`mailto:${BUSINESS_CONFIG.email}`} className="hover:underline">
                  {BUSINESS_CONFIG.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-brand-marigold shrink-0" />
                <a
                  href={BUSINESS_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline truncate"
                >
                  @celebrationbox.in
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: WhatsApp Ordering CTA (2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-pink block mb-1">
                Got a celebration?
              </span>
              <h5 className="text-xs sm:text-sm font-bold text-white mb-1.5">Book via WhatsApp</h5>
              <p className="text-[11px] text-gray-400 leading-snug">
                Verified stock, free campus pickup or nearby drop.
              </p>
            </div>
            <button
              onClick={() => onOpenOrder()}
              className="mt-3 w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm transition-all text-center cursor-pointer"
            >
              Order on WhatsApp
            </button>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            © {currentYear} {BUSINESS_CONFIG.name}. Student-founded in Bhimavaram, AP.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicy('cancellation')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cancellation & Returns
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
