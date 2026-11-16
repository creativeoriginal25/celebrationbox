import React from 'react';
import { Heart, Target, Compass, Rocket } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 relative scroll-mt-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-pink text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Our Story</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink">
            Started by College Students in Bhimavaram
          </h2>
          <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
            We believe memorable birthday setups shouldn't require running to four stores or spending thousands on decorators.
          </p>
        </div>

        {/* Story Card */}
        <div className="surface-card rounded-2xl p-7 sm:p-9 border border-brand-ink/10 space-y-7">
          <div className="space-y-4 text-xs sm:text-sm text-brand-ink-light leading-relaxed">
            <p>
              As college students living in Bhimavaram, Andhra Pradesh, we saw the same problem during every friend's birthday: someone had to dash to multiple local shops for balloons, tape, ribbons, and candles. Most of the time, the colors clashed, tape peeled off hostel walls, and the room ended up messy.
            </p>
            <p>
              Hiring professional party decorators cost ₹2,000 or more — impractical for students and young adults celebrating in hostels or bedrooms.
            </p>
            <p className="font-semibold text-brand-ink">
              That's why we built <strong className="text-brand-pink font-extrabold">Celebration Box</strong>. With a modest pilot budget of ₹3,000, we created curated DIY party kits that bring together 100% of the decor essentials into one neat, aesthetic box.
            </p>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-ink/10">
            <div className="p-4 rounded-xl bg-brand-cream-50 border border-brand-ink/5">
              <div className="w-8 h-8 rounded-lg bg-brand-pink/15 text-brand-pink flex items-center justify-center mb-2.5">
                <Target className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink mb-1">Our Mission</h4>
              <p className="text-xs text-brand-ink-muted leading-relaxed">
                Make celebration styling easy, accessible, and affordable for every hostel, bedroom, and home.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-brand-cream-50 border border-brand-ink/5">
              <div className="w-8 h-8 rounded-lg bg-brand-teal/15 text-brand-teal flex items-center justify-center mb-2.5">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink mb-1">Bhimavaram Roots</h4>
              <p className="text-xs text-brand-ink-muted leading-relaxed">
                Free campus pickups and friendly WhatsApp-first assistance tailored to local college schedules.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-brand-cream-50 border border-brand-ink/5">
              <div className="w-8 h-8 rounded-lg bg-brand-marigold/20 text-brand-marigold-600 flex items-center justify-center mb-2.5">
                <Rocket className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink mb-1">Long-Term Vision</h4>
              <p className="text-xs text-brand-ink-muted leading-relaxed">
                Expanding from DIY birthday kits into anniversaries, baby showers, festivals, and life's sweetest milestones.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
