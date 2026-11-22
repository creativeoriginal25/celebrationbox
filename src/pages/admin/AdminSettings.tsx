import React, { useState } from 'react';
import {
  Settings,
  Database,
  Copy,
  Check,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Code,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { BusinessSettings } from '../../types';
import { updateBusinessSettings } from '../../services/adminService';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminSettingsProps {
  settings: BusinessSettings;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<BusinessSettings>({ ...settings });
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const isLiveSupabase = isSupabaseConfigured();

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBusinessSettings(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
      onRefresh();
    } catch (err) {
      alert('Failed to save settings');
    }
  };

  const copySqlSetup = () => {
    const sqlText = `-- CELEBRATION BOX FIRST ADMIN USER CREATION
-- Run this in your Supabase SQL Editor after creating an account in Auth > Users:
INSERT INTO public.admin_users (id, email, role)
SELECT id, email, 'super_admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL@HERE.COM'
ON CONFLICT (id) DO NOTHING;`;
    navigator.clipboard.writeText(sqlText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-ink tracking-tight font-display">
          Website &amp; Business Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure public store contact channels, fulfillment instructions, and database connections.
        </p>
      </div>

      {/* Supabase Connection Status Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-brand-teal flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-brand-ink">Supabase PostgreSQL Database</h2>
              <p className="text-xs text-slate-400">Persistent storage, Auth, and Row-Level Security</p>
            </div>
          </div>

          {isLiveSupabase ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Connected &amp; Live</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Local Sandbox Mode Active</span>
            </span>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 space-y-2">
          <p className="leading-relaxed">
            {isLiveSupabase
              ? 'Your admin dashboard is actively persisting all product catalogues, orders, and materials directly to your live Supabase cloud database with row-level security enabled.'
              : 'The dashboard is currently operating in local sandbox mode with reactive browser persistence. All products, orders, and inventory changes you make right now will persist safely in your browser.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={copySqlSetup}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors cursor-pointer text-xs shadow-2xs"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied First-Admin SQL!' : 'Copy First-Admin SQL Snippet'}</span>
            </button>
            <span className="text-[11px] text-slate-400">
              (File saved at: <code>supabase/schema.sql</code>)
            </span>
          </div>
        </div>
      </div>

      {/* Business Profile Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-brand-ink">Store Profile &amp; Contact Channels</h2>
            <p className="text-[11px] text-slate-400">Publicly visible on your store header, footer, and WhatsApp checkout</p>
          </div>
          {isSaved && (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              <Check className="w-3.5 h-3.5" />
              <span>Settings Saved!</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Business Name</label>
            <input
              type="text"
              required
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              WhatsApp Business Number (with country code, no +)
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:border-brand-pink"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contact Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Instagram URL</label>
            <input
              type="url"
              value={formData.instagram_url}
              onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Service Location</label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={formData.service_location}
              onChange={(e) => setFormData({ ...formData, service_location: e.target.value })}
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pickup Instructions</label>
            <textarea
              rows={2}
              value={formData.pickup_instructions}
              onChange={(e) => setFormData({ ...formData, pickup_instructions: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Delivery Policy / Notes</label>
            <textarea
              rows={2}
              value={formData.delivery_info}
              onChange={(e) => setFormData({ ...formData, delivery_info: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white font-bold shadow-xs cursor-pointer transition-all"
          >
            Save Store Settings
          </button>
        </div>
      </form>
    </div>
  );
};
