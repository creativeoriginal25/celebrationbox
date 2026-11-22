import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { HERO_CONFIG } from '../../config/hero';

interface HeroActionsProps {
  onExplore: () => void;
  onWhatsAppOrder?: () => void;
  className?: string;
}

export const HeroActions: React.FC<HeroActionsProps> = ({
  onExplore,
  onWhatsAppOrder,
  className = '',
}) => {
  return (
    <div className={`w-full max-w-[340px] xs:max-w-[360px] sm:max-w-md mx-auto space-y-2.5 ${className}`}>
      {/* 1. Primary CTA: "Explore Celebration Boxes →" (Full width on mobile, 52px height) */}
      <button
        type="button"
        onClick={onExplore}
        className="w-full h-[52px] px-6 rounded-[14px] bg-brand-pink hover:bg-brand-pink-hover text-white font-bold text-[15px] sm:text-base flex items-center justify-center gap-2 shadow-[0_6px_20px_0_rgba(233,30,99,0.32)] hover:shadow-[0_8px_24px_0_rgba(233,30,99,0.42)] active:scale-[0.98] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-pink/30"
        aria-label="Explore Celebration Boxes catalogue"
      >
        <span>{HERO_CONFIG.primaryCta}</span>
        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
      </button>

      {/* 2. Secondary WhatsApp Action: Compact, recognizable */}
      {onWhatsAppOrder && (
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={onWhatsAppOrder}
            className="inline-flex items-center gap-1.5 py-1 px-3 rounded-lg text-xs font-semibold text-brand-ink/80 hover:text-emerald-700 hover:bg-emerald-50/70 transition-colors cursor-pointer group"
            aria-label="Order Celebration Box on WhatsApp"
          >
            <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageCircle className="w-2.5 h-2.5 fill-white stroke-[2]" />
            </div>
            <span>{HERO_CONFIG.secondaryCta}</span>
          </button>
        </div>
      )}
    </div>
  );
};
