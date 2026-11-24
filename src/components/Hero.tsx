import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, PackageCheck, Sparkles, Truck } from 'lucide-react';
import { Confetti, ConfettiRef } from './react-bits/Confetti';

interface HeroProps {
  onExplore: () => void;
  onOpenOrder?: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenOrder }) => {
  const confettiRef = useRef<ConfettiRef>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides configuration (featuring Pastel Rose as the flagship hero)
  const slides = [
    {
      id: 'pastel-rose',
      tag: 'BIRTHDAY DECORATION KIT',
      title: 'Pastel Rose Celebration Box',
      subtitle:
        'A premium DIY decoration kit with a perfect pastel setup for a memorable birthday.',
      price: '₹399',
      image: '/products/pastel-rose-setup.jpg',
      alt: 'Pastel Rose Celebration Box birthday setup with balloon arch and cake',
    },
  ];

  useEffect(() => {
    // Subtle celebratory confetti on initial entrance
    const timer = setTimeout(() => {
      confettiRef.current?.cannons();
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

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
            
            {/* Left Carousel Arrow Button */}
            <button
              type="button"
              onClick={handlePrevSlide}
              aria-label="Previous Slide"
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-brand-ink hover:text-[#8A1538] shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-brand-ink/5"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Carousel Arrow Button */}
            <button
              type="button"
              onClick={handleNextSlide}
              aria-label="Next Slide"
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-brand-ink hover:text-[#8A1538] shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border border-brand-ink/5"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

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
                <p className="text-sm sm:text-base text-[#5A5A6E] leading-relaxed mb-6 max-w-md">
                  {activeSlide.subtitle}
                </p>

                {/* 4. Price & Shop Now Action Row */}
                <div className="flex items-center gap-4 sm:gap-5 mb-8">
                  <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#7A153A] tracking-tight">
                    {activeSlide.price}
                  </span>

                  <button
                    onClick={onExplore}
                    className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-[#8A1538] hover:bg-[#72112E] shadow-[0_4px_14px_0_rgba(138,21,56,0.35)] hover:shadow-[0_6px_20px_0_rgba(138,21,56,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 5. Feature Highlights Row */}
                <div className="flex items-center gap-4 sm:gap-6 pt-4 border-t border-[#F2D7DE] text-brand-ink-light text-xs font-semibold">
                  {/* Complete DIY Kit */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FFEBF0] text-[#D81B60] flex items-center justify-center shrink-0">
                      <PackageCheck className="w-4 h-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="block font-bold text-brand-ink">Complete</span>
                      <span className="text-[11px] text-brand-ink-muted">DIY Kit</span>
                    </div>
                  </div>

                  <div className="w-[1px] h-6 bg-[#E8CFD5]" />

                  {/* Easy Setup */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#FFF4E5] text-[#FFB400] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="block font-bold text-brand-ink">Easy</span>
                      <span className="text-[11px] text-brand-ink-muted">Setup</span>
                    </div>
                  </div>

                  <div className="w-[1px] h-6 bg-[#E8CFD5]" />

                  {/* Fast Delivery */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#E0F7F6] text-[#00A8A8] flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div className="leading-tight">
                      <span className="block font-bold text-brand-ink">Fast</span>
                      <span className="text-[11px] text-brand-ink-muted">Delivery</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ========================================================
                  RIGHT COLUMN: FULL LIFESTYLE SETUP PHOTOGRAPH
                 ======================================================== */}
              <div className="lg:col-span-7 h-full w-full relative flex items-center justify-center p-3 sm:p-5 lg:p-0">
                <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] lg:h-[460px] rounded-2xl lg:rounded-none lg:rounded-r-[35px] overflow-hidden">
                  <img
                    src={activeSlide.image}
                    alt={activeSlide.alt}
                    className="w-full h-full object-cover object-center filter drop-shadow-sm transition-transform duration-700 hover:scale-[1.02]"
                    loading="eager"
                  />
                  {/* Subtle soft gradient fade towards text on desktop */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F6]/60 via-transparent to-transparent pointer-events-none hidden lg:block" />
                </div>
              </div>

            </div>

            {/* Bottom Slider Pagination Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7A153A]" />
              <span className="w-2 h-2 rounded-full bg-[#E5BCC6]" />
              <span className="w-2 h-2 rounded-full bg-[#E5BCC6]" />
            </div>

          </div>

        </div>
      </Confetti>
    </section>
  );
};
