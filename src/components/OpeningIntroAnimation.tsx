import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, X, ArrowRight, Sparkles } from 'lucide-react';

interface OpeningIntroAnimationProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OpeningIntroAnimation: React.FC<OpeningIntroAnimationProps> = ({
  isOpen,
  onComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // Start video on open
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {
        // Autoplay may be restricted without user interaction
      });
    }

    // Safety timeout: Auto-advance after 11s if onEnded doesn't fire
    const safetyTimer = setTimeout(() => {
      onComplete();
    }, 11500);

    return () => clearTimeout(safetyTimer);
  }, [isOpen, onComplete]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-cream-50 overflow-hidden"
          role="dialog"
          aria-label="Celebration Box Brand Introduction"
        >
          {/* Top Control Bar */}
          <div className="absolute top-5 left-0 right-0 max-w-5xl mx-auto px-6 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-pink animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase text-brand-ink">
                Celebration Box • Brand Reveal
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Unmute / Mute Button */}
              <button
                onClick={toggleSound}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-brand-ink text-xs font-semibold shadow-xs border border-brand-ink/10 transition-colors cursor-pointer"
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-brand-ink-muted" />
                    <span className="hidden sm:inline text-[11px]">Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-brand-pink" />
                    <span className="hidden sm:inline text-[11px]">Sound On</span>
                  </>
                )}
              </button>

              {/* Skip to Store Button */}
              <button
                onClick={onComplete}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-pink hover:bg-brand-pink-hover text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                aria-label="Skip brand intro and enter store"
              >
                <span>Enter Store</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Centered Opening Video Showcase */}
          <div className="relative w-full max-w-3xl px-4 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-black border-2 border-white/60"
            >
              <video
                ref={videoRef}
                src="/videos/celebration-box-intro.mp4"
                poster="/brand/logo.webp"
                autoPlay
                muted={isMuted}
                playsInline
                onEnded={onComplete}
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-cover"
              />

              {/* Progress Line along the bottom of the video */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
                <div
                  className="h-full bg-gradient-to-r from-brand-pink via-brand-marigold to-brand-teal transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>

            {/* Bottom Tagline Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="font-display font-extrabold text-xl sm:text-2xl text-brand-ink">
                Make Every Celebration <span className="text-brand-pink">Special.</span>
              </p>
              <p className="text-xs text-brand-ink-muted mt-1">
                Curated DIY Party Kits • Easy to Set Up • Made for Your Moments
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
