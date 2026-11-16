import React from 'react';
import { Check, X, Sparkles, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../config/products';
import { formatPrice } from '../utils/currency';

interface ProductComparisonProps {
  onOrderNow: (productId: 'mini-celebration-box' | 'signature-celebration-box') => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({ onOrderNow }) => {
  const comparisonRows = [
    {
      feature: 'Price',
      mini: formatPrice(249),
      signature: formatPrice(499),
      isHighlight: true,
    },
    {
      feature: 'Latex Balloons',
      mini: '12 Balloons (Coordinated)',
      signature: '20 Balloons (Full Garland)',
      isHighlight: false,
    },
    {
      feature: 'Happy Birthday Banner',
      mini: true,
      signature: true,
      isHighlight: false,
    },
    {
      feature: '6-Foot Foil Backdrop Curtain',
      mini: false,
      signature: 'Yes (Shimmer Wall)',
      isHighlight: true,
    },
    {
      feature: '18-Inch Birthday Foil Balloon',
      mini: false,
      signature: 'Yes (Statement Metallic)',
      isHighlight: true,
    },
    {
      feature: 'Photo Booth Props',
      mini: false,
      signature: '6 Fun Selfie Props',
      isHighlight: true,
    },
    {
      feature: 'Manual Balloon Hand Pump',
      mini: false,
      signature: 'Yes (Included)',
      isHighlight: true,
    },
    {
      feature: 'Cake Candle Pack (6 Pcs)',
      mini: true,
      signature: true,
      isHighlight: false,
    },
    {
      feature: 'Balloon Arch Strip',
      mini: '1 Metre',
      signature: '2 Metres',
      isHighlight: false,
    },
    {
      feature: 'Balloon Glue Dots',
      mini: '10 Dots',
      signature: '20 Dots',
      isHighlight: false,
    },
    {
      feature: 'Curling Ribbon',
      mini: '2 Metres',
      signature: '3 Metres',
      isHighlight: false,
    },
    {
      feature: 'DIY Instruction Guide',
      mini: true,
      signature: true,
      isHighlight: false,
    },
    {
      feature: 'Ideal For',
      mini: 'Hostel rooms, small bedroom surprises',
      signature: 'Hall parties, living rooms & photobooths',
      isHighlight: false,
    },
  ];

  return (
    <section id="compare" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-brand-pink-100/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge-teal text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Side-by-Side Comparison</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-ink">
            Which Box Is Right For You?
          </h2>
          <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
            Compare inclusions at a glance. Every item is verified and packed into your celebration box.
          </p>
        </div>

        {/* Comparison Table / Grid */}
        <div className="glass-card rounded-3xl overflow-hidden shadow-glass border-2 border-white/90">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[550px]">
              <thead>
                <tr className="border-b border-brand-ink/10 bg-white/70">
                  <th className="py-5 px-6 text-sm font-bold text-brand-ink w-2/5">
                    Kit Feature
                  </th>
                  <th className="py-5 px-6 text-center w-3/10 bg-white/50">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-ink-muted block">Budget Friendly</span>
                    <span className="text-lg font-black text-brand-ink block">Mini Box</span>
                    <span className="text-sm font-bold text-brand-pink">{formatPrice(PRODUCTS[0].price)}</span>
                  </th>
                  <th className="py-5 px-6 text-center w-3/10 bg-brand-pink-50/50 relative">
                    <span className="absolute -top-1 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-pink text-white shadow-sm">
                      Best Value
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-pink block">Complete Setup</span>
                    <span className="text-lg font-black text-brand-ink block">Signature Box</span>
                    <span className="text-sm font-bold text-brand-pink">{formatPrice(PRODUCTS[1].price)}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-ink/5 text-xs sm:text-sm">
                {comparisonRows.map((row, index) => (
                  <tr
                    key={index}
                    className={`transition-colors hover:bg-white/60 ${
                      row.isHighlight ? 'bg-amber-50/20 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-6 text-brand-ink font-medium">
                      {row.feature}
                    </td>

                    {/* Mini Column */}
                    <td className="py-3.5 px-6 text-center text-brand-ink-light bg-white/30">
                      {typeof row.mini === 'boolean' ? (
                        row.mini ? (
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-500">
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )
                      ) : (
                        <span className={row.feature === 'Price' ? 'font-bold text-brand-pink' : ''}>
                          {row.mini}
                        </span>
                      )}
                    </td>

                    {/* Signature Column */}
                    <td className="py-3.5 px-6 text-center text-brand-ink font-semibold bg-brand-pink-50/30">
                      {typeof row.signature === 'boolean' ? (
                        row.signature ? (
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-500">
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )
                      ) : (
                        <span className={row.feature === 'Price' ? 'font-black text-brand-pink' : 'text-brand-pink font-semibold'}>
                          {row.signature}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-white/80 border-t border-brand-ink/10">
                  <td className="py-5 px-6 text-xs text-brand-ink-muted">
                    Pick your match & order via WhatsApp:
                  </td>
                  <td className="py-5 px-6 text-center">
                    <button
                      onClick={() => onOrderNow('mini-celebration-box')}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-brand-ink glass-panel hover:bg-white border border-brand-ink/20 transition-all active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order Mini (₹249)</span>
                    </button>
                  </td>
                  <td className="py-5 px-6 text-center bg-brand-pink-50/50">
                    <button
                      onClick={() => onOrderNow('signature-celebration-box')}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-md shadow-brand-pink/25 transition-all active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order Signature (₹499)</span>
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};

