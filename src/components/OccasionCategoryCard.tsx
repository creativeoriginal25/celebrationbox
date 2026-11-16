import React from 'react';
import { OccasionCategory } from '../types';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';

interface OccasionCategoryCardProps {
  category: OccasionCategory;
  onClick: (category: OccasionCategory) => void;
}

export const OccasionCategoryCard: React.FC<OccasionCategoryCardProps> = ({
  category,
  onClick,
}) => {
  const isAvailable = category.isAvailable;

  return (
    <div
      onClick={() => onClick(category)}
      className="group flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(category);
        }
      }}
      aria-label={`${category.name} - ${isAvailable ? 'Available Now' : 'Coming Soon'}`}
    >
      {/* Circular Pastel Artwork Stage */}
      <div className="relative mb-3 flex items-center justify-center">
        {/* Outer Circular Ring on Hover */}
        <div
          className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-2 flex items-center justify-center transition-all duration-300 shadow-sm ${
            isAvailable
              ? 'group-hover:ring-4 group-hover:ring-brand-pink/25 group-hover:shadow-card'
              : 'group-hover:ring-2 group-hover:ring-brand-ink/10 opacity-90'
          }`}
          style={{ backgroundColor: category.bgColor }}
        >
          {/* Inner Illustration */}
          <img
            src={category.image}
            alt={category.name}
            className={`w-full h-full object-contain transition-transform duration-300 ${
              isAvailable ? 'group-hover:scale-108' : 'group-hover:scale-103'
            }`}
            loading="lazy"
          />
        </div>

        {/* Status Badge */}
        {!isAvailable && (
          <div className="absolute -bottom-1 inset-x-0 flex justify-center">
            <span className="bg-brand-ink/85 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 shadow-xs flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-brand-marigold" />
              <span>Coming Soon</span>
            </span>
          </div>
        )}

        {isAvailable && category.id === 'party-essentials' && (
          <div className="absolute -bottom-1 inset-x-0 flex justify-center">
            <span className="bg-brand-teal text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              Bundled
            </span>
          </div>
        )}
      </div>

      {/* Category Name & Indicator */}
      <div className="space-y-0.5 w-full">
        <h3 className="text-xs sm:text-sm md:text-base font-bold text-brand-ink group-hover:text-brand-pink transition-colors leading-snug">
          {category.name}
        </h3>
        <p className="text-[10px] sm:text-xs text-brand-ink-muted line-clamp-1">
          {category.tagline}
        </p>
      </div>
    </div>
  );
};