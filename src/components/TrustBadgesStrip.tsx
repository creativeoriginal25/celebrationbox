import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

export const TrustBadgesStrip: React.FC = () => {
  const badges = [
    {
      icon: Truck,
      title: 'Pan-India Delivery',
    },
    {
      icon: ShieldCheck,
      title: 'Quality Checked Kits',
    },
    {
      icon: RotateCcw,
      title: 'Easy DIY Setup',
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 my-4 sm:my-6">
      <div className="rounded-2xl sm:rounded-full bg-[#FFF0F4] border border-[#FCD4DE] px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 items-center justify-between text-center sm:text-left">
          {badges.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="flex items-center justify-center sm:justify-start gap-2.5 text-xs sm:text-sm font-bold text-brand-ink"
              >
                <div className="w-7 h-7 rounded-full bg-white/80 text-[#8A1538] flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="tracking-tight">{b.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
