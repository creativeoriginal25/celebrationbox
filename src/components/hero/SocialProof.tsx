import React from 'react';
import { Sparkles } from 'lucide-react';
import { HERO_CONFIG } from '../../config/hero';

interface SocialProofProps {
  className?: string;
}

export const SocialProof: React.FC<SocialProofProps> = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center justify-center gap-1.5 text-center text-xs font-medium text-brand-ink-muted/85 select-none ${className}`}
    >
      <Sparkles className="w-3 h-3 text-brand-marigold shrink-0" />
      <span>{HERO_CONFIG.socialProofText}</span>
    </div>
  );
};
