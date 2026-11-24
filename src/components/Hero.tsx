import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PackageCheck, Sparkles, Truck, Layers, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Confetti, ConfettiRef } from './react-bits/Confetti';

interface HeroProps {
  onExplore?: () => void;
  onOpenOrder?: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  const confettiRef = useRef<ConfettiRef>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Both flagship photos configured in the continuous carousel
  const slides = [
    {
      id: 'pastel-rose-setup',
      tag: 'BIRTHDAY DECORATION KIT',
      title: 'Pastel Rose Celebration Box',
      subtitle:
        'A premium DIY decoration kit with a perfect pastel setup for a memorable birthday.',
      price: '₹399',
      image: '/products/pastel-rose-setup.jpg',
      imageFit: 'object-cover',
      alt: 'Pastel Rose Celebration Box birthday setup with balloon arch and cake',
      features: [
        { icon: PackageCheck, title: 'Complete', sub: 'DIY Kit', bg: 'bg-[#FFEBF0]', color: 'text-[#D81B60]' },
        { icon: Sparkles, title: 'Easy', sub: 'Setup', bg: 'bg-[#FFF4E5]', color: 'text-[#FFB400]' },
        { icon: Truck, title: 'Fast', sub: 'Delivery', bg: 'bg-[#E0F7F6]', color: 'text-[#00A8A8]' },
      ],
    },
    {
      id: 'pastel-rose-contents',
      tag: "WHAT'S INSIDE THE BOX",
      title: 'Pastel Rose Celebration Box',
      subtitle:
        '56 balloons (Baby Pink, Lavender, Metallic Copper), Gold Banner, Foil Fringe & Birthday Candles.',
      price: '₹399',
      image: '/products/pastel-rose-contents.jpg',
      imageFit: 'object-contain',
      alt: "What's Inside the Box - 56 balloons and decoration kit contents",
      features: [
        { icon: Layers, title: '56 Pieces', sub: 'Balloons', bg: 'bg-[#FFEBF0]', color: 'text-[#D81B60]' },
        { icon: Sparkles, title: 'Foil Fringe', sub: 'Backdrop', bg: 'bg-[#FFF4E5]', color: 'text-[#FFB400]' },
        { icon: CheckCircle2, title: 'Lighting', sub: 'On Rent ✨', bg: 'bg-[#E0F7F6]', color: 'text-[#00A8A8]' },
      ],
    },
  ];

  useEffect(() => {
    // Festive celebration cannons on initial load
    const timer = setTimeout(() => {
      confettiRef.current?.cannons();
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Continuous auto-advance: moves automatically every 4 seconds even on user hover or touch
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[currentSlide];

  return (
    <section id="home" className="relative pt-4 pb-4 overflow-hidden scroll-mt-24">
      {/* Background festive celebration confetti burst */}
      <Confetti
        ref={confettiRef}
        colors={['#E91E63', '#FFB400', '#00A8A8', '#FF80AB', '#B388FF']}
        shapes={['rect', 'strip', 'circle']}
        size={13}
        burst={true}
        burstCount={90}
        burstPower={1}
        burstSpread={65}
        autoplay={false}
        intro={false}
        interactive={false}
        disabled={false}
        className="relative"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Main Showcase Hero Card */}
          <div className="relative rounded-[28px] sm:rounded-[36px] bg-gradient-to-r from-[#FFF8F6] via-[#FFF5F6] to-[#FCEEF2] border border-[#F4E0E5] shadow-[0_8px_30px_0_rgba(74,21,37,0.04)] overflow-hidden">

            {/* Hero Card Interior Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[420px] sm:min-h-[460px]">
              
              {/* ========================================================
                  LEFT COLUMN: EDITORIAL CONTENT & CTA
                 ======================================================== */}
              <div className="lg:col-span-5 px-6 sm:px-10 lg:pl-12 lg:pr-6 py-8 sm:py-10 z-10 text-left flex flex-col justify-center">
                
                {/* 1. Badge Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBF0] text-[#D81B60] font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-3 w-fit border border-[#FCD2DC]">
                  <span>{activeSlide.tag}</span>
                </div>

                {/* 2. Large Editorial Serif Title */}
                <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] text-[#4A1525] leading-[1.12] tracking-tight mb-3">
                  {activeSlide.title}
                </h1>

                {/* 3. Subtitle / Description */}
                <p className="text-sm sm:text-base text-[#5A5A6E] leading-relaxed mb-6 max-w-md min-h-[48px]">
                  {activeSlide.subtitle}
                </p>

                {/* 4. Price & Shop Now Action Row */}
                <div className="flex items-center gap-4 sm:gap-5 mb-8">
                  <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#7A153A] tracking-tight">
                    {activeSlide.price}
                  </span>

                  <Link
                    to="/celebration-boxes/pastel-rose"
                    className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-[#8A1538] hover:bg-[#72112E] shadow-[0_4px_14px_0_rgba(138,21,56,0.35)] hover:shadow-[0_6px_20px_0_rgba(138,21,56,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* 5. Feature Highlights Row */}
                <div className="flex items-center gap-3 sm:gap-5 pt-4 border-t border-[#F2D7DE] text-brand-ink-light text-xs font-semibold">
                  {activeSlide.features.map((feat, idx) => {
                    const Icon = feat.icon;
                    return (
                      <React.Fragment key={idx}>
                        {idx > 0 && <div className="w-[1px] h-6 bg-[#E8CFD5]" />}
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${feat.bg} ${feat.color} flex items-center justify-center shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="leading-tight">
                            <span className="block font-bold text-brand-ink">{feat.title}</span>
                            <span className="text-[11px] text-brand-ink-muted">{feat.sub}</span>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

              </div>

              {/* ========================================================
                  RIGHT COLUMN: PHOTOGRAPH CAROUSEL STAGE
                 ======================================================== */}
              <div className="lg:col-span-7 h-full w-full relative flex items-center justify-center p-3 sm:p-5 lg:p-0">
                <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[460px] rounded-2xl lg:rounded-none lg:rounded-r-[35px] overflow-hidden bg-white/40 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeSlide.id}
                      src={activeSlide.image}
                      alt={activeSlide.alt}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className={`w-full h-full ${activeSlide.imageFit} object-center filter drop-shadow-sm transition-transform duration-700 hover:scale-[1.02]`}
                      loading="eager"
                    />
                  </AnimatePresence>

                  {/* Subtle soft gradient fade towards text on desktop */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F6]/60 via-transparent to-transparent pointer-events-none hidden lg:block" />
                </div>
              </div>

            </div>

            {/* Bottom Slider Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 cursor-pointer ${
                    currentSlide === idx
                      ? 'w-6 h-2 rounded-full bg-[#7A153A]'
                      : 'w-2 h-2 rounded-full bg-[#E5BCC6] hover:bg-[#7A153A]/60'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>
      </Confetti>
    </section>
  );
};
