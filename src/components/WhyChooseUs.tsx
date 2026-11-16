import React from 'react';
import { Palette, Box, BookOpen, IndianRupee, MapPinCheck } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      title: 'Curated Decoration Collections',
      description:
        'Instead of random clashing decorations from local shops, our kits feature designer-coordinated color palettes like Pastel Pop with balanced peach, lilac, and cream hues.',
      icon: Palette,
      color: 'bg-brand-pink/10 text-brand-pink',
    },
    {
      title: 'Everything Organized in One Box',
      description:
        'No more running around town searching for ribbons, tape, glue dots, or arch strips. Every single item needed for your birthday setup comes packed inside your Celebration Box.',
      icon: Box,
      color: 'bg-brand-teal/10 text-brand-teal',
    },
    {
      title: 'Beginner-Friendly DIY Instructions',
      description:
        'Never made a balloon garland before? No problem! Each kit includes an illustrated step-by-step DIY instruction card that anyone can set up in 15–30 minutes.',
      icon: BookOpen,
      color: 'bg-brand-marigold/15 text-brand-marigold-600',
    },
    {
      title: 'Honest & Affordable Packages',
      description:
        'Professional decorators charge ₹2,000+ for basic setups. Our curated DIY kits start at just ₹249 for Mini and ₹499 for Signature — student-friendly and transparent.',
      icon: IndianRupee,
      color: 'bg-brand-pink/10 text-brand-pink',
    },
    {
      title: 'Easy Local Ordering in Bhimavaram',
      description:
        'Place orders straight through WhatsApp with free college pickup or nearby local delivery. Coordinated directly by student founders who understand campus schedules.',
      icon: MapPinCheck,
      color: 'bg-brand-teal/10 text-brand-teal',
    },
  ];

  return (
    <section id="why-us" className="py-16 md:py-24 relative bg-white/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge-yellow text-xs font-bold uppercase tracking-wider">
            <span>Why Celebration Box?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-ink">
            Crafted for Stress-Free Celebrations
          </h2>
          <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
            We curate high-quality party supplies into ready-to-decorate kits so you spend less time shopping and more time celebrating.
          </p>
        </div>

        {/* 5 Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-3xl p-6 hover:shadow-glass-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${p.color} flex items-center justify-center mb-5 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-brand-ink mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Value Callout Card */}
          <div className="glass-panel rounded-3xl p-6 border-2 border-dashed border-brand-pink/30 flex flex-col justify-center items-center text-center bg-gradient-to-br from-brand-pink-50/50 to-white/80">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-pink mb-1">Our Promise</span>
            <h3 className="text-xl font-extrabold text-brand-ink mb-2">Honest, Quality Party Supplies</h3>
            <p className="text-xs text-brand-ink-muted leading-relaxed max-w-xs">
              Carefully sourced, tested for balloon durability, and packed with love right here in Bhimavaram.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

