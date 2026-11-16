import React from 'react';
import { Package, Wand2, PartyPopper, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Choose Your Box',
      description:
        'Select between the compact Mini Box (₹249) or the full Signature Box (₹499) in our curated Pastel Pop theme. Customize your celebration date and delivery or college pickup option.',
      icon: Package,
      badge: 'Step 1',
      color: 'pink',
    },
    {
      step: '02',
      title: 'Unbox and Decorate',
      description:
        'Everything is organized in one neat box with glue dots, arch strips, and a step-by-step DIY guide. No extra tools or prior decoration skills needed — set it up in 15 to 30 minutes!',
      icon: Wand2,
      badge: 'Step 2',
      color: 'yellow',
    },
    {
      step: '03',
      title: 'Celebrate Your Moment',
      description:
        'Light the candles, gather your friends, snap aesthetic birthday photos, and make memories that last. Clean up effortlessly without damaging walls.',
      icon: PartyPopper,
      badge: 'Step 3',
      color: 'teal',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge-pink text-xs font-bold uppercase tracking-wider">
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-ink">
            How Celebration Box Works
          </h2>
          <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
            Planning a celebration shouldn't be stressful or expensive. We take the hassle out of birthday prep.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative glass-card rounded-3xl p-7 flex flex-col justify-between hover:shadow-glass-hover transition-all duration-300 group"
              >
                {/* Step Number Watermark */}
                <span className="absolute top-5 right-6 text-4xl font-black text-brand-ink/10 select-none font-display">
                  {s.step}
                </span>

                <div>
                  {/* Icon badge */}
                  <div
                    className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center shadow-sm ${
                      s.color === 'pink'
                        ? 'bg-brand-pink/10 text-brand-pink'
                        : s.color === 'yellow'
                        ? 'bg-brand-marigold/15 text-brand-marigold-600'
                        : 'bg-brand-teal/10 text-brand-teal'
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-brand-ink-muted">
                    {s.badge}
                  </span>
                  <h3 className="text-xl font-extrabold text-brand-ink mt-1 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-brand-ink-light leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-ink/10 flex items-center gap-2 text-xs font-bold text-brand-ink">
                  <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                  <span>Beginner-friendly</span>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

