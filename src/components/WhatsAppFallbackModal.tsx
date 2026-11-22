import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, AlertTriangle, ExternalLink, Terminal } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppLink } from '../services/whatsappService';

interface WhatsAppFallbackModalProps {
  message: string;
  isConfigured: boolean;
  onClose: () => void;
}

export const WhatsAppFallbackModal: React.FC<WhatsAppFallbackModalProps> = ({
  message,
  isConfigured,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [testNumber, setTestNumber] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const cleanTestNumber = testNumber.replace(/\D/g, '');
  const testUrl = cleanTestNumber ? buildWhatsAppLink(cleanTestNumber, message) : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-ink/10 text-left max-h-[90vh] overflow-y-auto"
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
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-brand-pink/15 text-brand-pink flex items-center justify-center shrink-0">
            {isConfigured ? <MessageSquare className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6 text-amber-600" />}
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-brand-ink">
              {isConfigured ? 'Review & Copy Order Message' : 'WhatsApp Number Setup Required'}
            </h3>
            <p className="text-xs text-brand-ink-muted">
              {isConfigured
                ? 'Your order message has been generated and formatted.'
                : 'Follow the steps below to configure your business WhatsApp number.'}
            </p>
          </div>
        </div>

        {/* Notice for unconfigured number */}
        {!isConfigured && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-900 text-xs space-y-2">
            <p className="font-bold">
              Business WhatsApp Number is currently a placeholder (e.g. <code>91XXXXXXXXXX</code>).
            </p>
            <p>
              To connect your real business WhatsApp:
            </p>
            <ol className="list-decimal pl-5 space-y-1 font-mono text-[11px] bg-amber-100/60 p-2.5 rounded-lg">
              <li>Open <code>.env</code> in the project directory</li>
              <li>Set <code>VITE_WHATSAPP_NUMBER=91XXXXXXXXXX</code> (replace with your 10 or 12-digit Indian number)</li>
              <li>Save file and restart dev server (<code>npm run dev</code>)</li>
            </ol>
          </div>
        )}

        {/* Formatted Message Preview */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-ink">
              Ready-to-Send Order Text:
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-brand-pink bg-brand-pink/10 hover:bg-brand-pink/20 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-brand-ink/5 border border-brand-ink/10 text-xs font-mono text-brand-ink whitespace-pre-wrap break-words max-h-56 overflow-y-auto">
            {message}
          </pre>
        </div>

        {/* Quick Test Direct WhatsApp Trigger */}
        <div className="mb-5 p-4 rounded-2xl glass-panel space-y-2.5">
          <label className="block text-xs font-bold text-brand-ink">
            Test directly with a WhatsApp number right now:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. 919876543210"
              value={testNumber}
              onChange={(e) => setTestNumber(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl text-xs border border-brand-ink/15 bg-white font-mono"
            />
            {testUrl && (
              <a
                href={testUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-teal hover:bg-brand-teal-hover transition-colors"
              >
                <span>Open in WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <p className="text-[11px] text-brand-ink-muted">
            Format: Country code + 10 digits without '+' or spaces.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-brand-ink/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-brand-ink bg-brand-cream-50 hover:bg-brand-cream-100 border border-brand-ink/10 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy & Send Manually</span>
          </button>
        </div>
      </div>
    </div>
  );
};

