import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Target,
  Compass,
  Rocket,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Cake,
  ArrowRight,
  Package,
} from 'lucide-react';
import { CelebrationBoxLogo } from '../components/CelebrationBoxLogo';

export const AboutPage: React.FC = () => {
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
            <span className="text-brand-ink font-bold">About Us</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-black uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-brand-pink" />
            <span>Our Founding Story</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-ink font-display tracking-tight">
            Started by College Students in Bhimavaram
          </h1>

          <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
            We believe memorable birthday setups shouldn&apos;t require running to four stores or spending thousands on decorators.
          </p>
        </div>

        {/* Narrative Card */}
        <div className="rounded-3xl bg-white border border-brand-ink/10 shadow-card p-6 sm:p-10 space-y-8">
          <div className="space-y-4 text-xs sm:text-sm text-brand-ink-light leading-relaxed">
            <p>
              As college students living in Bhimavaram, Andhra Pradesh, we saw the same problem during every friend&apos;s birthday: someone had to dash to multiple local shops for balloons, tape, ribbons, and candles. Most of the time, the colors clashed, tape peeled off hostel walls, and the room ended up messy.
            </p>
            <p>
              Hiring professional party decorators cost ₹2,000 or more — completely impractical for students and young adults celebrating in hostels or bedrooms.
            </p>
            <p className="text-brand-ink font-semibold">
              That&apos;s why we built <strong className="text-brand-pink font-extrabold">Celebration Box</strong>. With a modest pilot budget, we created curated DIY party kits that bring together 100% of the decor essentials into one neat, aesthetic box for just <strong>₹399</strong>.
            </p>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-ink/10">
            <div className="p-4 rounded-2xl bg-brand-cream-50/70 border border-brand-ink/5 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-brand-pink/15 text-brand-pink flex items-center justify-center">
                <Target className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink">Our Mission</h3>
              <p className="text-xs text-brand-ink-muted leading-relaxed">
                Make celebration styling effortless, aesthetic, and affordable for every hostel, bedroom, and home.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-cream-50/70 border border-brand-ink/5 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-brand-teal/15 text-brand-teal flex items-center justify-center">
                <Compass className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink">Bhimavaram Roots</h3>
              <p className="text-xs text-brand-ink-muted leading-relaxed">
                Free campus pickups at SRKR college gate and friendly WhatsApp-first assistance tailored to student schedules.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-cream-50/70 border border-brand-ink/5 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Rocket className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-ink">The Chocoloom Partnership</h3>
              <p className="text-xs text-brand-ink-muted leading-relaxed">
                Collaborating with Chocoloom to pair our signature decoration kit with fresh artisan birthday cakes in one complete combo.
              </p>
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="rounded-3xl bg-brand-ink text-white p-8 sm:p-10 text-center space-y-4 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-black font-display text-white">
            Ready to Celebrate Your Next Birthday?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Get the Pastel Rose Celebration Box for ₹399, or pair it with an artisan Chocoloom cake.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/celebration-boxes/pastel-rose"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white text-xs sm:text-sm font-extrabold shadow-card transition-all"
            >
              Shop Pastel Rose Box
            </Link>
            <Link
              to="/cakes"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold transition-all"
            >
              Explore Cakes &amp; Combos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
