import React from 'react';
import { ArrowRight, MessageCircle, Sparkles, CheckCircle2, Box, Clock, MapPin } from 'lucide-react';
import { PRODUCTS } from '../config/products';
import { formatPrice } from '../utils/currency';

interface HeroProps {
  onExplore: () => void;
  onOpenOrder: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenOrder }) => {
  return (
    <section id="home" className="relative pt-8 pb-16 md:pt-14 md:pb-22 overflow-hidden scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Brand Pitch & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Brand Intro Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-pink text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
              <span>Student-Founded • Bhimavaram, AP</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-brand-ink tracking-tight leading-[1.12]">
              Make Every Celebration <span className="text-brand-pink underline decoration-brand-marigold decoration-wavy decoration-3">Special.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-brand-ink-light max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Beautiful DIY birthday decorations, thoughtfully curated and packed into one celebration box.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm active:scale-98 transition-all cursor-pointer"
              >
                <span>Explore Celebration Boxes</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenOrder('signature-celebration-box')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-brand-ink bg-white hover:bg-brand-cream-50 border border-brand-ink/15 shadow-sm active:scale-98 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-brand-teal" />
                <span>Order on WhatsApp</span>
              </button>
            </div>

            {/* 3 Concise Trust/Value Indicators */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="surface-card p-3 rounded-xl flex items-start gap-2.5">
                <Box className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-brand-ink">Curated DIY Kits</h4>
                  <p className="text-[11px] text-brand-ink-muted leading-tight">Coordinated Pastel Pop color theme</p>
                </div>
              </div>

              <div className="surface-card p-3 rounded-xl flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-marigold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-brand-ink">Beginner-Friendly Setup</h4>
                  <p className="text-[11px] text-brand-ink-muted leading-tight">Step-by-step instruction guide in every box</p>
                </div>
              </div>

              <div className="surface-card p-3 rounded-xl flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-brand-ink">College Pickup Available</h4>
                  <p className="text-[11px] text-brand-ink-muted leading-tight">Free campus pickup & nearby delivery</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Controlled Product Presentation (Mini & Signature) */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              
              {/* Signature Box Card */}
              <div className="surface-card rounded-2xl p-4.5 border-2 border-brand-pink/30 hover:border-brand-pink transition-all">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="badge-pink px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    Signature Box • Best Value
                  </span>
                  <span className="text-lg font-black text-brand-pink">{formatPrice(PRODUCTS[1].price)}</span>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-brand-cream-100 aspect-[16/10] flex items-center justify-center p-2 mb-3">
                  <img
                    src={PRODUCTS[1].image}
                    alt={PRODUCTS[1].name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-ink">{PRODUCTS[1].name}</span>
                  <button
                    onClick={() => onOpenOrder(PRODUCTS[1].id)}
                    className="font-bold text-brand-pink hover:underline"
                  >
                    Quick Order →
                  </button>
                </div>
                <p className="text-[11px] text-brand-ink-muted mt-0.5">
                  12 items: backdrop, 18" foil balloon, photo props & manual pump included.
                </p>
              </div>

              {/* Mini Box Card */}
              <div className="surface-card rounded-2xl p-4 border border-brand-ink/10 hover:border-brand-ink/20 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="badge-yellow px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                    Mini Box • Hostel Pick
                  </span>
                  <span className="text-base font-black text-brand-ink">{formatPrice(PRODUCTS[0].price)}</span>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-brand-cream-100 aspect-[16/9] flex items-center justify-center p-2 mb-2.5">
                  <img
                    src={PRODUCTS[0].image}
                    alt={PRODUCTS[0].name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-ink">{PRODUCTS[0].name}</span>
                  <button
                    onClick={() => onOpenOrder(PRODUCTS[0].id)}
                    className="font-bold text-brand-teal hover:underline"
                  >
                    Quick Order →
                  </button>
                </div>
                <p className="text-[11px] text-brand-ink-muted mt-0.5">
                  8 essentials: 12 balloons, banner, candles, arch tape & glue dots.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
