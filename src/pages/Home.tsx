import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Cake,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Heart,
  Truck,
  Layers,
  Zap,
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { HowItWorks } from '../components/HowItWorks';
import { FAQ } from '../components/FAQ';
import { OccasionCategoryGrid } from '../components/OccasionCategoryGrid';
import { PRODUCTS } from '../config/products';
import { CHOCOLOOM_CONFIG } from '../config/chocoloomCakes';
import { formatPrice } from '../utils/currency';

export const Home: React.FC = () => {
  const featuredProduct = PRODUCTS.find((p) => p.slug === 'pastel-rose') || PRODUCTS[0];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Section */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">
        {/* 2. PROMINENT DUAL SHOPPING CARDS (STORE FRONT CALLOUTS) */}
        <section className="scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* CARD A: SHOP CELEBRATION BOXES */}
            <div className="rounded-3xl p-7 sm:p-9 border-2 border-brand-ink/10 hover:border-brand-pink/50 bg-gradient-to-br from-white via-brand-cream-50/50 to-white shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-pink/15 text-brand-pink flex items-center justify-center shadow-xs">
                  <Package className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-brand-pink">
                    DIY Decoration Kits
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-brand-ink font-display">
                    Shop Celebration Boxes
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed">
                  Everything you need for a beautiful birthday celebration. Pre-curated packs with 56 balloons, foil backdrop, banner, candles and wall-friendly tape.
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pastel Rose Edition Available now for ₹399</span>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to="/celebration-boxes"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white text-xs sm:text-sm font-extrabold shadow-card transition-all cursor-pointer group-hover:translate-x-1"
                >
                  <span>Explore Celebration Boxes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* CARD B: CAKES & CELEBRATION COMBOS */}
            <div className="rounded-3xl p-7 sm:p-9 border-2 border-brand-pink/20 hover:border-brand-pink bg-gradient-to-br from-pink-50/40 via-white to-amber-50/30 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-white" />
                <span>Chocoloom Collab</span>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-xs">
                  <Cake className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-brand-pink">
                    Complete Birthday Combo
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-brand-ink font-display">
                    Cakes &amp; Celebration Combos
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed">
                  Pair your celebration with a delicious, personalized cake by Chocoloom. 6+ gourmet flavours, custom name piping, and reference photo designs.
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-brand-pink">
                  <CheckCircle2 className="w-4 h-4 text-brand-pink shrink-0" />
                  <span>Bento (250g) to 2kg cakes delivered with your kit</span>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to="/cakes"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-ink hover:bg-black text-white text-xs sm:text-sm font-extrabold shadow-card transition-all cursor-pointer group-hover:translate-x-1"
                >
                  <span>Explore Cakes &amp; Combos</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FEATURED PRODUCT SHOWCASE: PASTEL ROSE CELEBRATION BOX (₹399) */}
        <section className="rounded-3xl bg-white border border-brand-ink/10 shadow-card p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Product Image */}
            <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-cream-50 border border-brand-ink/10 shadow-xs">
              <img
                src={featuredProduct.image}
                alt={featuredProduct.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-brand-pink text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Featured Kit
              </span>
            </div>

            {/* Right: Overview & Pricing */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-pink">
                  Official Launch Edition
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-brand-ink font-display">
                  {featuredProduct.name}
                </h3>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-brand-pink font-display">
                  {formatPrice(featuredProduct.price)}
                </span>
                <span className="text-xs text-brand-ink-muted line-through font-semibold">
                  Market: ₹550+
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                  All-Inclusive 56 Balloons
                </span>
              </div>

              <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed">
                {featuredProduct.description}
              </p>

              {/* Inclusions summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-brand-ink pt-2 border-t border-brand-ink/5">
                <div className="p-2 rounded-xl bg-brand-cream-50 font-semibold text-center">
                  20 Baby Pink
                </div>
                <div className="p-2 rounded-xl bg-brand-cream-50 font-semibold text-center">
                  20 Lavender
                </div>
                <div className="p-2 rounded-xl bg-brand-cream-50 font-semibold text-center">
                  16 Copper
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                <Link
                  to="/celebration-boxes/pastel-rose"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white text-xs sm:text-sm font-extrabold shadow-card transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Full Kit Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/cakes"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-brand-cream-50 border border-brand-ink/20 text-brand-ink text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-2"
                >
                  <Cake className="w-4 h-4 text-brand-pink" />
                  <span>Pair with Chocoloom Cake</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CELEBRATIONBOX × CHOCOLOOM COLLABORATION INTRODUCTION */}
        <section className="rounded-3xl bg-gradient-to-r from-[#FFF5F8] via-white to-[#FFF8F3] border-2 border-brand-pink/20 p-8 sm:p-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-pink/10 text-brand-pink text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collaboration Spotlight</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-brand-ink font-display">
            CelebrationBox × Chocoloom
          </h2>

          <p className="text-sm sm:text-base text-brand-ink-light max-w-2xl mx-auto italic">
            &ldquo;Beautiful Decorations. Delicious Cakes. One Perfect Celebration.&rdquo;
          </p>

          <p className="text-xs sm:text-sm text-brand-ink-light max-w-2xl mx-auto leading-relaxed">
            We teamed up with Bhimavaram&apos;s favourite cake kitchen, Chocoloom, so you don&apos;t need to order your room decor and birthday cake from two different places. Pick your theme, customize your cake flavour, and get everything delivered together fresh!
          </p>

          <div className="pt-3">
            <Link
              to="/cakes"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white text-xs sm:text-sm font-extrabold shadow-card transition-all"
            >
              <Cake className="w-4 h-4 fill-white" />
              <span>Explore Chocoloom Cakes &amp; Combos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* 5. AVAILABLE OCCASIONS & THEMES */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-ink font-display">
              Celebration Occasions &amp; Themes
            </h2>
            <p className="text-xs sm:text-sm text-brand-ink-muted">
              Whatever the milestone, celebrate in style with pre-coordinated themes.
            </p>
          </div>

          <OccasionCategoryGrid />
        </section>

        {/* 6. HOW IT WORKS */}
        <HowItWorks />

        {/* 7. WHY CHOOSE CELEBRATION BOX */}
        <WhyChooseUs />

        {/* 8. FAQ */}
        <FAQ />
      </div>
    </div>
  );
};
