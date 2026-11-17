import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface IntroVideoProps {
  onStartReveal?: () => void;
  onComplete: () => void;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ onStartReveal, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [needsInteraction, setNeedsInteraction] = useState<boolean>(false);

  const handleFinish = useCallback(() => {
    setIsFadingOut(true);
    if (onStartReveal) {
      onStartReveal();
    }
    setTimeout(() => {
      onComplete();
    }, 600); // Smooth 600ms fade transition into the website
  }, [onStartReveal, onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Prevent body scrolling during intro
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Attempt autoplay with sound first
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch(() => {
          // Browser autoplay policy blocked unmuted video; fallback to muted autoplay immediately
          video.muted = true;
          setIsMuted(true);
          video
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              // Both attempts blocked; show tap to start
              setNeedsInteraction(true);
            });
        });
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const handleUserInteraction = () => {
    const video = videoRef.current;
    if (!video) return;

    if (needsInteraction || video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        setNeedsInteraction(false);
      });
    } else if (video.muted) {
      // Unmute on first user touch anywhere on the video
      video.muted = false;
      setIsMuted(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  // Prevent right-click context menu and key skips
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disallow space, enter, escape, arrow keys from skipping or controlling video
      if (['Space', 'Enter', 'Escape', 'ArrowRight', 'ArrowLeft'].includes(e.code)) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      onClick={handleUserInteraction}
      onContextMenu={(e) => e.preventDefault()}
      className={`fixed inset-0 z-[999999] bg-black flex items-center justify-center select-none overflow-hidden transition-opacity duration-600 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ touchAction: 'none' }}
    >
      {/* Video Element (Highest Quality Fullscreen Presentation) */}
      <video
        ref={videoRef}
        src="/intro-video.mp4"
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleFinish}
        onError={handleFinish}
        className="w-full h-full object-contain sm:object-cover bg-black pointer-events-none"
      />

      {/* Floating Sound Toggle Button */}
      {isPlaying && (
        <button
          onClick={toggleSound}
          type="button"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          className="absolute top-5 right-5 sm:top-7 sm:right-7 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium border border-white/20 shadow-lg cursor-pointer transition-all active:scale-95"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-brand-pink" />
              <span className="hidden xs:inline">Tap for Sound</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span className="hidden xs:inline">Sound On</span>
            </>
          )}
        </button>
      )}

      {/* Tap to Begin prompt if browser blocked all autoplay */}
      {needsInteraction && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 p-6 text-center">
          <div className="px-6 py-3 rounded-full bg-brand-pink text-white font-bold text-sm sm:text-base shadow-xl animate-pulse">
            ▶ Tap Anywhere to Start Celebration
          </div>
        </div>
      )}

      {/* Thin Gold Progress Bar at the bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <div
          className="h-full bg-gradient-to-r from-brand-pink via-brand-marigold to-brand-teal transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
