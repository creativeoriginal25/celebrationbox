import React from 'react';
import { Package, Wand2, PartyPopper, Clock, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Choose Your Box',
      description:
        'Select between the compact Mini Box (₹249) or the complete Signature Box (₹499) in our signature Pastel Pop theme. Pick your celebration date and college pickup or nearby delivery.',
      icon: Package,
      time: '1–2 mins to order',
      color: 'bg-brand-pink/10 text-brand-pink',
    },
    {
      step: '02',
      title: 'Unbox Your Decorations',
      description:
        'Everything arrives organized in one celebration box with pre-cut arch strips, wall-safe glue dots, curling ribbons, and an illustrated step-by-step DIY guide. No extra tools required.',
      icon: Wand2,
      time: 'All-in-one box',
      color: 'bg-brand-marigold/15 text-brand-marigold-600',
    },
    {
      step: '03',
      title: 'Decorate and Celebrate',
      description:
        'Inflate your balloons, slide them into the garland strip, mount on your wall with glue dots, and light the candles! DIY setup takes 15–20 mins for Mini and 30–40 mins for Signature.',
      icon: PartyPopper,
      time: '15–40 mins DIY',
      color: 'bg-brand-teal/10 text-brand-teal',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 relative scroll-mt-28 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-pink text-xs font-bold uppercase tracking-wider">
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink">
            How Celebration Box Works
          </h2>
          <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
            We handle the curation and party essentials so you can set up a beautiful celebration in your hostel room or home without stress.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="surface-card rounded-2xl p-7 flex flex-col justify-between surface-card-hover border border-brand-ink/10 relative"
              >
                {/* Step Number Tag */}
                <span className="absolute top-6 right-6 font-display font-black text-3xl text-brand-ink/10 select-none">
                  {s.step}
                </span>

                <div>
                  <div className={`w-12 h-12 rounded-xl mb-5 flex items-center justify-center ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-ink-muted block mb-1">
                    Step {s.step}
                  </span>
                  <h3 className="text-lg font-bold text-brand-ink mb-2.5">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-ink-light leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-ink/10 flex items-center justify-between text-xs font-medium text-brand-ink-muted">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal" />
                    <span>Customer DIY setup</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-ink">
                    <Clock className="w-3 h-3 text-brand-marigold" />
                    <span>{s.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
