import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Cake,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Package,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { CHOCOLOOM_CONFIG, CakeFlavourOption } from '../config/chocoloomCakes';
import { CelebrationBoxLogo } from '../components/CelebrationBoxLogo';
import { formatPrice } from '../utils/currency';

export const CakesCatalogue: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBox, setSelectedBox] = useState<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  } | null>(null);

  // Check if user came from a CelebrationBox page with a pre-selected box
  useEffect(() => {
    try {
      const stored = localStorage.getItem('celebration_selected_box');
      if (stored) {
        setSelectedBox(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleClearSelectedBox = () => {
    try {
      localStorage.removeItem('celebration_selected_box');
    } catch {
      // ignore
    }
    setSelectedBox(null);
  };

  const handleCustomizeCake = (cakeId: string) => {
    navigate(`/cakes/customize/${cakeId}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB]">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-brand-ink/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs text-brand-ink-muted">
            <Link to="/" className="hover:text-brand-pink font-semibold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
            <span className="text-brand-ink font-bold">Cakes &amp; Combos</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10 sm:space-y-12">
        {/* 2. Top Collaboration Header */}
        <div className="rounded-3xl bg-gradient-to-br from-[#FFF5F8] via-white to-[#FFF8F3] border-2 border-brand-pink/20 p-6 sm:p-10 shadow-sm relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            {/* Logos & Cross Badge */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-white shadow-2xs border border-brand-ink/10 flex items-center">
                <CelebrationBoxLogo className="h-7 sm:h-9 w-auto" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-brand-pink">×</span>
              <div className="p-2 sm:p-2.5 rounded-2xl bg-white shadow-2xs border border-brand-ink/10 flex items-center gap-2">
                <img
                  src={CHOCOLOOM_CONFIG.logoUrl}
                  alt="Chocoloom"
                  className="h-7 sm:h-8 w-auto object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-sm sm:text-base font-extrabold text-brand-ink font-display">
                  Chocoloom
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink/15 text-brand-pink text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cakes by Chocoloom</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-brand-ink font-display tracking-tight">
                CelebrationBox × Chocoloom
              </h1>

              <p className="text-base sm:text-lg text-brand-ink-light font-medium italic">
                &ldquo;Beautiful Decorations. Delicious Cakes. One Perfect Celebration.&rdquo;
              </p>
            </div>

            <p className="text-xs sm:text-sm text-brand-ink-light max-w-xl mx-auto leading-relaxed">
              Order handcrafted artisan cakes freshly baked by Chocoloom in Bhimavaram, delivered together with your Celebration Box for a seamless, hassle-free party!
            </p>

            {/* Official Chocoloom Website Link */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <a
                href={CHOCOLOOM_CONFIG.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-brand-cream-50 border border-brand-ink/15 text-xs font-bold text-brand-ink hover:text-brand-pink transition-all shadow-2xs"
              >
                <span>Visit Official Chocoloom Website</span>
                <ExternalLink className="w-3.5 h-3.5 text-brand-pink" />
              </a>
            </div>
          </div>
        </div>

        {/* 3. Pairing Notice (If Arrived from CelebrationBox) */}
        {selectedBox ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50/70 to-amber-50/40 border border-brand-pink/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-pink text-white flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-pink block">
                  Pairing In Progress
                </span>
                <h4 className="text-sm font-extrabold text-brand-ink">
                  {selectedBox.productName} ({formatPrice(selectedBox.price)})
                </h4>
                <p className="text-xs text-brand-ink-muted">
                  Select a cake below to complete your celebration combo!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleClearSelectedBox}
                className="text-xs font-semibold text-brand-ink-muted hover:text-rose-600 px-3 py-1.5 rounded-lg border border-brand-ink/10 hover:bg-white transition-colors"
              >
                Clear Box Selection
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-brand-cream-50/80 border border-brand-ink/10 flex items-center justify-between gap-3 text-xs text-brand-ink-light">
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4 text-brand-teal shrink-0" />
              <span>
                Want to pair with our signature decoration kit? You can add the <strong>Pastel Rose Celebration Box (₹399)</strong> directly during cake customization!
              </span>
            </div>
            <Link
              to="/celebration-boxes/pastel-rose"
              className="text-brand-pink font-bold hover:underline shrink-0"
            >
              View Box Details →
            </Link>
          </div>
        )}

        {/* 4. Cake Catalogue Product Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-brand-ink/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-brand-ink font-display">
                Chocoloom Artisan Cake Catalogue
              </h2>
              <p className="text-xs text-brand-ink-muted">
                Available in 250g Bento, 500g Classic, 1kg, 1.5kg and 2kg party sizes
              </p>
            </div>
            <span className="text-xs font-bold text-brand-pink hidden sm:inline">
              {CHOCOLOOM_CONFIG.flavours.length} Signature Flavours
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {CHOCOLOOM_CONFIG.flavours.map((cake: CakeFlavourOption) => {
              const startingPrice = cake.pricing['250g'] || 219;
              return (
                <div
                  key={cake.id}
                  className="rounded-3xl bg-white border-2 border-brand-ink/10 hover:border-brand-pink/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Cake Photograph */}
                    <div className="relative aspect-[4/3] bg-pink-50/30 overflow-hidden">
                      <img
                        src={cake.image}
                        alt={cake.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {cake.isPopular && (
                        <span className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                          Bestseller
                        </span>
                      )}
                      <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-brand-ink text-[10px] font-black px-2 py-0.5 rounded-lg border border-brand-ink/10 shadow-2xs">
                        From {formatPrice(startingPrice)}
                      </span>
                    </div>

                    {/* Cake Info */}
                    <div className="p-5 sm:p-6 space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-lg font-black text-brand-ink font-display group-hover:text-brand-pink transition-colors">
                          {cake.name}
                        </h3>
                        <span className="text-base font-black text-brand-pink font-display">
                          {formatPrice(startingPrice)}
                        </span>
                      </div>

                      <p className="text-xs text-brand-pink font-semibold">
                        {cake.tagline}
                      </p>

                      <p className="text-xs text-brand-ink-light line-clamp-2 leading-relaxed">
                        {cake.description}
                      </p>

                      <div className="pt-2 border-t border-brand-ink/5 flex items-center justify-between text-[11px] text-brand-ink-muted">
                        <span>Sizes: 250g, 500g, 1kg+</span>
                        <span className="text-emerald-700 font-bold">100% Eggless Option</span>
                      </div>
                    </div>
                  </div>

                  {/* Action: Customize & Add -> /cakes/customize/:cakeId */}
                  <div className="p-5 sm:p-6 pt-0">
                    <button
                      type="button"
                      onClick={() => handleCustomizeCake(cake.id)}
                      className="w-full py-3 px-4 rounded-xl text-center text-xs sm:text-sm font-extrabold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-card transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Cake className="w-4 h-4 fill-white" />
                      <span>Customize &amp; Add</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
