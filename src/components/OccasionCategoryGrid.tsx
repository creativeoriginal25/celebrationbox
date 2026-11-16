import React, { useState } from 'react';
import { OCCASION_CATEGORIES } from '../config/categories';
import { OccasionCategory } from '../types';
import { OccasionCategoryCard } from './OccasionCategoryCard';
import { X, BellRing, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

interface OccasionCategoryGridProps {
  onSelectCategory: (category: OccasionCategory) => void;
}

export const OccasionCategoryGrid: React.FC<OccasionCategoryGridProps> = ({
  onSelectCategory,
}) => {
  const [comingSoonModalCategory, setComingSoonModalCategory] = useState<OccasionCategory | null>(null);

  const handleCategoryClick = (category: OccasionCategory) => {
    if (category.isAvailable) {
      onSelectCategory(category);
    } else {
      setComingSoonModalCategory(category);
    }
  };

  const handleWhatsAppNotify = (category: OccasionCategory) => {
    const text = encodeURIComponent(
      `Hi Celebration Box team! 👋 I'm interested in the upcoming *${category.name}* collection. Please notify me when it launches!`
    );
    window.open(`https://wa.me/${BUSINESS_CONFIG.whatsappNumber}?text=${text}`, '_blank');
    setComingSoonModalCategory(null);
  };

  return (
    <section id="categories" className="py-14 sm:py-20 bg-white border-y border-brand-ink/5 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase badge-pink mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Occasions &amp; Themes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink">
            Explore Celebrations
          </h2>
          <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
            Whatever the occasion, find the little things that make it special.
          </p>
        </div>

        {/* Visual Category Grid: Responsive Multi-Column
            Mobile: 2 columns (grid-cols-2)
            Tablet: 3-4 columns (sm:grid-cols-3 md:grid-cols-4)
            Desktop: 5 columns (lg:grid-cols-5 xl:grid-cols-5)
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 justify-center">
          {OCCASION_CATEGORIES.map((category) => (
            <OccasionCategoryCard
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
            />
          ))}
        </div>

        {/* Availability Clarity Note */}
        <div className="mt-10 sm:mt-12 text-center max-w-xl mx-auto">
          <p className="text-xs text-brand-ink-muted bg-brand-cream-50 py-2.5 px-4 rounded-xl border border-brand-ink/5">
            💡 <strong>Initial Launch:</strong> We are currently offering our signature all-in-one DIY Birthday Kits. Seasonal, festive &amp; bespoke themes are launching soon!
          </p>
        </div>
      </div>

      {/* Coming Soon Polite Notification Modal */}
      {comingSoonModalCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setComingSoonModalCategory(null)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-modal border border-brand-ink/10 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setComingSoonModalCategory(null)}
              className="absolute top-4 right-4 p-2 rounded-lg text-brand-ink-muted hover:text-brand-ink hover:bg-brand-cream-50 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Circular Category Artwork */}
            <div
              className="w-24 h-24 rounded-full mx-auto p-2 flex items-center justify-center shadow-xs"
              style={{ backgroundColor: comingSoonModalCategory.bgColor }}
            >
              <img
                src={comingSoonModalCategory.image}
                alt={comingSoonModalCategory.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Title & Tagline */}
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                Launching Soon
              </span>
              <h3 className="text-xl font-extrabold text-brand-ink">
                {comingSoonModalCategory.name} Collection
              </h3>
              <p className="text-xs text-brand-teal font-semibold">
                {comingSoonModalCategory.tagline}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed">
              {comingSoonModalCategory.availableNotice ||
                comingSoonModalCategory.description}
            </p>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleWhatsAppNotify(comingSoonModalCategory)}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Notify Me on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setComingSoonModalCategory(null);
                  const shopEl = document.getElementById('shop');
                  if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-brand-ink hover:bg-brand-cream-50 border border-brand-ink/10 transition-all cursor-pointer"
              >
                Browse Available Birthday Kits →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};