import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PackageCheck, AlertCircle, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';

interface ProductContentsProps {
  product: Product;
  defaultExpanded?: boolean;
}

export const ProductContents: React.FC<ProductContentsProps> = ({
  product,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  // Accurate piece counts from config
  const totalPieces = product.totalPieces;
  const packItems = product.packItems || [];

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
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-brand-ink">
                What's Inside the Pack
              </h3>
              {totalPieces && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {totalPieces} Total Pieces
                </span>
              )}
            </div>
            <p className="text-xs text-brand-ink-muted">
              {packItems.length > 0
                ? `${packItems.length} essential kit items • 100% verified package inventory`
                : `${product.inclusions.length} celebration essentials`}
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
          {/* Verified Items List */}
          {packItems.length > 0 ? (
            <div className="divide-y divide-brand-ink/5 border-y border-brand-ink/5">
              {packItems.map((item, idx) => (
                <div
                  key={idx}
                  className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4 hover:bg-brand-cream-50/50 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-brand-pink/10 text-brand-pink text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs sm:text-sm font-bold text-brand-ink">
                          {item.name}
                        </span>
                        {item.specification && (
                          <span className="text-[11px] text-brand-ink-muted hidden md:inline">
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
                  </div>

                  <div className="sm:text-right shrink-0 pl-7 sm:pl-0">
                    <span className="inline-block bg-brand-cream-100 text-brand-ink text-xs font-black px-2.5 py-1 rounded-md border border-brand-ink/10">
                      {item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Fallback to simple inclusions if packItems not present */
            <ul className="space-y-2">
              {product.inclusions.map((inclusion, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-brand-ink">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{inclusion}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Balloon Size Disclaimer Note */}
          <div className="p-3 rounded-xl bg-brand-cream-50 border border-brand-ink/10 flex items-start gap-2.5 text-xs text-brand-ink-light">
            <Info className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-brand-ink font-semibold">Important Note:</strong> Balloon sizes are approximate when fully inflated. Natural latex balloons should be inflated carefully according to the included DIY instruction card.
            </div>
          </div>

          {/* Important Exclusions & Notes */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/70 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Explicit Exclusions &amp; Notes:</span>
            </div>
            <ul className="space-y-1 pl-5 list-disc text-[11px] sm:text-xs text-amber-900/90 leading-relaxed">
              {product.exclusions.map((exclusion, idx) => (
                <li key={idx}>{exclusion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};