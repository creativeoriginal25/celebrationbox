import React from 'react';
import { MessageCircle, Mail, MapPin, Heart, Shield, Sparkles, ExternalLink } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { PolicyType } from './PolicyModal';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface FooterProps {
  onOpenOrder: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
  onOpenPolicy: (type: PolicyType) => void;
  onOpenAdminTemplates: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOrder,
  onOpenPolicy,
  onOpenAdminTemplates,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-brand-ink text-white pt-16 pb-12 overflow-hidden">
      {/* Decorative top border with brand gradient */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-pink via-brand-marigold to-brand-teal" />

      {/* Ambient background glow */}
      <div className="absolute -top-20 left-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Info & Mission */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/brand/logo.webp"
                alt="Celebration Box Logo"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              <strong>{BUSINESS_CONFIG.name}</strong> — {BUSINESS_CONFIG.tagline}
              <br />
              {BUSINESS_CONFIG.descriptor}. Hand-curated DIY birthday decoration kits designed for college students, hostels, and bedroom celebrations in Bhimavaram.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={BUSINESS_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-pink flex items-center justify-center transition-colors text-white"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${BUSINESS_CONFIG.email}`}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-brand-teal flex items-center justify-center transition-colors text-white"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>

              <button
                onClick={() => onOpenOrder()}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-emerald-600 flex items-center justify-center transition-colors text-white"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-marigold">
              Celebration Kits
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
              <li>
                <button
                  onClick={() => onOpenOrder('mini-celebration-box')}
                  className="hover:text-brand-pink transition-colors text-left"
                >
                  Mini Celebration Box (₹249)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenOrder('signature-celebration-box')}
                  className="hover:text-brand-pink transition-colors text-left"
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
                  How Setup Works (15 Mins)
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details (Configurable by owner) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Local Bhimavaram Hub
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                <span>{BUSINESS_CONFIG.campusLocation}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-teal shrink-0" />
                <a href={`mailto:${BUSINESS_CONFIG.email}`} className="hover:underline">
                  {BUSINESS_CONFIG.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
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

            <div className="pt-2">
              <button
                onClick={() => onOpenAdminTemplates()}
                className="text-[11px] font-semibold text-brand-marigold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Founder Portal: WhatsApp Response Templates</span>
              </button>
            </div>
          </div>

          {/* Quick CTA Card */}
          <div className="lg:col-span-2 flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-pink block mb-1">
                Got a celebration?
              </span>
              <h5 className="text-sm font-bold text-white mb-2">Book Your Box in 2 Minutes</h5>
              <p className="text-[11px] text-gray-400 leading-snug">
                Student budget friendly, zero stress, full celebration kit.
              </p>
            </div>
            <button
              onClick={() => onOpenOrder()}
              className="mt-4 w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-md shadow-brand-pink/20 transition-all text-center"
            >
              Order on WhatsApp
            </button>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            © {currentYear} {BUSINESS_CONFIG.name}. Student-founded in Bhimavaram, AP.
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenPolicy('cancellation')}
              className="hover:text-white transition-colors"
            >
              Cancellation & Returns
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
