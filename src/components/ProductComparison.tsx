import React, { useState } from 'react';
import { Check, X, Sparkles, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../config/products';
import { formatPrice } from '../utils/currency';

interface ProductComparisonProps {
  onOrderNow: (productId: 'mini-celebration-box' | 'signature-celebration-box') => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({ onOrderNow }) => {
  const [mobileTab, setMobileTab] = useState<'mini' | 'signature'>('signature');

  const comparisonRows = [
    {
      feature: 'Selling Price',
      mini: formatPrice(249),
      signature: formatPrice(499),
      isHighlight: true,
    },
    {
      feature: 'Total Box Items',
      mini: '8 Curated Items',
      signature: '12 Curated Items',
      isHighlight: false,
    },
    {
      feature: 'Latex Balloons (Pastel Pop)',
      mini: '12 Balloons (4 Peach, 4 Lilac, 4 Cream)',
      signature: '20 Balloons (Full Garland Set)',
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
      feature: '18" Birthday Foil Balloon',
      mini: false,
      signature: 'Yes (Metallic Statement)',
      isHighlight: true,
    },
    {
      feature: 'Photo Booth Props',
      mini: false,
      signature: '6 Themed Photo Props',
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
      mini: '1 Metre Strip',
      signature: '2 Metre Strip',
      isHighlight: false,
    },
    {
      feature: 'Balloon Glue Dots',
      mini: '10 Removable Dots',
      signature: '20 Removable Dots',
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
      feature: 'Estimated Setup Time',
      mini: '15–20 minutes',
      signature: '30–40 minutes',
      isHighlight: false,
    },
    {
      feature: 'Ideal For',
      mini: 'Hostel rooms & bedroom surprises',
      signature: 'Living rooms, halls & photobooths',
      isHighlight: false,
    },
  ];

  return (
    <section id="compare" className="py-16 md:py-24 relative scroll-mt-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-teal text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Comparison</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink">
            Compare Celebration Boxes
          </h2>
          <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
            Every item is verified and packed into your celebration box. Choose the setup that fits your room and celebration.
          </p>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="block md:hidden mb-6">
          <div className="grid grid-cols-2 p-1 bg-white border border-brand-ink/10 rounded-xl shadow-xs">
            <button
              onClick={() => setMobileTab('mini')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mobileTab === 'mini'
                  ? 'bg-brand-ink text-white shadow-xs'
                  : 'text-brand-ink hover:text-brand-pink'
              }`}
            >
              Mini Box ({formatPrice(PRODUCTS[0].price)})
            </button>
            <button
              onClick={() => setMobileTab('signature')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mobileTab === 'signature'
                  ? 'bg-brand-pink text-white shadow-xs'
                  : 'text-brand-ink hover:text-brand-pink'
              }`}
            >
              Signature Box ({formatPrice(PRODUCTS[1].price)})
            </button>
          </div>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="block md:hidden surface-card rounded-2xl p-5 border border-brand-ink/10">
          <div className="flex items-center justify-between pb-4 border-b border-brand-ink/10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-ink-muted">
                {mobileTab === 'mini' ? 'Hostel & Bedroom Pick' : 'Complete Party Setup'}
              </span>
              <h3 className="text-lg font-bold text-brand-ink">
                {mobileTab === 'mini' ? PRODUCTS[0].name : PRODUCTS[1].name}
              </h3>
            </div>
            <span className="text-xl font-black text-brand-pink">
              {formatPrice(mobileTab === 'mini' ? PRODUCTS[0].price : PRODUCTS[1].price)}
            </span>
          </div>

          <div className="divide-y divide-brand-ink/5 py-2">
            {comparisonRows.map((row, idx) => {
              const val = mobileTab === 'mini' ? row.mini : row.signature;
              return (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="text-brand-ink-light font-medium">{row.feature}</span>
                  <span className="font-bold text-brand-ink text-right">
                    {typeof val === 'boolean' ? (
                      val ? (
                        <span className="inline-flex items-center text-emerald-600 gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[3]" /> Included
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-rose-500 gap-1">
                          <X className="w-3.5 h-3.5 stroke-[3]" /> Not Included
                        </span>
                      )
                    ) : (
                      val
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-brand-ink/10">
            <button
              onClick={() => onOrderNow(mobileTab === 'mini' ? PRODUCTS[0].id : PRODUCTS[1].id)}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                Order {mobileTab === 'mini' ? 'Mini (₹249)' : 'Signature (₹499)'}
              </span>
            </button>
          </div>
        </div>

        {/* Desktop Comparison Table */}
        <div className="hidden md:block surface-card rounded-2xl overflow-hidden border border-brand-ink/10 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-ink/10 bg-brand-cream-50">
                <th className="py-4 px-6 text-sm font-bold text-brand-ink w-2/5">
                  Inclusions & Specs
                </th>
                <th className="py-4 px-6 text-center w-3/10 bg-white/70">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-ink-muted block">Budget Friendly</span>
                  <span className="text-base font-extrabold text-brand-ink block">Mini Box</span>
                  <span className="text-sm font-bold text-brand-ink">{formatPrice(PRODUCTS[0].price)}</span>
                </th>
                <th className="py-4 px-6 text-center w-3/10 bg-brand-pink-50/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-pink block">Most Popular</span>
                  <span className="text-base font-extrabold text-brand-ink block">Signature Box</span>
                  <span className="text-sm font-black text-brand-pink">{formatPrice(PRODUCTS[1].price)}</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ink/5 text-xs sm:text-sm">
              {comparisonRows.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-brand-cream-50/50 transition-colors ${
                    row.isHighlight ? 'bg-amber-50/40' : ''
                  }`}
                >
                  <td className="py-3.5 px-6 text-brand-ink font-medium">
                    {row.feature}
                  </td>

                  {/* Mini Box Column */}
                  <td className="py-3.5 px-6 text-center text-brand-ink-light bg-white/40">
                    {typeof row.mini === 'boolean' ? (
                      row.mini ? (
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-500">
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )
                    ) : (
                      <span className={row.feature === 'Selling Price' ? 'font-bold text-brand-ink' : ''}>
                        {row.mini}
                      </span>
                    )}
                  </td>

                  {/* Signature Box Column */}
                  <td className="py-3.5 px-6 text-center text-brand-ink font-semibold bg-brand-pink-50/20">
                    {typeof row.signature === 'boolean' ? (
                      row.signature ? (
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 text-rose-500">
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )
                    ) : (
                      <span className={row.feature === 'Selling Price' ? 'font-black text-brand-pink text-base' : 'text-brand-pink font-semibold'}>
                        {row.signature}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-brand-cream-50/80 border-t border-brand-ink/10">
                <td className="py-4 px-6 text-xs text-brand-ink-muted">
                  Ready to book? Fast WhatsApp checkout:
                </td>
                <td className="py-4 px-6 text-center">
                  <button
                    onClick={() => onOrderNow('mini-celebration-box')}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-brand-ink bg-white hover:bg-brand-cream-100 border border-brand-ink/20 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order Mini (₹249)</span>
                  </button>
                </td>
                <td className="py-4 px-6 text-center bg-brand-pink-50/50">
                  <button
                    onClick={() => onOrderNow('signature-celebration-box')}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm transition-all cursor-pointer"
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
    </section>
  );
};
