import React, { useRef, useState } from 'react';
import { ArrowRight, MessageCircle, RotateCcw, Play } from 'lucide-react';
import { ScrollReveal } from './react-bits/ScrollReveal';
import { ScrollExpand } from './react-bits/ScrollExpand';

interface HeroProps {
  onExplore: () => void;
  onOpenOrder: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenOrder }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsVideoEnded(false);
      setIsPlaying(true);
    }
  };

  const handleVideoEnded = () => {
    setIsVideoEnded(true);
    setIsPlaying(false);
  };

  return (
    <section id="home" className="relative pt-8 pb-14 md:pt-16 md:pb-20 overflow-hidden scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Headline & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <ScrollReveal yOffset={16} duration={0.5}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-brand-ink tracking-tight leading-[1.12]">
                Make Every Celebration{' '}
                <span className="text-brand-pink underline decoration-brand-marigold decoration-wavy decoration-3">
                  Special.
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal yOffset={20} duration={0.6} delay={0.1}>
              <p className="text-base sm:text-lg text-brand-ink-light max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Beautiful DIY birthday decorations, thoughtfully curated and packed into one celebration box.
              </p>
            </ScrollReveal>

            <ScrollReveal yOffset={20} duration={0.6} delay={0.2}>
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

              {/* Supporting Microcopy */}
              <div className="pt-4">
                <p className="text-xs sm:text-sm font-medium text-brand-ink-muted">
                  Curated DIY Kits • Easy to Set Up • Made for Your Moments
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: 10-Second Brand Animation Video in Modern Media Frame */}
          <div className="lg:col-span-5">
            <ScrollExpand minScale={0.97} maxScale={1.02}>
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-brand-ink/5 border border-brand-ink/10 shadow-card aspect-[16/10] sm:aspect-[4/3] group">
                {/* Video Element */}
                <video
                  ref={videoRef}
                  src="/videos/celebration-box-intro.mp4"
                  poster="/brand/logo.webp"
                  autoPlay
                  muted
                  playsInline
                  onEnded={handleVideoEnded}
                  onPlay={() => setIsPlaying(true)}
                  className="w-full h-full object-cover"
                  aria-label="Celebration Box Brand Introduction Video"
                />

                {/* Video Overlay Control: Subtle Replay Button */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                  {isVideoEnded ? (
                    <button
                      onClick={handleReplay}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-ink/80 hover:bg-brand-ink text-white text-xs font-semibold backdrop-blur-xs shadow-sm transition-all cursor-pointer"
                      aria-label="Replay brand intro animation"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-brand-marigold" />
                      <span>Replay Animation</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleReplay}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/50 hover:bg-black/70 text-white text-[11px] backdrop-blur-xs transition-opacity cursor-pointer"
                      aria-label="Replay intro"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Replay</span>
                    </button>
                  )}
                </div>

                {/* Subtle Brand Badge Overlay in corner */}
                <div className="absolute top-3 left-3 pointer-events-none">
                  <span className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-bold text-brand-ink border border-brand-ink/10 shadow-xs">
                    Celebration Box • Brand Intro
                  </span>
                </div>
              </div>
            </ScrollExpand>
          </div>

        </div>
      </div>
    </section>
  );
};
