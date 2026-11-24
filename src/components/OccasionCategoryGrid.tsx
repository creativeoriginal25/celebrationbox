import React, { useState } from 'react';
import { OccasionCategory } from '../types';
import { Cake, Heart, Wine, Gift, Percent, X, MessageCircle, ArrowRight } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppLink, triggerWhatsAppChat } from '../services/whatsappService';

interface OccasionCategoryGridProps {
  onSelectCategory: (category: OccasionCategory) => void;
}

interface OccasionItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  borderColor: string;
  isAvailable: boolean;
  tagline: string;
}

const OCCASIONS: OccasionItem[] = [
  {
    id: 'birthday-kits',
    name: 'Birthday Kits',
    icon: Cake,
    bgColor: '#FFF0F4',
    borderColor: '#FCD2DC',
    isAvailable: true,
    tagline: 'Curated DIY Birthday Decoration Kits',
  },
  {
    id: 'anniversary',
    name: 'Anniversary',
    icon: Heart,
    bgColor: '#FFF7F2',
    borderColor: '#FBE0D2',
    isAvailable: false,
    tagline: 'Romantic room styling & surprises',
  },
  {
    id: 'bachelorette',
    name: 'Bachelorette',
    icon: Wine,
    bgColor: '#FAF0F6',
    borderColor: '#F3D5E7',
    isAvailable: false,
    tagline: 'Chic bride-to-be & party setups',
  },
  {
    id: 'festive-kits',
    name: 'Festive Kits',
    icon: Gift,
    bgColor: '#FFF9EE',
    borderColor: '#FDE9C2',
    isAvailable: false,
    tagline: 'Traditional celebration decor & lights',
  },
  {
    id: 'combos-offers',
    name: 'Combos & Offers',
    icon: Percent,
    bgColor: '#FFF0F4',
    borderColor: '#FCD2DC',
    isAvailable: true,
    tagline: 'Bundled kits & limited-time savings',
  },
];

export const OccasionCategoryGrid: React.FC<OccasionCategoryGridProps> = ({
  onSelectCategory,
}) => {
  const [comingSoonCategory, setComingSoonCategory] = useState<OccasionItem | null>(null);

  const handleOccasionClick = (item: OccasionItem) => {
    if (item.isAvailable) {
      const shopEl = document.getElementById('shop');
      if (shopEl) {
        shopEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setComingSoonCategory(item);
    }
  };

  const handleNotifyWhatsApp = (item: OccasionItem) => {
    const text = `Hi Celebration Box team! 👋 I'm interested in the upcoming *${item.name}* collection. Please notify me when it launches!`;
    const url = buildWhatsAppLink(BUSINESS_CONFIG.whatsappNumber, text);
    triggerWhatsAppChat(url);
    setComingSoonCategory(null);
  };

  return (
    <section id="categories" className="py-4 sm:py-6 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header: —— Shop by Occasion —— */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 my-6 sm:my-8 select-none">
          <div className="h-[1px] w-12 sm:w-24 md:w-32 bg-[#7A153A]/25" />
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#5C112A] tracking-tight">
            Shop by Occasion
          </h2>
          <div className="h-[1px] w-12 sm:w-24 md:w-32 bg-[#7A153A]/25" />
        </div>

        {/* 5 Occasion Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 justify-center">
          {OCCASIONS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => handleOccasionClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOccasionClick(item);
                  }
                }}
                style={{
                  backgroundColor: item.bgColor,
                  borderColor: item.borderColor,
                }}
                className="group flex flex-col items-center justify-center p-5 sm:p-6 rounded-[20px] sm:rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer select-none text-center"
              >
                {/* Central Icon */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-[#8A1538] transition-transform duration-300 group-hover:scale-110 mb-3">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.8]" />
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-xs sm:text-sm text-brand-ink group-hover:text-[#8A1538] transition-colors tracking-tight">
                  {item.name}
                </h3>
              </div>
            );
          })}
        </div>

      </div>

      {/* Coming Soon Polite Notification Modal */}
      {comingSoonCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setComingSoonCategory(null)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-pink-100 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setComingSoonCategory(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-brand-ink-muted hover:text-brand-ink hover:bg-brand-cream-50 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-[#8A1538] shadow-xs"
              style={{ backgroundColor: comingSoonCategory.bgColor }}
            >
              {React.createElement(comingSoonCategory.icon, {
                className: 'w-8 h-8 stroke-[1.8]',
              })}
            </div>

            {/* Title & Tagline */}
            <div className="space-y-1">
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                Launching Soon
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#5C112A]">
                {comingSoonCategory.name} Collection
              </h3>
              <p className="text-xs text-brand-ink-light leading-relaxed">
                {comingSoonCategory.tagline}. We are currently perfecting this collection for upcoming celebrations!
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleNotifyWhatsApp(comingSoonCategory)}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Notify Me on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setComingSoonCategory(null);
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
