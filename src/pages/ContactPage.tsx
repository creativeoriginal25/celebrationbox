import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Building2,
  ChevronRight,
  ExternalLink,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppLink, triggerWhatsAppChat } from '../services/whatsappService';

export const ContactPage: React.FC = () => {
  const handleOpenWhatsApp = () => {
    const message = `Hello Celebration Box team! 👋 I have a query about your celebration boxes and cake combos. Could you please help me?`;
    const url = buildWhatsAppLink(BUSINESS_CONFIG.whatsappNumber, message);
    triggerWhatsAppChat(url);
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB]">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-brand-ink/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs text-brand-ink-muted">
            <Link to="/" className="hover:text-brand-pink font-semibold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
            <span className="text-brand-ink font-bold">Contact Us</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-black uppercase tracking-wider">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>We&apos;re Here to Help</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-ink font-display tracking-tight">
            Contact &amp; Delivery Hub
          </h1>

          <p className="text-sm sm:text-base text-brand-ink-light leading-relaxed">
            Have questions about box customization, cake combos, or campus pickup? Reach out to our student-led team on WhatsApp.
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: WhatsApp Support */}
          <div className="p-6 rounded-3xl bg-white border border-brand-ink/10 shadow-card flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-brand-ink font-display">
                WhatsApp Support
              </h3>
              <p className="text-xs text-brand-ink-light leading-relaxed">
                Fastest way to get in touch. We respond instantly for order tracking and custom enquiries.
              </p>
              <div className="font-mono text-sm font-bold text-emerald-800">
                +91 9100280705
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>

          {/* Card 2: Campus Pickup Location */}
          <div className="p-6 rounded-3xl bg-white border border-brand-ink/10 shadow-card flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal/15 text-brand-teal flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-brand-ink font-display">
                Campus Pickup Hub
              </h3>
              <p className="text-xs text-brand-ink-light leading-relaxed">
                Free handover point for all college students and staff.
              </p>
              <div className="text-xs text-brand-ink font-semibold">
                SRKR Engineering College Gate, Bhimavaram, AP 534204
              </div>
            </div>

            <div className="p-3 rounded-xl bg-teal-50/80 border border-teal-200/60 text-[11px] text-teal-900 font-semibold text-center">
              FREE Campus Handover
            </div>
          </div>

          {/* Card 3: Email & Inquiries */}
          <div className="p-6 rounded-3xl bg-white border border-brand-ink/10 shadow-card flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-pink/15 text-brand-pink flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-brand-ink font-display">
                Email Inquiries
              </h3>
              <p className="text-xs text-brand-ink-light leading-relaxed">
                For corporate celebrations, institutional collaborations, and official partnership requests.
              </p>
              <a
                href={`mailto:${BUSINESS_CONFIG.email}`}
                className="text-xs font-bold text-brand-pink hover:underline truncate block"
              >
                {BUSINESS_CONFIG.email}
              </a>
            </div>

            <a
              href={`mailto:${BUSINESS_CONFIG.email}`}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-brand-cream-50 border border-brand-ink/15 text-brand-ink font-extrabold text-xs shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4 text-brand-pink" />
              <span>Send Email</span>
            </a>
          </div>
        </div>

        {/* Operating Hours Note */}
        <div className="rounded-3xl bg-brand-cream-50/80 border border-brand-ink/10 p-6 sm:p-8 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs text-brand-ink-light leading-relaxed">
            <h4 className="font-extrabold text-brand-ink text-sm">Operating Timings &amp; Midnight Orders</h4>
            <p>
              We operate every day from <strong>9:00 AM to 10:30 PM</strong>. For surprise midnight birthday deliveries (11:30 PM – 12:15 AM), please place your order at least 4 hours in advance so our bakery partner Chocoloom can bake your cake fresh!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
