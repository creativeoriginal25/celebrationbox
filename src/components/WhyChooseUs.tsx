import React from 'react';
import { Box, BookOpen, IndianRupee, MapPinCheck } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      title: 'All-in-One Decoration Kit',
      description:
        'No more rushing to multiple local stationery and party shops for tape, ribbons, or candles. Everything needed for your birthday setup arrives organized in one box.',
      icon: Box,
      color: 'bg-brand-pink/10 text-brand-pink',
    },
    {
      title: 'Beginner-Friendly Instructions',
      description:
        'Never made a balloon garland before? Our illustrated DIY guide walks you through inflation and arch styling step-by-step with removable, wall-safe glue dots.',
      icon: BookOpen,
      color: 'bg-brand-teal/10 text-brand-teal',
    },
    {
      title: 'Student-Friendly Pricing',
      description:
        'Professional party decorators charge ₹2,000+ for basic setups. Our curated DIY kits cost just ₹249 for Mini and ₹499 for Signature — transparent and student-budget friendly.',
      icon: IndianRupee,
      color: 'bg-brand-marigold/15 text-brand-marigold-600',
    },
    {
      title: 'Local College Pickup & Nearby Delivery',
      description:
        'Collect your box free from campus pickup spots in Bhimavaram or request doorstep delivery to your hostel, PG, or home coordinated smoothly over WhatsApp.',
      icon: MapPinCheck,
      color: 'bg-brand-pink/10 text-brand-pink',
    },
  ];

  return (
    <section id="why-us" className="py-16 md:py-24 relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-yellow text-xs font-bold uppercase tracking-wider">
            <span>Why Celebration Box?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink">
            Crafted for Memorable, Stress-Free Birthdays
          </h2>
          <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
            We focus on honest party supplies, coordinated color palettes, and friendly local service in Bhimavaram.
          </p>
        </div>

        {/* 4 Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="surface-card rounded-2xl p-6 surface-card-hover border border-brand-ink/10 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${p.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-brand-ink mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed">
                    {p.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
