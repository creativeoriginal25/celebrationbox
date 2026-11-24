import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
  Cake,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PRODUCTS } from '../config/products';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';

export const CelebrationBoxes: React.FC = () => {
  const { addToCart } = useCart();
  const availableProduct = PRODUCTS.find((p) => p.slug === 'pastel-rose') || PRODUCTS[0];
  const comingSoonProducts = PRODUCTS.filter((p) => p.inventoryStatus === 'out_of_stock' || p.badge === 'Coming Soon');

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
            <span className="text-brand-ink font-bold">Celebration Boxes</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-extrabold uppercase tracking-widest">
            <Package className="w-3.5 h-3.5" />
            <span>Signature DIY Kits</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-ink font-display tracking-tight">
            Our Celebration Boxes
          </h1>

          <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
            Thoughtfully curated DIY birthday kits packed with 56 balloons, glittering backdrops, banners, candles and tape.
            Everything is pre-coordinated for an effortless setup in bedrooms and hostel rooms.
          </p>
        </div>

        {/* 2. Product Catalogue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Pastel Rose Celebration Box (AVAILABLE) */}
          <div className="rounded-3xl bg-white border-2 border-brand-pink/20 hover:border-brand-pink shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div>
              {/* Product Image & Badges */}
              <div className="relative aspect-[4/3] bg-brand-cream-50 overflow-hidden">
                <img
                  src={availableProduct.image}
                  alt={availableProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-brand-pink text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  In Stock &amp; Available
                </span>
                <span className="absolute top-3 right-3 bg-white/95 text-brand-ink text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm border border-brand-ink/10">
                  56 Balloons Included
                </span>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-black text-brand-ink font-display group-hover:text-brand-pink transition-colors">
                    {availableProduct.name}
                  </h3>
                  <div className="text-right">
                    <span className="text-xs text-brand-ink-muted line-through mr-1.5">
                      ₹{availableProduct.compare_at_price || 550}
                    </span>
                    <span className="text-xl font-black text-brand-pink font-display">
                      {formatPrice(availableProduct.price)}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-brand-ink-light line-clamp-2 leading-relaxed">
                  {availableProduct.description}
                </p>

                {/* Features Checklist */}
                <div className="pt-2 border-t border-brand-ink/5 space-y-1.5 text-xs text-brand-ink font-medium">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Baby Pink, Lavender &amp; Metallic Copper</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Free campus pickup at SRKR gate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 space-y-2.5">
              <Link
                to="/celebration-boxes/pastel-rose"
                className="w-full py-3 px-4 rounded-xl text-center text-xs sm:text-sm font-extrabold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-card transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => addToCart(availableProduct, 1)}
                className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold text-brand-ink bg-white hover:bg-brand-cream-50 border border-brand-ink/15 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>Quick Add to Cart</span>
              </button>
            </div>
          </div>

          {/* Card 2: Royal Blue Celebration Box (COMING SOON) */}
          <div className="rounded-3xl bg-white border border-brand-ink/10 shadow-xs flex flex-col justify-between overflow-hidden opacity-90">
            <div>
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80"
                  alt="Royal Blue Celebration Box"
                  className="w-full h-full object-cover filter grayscale-[25%]"
                />
                <span className="absolute top-3 left-3 bg-slate-800 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Coming Soon</span>
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-black text-brand-ink font-display">
                    Royal Blue Celebration Box
                  </h3>
                  <span className="text-lg font-bold text-slate-500 font-display">₹399</span>
                </div>

                <p className="text-xs sm:text-sm text-brand-ink-light line-clamp-2 leading-relaxed">
                  A majestic combination of royal blue, midnight navy, and metallic chrome silver balloons with a silver fringe backdrop.
                </p>

                <div className="pt-2 border-t border-brand-ink/5 space-y-1.5 text-xs text-brand-ink-muted">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>Royal Blue &amp; Chrome Silver Balloons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>In production batch for upcoming release</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                type="button"
                disabled
                className="w-full py-3 px-4 rounded-xl text-center text-xs sm:text-sm font-bold text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Coming Soon</span>
              </button>
            </div>
          </div>

          {/* Card 3: Monochrome Celebration Box (COMING SOON) */}
          <div className="rounded-3xl bg-white border border-brand-ink/10 shadow-xs flex flex-col justify-between overflow-hidden opacity-90">
            <div>
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80"
                  alt="Monochrome Celebration Box"
                  className="w-full h-full object-cover filter grayscale-[30%]"
                />
                <span className="absolute top-3 left-3 bg-slate-800 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Coming Soon</span>
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-black text-brand-ink font-display">
                    Monochrome Celebration Box
                  </h3>
                  <span className="text-lg font-bold text-slate-500 font-display">₹399</span>
                </div>

                <p className="text-xs sm:text-sm text-brand-ink-light line-clamp-2 leading-relaxed">
                  A sleek, minimalist and timeless theme featuring matte black, clean white, and metallic gold accents for modern aesthetic parties.
                </p>

                <div className="pt-2 border-t border-brand-ink/5 space-y-1.5 text-xs text-brand-ink-muted">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>Matte Black, Crisp White &amp; Metallic Gold</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>Scheduled for upcoming semester launch</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                type="button"
                disabled
                className="w-full py-3 px-4 rounded-xl text-center text-xs sm:text-sm font-bold text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Coming Soon</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Chocoloom Collaboration Banner Callout */}
        <div className="rounded-3xl bg-gradient-to-r from-pink-500/10 via-rose-500/5 to-amber-500/10 border-2 border-brand-pink/20 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-pink">
              <Cake className="w-4 h-4" />
              <span>CelebrationBox × Chocoloom</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-brand-ink font-display">
              Want a Complete Birthday Combo with Cake?
            </h3>
            <p className="text-xs sm:text-sm text-brand-ink-light max-w-xl">
              Pair your decoration box with a delicious, customized cake from Chocoloom. Bento (250g) to 2kg cakes delivered together!
            </p>
          </div>

          <Link
            to="/cakes"
            className="px-6 py-3.5 rounded-2xl bg-brand-pink hover:bg-brand-pink-hover text-white text-xs sm:text-sm font-extrabold shadow-card transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-98"
          >
            <span>Explore Cakes &amp; Combos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
