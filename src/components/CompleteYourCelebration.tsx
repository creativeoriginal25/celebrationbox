import React, { useState } from 'react';
import {
  Cake,
  Package,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Heart,
  Lightbulb,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CHOCOLOOM_CONFIG,
  CakeCustomizationState,
  DEFAULT_CAKE_CUSTOMIZATION,
  calculateCakePrice,
  getCakeFlavour,
  getCakeDesign,
} from '../config/chocoloomCakes';
import { CakeCustomizerFields } from './CakeCustomizerFields';
import { formatPrice } from '../utils/currency';

interface CompleteYourCelebrationProps {
  onOrderBoxOnly?: () => void;
  onOrderCombo?: (cakeState: CakeCustomizationState, wantsLighting: boolean) => void;
}

export const CompleteYourCelebration: React.FC<CompleteYourCelebrationProps> = ({
  onOrderBoxOnly,
  onOrderCombo,
}) => {
  // Mode selection: 'combo' vs 'box-only'
  const [selectedPlan, setSelectedPlan] = useState<'combo' | 'box-only'>('combo');

  // Interactive cake state
  const [cakeState, setCakeState] = useState<CakeCustomizationState>({
    ...DEFAULT_CAKE_CUSTOMIZATION,
    includeCake: true,
  });

  // Optional lighting rental
  const [wantsLighting, setWantsLighting] = useState<boolean>(false);

  // Dynamic pricing calculation
  const boxBasePrice = CHOCOLOOM_CONFIG.baseBoxPrice; // ₹399
  const currentCakePrice = selectedPlan === 'combo' ? calculateCakePrice(cakeState) : 0;
  const lightingDepositNote = wantsLighting ? 50 : 0; // nominal add-on rental indicator
  const grandTotal = boxBasePrice + currentCakePrice;

  const currentFlavour = getCakeFlavour(cakeState.flavourId);
  const currentDesign = getCakeDesign(cakeState.designId);
  const sizeOption = CHOCOLOOM_CONFIG.sizes.find((s) => s.id === cakeState.size);

  const handleProceedOrder = () => {
    if (selectedPlan === 'combo') {
      if (onOrderCombo) {
        onOrderCombo(cakeState, wantsLighting);
      }
    } else {
      if (onOrderBoxOnly) {
        onOrderBoxOnly();
      }
    }
  };

  return (
    <section id="cake-combo" className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-[#FFFDFB] via-[#FFF5F8] to-[#FFFDFB] border-y border-brand-pink/10 scroll-mt-24">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-pink/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-amber-500/10 border border-brand-pink/20 text-brand-pink text-xs font-extrabold uppercase tracking-widest shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exclusive Collaboration</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-brand-ink font-display tracking-tight">
            Complete Your Celebration
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-brand-ink-light font-medium leading-relaxed">
            Beautiful Decorations. Delicious Cakes. One Perfect Celebration.
          </p>

          {/* Chocoloom Badge & External Explore Link */}
          <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-brand-ink/10 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-extrabold text-brand-ink">
                Cakes by Chocoloom
              </span>
            </div>
            <a
              href={CHOCOLOOM_CONFIG.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-pink/10 hover:bg-brand-pink/15 text-brand-pink text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Explore Chocoloom Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 1. SELECTION CARDS: CELEBRATIONBOX ONLY vs CELEBRATIONBOX + CHOCOLOOM CAKE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto mb-10">
          {/* OPTION A: CELEBRATIONBOX ONLY */}
          <div
            onClick={() => setSelectedPlan('box-only')}
            className={`relative rounded-3xl p-6 sm:p-7 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlan === 'box-only'
                ? 'border-brand-pink bg-white shadow-xl ring-2 ring-brand-pink/20'
                : 'border-brand-ink/10 bg-white/70 hover:border-brand-pink/40 hover:bg-white'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-cream-100 text-brand-ink flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-ink-muted block font-semibold">Kit Price</span>
                  <span className="text-2xl font-black text-brand-ink font-display">₹399</span>
                </div>
              </div>

              <h3 className="text-xl font-black text-brand-ink mb-1.5 font-display">
                CelebrationBox Only
              </h3>
              <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed mb-4">
                Signature DIY Birthday Decoration Kit. 56 aesthetic balloons, shimmering backdrop, banner, candles and tape.
              </p>

              <ul className="space-y-2 text-xs text-brand-ink font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full 56-Piece Birthday Kit</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Campus Pickup or Nearby Delivery</span>
                </li>
                <li className="flex items-center gap-2 text-brand-ink-muted">
                  <span className="w-4 text-center">—</span>
                  <span>Does not include birthday cake</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-ink/5 flex items-center justify-between">
              <span className={`text-xs font-bold ${selectedPlan === 'box-only' ? 'text-brand-pink' : 'text-brand-ink-muted'}`}>
                {selectedPlan === 'box-only' ? '✓ Selected Plan' : 'Select Box Only'}
              </span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  selectedPlan === 'box-only'
                    ? 'bg-brand-pink text-white'
                    : 'border-2 border-brand-ink/20'
                }`}
              >
                {selectedPlan === 'box-only' && <span className="text-xs">✓</span>}
              </div>
            </div>
          </div>

          {/* OPTION B: CELEBRATIONBOX + CHOCOLOOM CAKE COMBO (FEATURED) */}
          <div
            onClick={() => setSelectedPlan('combo')}
            className={`relative rounded-3xl p-6 sm:p-7 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlan === 'combo'
                ? 'border-brand-pink bg-gradient-to-b from-white via-pink-50/20 to-white shadow-xl ring-2 ring-brand-pink/25'
                : 'border-brand-ink/10 bg-white/70 hover:border-brand-pink/40 hover:bg-white'
            }`}
          >
            {/* Best Value Badge */}
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 fill-white" />
              <span>Complete Birthday Combo</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-sm">
                  <Cake className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="text-xs text-brand-pink block font-bold">Combo Price</span>
                  <span className="text-2xl font-black text-brand-pink font-display">
                    ₹399 + Cake Price
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-black text-brand-ink mb-1.5 font-display flex items-center gap-2">
                <span>CelebrationBox + Chocoloom Cake</span>
              </h3>
              <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed mb-4">
                Complete all-in-one celebration! Signature room decoration kit paired with an artisan customized cake by Chocoloom.
              </p>

              <ul className="space-y-2 text-xs text-brand-ink font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full 56-Piece Birthday Decoration Kit</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Choice of 6 Gourmet Cake Flavours & 5 Sizes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom name on cake, diet choice & photo references</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Delivered together fresh to campus or room</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-ink/5 flex items-center justify-between">
              <span className={`text-xs font-bold ${selectedPlan === 'combo' ? 'text-brand-pink' : 'text-brand-ink-muted'}`}>
                {selectedPlan === 'combo' ? '✓ Selected Plan (Customize Below)' : 'Select Combo'}
              </span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  selectedPlan === 'combo'
                    ? 'bg-brand-pink text-white'
                    : 'border-2 border-brand-ink/20'
                }`}
              >
                {selectedPlan === 'combo' && <span className="text-xs">✓</span>}
              </div>
            </div>
          </div>
        </div>

        {/* 2. INTERACTIVE CAKE CUSTOMIZER SECTION (DISPLAYED WHEN COMBO IS SELECTED) */}
        <AnimatePresence>
          {selectedPlan === 'combo' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto mb-10"
            >
              <div className="rounded-3xl bg-white border border-brand-pink/20 shadow-xl overflow-hidden">
                {/* Customizer Sub-header */}
                <div className="px-6 py-5 bg-gradient-to-r from-pink-500/10 via-rose-500/5 to-amber-500/10 border-b border-brand-pink/15 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-pink text-white flex items-center justify-center shadow-xs">
                      <Cake className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-brand-ink font-display">
                        Customize Your Chocoloom Cake
                      </h3>
                      <p className="text-xs text-brand-ink-light">
                        Select flavour, weight, aesthetic design & custom birthday name
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-brand-pink/30 text-xs font-bold text-brand-pink shadow-2xs">
                    <span>Cake Total:</span>
                    <span className="font-extrabold text-sm font-display">
                      {formatPrice(currentCakePrice)}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <CakeCustomizerFields
                    cakeState={cakeState}
                    onChange={(updater) => setCakeState((prev) => updater(prev))}
                    showToggleHeader={false}
                  />

                  {/* Optional Decorative Lighting Rental Add-on */}
                  <div className="mt-6 pt-6 border-t border-brand-ink/10">
                    <div className="flex items-start justify-between gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Lightbulb className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-brand-ink">
                              Add Milky-White Decorative Lighting on Rent ✨
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                              Optional Rental
                            </span>
                          </div>
                          <p className="text-xs text-brand-ink-light mt-0.5">
                            Gives your room a magical warm celebration glow. Rental duration & return arranged on WhatsApp.
                          </p>
                        </div>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1 select-none">
                        <input
                          type="checkbox"
                          checked={wantsLighting}
                          onChange={(e) => setWantsLighting(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. DYNAMIC ORDER SUMMARY BAR & CTA */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-brand-ink text-white p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-brand-pink">
                    Live Order Summary
                  </span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-300">
                    Real-time calculation
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black font-display text-white">
                  {selectedPlan === 'combo' ? (
                    <>CelebrationBox + {currentFlavour.name} Cake</>
                  ) : (
                    <>CelebrationBox Only</>
                  )}
                </h3>

                <div className="text-xs sm:text-sm text-slate-300 space-y-1">
                  <p>
                    • CelebrationBox (56-piece kit): <strong>₹{boxBasePrice}</strong>
                  </p>
                  {selectedPlan === 'combo' && (
                    <p>
                      • Chocoloom Cake ({sizeOption?.label || cakeState.size}, {cakeState.dietType === 'eggless' ? 'Eggless' : 'Egg'}, {currentDesign.name}):{' '}
                      <strong>+{formatPrice(currentCakePrice)}</strong>
                    </p>
                  )}
                  {wantsLighting && (
                    <p className="text-amber-300">
                      • Milky-White Decorative Lighting Rental Enquiry: <strong>Included</strong>
                    </p>
                  )}
                  {cakeState.nameOnCake && selectedPlan === 'combo' && (
                    <p className="text-pink-300">
                      • Name on Cake: &ldquo;{cakeState.nameOnCake}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-4 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-xs text-slate-400 block font-medium">Grand Total</span>
                  <div className="text-3xl sm:text-4xl font-black text-white font-display">
                    {formatPrice(grandTotal)}
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Campus pickup FREE • Delivered together
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleProceedOrder}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-pink via-pink-600 to-rose-600 hover:from-brand-pink-hover hover:to-rose-700 text-white font-extrabold text-sm sm:text-base shadow-xl hover:shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-5 h-5 fill-white" />
                  <span>
                    {selectedPlan === 'combo' ? 'Order Birthday Combo' : 'Order CelebrationBox Only'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
