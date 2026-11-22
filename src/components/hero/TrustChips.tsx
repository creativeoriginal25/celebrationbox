import React from 'react';
import { Tag, Building2, Sparkles } from 'lucide-react';
import { HERO_CONFIG } from '../../config/hero';

interface TrustChipsProps {
  className?: string;
}

export const TrustChips: React.FC<TrustChipsProps> = ({ className = '' }) => {
  const getIcon = (type: 'price' | 'pickup' | 'diy') => {
    switch (type) {
      case 'price':
        return <Tag className="w-3 h-3 text-brand-pink shrink-0" />;
      case 'pickup':
        return <Building2 className="w-3 h-3 text-brand-teal shrink-0" />;
      case 'diy':
        return <Sparkles className="w-3 h-3 text-brand-marigold shrink-0" />;
    }
  };

  return (
    <div
      className={`flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap text-brand-ink select-none ${className}`}
      role="list"
      aria-label="Product value and trust highlights"
    >
      {HERO_CONFIG.trustChips.map((chip, index) => (
        <div
          key={index}
          role="listitem"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 border border-brand-ink/10 shadow-[0_1px_3px_rgba(43,43,58,0.04)] text-[11px] sm:text-xs font-bold text-brand-ink tracking-tight transition-transform hover:scale-[1.02]"
        >
          {getIcon(chip.type)}
          <span>{chip.label}</span>
        </div>
      ))}
    </div>
  );
};
