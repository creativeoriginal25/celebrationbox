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
        'Each box is a complete DIY party kit. The Mini Celebration Box (₹249) includes 12 latex balloons in our Pastel Pop palette, a Happy Birthday banner, a 6-pack of cake candles, a 1m balloon arch strip, 10 wall-safe glue dots, curling ribbon, DIY instruction card, and a branded sticker. The Signature Celebration Box (₹499) adds an 18-inch metallic foil balloon, a 6-foot shimmer foil backdrop curtain, 6 photo booth props, 20 balloons, and a manual balloon hand pump.',
    },
    {
      question: 'Do I need decoration experience?',
      answer:
        'Not at all! Every kit is designed specifically for beginners. We include our step-by-step DIY instruction card that shows you how to inflate balloons, slide them into the balloon arch strip, and mount the garland without tape using our wall-friendly glue dots in just 15 to 30 minutes.',
    },
    {
      question: 'Is a cake included?',
      answer:
        'No, cake is not included in any of our boxes. We focus exclusively on decorations and celebration styling. However, we do provide a 6-piece celebratory cake candle pack inside every single box so your birthday cake is ready for the wish-making moment!',
    },
    {
      question: 'Is a balloon pump included?',
      answer:
        'A manual balloon hand pump is included in the Signature Celebration Box (₹499). It is not included in the Mini Celebration Box (₹249) to keep the price at an ultra-affordable ₹249 — with 12 balloons, it is quick to blow up by mouth or share with a friend.',
    },
    {
      question: 'Do you offer delivery?',
      answer:
        'Yes! We offer nearby local delivery in Bhimavaram. Because delivery rates vary depending on distance and local bike/auto drop fares, actual delivery charges are confirmed transparently with you over WhatsApp before order dispatch. No surprise charges!',
    },
    {
      question: 'Can I collect my order from college?',
      answer:
        'Yes! We offer convenient college campus pickup in Bhimavaram (popular campus spots like SRKR, Vishnu, etc.). College pickup has zero delivery charges! Pickup spot and handover timings are confirmed with you over WhatsApp after you place your request.',
    },
    {
      question: 'How far in advance should I order?',
      answer:
        'We recommend placing your order at least 24 to 48 hours in advance to guarantee theme and box availability. If you have an urgent same-day birthday surprise in Bhimavaram, reach out to us on WhatsApp and we will do our best to accommodate based on current stock.',
    },
    {
      question: 'Can I request customized decorations?',
      answer:
        'For our initial launch, we offer the curated Pastel Pop theme (peach, lilac, and cream) to maintain the highest quality and lowest prices. You can add a personalized birthday message in our order form which we pack inside the box. Additional themes and custom accessories will be introduced soon!',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-badge-teal text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-ink">
            Got Questions? We Have Honest Answers
          </h2>
          <p className="text-sm sm:text-base text-brand-ink-light">
            Everything you need to know about our DIY celebration kits, inclusions, and Bhimavaram ordering.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-200 border border-white/80"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between text-left gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-brand-ink">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-brand-pink text-white rotate-180' : 'bg-brand-ink/5 text-brand-ink'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-brand-ink-light leading-relaxed border-t border-brand-ink/5 animate-fadeIn">
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

