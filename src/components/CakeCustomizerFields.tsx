import React, { useRef } from 'react';
import { Cake, Sparkles, Image as ImageIcon, X, Check, Heart } from 'lucide-react';
import {
  CHOCOLOOM_CONFIG,
  CakeCustomizationState,
  CakeSize,
  CakeDietType,
  calculateCakePrice,
} from '../config/chocoloomCakes';
import { formatPrice } from '../utils/currency';

interface CakeCustomizerFieldsProps {
  cakeState: CakeCustomizationState;
  onChange: (updater: (prev: CakeCustomizationState) => CakeCustomizationState) => void;
  showToggleHeader?: boolean;
}

export const CakeCustomizerFields: React.FC<CakeCustomizerFieldsProps> = ({
  cakeState,
  onChange,
  showToggleHeader = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleInclude = (include: boolean) => {
    onChange((prev) => ({ ...prev, includeCake: include }));
  };

  const handleSelectFlavour = (flavourId: string) => {
    onChange((prev) => ({ ...prev, flavourId }));
  };

  const handleSelectSize = (size: CakeSize) => {
    onChange((prev) => ({ ...prev, size }));
  };

  const handleSelectDiet = (dietType: CakeDietType) => {
    onChange((prev) => ({ ...prev, dietType }));
  };

  const handleSelectDesign = (designId: string) => {
    onChange((prev) => ({ ...prev, designId }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('Please upload an image smaller than 4MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChange((prev) => ({
        ...prev,
        referenceImage: dataUrl,
        referenceImageName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onChange((prev) => ({
      ...prev,
      referenceImage: undefined,
      referenceImageName: undefined,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentPrice = calculateCakePrice(cakeState);

  return (
    <div className="space-y-4">
      {/* Optional Toggle Header */}
      {showToggleHeader && (
        <div className="flex items-start justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50/50 to-amber-50/30 border border-brand-pink/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-pink text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm sm:text-base font-extrabold text-brand-ink font-display">
                  Add a Cake by Chocoloom ✨
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-pink/15 text-brand-pink border border-brand-pink/20">
                  Cakes by Chocoloom
                </span>
              </div>
              <p className="text-xs text-brand-ink-light mt-0.5">
                Freshly baked artisanal birthday cake delivered alongside your Celebration Box.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1 select-none">
            <input
              type="checkbox"
              checked={cakeState.includeCake}
              onChange={(e) => handleToggleInclude(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
          </label>
        </div>
      )}

      {/* Expanded Customizer Controls */}
      {cakeState.includeCake && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-pink/20 shadow-xs space-y-5 animate-fadeIn">
          {/* Header & Live Price */}
          <div className="flex items-center justify-between pb-3 border-b border-brand-ink/5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                Customize Chocoloom Cake
              </span>
              <p className="text-[11px] text-brand-ink-muted">
                Baked fresh in Bhimavaram for your celebration
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-brand-ink-muted block font-medium">Cake Price</span>
              <span className="text-base sm:text-lg font-extrabold text-brand-pink font-display">
                +{formatPrice(currentPrice)}
              </span>
            </div>
          </div>

          {/* 1. FLAVOUR SELECTION */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                1. Select Cake Flavour
              </label>
              <span className="text-[11px] text-brand-ink-muted">
                {CHOCOLOOM_CONFIG.flavours.length} gourmet options
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CHOCOLOOM_CONFIG.flavours.map((flavour) => {
                const isSelected = cakeState.flavourId === flavour.id;
                const flavourPrice = flavour.pricing[cakeState.size];
                return (
                  <button
                    key={flavour.id}
                    type="button"
                    onClick={() => handleSelectFlavour(flavour.id)}
                    className={`relative p-2.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer group ${
                      isSelected
                        ? 'border-brand-pink bg-pink-50/50 shadow-xs'
                        : 'border-brand-ink/10 bg-white hover:border-brand-pink/40 hover:bg-[#FFFDFB]'
                    }`}
                  >
                    {flavour.isPopular && (
                      <span className="absolute -top-2 right-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow-2xs">
                        Bestseller
                      </span>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={flavour.image}
                        alt={flavour.name}
                        className="w-10 h-10 rounded-lg object-cover border border-brand-ink/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-brand-ink leading-tight truncate">
                          {flavour.name}
                        </h5>
                        <span className="text-[10px] text-brand-ink-muted line-clamp-1">
                          {flavour.tagline}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-brand-ink/5 text-[11px]">
                      <span className="font-extrabold text-brand-ink">
                        {formatPrice(flavourPrice)}
                      </span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-brand-pink text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SIZE & DIET TOGGLE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cake Size */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-brand-ink block mb-2">
                2. Cake Size / Weight
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CHOCOLOOM_CONFIG.sizes.map((s) => {
                  const isSelected = cakeState.size === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectSize(s.id)}
                      className={`py-2 px-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-brand-pink bg-pink-50/70 text-brand-pink font-bold shadow-2xs'
                          : 'border-brand-ink/15 bg-white text-brand-ink hover:border-brand-ink/30'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">{s.label}</div>
                      <div className="text-[10px] text-brand-ink-muted leading-tight mt-0.5">
                        {s.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Diet Type (Eggless / Contains Egg) */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-brand-ink block mb-2">
                3. Dietary Preference
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDiet('eggless')}
                  className={`py-3 px-3 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    cakeState.dietType === 'eggless'
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-extrabold ring-1 ring-emerald-500/30'
                      : 'border-brand-ink/15 bg-white text-brand-ink hover:border-brand-ink/30'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                  <span className="text-xs">100% Eggless</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectDiet('contains_egg')}
                  className={`py-3 px-3 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    cakeState.dietType === 'contains_egg'
                      ? 'border-amber-500 bg-amber-50/70 text-amber-900 font-extrabold ring-1 ring-amber-500/30'
                      : 'border-brand-ink/15 bg-white text-brand-ink hover:border-brand-ink/30'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
                  <span className="text-xs">Regular (Egg)</span>
                </button>
              </div>
              <p className="text-[11px] text-brand-ink-muted mt-2">
                All eggless cakes are baked in dedicated vegetarian ovens with premium vegetarian ingredients.
              </p>
            </div>
          </div>

          {/* 3. DESIGN SELECTION */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                4. Select Cake Style & Design
              </label>
              <span className="text-[11px] text-brand-ink-muted">Aesthetic styles</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CHOCOLOOM_CONFIG.designs.map((design) => {
                const isSelected = cakeState.designId === design.id;
                return (
                  <button
                    key={design.id}
                    type="button"
                    onClick={() => handleSelectDesign(design.id)}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-brand-pink bg-pink-50/50 shadow-xs'
                        : 'border-brand-ink/10 bg-white hover:border-brand-pink/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={design.image}
                        alt={design.name}
                        className="w-10 h-10 rounded-lg object-cover border border-brand-ink/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <h6 className="text-xs font-bold text-brand-ink leading-tight truncate">
                          {design.name}
                        </h6>
                        <span className="text-[10px] text-brand-ink-muted line-clamp-1">
                          {design.tagline}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-brand-ink/5 text-[11px]">
                      <span className="text-[10px] text-brand-pink font-semibold">
                        {design.additionalCost > 0 ? `+${formatPrice(design.additionalCost)}` : 'Included'}
                      </span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-brand-pink text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. TEXT ON CAKE & MESSAGE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-brand-ink mb-1">
                Name on Cake <span className="text-brand-ink-muted font-normal">(optional)</span>
              </label>
              <input
                type="text"
                maxLength={25}
                placeholder="e.g. Sneha / Rahul / Ananya"
                value={cakeState.nameOnCake}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange((prev) => ({ ...prev, nameOnCake: val }));
                }}
                className="w-full px-3 py-2 rounded-xl border border-brand-ink/15 bg-white text-xs sm:text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink mb-1">
                Card / Cake Message <span className="text-brand-ink-muted font-normal">(optional)</span>
              </label>
              <input
                type="text"
                maxLength={60}
                placeholder="e.g. Happy 21st Birthday Sneha! ✨"
                value={cakeState.customMessage}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange((prev) => ({ ...prev, customMessage: val }));
                }}
                className="w-full px-3 py-2 rounded-xl border border-brand-ink/15 bg-white text-xs sm:text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink"
              />
            </div>
          </div>

          {/* 5. REFERENCE PHOTO UPLOAD (OPTIONAL) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-brand-ink">
                Reference Image for Custom Design <span className="text-brand-ink-muted font-normal">(optional)</span>
              </label>
              <span className="text-[11px] text-brand-ink-muted">Pinterest / Instagram photo</span>
            </div>

            {cakeState.referenceImage ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-pink-50/50 border border-brand-pink/20">
                <img
                  src={cakeState.referenceImage}
                  alt="Reference Design"
                  className="w-14 h-14 rounded-lg object-cover border border-brand-pink/30 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-brand-ink truncate">
                    {cakeState.referenceImageName || 'Uploaded Cake Design'}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    ✓ Attached to WhatsApp order summary
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 rounded-lg text-brand-ink-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="cake-reference-file-input"
                />
                <label
                  htmlFor="cake-reference-file-input"
                  className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-brand-ink/20 hover:border-brand-pink/50 bg-[#FFFDFB] text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-pink">
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload Custom Cake Reference Photo</span>
                  </div>
                  <p className="text-[10px] text-brand-ink-muted">
                    Found an aesthetic design on Pinterest? Upload it and Chocoloom will recreate it.
                  </p>
                </label>
              </div>
            )}
          </div>

          {/* 6. SPECIAL INSTRUCTIONS */}
          <div>
            <label className="block text-xs font-bold text-brand-ink mb-1">
              Special Instructions / Allergy Notes <span className="text-brand-ink-muted font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              maxLength={150}
              placeholder="e.g. Less sweetness preferred, need extra golden candle, call upon gate arrival."
              value={cakeState.specialInstructions}
              onChange={(e) => {
                const val = e.target.value;
                onChange((prev) => ({ ...prev, specialInstructions: val }));
              }}
              className="w-full px-3 py-2 rounded-xl border border-brand-ink/15 bg-white text-xs sm:text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink"
            />
          </div>
        </div>
      )}
    </div>
  );
};
