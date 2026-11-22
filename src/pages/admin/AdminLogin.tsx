import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, Mail, ArrowLeft, ShieldAlert, Sparkles, Database, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onNavigateHome }) => {
  const { signIn, isConfigured } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await signIn(email, password);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.error || 'Failed to authenticate');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-800">
      {/* Back to Public Store link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-pink transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to celebrationbox.in</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-pink/10 text-brand-pink mb-3 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-brand-ink tracking-tight font-display">
            Business Control Centre
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to manage products, pricing, orders and stock.
          </p>
        </div>

        <div className="mt-6 bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200/80 rounded-2xl">
          {/* Connection Status Pill */}
          <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-teal" />
              <span className="font-semibold text-slate-700">Database Engine:</span>
            </div>
            {isConfigured ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                <span>Supabase Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                <span>Local Sandbox Mode</span>
              </span>
            )}
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@celebrationbox.in"
                  className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign in to Dashboard'}
            </button>
          </form>

          {!isConfigured && (
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                <strong>First-time setup?</strong> Enter any admin email and a 6+ character password to explore the sandbox dashboard. Connect your Supabase credentials in Settings anytime.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
