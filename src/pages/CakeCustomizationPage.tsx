import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Cake,
  Sparkles,
  Package,
  ArrowRight,
  ChevronRight,
  Upload,
  X,
  Check,
  CheckCircle2,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
} from 'lucide-react';
import {
  CHOCOLOOM_CONFIG,
  CakeCustomizationState,
  CakeSize,
  CakeDietType,
  calculateCakePrice,
  getCakeFlavour,
  getCakeDesign,
  DEFAULT_CAKE_CUSTOMIZATION,
} from '../config/chocoloomCakes';
import { PRODUCTS } from '../config/products';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { CelebrationBoxLogo } from '../components/CelebrationBoxLogo';

export const CakeCustomizationPage: React.FC = () => {
  const { cakeId } = useParams<{ cakeId: string }>();
  const navigate = useNavigate();
  const { addComboToCart } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback to first flavour if cakeId not found
  const initialFlavour =
    CHOCOLOOM_CONFIG.flavours.find((f) => f.id === cakeId) || CHOCOLOOM_CONFIG.flavours[0];

  // Customization state
  const [cakeState, setCakeState] = useState<CakeCustomizationState>({
    ...DEFAULT_CAKE_CUSTOMIZATION,
    flavourId: initialFlavour.id,
    includeCake: true,
  });

  // Pairing with CelebrationBox: default true if stored or desired
  const [includeBox, setIncludeBox] = useState<boolean>(true);
  const [wantsLighting, setWantsLighting] = useState<boolean>(false);

  // Check stored box from previous page
  const defaultBox = PRODUCTS.find((p) => p.slug === 'pastel-rose') || PRODUCTS[0];

  useEffect(() => {
    try {
      const stored = localStorage.getItem('celebration_selected_box');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.wantsLighting) {
          setWantsLighting(true);
        }
        setIncludeBox(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Update flavour when URL param changes
  useEffect(() => {
    if (cakeId) {
      const found = CHOCOLOOM_CONFIG.flavours.find((f) => f.id === cakeId);
      if (found) {
        setCakeState((prev) => ({ ...prev, flavourId: found.id }));
      }
    }
  }, [cakeId]);

  const currentFlavour = getCakeFlavour(cakeState.flavourId);
  const currentDesign = getCakeDesign(cakeState.designId);
  const currentSizeObj = CHOCOLOOM_CONFIG.sizes.find((s) => s.id === cakeState.size);

  // Pricing calculations
  const cakePrice = calculateCakePrice(cakeState);
  const boxPrice = includeBox ? defaultBox.price : 0;
  const grandTotal = boxPrice + cakePrice;

  // Image Upload handler
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
      setCakeState((prev) => ({
        ...prev,
        referenceImage: dataUrl,
        referenceImageName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCakeState((prev) => ({
      ...prev,
      referenceImage: undefined,
      referenceImageName: undefined,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add Combo to Cart handler
  const handleAddComboToCart = () => {
    const comboTitle = includeBox
      ? `${defaultBox.name} + ${currentFlavour.name} Cake Combo`
      : `${currentFlavour.name} Birthday Cake (${currentSizeObj?.label || cakeState.size})`;

    addComboToCart({
      name: comboTitle,
      price: grandTotal,
      image: currentFlavour.image,
      quantity: 1,
      isCombo: includeBox,
      boxId: includeBox ? defaultBox.id : undefined,
      boxName: includeBox ? defaultBox.name : undefined,
      boxPrice: includeBox ? defaultBox.price : undefined,
      cakeDetails: {
        includeCake: true,
        flavourId: currentFlavour.id,
        flavourName: currentFlavour.name,
        size: cakeState.size,
        dietType: cakeState.dietType,
        designId: currentDesign.id,
        designName: currentDesign.name,
        nameOnCake: cakeState.nameOnCake.trim(),
        customMessage: cakeState.customMessage.trim(),
        referenceImage: cakeState.referenceImage,
        referenceImageName: cakeState.referenceImageName,
        specialInstructions: cakeState.specialInstructions.trim(),
        cakePrice,
      },
      wantsLightingRental: wantsLighting,
    });

    // Clear temporary stored box selection
    try {
      localStorage.removeItem('celebration_selected_box');
    } catch {
      // ignore
    }

    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] pb-24 md:pb-16">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-brand-ink/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs text-brand-ink-muted">
            <Link to="/" className="hover:text-brand-pink font-semibold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
            <Link to="/cakes" className="hover:text-brand-pink font-semibold transition-colors">
              Cakes &amp; Combos
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
            <span className="text-brand-ink font-bold">{currentFlavour.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Collaboration Branding Bar */}
        <div className="mb-8 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50/50 to-amber-50/30 border border-brand-pink/20 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-brand-pink text-white flex items-center justify-center shrink-0">
              <Cake className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-black text-brand-ink block">
                CelebrationBox × Chocoloom Cake Studio
              </span>
              <p className="text-[11px] text-brand-ink-light">
                Freshly baked artisan cakes crafted exclusively for Celebration Box customers in Bhimavaram.
              </p>
            </div>
          </div>

          <a
            href={CHOCOLOOM_CONFIG.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-pink hover:underline"
          >
            <span>Explore Chocoloom</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* 2-COLUMN LAYOUT: Left Preview & Gallery | Right Customization Options */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* ========================================================== */}
          {/* LEFT SIDE: Large Cake Image, Description & Live Preview   */}
          {/* ========================================================== */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Main Cake Image */}
              <div className="rounded-3xl overflow-hidden bg-white border-2 border-brand-pink/20 shadow-card">
                <div className="relative aspect-square overflow-hidden bg-pink-50/20">
                  <img
                    src={currentFlavour.image}
                    alt={currentFlavour.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full border border-brand-pink/20 text-xs font-extrabold text-brand-pink shadow-xs">
                    {currentSizeObj?.label || cakeState.size}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-brand-ink/90 backdrop-blur-xs text-white p-3 rounded-2xl shadow-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-pink-300 font-bold block uppercase tracking-wider">
                        Active Flavour
                      </span>
                      <h4 className="text-sm font-black truncate">{currentFlavour.name}</h4>
                    </div>
                    <span className="text-base font-black text-brand-pink font-display">
                      +{formatPrice(cakePrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Selected Customization Preview Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-brand-ink/10 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-brand-ink/5 pb-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                    Live Customization Summary
                  </h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {cakeState.dietType === 'eggless' ? '100% Eggless 🟢' : 'Contains Egg 🥚'}
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs text-brand-ink-light">
                  <li>
                    • Flavour: <strong className="text-brand-ink">{currentFlavour.name}</strong>
                  </li>
                  <li>
                    • Size: <strong className="text-brand-ink">{currentSizeObj?.label}</strong> ({currentSizeObj?.description})
                  </li>
                  <li>
                    • Design Style: <strong className="text-brand-ink">{currentDesign.name}</strong>
                    {currentDesign.additionalCost > 0 && ` (+${formatPrice(currentDesign.additionalCost)})`}
                  </li>
                  {cakeState.nameOnCake && (
                    <li className="text-brand-pink font-semibold">
                      • Name on Cake: &ldquo;{cakeState.nameOnCake}&rdquo;
                    </li>
                  )}
                  {cakeState.customMessage && (
                    <li className="text-brand-pink font-semibold">
                      • Message: &ldquo;{cakeState.customMessage}&rdquo;
                    </li>
                  )}
                  {cakeState.referenceImage && (
                    <li className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Custom Reference Photo Attached</span>
                    </li>
                  )}
                </ul>

                {includeBox && (
                  <div className="pt-2.5 border-t border-brand-ink/5 flex items-center justify-between text-xs">
                    <span className="text-brand-ink font-bold flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-brand-pink" />
                      <span>{defaultBox.name} (56 balloons)</span>
                    </span>
                    <span className="font-extrabold text-brand-ink">{formatPrice(defaultBox.price)}</span>
                  </div>
                )}
              </div>

              {/* Chocoloom Quality Assurance */}
              <div className="p-4 rounded-2xl bg-[#FFF8F3] border border-amber-200/60 text-xs text-brand-ink-light space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Chocoloom Bakery Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Every cake is freshly baked to order on the day of your celebration using premium cocoa and fresh cream. Delivery is coordinated directly with your Celebration Box.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* RIGHT SIDE: Interactive Customization Form Controls        */}
          {/* ========================================================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header & Dynamic Price */}
            <div className="p-5 rounded-2xl bg-white border border-brand-ink/10 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs text-brand-ink-muted uppercase font-bold tracking-wider block">
                  Customize Cake
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-brand-ink font-display">
                  {currentFlavour.name}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-brand-ink-muted block font-semibold">Cake Total</span>
                <span className="text-2xl sm:text-3xl font-black text-brand-pink font-display">
                  {formatPrice(cakePrice)}
                </span>
              </div>
            </div>

            {/* 1. SELECT FLAVOUR */}
            <div className="p-5 rounded-2xl bg-white border border-brand-ink/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                  1. Cake Flavour
                </label>
                <span className="text-[11px] text-brand-ink-muted">Tap to switch flavour</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CHOCOLOOM_CONFIG.flavours.map((flavour) => {
                  const isSelected = cakeState.flavourId === flavour.id;
                  const price = flavour.pricing[cakeState.size] || 449;
                  return (
                    <button
                      key={flavour.id}
                      type="button"
                      onClick={() => setCakeState((prev) => ({ ...prev, flavourId: flavour.id }))}
                      className={`p-2.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-brand-pink bg-pink-50/50 shadow-xs ring-1 ring-brand-pink/30'
                          : 'border-brand-ink/10 bg-white hover:border-brand-pink/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <img
                          src={flavour.image}
                          alt={flavour.name}
                          className="w-9 h-9 rounded-lg object-cover shrink-0 border border-brand-ink/10"
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-brand-ink truncate">{flavour.name}</h5>
                          <span className="text-[10px] text-brand-ink-muted block truncate">
                            {flavour.tagline}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-brand-ink/5 text-[11px]">
                        <span className="font-extrabold text-brand-pink">{formatPrice(price)}</span>
                        {isSelected && <span className="text-brand-pink font-black">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. SELECT SIZE / WEIGHT */}
            <div className="p-5 rounded-2xl bg-white border border-brand-ink/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                  2. Cake Size / Weight
                </label>
                <span className="text-[11px] text-brand-ink-muted">Serving size guide</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CHOCOLOOM_CONFIG.sizes.map((s) => {
                  const isSelected = cakeState.size === s.id;
                  const sizePrice = currentFlavour.pricing[s.id];
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCakeState((prev) => ({ ...prev, size: s.id }))}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-brand-pink bg-pink-50/60 shadow-xs'
                          : 'border-brand-ink/10 bg-white hover:border-brand-pink/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-brand-ink">{s.label}</span>
                        {isSelected && <span className="text-brand-pink text-xs font-black">✓</span>}
                      </div>
                      <p className="text-[10px] text-brand-ink-muted mt-0.5">{s.description}</p>
                      <span className="text-xs font-extrabold text-brand-pink block mt-1.5">
                        {formatPrice(sizePrice)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. DIETARY PREFERENCE */}
            <div className="p-5 rounded-2xl bg-white border border-brand-ink/10 shadow-xs space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-ink block">
                3. Dietary Preference
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCakeState((prev) => ({ ...prev, dietType: 'eggless' }))}
                  className={`py-3 px-4 rounded-xl border-2 text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    cakeState.dietType === 'eggless'
                      ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-black shadow-xs ring-1 ring-emerald-500/30'
                      : 'border-brand-ink/10 bg-white text-brand-ink hover:border-brand-ink/30'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                  <span className="text-xs sm:text-sm font-bold">100% Eggless</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCakeState((prev) => ({ ...prev, dietType: 'contains_egg' }))}
                  className={`py-3 px-4 rounded-xl border-2 text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    cakeState.dietType === 'contains_egg'
                      ? 'border-amber-500 bg-amber-50/80 text-amber-950 font-black shadow-xs ring-1 ring-amber-500/30'
                      : 'border-brand-ink/10 bg-white text-brand-ink hover:border-brand-ink/30'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span>
                  <span className="text-xs sm:text-sm font-bold">Regular (With Egg)</span>
                </button>
              </div>
            </div>

            {/* 4. CAKE STYLE & DESIGN */}
            <div className="p-5 rounded-2xl bg-white border border-brand-ink/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                  4. Cake Style &amp; Design
                </label>
                <span className="text-[11px] text-brand-ink-muted">Aesthetic piping styles</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CHOCOLOOM_CONFIG.designs.map((design) => {
                  const isSelected = cakeState.designId === design.id;
                  return (
                    <button
                      key={design.id}
                      type="button"
                      onClick={() => setCakeState((prev) => ({ ...prev, designId: design.id }))}
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
                          <h6 className="text-xs font-bold text-brand-ink truncate">{design.name}</h6>
                          <span className="text-[10px] text-brand-ink-muted line-clamp-1">
                            {design.tagline}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-brand-ink/5 text-[11px]">
                        <span className="text-[10px] text-brand-pink font-semibold">
                          {design.additionalCost > 0 ? `+${formatPrice(design.additionalCost)}` : 'Included'}
                        </span>
                        {isSelected && <span className="text-brand-pink text-xs font-black">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. PERSONALIZATION: NAME, MESSAGE, PHOTO */}
            <div className="p-5 rounded-2xl bg-white border border-brand-ink/10 shadow-xs space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-ink block">
                5. Personalization &amp; Reference
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-ink mb-1">
                    Name on Cake <span className="text-brand-ink-muted font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={25}
                    placeholder="e.g. Rahul / Sneha"
                    value={cakeState.nameOnCake}
                    onChange={(e) => setCakeState((p) => ({ ...p, nameOnCake: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-ink/15 text-xs sm:text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-ink mb-1">
                    Birthday Message <span className="text-brand-ink-muted font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    placeholder="e.g. Happy 21st Birthday Rahul! ✨"
                    value={cakeState.customMessage}
                    onChange={(e) => setCakeState((p) => ({ ...p, customMessage: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-ink/15 text-xs sm:text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink"
                  />
                </div>
              </div>

              {/* Reference Image Upload */}
              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  Reference Photo for Custom Design <span className="text-brand-ink-muted font-normal">(optional)</span>
                </label>

                {cakeState.referenceImage ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-pink-50/50 border border-brand-pink/20">
                    <img
                      src={cakeState.referenceImage}
                      alt="Uploaded reference"
                      className="w-14 h-14 rounded-lg object-cover border border-brand-pink/30 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-brand-ink truncate">
                        {cakeState.referenceImageName || 'Uploaded Cake Design'}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-medium">
                        ✓ Attached to order &amp; WhatsApp message
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 rounded-lg text-brand-ink-muted hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
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
                      id="cake-photo-upload-input"
                    />
                    <label
                      htmlFor="cake-photo-upload-input"
                      className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-brand-ink/20 hover:border-brand-pink/50 bg-[#FFFDFB] text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-pink">
                        <Upload className="w-4 h-4" />
                        <span>Upload Custom Cake Reference (Pinterest / Instagram)</span>
                      </div>
                      <p className="text-[10px] text-brand-ink-muted">
                        Chocoloom pastry chefs will recreate your uploaded aesthetic cake design.
                      </p>
                    </label>
                  </div>
                )}
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  Special Instructions / Allergy Notes <span className="text-brand-ink-muted font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  maxLength={150}
                  placeholder="e.g. Less sugar preferred, extra golden candle requested."
                  value={cakeState.specialInstructions}
                  onChange={(e) => setCakeState((p) => ({ ...p, specialInstructions: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-brand-ink/15 text-xs text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink"
                />
              </div>
            </div>

            {/* 6. CELEBRATIONBOX COMBO PAIRING */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50/70 to-amber-50/40 border-2 border-brand-pink/30 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-pink text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-extrabold text-brand-ink font-display">
                        Pair with Celebration Box (Birthday Kit)
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-pink text-white">
                        ₹399
                      </span>
                    </div>
                    <p className="text-xs text-brand-ink-light mt-0.5">
                      Includes 56 Balloons (Pink, Lavender, Copper), Shimmering Foil Backdrop, Banner, Candles &amp; Tape.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1 select-none">
                  <input
                    type="checkbox"
                    checked={includeBox}
                    onChange={(e) => setIncludeBox(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-pink"></div>
                </label>
              </div>

              {includeBox && (
                <div className="pt-3 border-t border-brand-pink/20 flex items-center justify-between text-xs text-brand-ink font-medium">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Delivered together to your campus hostel or door</span>
                  </div>
                  <Link
                    to="/celebration-boxes/pastel-rose"
                    className="text-brand-pink font-bold hover:underline"
                  >
                    View Kit Inclusions →
                  </Link>
                </div>
              )}
            </div>

            {/* Optional Decorative Lighting Rental */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-brand-ink">
                    Milky-White Decorative Lighting on Rent ✨
                  </h4>
                  <p className="text-[11px] text-brand-ink-light mt-0.5">
                    Gives your birthday setup a warm ambient glow. Rented separately; return details on WhatsApp.
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
                <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* DYNAMIC REAL-TIME PRICE BREAKDOWN & ACTION */}
            <div className="p-6 rounded-3xl bg-brand-ink text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs uppercase font-extrabold tracking-widest text-brand-pink">
                  Order Summary
                </span>
                <span className="text-xs text-slate-400">Real-time calculation</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-300">
                {includeBox && (
                  <div className="flex items-center justify-between">
                    <span>CelebrationBox (Pastel Rose Kit)</span>
                    <strong className="text-white">{formatPrice(boxPrice)}</strong>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>
                    Chocoloom Cake ({currentFlavour.name}, {currentSizeObj?.label})
                  </span>
                  <strong className="text-white">{formatPrice(cakePrice)}</strong>
                </div>
                {wantsLighting && (
                  <div className="flex items-center justify-between text-amber-300">
                    <span>Lighting Rental Enquiry</span>
                    <span>Enquiry Included</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold block text-white">Grand Total</span>
                  <span className="text-[11px] text-slate-400">FREE campus pickup at SRKR gate</span>
                </div>
                <span className="text-3xl font-black text-white font-display">
                  {formatPrice(grandTotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddComboToCart}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-pink via-pink-600 to-rose-600 hover:from-brand-pink-hover hover:to-rose-700 text-white font-black text-sm sm:text-base shadow-xl hover:shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Cake className="w-5 h-5 fill-white" />
                <span>{includeBox ? 'Add Combo to Cart' : 'Add Cake to Cart'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
