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
    <footer className="relative bg-[#252533] text-white pt-14 pb-10 border-t border-white/5 select-none">
      {/* Top Brand Gradient Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-pink via-brand-marigold to-brand-teal" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Four-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          
          {/* ========================================================
              COLUMN 1 – BRAND
             ======================================================== */}
          <div className="space-y-4">
            {/* Transparent Brand Logo (No white placeholder box) */}
            <div className="flex items-center">
              <CelebrationBoxLogo
                className="h-8 sm:h-9 w-auto"
                animated={false}
                interactive={false}
                variant="dark"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-semibold text-white tracking-wide">
                Celebration Box{' '}
                <span className="text-gray-400 font-normal">— Make Every Moment Special.</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-300/90 leading-relaxed max-w-sm">
                Thoughtfully curated DIY birthday decoration kits, designed to make every celebration special.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={BUSINESS_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-brand-pink flex items-center justify-center transition-all duration-200 text-white shadow-xs hover:scale-105 active:scale-95"
                aria-label="Follow us on Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${BUSINESS_CONFIG.email}`}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-brand-teal flex items-center justify-center transition-all duration-200 text-white shadow-xs hover:scale-105 active:scale-95"
                aria-label="Email Celebration Box"
              >
                <Mail className="w-4 h-4" />
              </a>

              <button
                onClick={() => onOpenOrder()}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-emerald-600 flex items-center justify-center transition-all duration-200 text-white shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ========================================================
              COLUMN 2 – CELEBRATION KITS
             ======================================================== */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-marigold">
              Celebration Kits
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              <li>
                <button
                  onClick={() => onOpenOrder('mini-celebration-box')}
                  className="hover:text-brand-pink transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span>Mini Celebration Box</span>
                  <span className="text-brand-pink font-semibold text-xs">— ₹249</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenOrder('signature-celebration-box')}
                  className="hover:text-brand-pink transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span>Pastel Rose Celebration Box</span>
                  <span className="text-brand-pink font-semibold text-xs">— ₹399</span>
                </button>
              </li>
              <li>
                <a
                  href="#compare"
                  className="hover:text-brand-pink transition-colors block"
                >
                  Compare Our Boxes
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-brand-pink transition-colors block"
                >
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* ========================================================
              COLUMN 3 – CONTACT
             ======================================================== */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                <span>Bhimavaram, Andhra Pradesh, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-teal shrink-0" />
                <a
                  href={`mailto:${BUSINESS_CONFIG.email}`}
                  className="hover:text-white hover:underline transition-colors truncate"
                >
                  {BUSINESS_CONFIG.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <InstagramIcon className="w-4 h-4 text-brand-teal shrink-0" />
                <a
                  href={BUSINESS_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors truncate"
                >
                  @celebrationbox.in
                </a>
              </li>
            </ul>
          </div>

          {/* ========================================================
              COLUMN 4 – WHATSAPP CTA
             ======================================================== */}
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 shadow-sm flex flex-col justify-between space-y-3.5">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-pink block">
                Got a celebration?
              </span>
              <h5 className="text-sm font-bold text-white leading-tight">
                Find the perfect box for your next special moment.
              </h5>
            </div>
            <a
              href={`https://wa.me/919100280705?text=${encodeURIComponent(
                'Hello Celebration Box! 🎉 I would like to order a Celebration Box for an upcoming celebration.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                const userAgent = navigator.userAgent || '';
                const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
                if (isMobile) {
                  e.preventDefault();
                  window.location.href = `https://wa.me/919100280705?text=${encodeURIComponent(
                    'Hello Celebration Box! 🎉 I would like to order a Celebration Box for an upcoming celebration.'
                  )}`;
                }
              }}
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-[0_4px_14px_0_rgba(233,30,99,0.30)] hover:shadow-[0_6px_20px_0_rgba(233,30,99,0.40)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order on WhatsApp</span>
            </a>
          </div>

        </div>

        {/* ========================================================
            FOUNDER & POWERED-BY IDENTITY STRIP
           ======================================================== */}
        <div className="py-6 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="text-gray-400">Founded by</span>
            <span className="font-semibold text-white tracking-wide">Lokesh Thanala</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="text-gray-400">Powered by</span>
            <span className="font-bold text-brand-marigold tracking-wide">NextGen Labs</span>
          </div>
        </div>

        {/* ========================================================
            COPYRIGHT & LEGAL POLICY LINKS
           ======================================================== */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            © {currentYear} Celebration Box. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <span className="text-white/20">•</span>
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-white/20">•</span>
            <button
              onClick={() => onOpenPolicy('cancellation')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Cancellation &amp; Returns
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};