import React from 'react';
import { Heart, Sparkles, Target, Compass, Rocket } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 relative overflow-hidden bg-brand-cream/40">
      {/* Ambient glass orbs */}
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-brand-marigold-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-brand-pink-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge-pink text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Our Story</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-ink">
            Started in a College Dorm in Bhimavaram
          </h2>
          <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
            We believe big smiles don't require big budgets or complicated planning.
          </p>
        </div>

        {/* Story Content Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-glass border-2 border-white/90 space-y-8">
          <div className="space-y-4 text-sm sm:text-base text-brand-ink-light leading-relaxed">
            <p>
              As college students living in Bhimavaram, Andhra Pradesh, we saw the same problem over and over: whenever a roommate or friend had a birthday, someone had to dash to four different local stores. You’d buy balloons from one shop, tape from a stationery store, candles from a bakery, and still end up with mismatched colors and sticky tape marks on hostel walls.
            </p>
            <p>
              Hiring professional decorators easily cost ₹2,000 or more — way out of reach for students and young adults wanting an intimate celebration.
            </p>
            <p className="font-semibold text-brand-ink">
              That’s why we founded <span className="text-brand-pink font-extrabold">Celebration Box</span>. With a modest pilot budget of just ₹3,000, we set out to build curated, beginner-friendly DIY celebration kits that put everything you need into one neat, aesthetic box.
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-ink/10">
            <div className="glass-panel p-4 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-brand-pink/15 text-brand-pink flex items-center justify-center mb-3">
                <Target className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-ink mb-1">Our Mission</h4>
              <p className="text-xs text-brand-ink-muted leading-relaxed">
                Make celebration styling easy, accessible, and affordable for every hostel, bedroom, and home.
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-brand-teal/15 text-brand-teal flex items-center justify-center mb-3">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-ink mb-1">Local Focus</h4>
              <p className="text-xs text-brand-ink-muted leading-relaxed">
                Rooted in Bhimavaram with convenient campus pickups and friendly WhatsApp-first assistance.
              </p>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-brand-marigold/20 text-brand-marigold-600 flex items-center justify-center mb-3">
                <Rocket className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-ink mb-1">Long-term Vision</h4>
              <p className="text-xs text-brand-ink-muted leading-relaxed">
                Expanding from DIY birthday boxes into anniversaries, baby showers, festivals, and life's sweetest milestones.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

