import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'What comes inside a Celebration Box?',
      answer:
        'Each kit is a complete DIY party kit. The Mini Celebration Box (₹249) includes 12 latex balloons in our Pastel Pop palette (peach, lilac, cream), a Happy Birthday banner, a 6-pack of cake candles, 1m balloon arch strip, 10 wall-safe glue dots, curling ribbon, DIY instruction card, and a branded sticker. The Signature Celebration Box (₹499) includes 20 balloons, an 18-inch metallic foil balloon, a 6-foot shimmer foil backdrop curtain, 6 photo booth props, a 2m arch strip, 20 glue dots, curling ribbon, candles, instructions, and a manual balloon hand pump.',
    },
    {
      question: 'Do I need decoration experience?',
      answer:
        'Not at all! Every kit is designed for complete beginners. All setups are DIY (assembled by you). Our illustrated step-by-step instruction card shows you how to inflate balloons, slide them into the balloon arch strip, and mount them safely to walls with our removable glue dots in 15 to 40 minutes.',
    },
    {
      question: 'Is a cake included?',
      answer:
        'No, a cake is not included in either box. We focus purely on party decoration styling. However, we do include a 6-piece celebratory cake candle pack in every box so your birthday cake is ready for candle-lighting!',
    },
    {
      question: 'Is a balloon pump included?',
      answer:
        'A manual balloon hand pump is included in the Signature Celebration Box (₹499). It is not included in the Mini Celebration Box (₹249) to keep the price at an ultra-affordable ₹249 — with 12 balloons, it is quick to blow up by mouth or share with a roommate.',
    },
    {
      question: 'Do you offer delivery?',
      answer:
        'Yes! We offer nearby local delivery in Bhimavaram. Because delivery rates vary depending on distance and local auto/bike drop fares, actual delivery charges are confirmed transparently with you over WhatsApp before order dispatch. No surprise charges!',
    },
    {
      question: 'Can I collect my order from college?',
      answer:
        'Yes! We offer convenient, free college campus pickup in Bhimavaram (e.g. campus gates / student centers). College pickup has zero delivery fee. Pickup spot and collection timing are confirmed with you over WhatsApp after order verification.',
    },
    {
      question: 'How far in advance should I order?',
      answer:
        'We recommend booking at least 24 to 48 hours in advance to ensure theme and kit availability. If you have an urgent same-day celebration in Bhimavaram, send us a WhatsApp message and we will do our best to assist based on ready stock.',
    },
    {
      question: 'Can I request customized decorations?',
      answer:
        'For our initial launch, we focus on the curated Pastel Pop theme (peach, lilac, and cream) to maintain the highest quality and lowest prices. You can include a personal birthday message in our order form which we pack inside the box. Additional themes and celebration types will launch soon!',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 relative scroll-mt-28 bg-white/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full badge-teal text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-ink">
            Got Questions? We Have Honest Answers
          </h2>
          <p className="text-sm sm:text-base text-brand-ink-light">
            Everything you need to know about our DIY celebration kits, inclusions, and Bhimavaram ordering.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="surface-card rounded-xl overflow-hidden border border-brand-ink/10 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-4 px-5 flex items-center justify-between text-left gap-4 focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-brand-ink">
                    {faq.question}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-brand-pink text-white rotate-180' : 'bg-brand-cream-200 text-brand-ink'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-brand-ink-light leading-relaxed border-t border-brand-ink/5">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
