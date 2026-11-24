import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PackageCheck, AlertCircle, Info, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductContentsProps {
  product: Product;
  defaultExpanded?: boolean;
}

interface ContentGroup {
  title: string;
  badge?: string;
  items: {
    name: string;
    quantity: string;
    specification?: string;
    note?: string;
  }[];
}

export const ProductContents: React.FC<ProductContentsProps> = ({
  product,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  // Grouped inventory according to actual purchased materials
  const contentGroups: ContentGroup[] = [
    {
      title: 'Balloons — 56 Pieces',
      badge: '56 Balloons Total',
      items: [
        {
          name: 'Baby Pink Latex Balloons',
          quantity: '20 pcs',
          specification: '10-inch natural latex',
          note: 'Soft baby pink tone for a cheerful, photogenic party corner',
        },
        {
          name: 'Lavender Latex Balloons',
          quantity: '20 pcs',
          specification: '10-inch natural latex',
          note: 'Complements the baby pink and metallic copper tones beautifully',
        },
        {
          name: 'Metallic Copper Balloons',
          quantity: '16 pcs',
          specification: '10-inch glossy metallic',
          note: 'Rich metallic luster that adds luxury shimmer to your setup',
        },
      ],
    },
    {
      title: 'Birthday Decor',
      badge: 'Focal Decor',
      items: [
        {
          name: 'Gold Glitter Happy Birthday Letter Banner',
          quantity: '1 pc',
          specification: 'Pre-strung script lettering with hanging string',
          note: 'Sparkling celebratory centerpiece for wall or backdrop display',
        },
        {
          name: 'Lavender-Pink Metallic Foil Fringe Backdrop',
          quantity: '1 pc',
          specification: 'Shimmering metallic tinsel foil curtain',
          note: 'Instant photo booth backdrop for memorable celebration pictures',
        },
      ],
    },
    {
      title: 'Setup & Finishing',
      badge: 'Accessories',
      items: [
        {
          name: 'Double-Sided Foam Tape',
          quantity: 'Included',
          specification: 'Mounting foam tape for secure wall attachment',
          note: 'Holds backdrop, banner, and balloon clusters securely without peeling wall paint',
        },
        {
          name: 'Birthday Candles',
          quantity: '2 pcs',
          specification: 'Celebration birthday cake candles',
          note: 'Ready for the birthday cake cutting moment',
        },
      ],
    },
  ];

  return (
    <div className="rounded-2xl border border-brand-ink/10 bg-white shadow-xs overflow-hidden transition-all">
      {/* Header bar / Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-brand-cream-50 to-white hover:bg-brand-cream-100 transition-colors cursor-pointer border-b border-brand-ink/5"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-pink-100 text-brand-pink flex items-center justify-center shrink-0">
            <PackageCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-extrabold text-brand-ink font-display">
                What's Inside the Box
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                56 Balloons Included
              </span>
            </div>
            <p className="text-xs text-brand-ink-muted">
              Actual purchased material checklist • 100% verified package inventory
            </p>
          </div>
        </div>

        <div className="p-1 rounded-lg text-brand-ink-muted hover:text-brand-ink hover:bg-white transition-colors">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Collapsible Content Panel */}
      {isExpanded && (
        <div className="p-5 space-y-5 animate-fadeIn">
          {/* Grouped Items Cards */}
          <div className="space-y-4">
            {contentGroups.map((group, groupIdx) => (
              <div
                key={groupIdx}
                className="rounded-xl border border-brand-ink/10 bg-brand-cream-50/40 p-3.5 sm:p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-brand-ink/5 pb-2">
                  <h4 className="text-xs sm:text-sm font-extrabold text-brand-ink uppercase tracking-wider">
                    {group.title}
                  </h4>
                  {group.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-brand-ink/10 text-brand-ink-muted">
                      {group.badge}
                    </span>
                  )}
                </div>

                <div className="divide-y divide-brand-ink/5">
                  {group.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="py-2.5 flex items-start sm:items-center justify-between gap-2.5 hover:bg-white/60 px-1.5 rounded-lg transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-brand-ink">
                            {item.name}
                          </span>
                          {item.specification && (
                            <span className="text-[11px] text-brand-ink-muted">
                              ({item.specification})
                            </span>
                          )}
                        </div>
                        {item.note && (
                          <p className="text-[11px] text-brand-ink-light mt-0.5 leading-snug">
                            {item.note}
                          </p>
                        )}
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="inline-block bg-white text-brand-ink text-xs font-black px-2.5 py-1 rounded-md border border-brand-ink/10 shadow-2xs">
                          {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Balloon Size Disclaimer Note */}
          <div className="p-3 rounded-xl bg-brand-cream-50 border border-brand-ink/10 flex items-start gap-2.5 text-xs text-brand-ink-light">
            <Info className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-brand-ink font-semibold">Balloons Note:</strong> Natural latex balloons should be inflated carefully. All 56 balloons are supplied uninflated.
            </div>
          </div>

          {/* Important Exclusions & Styling Note */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/70 space-y-1.5 text-amber-900 text-xs leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Package Exclusions:</span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-900/90 pl-5.5">
              Cake, table, gift boxes, flowers, and props are styling inspiration only and not included. Decorative lighting is available separately on rent. Balloon pump is not included.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
