import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Sparkles,
  ShoppingBag,
  Cake,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { PRODUCTS } from '../config/products';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { getProductImages } from '../config/productImages';

export const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = PRODUCTS.find((p) => p.slug === 'pastel-rose') || PRODUCTS[0];

  const [quantity, setQuantity] = useState<number>(1);
  const [wantsLighting, setWantsLighting] = useState<boolean>(false);

  const galleryImages = getProductImages(product.id, product.image, product.name);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleMakeCakeCombo = () => {
    // Preserve selected box & quantity in localStorage / navigation state
    try {
      localStorage.setItem(
        'celebration_selected_box',
        JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
          wantsLighting,
        })
      );
    } catch {
      // ignore
    }
    navigate('/cakes');
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
            <Link to="/celebration-boxes" className="hover:text-brand-pink font-semibold transition-colors">
              Celebration Boxes
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
            <span className="text-brand-ink font-bold">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* 2. Main Product Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Large Product Gallery */}
          <div className="lg:col-span-7">
            <div className="sticky top-24">
              <ProductImageGallery
                images={galleryImages}
                productName={product.name}
              />
            </div>
          </div>

          {/* Right: Product Buying Information */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header Titles & Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-pink/10 text-brand-pink border border-brand-pink/20">
                  Official DIY Kit
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  In Stock
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  56 Balloons Included
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-ink font-display leading-tight">
                {product.name}
              </h1>

              {/* Price & Market Comparison */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl sm:text-4xl font-black text-brand-pink font-display">
                  {formatPrice(product.price)}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-brand-ink-muted">
                  <span>Market Price:</span>
                  <span className="line-through font-semibold">₹550+</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                    Save 27%
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-brand-ink-muted">
                All-inclusive kit price. Free college gate pickup or nearby Bhimavaram delivery.
              </p>
            </div>

            {/* Product Description */}
            <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed">
              {product.description}
            </p>

            {/* Exact Pastel Rose Kit Contents (What's Inside the Box) */}
            <div className="rounded-2xl border-2 border-brand-pink/20 bg-pink-50/30 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-brand-pink" />
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-brand-ink">
                    What&apos;s Inside the Box?
                  </h3>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-pink text-white">
                  56 Balloons Total
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-brand-ink">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-brand-pink/15">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFB6C1] shrink-0"></span>
                  <span className="font-semibold">20 Baby Pink Balloons</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-brand-pink/15">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D8B4E2] shrink-0"></span>
                  <span className="font-semibold">20 Lavender Balloons</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-brand-pink/15">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C87A5E] shrink-0"></span>
                  <span className="font-semibold">16 Metallic Copper Balloons</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-brand-pink/15">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-semibold">1 Gold Glitter Birthday Banner</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-brand-pink/15">
                  <span className="text-brand-pink font-bold">✨</span>
                  <span className="font-semibold">1 Lavender-Pink Foil Backdrop</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/80 border border-brand-pink/15">
                  <span className="text-amber-600 font-bold">🎂</span>
                  <span className="font-semibold">2 Birthday Cake Candles</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/90 border border-brand-pink/15 text-[11px] text-brand-ink-light flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                <span>
                  <strong>Double-Sided Foam Tape Included</strong> for instant wall-friendly attachment without damaging room paint.
                </span>
              </div>
            </div>

            {/* Optional Decorative Lighting Rental */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-bold text-brand-ink">
                      Milky-White Decorative Lighting Rental ✨
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900">
                      Optional Add-on
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-ink-light mt-0.5">
                    Warm cozy glow for your celebration corner. Note: Rented separately; return arranged on WhatsApp.
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

            {/* Quantity Controls & Dual Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-brand-ink/20 bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg text-brand-ink hover:bg-brand-cream-100 disabled:opacity-40 flex items-center justify-center font-bold text-base cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-extrabold text-brand-ink">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    className="w-8 h-8 rounded-lg text-brand-ink hover:bg-brand-cream-100 disabled:opacity-40 flex items-center justify-center font-bold text-base cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-brand-ink-muted">
                  Total: <strong className="text-brand-ink">{formatPrice(product.price * quantity)}</strong>
                </span>
              </div>

              {/* Primary Actions: Add to Cart & Make It a Cake Combo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Action 1: Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-brand-ink bg-white hover:bg-brand-cream-50 border-2 border-brand-ink/20 hover:border-brand-pink transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-pink" />
                  <span>Add to Cart</span>
                </button>

                {/* Action 2: Make It a Cake Combo */}
                <button
                  type="button"
                  onClick={handleMakeCakeCombo}
                  className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-brand-pink via-pink-600 to-rose-600 hover:from-brand-pink-hover hover:to-rose-700 shadow-card hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Cake className="w-4 h-4 fill-white" />
                  <span>Make It a Cake Combo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-center text-brand-ink-muted pt-1">
                Click <strong>Make It a Cake Combo</strong> to pair this box with an artisan Chocoloom birthday cake.
              </p>
            </div>

            {/* Fulfilment & Delivery Policies */}
            <div className="pt-4 border-t border-brand-ink/10 space-y-2 text-xs text-brand-ink-light">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-teal shrink-0" />
                <span>
                  <strong>Campus Gate Pickup:</strong> FREE pickup at SRKR Engineering College Gate, Bhimavaram.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-pink shrink-0" />
                <span>
                  <strong>Nearby Delivery:</strong> Available across Bhimavaram hostels, apartments &amp; homes.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Quick Preparation:</strong> Prepared fresh for your celebration time slot.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
