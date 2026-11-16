import React from 'react';
import { ArrowRight, MessageCircle, Sparkles, CheckCircle2, PackageCheck, Clock, MapPin } from 'lucide-react';
import { PRODUCTS } from '../config/products';
import { formatPrice } from '../utils/currency';

interface HeroProps {
  onExplore: () => void;
  onOpenOrder: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenOrder }) => {
  return (
    <section id="home" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Ambient Pastel Glow Orbs for Glassmorphism backdrop */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 -translate-y-12 w-[600px] h-[350px] bg-gradient-to-tr from-brand-pink-100/60 via-brand-marigold-100/50 to-brand-teal-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-48 right-4 w-72 h-72 bg-brand-pink-100/50 rounded-full blur-2xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-6 w-80 h-80 bg-brand-teal-100/40 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Pitch & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-badge-pink text-xs font-semibold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
              <span>Student-Founded In Bhimavaram</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-ink tracking-tight leading-[1.12]">
              Make Every Celebration <span className="text-brand-pink underline decoration-brand-marigold decoration-wavy decoration-4">Special.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-brand-ink-light max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Everything you need to create a beautiful birthday setup, packed into one celebration box.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExplore}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-base font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-lg shadow-brand-pink/25 hover:shadow-xl hover:shadow-brand-pink/35 active:scale-95 transition-all duration-200"
              >
                <span>Explore Boxes</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onOpenOrder('signature-celebration-box')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-base font-semibold text-brand-ink glass-panel hover:bg-white/90 border border-brand-teal/30 hover:border-brand-teal shadow-glass active:scale-95 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5 text-brand-teal" />
                <span>Order on WhatsApp</span>
              </button>
            </div>

            {/* Clean Sub-Supporting Descriptor Tag */}
            <div className="pt-2">
              <p className="text-xs sm:text-sm font-medium text-brand-ink-muted">
                Curated DIY Party Kits • Easy to Set Up • Made for Your Moments
              </p>
            </div>

            {/* Quick Benefits Chips */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="glass-panel p-3 rounded-xl flex items-start gap-2.5">
                <PackageCheck className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-brand-ink">All In One Box</h4>
                  <p className="text-[11px] text-brand-ink-muted leading-tight">No hunting for separate tape or ribbons</p>
                </div>
              </div>

              <div className="glass-panel p-3 rounded-xl flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-marigold shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-brand-ink">Quick DIY Guide</h4>
                  <p className="text-[11px] text-brand-ink-muted leading-tight">15 to 30 mins beginner-friendly setup</p>
                </div>
              </div>

              <div className="glass-panel p-3 rounded-xl flex items-start gap-2.5 col-span-2 sm:col-span-1">
                <MapPin className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-brand-ink">College Friendly</h4>
                  <p className="text-[11px] text-brand-ink-muted leading-tight">Bhimavaram campus pickup & delivery</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Product Showcase Arrangement */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Visual Display: Signature Box Preview Card */}
              <div className="glass-card rounded-3xl p-5 shadow-glass-hover border-2 border-white/80 transition-transform duration-300 hover:scale-[1.01]">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-brand-cream to-white aspect-[4/3] flex items-center justify-center p-2">
                  <img
                    src={PRODUCTS[1].image}
                    alt={PRODUCTS[1].name}
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="glass-badge-yellow px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {PRODUCTS[1].badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="glass-panel px-3 py-1 rounded-full text-xs font-bold text-brand-ink shadow-sm">
                      Theme: Pastel Pop
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-brand-ink leading-tight">{PRODUCTS[1].name}</h3>
                    <p className="text-xs text-brand-ink-muted">Complete 12-item birthday setup</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-brand-pink">{formatPrice(PRODUCTS[1].price)}</span>
                  </div>
                </div>

                <div className="mt-3.5 pt-3.5 border-t border-brand-ink/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-brand-teal font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Includes hand pump & backdrop</span>
                  </div>
                  <button
                    onClick={() => onOpenOrder(PRODUCTS[1].id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm transition-all"
                  >
                    Quick Order
                  </button>
                </div>
              </div>

              {/* Floating Mini Box Teaser Badge on bottom left */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 glass-panel rounded-2xl p-3.5 shadow-glass border border-white/90 max-w-[240px] flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-cream flex items-center justify-center shrink-0 overflow-hidden border border-brand-pink/20">
                  <img src={PRODUCTS[0].image} alt="Mini Box" className="w-10 h-10 object-contain" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-pink">Hostel Favorite</span>
                  <h4 className="text-xs font-bold text-brand-ink truncate">{PRODUCTS[0].name}</h4>
                  <p className="text-xs font-black text-brand-pink">{formatPrice(PRODUCTS[0].price)}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

