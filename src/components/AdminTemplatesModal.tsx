import React, { useState } from 'react';
import { X, Copy, Check, MessageSquareCode, Sparkles } from 'lucide-react';
import { OWNER_MESSAGE_TEMPLATES } from '../config/business';

interface AdminTemplatesModalProps {
  onClose: () => void;
}

export const AdminTemplatesModal: React.FC<AdminTemplatesModalProps> = ({ onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sampleCustomerName, setSampleCustomerName] = useState('Rahul');
  const [sampleProduct, setSampleProduct] = useState('Signature Celebration Box');
  const [sampleAmount, setSampleAmount] = useState(399);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-ink/10 text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-brand-ink-muted hover:text-brand-pink hover:bg-white/80 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-teal/15 text-brand-teal flex items-center justify-center shrink-0">
            <MessageSquareCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-brand-ink">
              Founder Quick-Reply WhatsApp Templates
            </h3>
            <p className="text-xs text-brand-ink-muted">
              Standardized messages to reply to customers in seconds. Copy & paste straight into WhatsApp.
            </p>
          </div>
        </div>

        {/* Quick parameters editor */}
        <div className="p-4 rounded-2xl bg-brand-cream-50/80 border border-brand-ink/10 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-brand-ink mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={sampleCustomerName}
              onChange={(e) => setSampleCustomerName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-brand-ink/15 text-xs bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-brand-ink mb-1">
              Product Kit
            </label>
            <select
              value={sampleProduct}
              onChange={(e) => {
                setSampleProduct(e.target.value);
                setSampleAmount(e.target.value.includes('Mini') ? 249 : 399);
              }}
              className="w-full px-3 py-1.5 rounded-lg border border-brand-ink/15 text-xs bg-white font-medium"
            >
              <option value="Pastel Rose Celebration Box">Pastel Rose Box (₹399)</option>
              <option value="Mini Celebration Box">Mini Box (₹249)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-brand-ink mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              value={sampleAmount}
              onChange={(e) => setSampleAmount(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-lg border border-brand-ink/15 text-xs bg-white font-medium"
            />
          </div>
        </div>

        {/* Templates List */}
        <div className="space-y-4">
          {OWNER_MESSAGE_TEMPLATES.map((tmpl) => {
            const renderedText = tmpl.template({
              customerName: sampleCustomerName || 'Customer',
              productName: sampleProduct,
              amount: sampleAmount,
            });

            const isCopied = copiedId === tmpl.id;

            return (
              <div
                key={tmpl.id}
                className="p-4 rounded-2xl bg-white/80 border border-brand-ink/10 shadow-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-brand-ink">{tmpl.title}</h4>
                    <p className="text-[11px] text-brand-ink-muted">{tmpl.description}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(tmpl.id, renderedText)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-xs active:scale-95 transition-all"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Template</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-3 rounded-xl bg-brand-cream/60 border border-brand-ink/5 text-xs font-mono text-brand-ink whitespace-pre-wrap leading-relaxed">
                  {renderedText}
                </pre>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-brand-ink/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-pink hover:bg-brand-pink-hover transition-colors shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

