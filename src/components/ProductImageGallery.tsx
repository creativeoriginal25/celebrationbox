import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn } from 'lucide-react';
import { ProductGalleryImage } from '../types';

interface ProductImageGalleryProps {
  images: ProductGalleryImage[];
  productName: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Reset to first image if images prop changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsZoomed(false);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-brand-cream-100 flex items-center justify-center border border-brand-ink/10 text-brand-ink-muted">
        No images available
      </div>
    );
  }

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, images.length]);

  return (
    <div className="flex flex-col space-y-4 select-none">
      {/* Main Image Stage */}
      <div className="relative group rounded-2xl bg-gradient-to-b from-white to-brand-cream-100 border border-brand-ink/10 shadow-sm overflow-hidden aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center">
        {/* Main Image */}
        <img
          src={currentImage.url}
          alt={currentImage.alt || productName}
          className="w-full h-full object-contain p-4 sm:p-6 transition-all duration-300 group-hover:scale-[1.02] cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
          loading="eager"
        />

        {/* View / Caption Pill */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-lg border border-brand-ink/10 shadow-xs text-[11px] font-bold text-brand-ink flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-pink" />
          <span>{currentImage.title || `View ${currentIndex + 1} of ${images.length}`}</span>
        </div>

        {/* Zoom Lightbox Trigger Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-brand-ink shadow-sm border border-brand-ink/10 transition-transform active:scale-95 cursor-pointer opacity-80 group-hover:opacity-100"
          title="Click to zoom / lightbox"
          aria-label="Enlarge image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Previous & Next Arrow Controls (Shown on hover or always accessible) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-brand-ink shadow-card border border-brand-ink/10 flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-brand-ink shadow-card border border-brand-ink/10 flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom Image Caption */}
        <div className="absolute bottom-2 inset-x-2 text-center pointer-events-none">
          <span className="inline-block bg-brand-ink/75 text-white text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur-xs">
            {currentImage.caption}
          </span>
        </div>
      </div>

      {/* Thumbnail Gallery Below Main Image */}
      {images.length > 1 && (
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={img.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl p-1.5 transition-all cursor-pointer bg-white overflow-hidden border ${
                  isSelected
                    ? 'border-brand-pink ring-2 ring-brand-pink/30 shadow-sm scale-102'
                    : 'border-brand-ink/10 hover:border-brand-ink/30 opacity-75 hover:opacity-100'
                }`}
                aria-label={`View ${img.title || `image ${idx + 1}`}`}
                aria-current={isSelected ? 'true' : 'false'}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
                {isSelected && (
                  <span className="absolute bottom-0 inset-x-0 h-1 bg-brand-pink" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink/90 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Product Image Lightbox"
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between mb-3 text-white">
              <div className="text-sm font-semibold">
                <span>{productName}</span>
                <span className="mx-2 text-white/50">•</span>
                <span className="text-white/80">{currentImage.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                  title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                  aria-label="Close Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Lightbox Main Stage */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-white rounded-2xl overflow-hidden flex items-center justify-center p-4 shadow-modal">
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className={`w-full h-full object-contain transition-transform duration-300 ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Lightbox Prev / Next */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-brand-ink shadow-modal flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-brand-ink shadow-modal flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Caption & Thumbnails */}
            <div className="mt-3 text-center text-xs text-white/80 max-w-xl">
              <p className="font-medium">{currentImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};