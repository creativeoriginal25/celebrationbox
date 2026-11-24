import React, { useState, useEffect } from 'react';
import {
  Gift,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  RefreshCw,
  Search,
  Filter,
  ExternalLink,
  ShieldAlert,
  X,
  Send,
  UserCheck,
  PowerOff,
  Check,
  KeyRound,
} from 'lucide-react';
import { formatPrice } from '../../utils/currency';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { getSupabaseClient } from '../../lib/supabase';

interface ReferralCodeItem {
  code: string;
  partnerName: string;
  partnerContact: string;
  notes?: string;
  status: 'UNASSIGNED' | 'ACTIVE' | 'INACTIVE';
  verifiedReferrals?: number;
  earnedRewards?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ReferralOrderItem {
  orderId: string;
  timestamp: string;
  customerName: string;
  customerPhone: string;
  product: string;
  quantity: number;
  orderTotal: number;
  fulfilmentMethod: string;
  referralCode: string;
  referralPartner: string;
  orderStatus: string;
  paymentStatus: string;
  fulfilmentStatus: string;
  referralEligibility: string;
  notes?: string;
}

interface ReferralRewardItem {
  rewardId: string;
  referralPartner: string;
  referralCode: string;
  eligibleOrderIds: string;
  rewardAmount: number;
  rewardStatus: 'Pending Payout' | 'Paid';
  createdAt: string;
  paymentDate?: string;
  upiNotes?: string;
}

interface ReferralMetrics {
  totalCodes: number;
  activePartners: number;
  pendingReferredOrders: number;
  verifiedReferrals: number;
  pendingRewardPayouts: number;
  totalRewardsPaid: number;
}

export const AdminReferrals: React.FC = () => {
  const { user } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'codes' | 'orders' | 'rewards'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Data States
  const [metrics, setMetrics] = useState<ReferralMetrics>({
    totalCodes: 10,
    activePartners: 0,
    pendingReferredOrders: 0,
    verifiedReferrals: 0,
    pendingRewardPayouts: 0,
    totalRewardsPaid: 0,
  });
  const [codes, setCodes] = useState<ReferralCodeItem[]>([]);
  const [orders, setOrders] = useState<ReferralOrderItem[]>([]);
  const [rewards, setRewards] = useState<ReferralRewardItem[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [assignModalCode, setAssignModalCode] = useState<ReferralCodeItem | null>(null);
  const [assignForm, setAssignForm] = useState({ partnerName: '', partnerContact: '', notes: '' });
  const [isAssigning, setIsAssigning] = useState(false);

  const [payoutModalReward, setPayoutModalReward] = useState<ReferralRewardItem | null>(null);
  const [payoutForm, setPayoutForm] = useState({ upiNotes: '' });
  const [isPaying, setIsPaying] = useState(false);

  // Admin Auth / Key Modal
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [adminApiKey, setAdminApiKey] = useState(() => localStorage.getItem('cb_admin_api_key') || '');

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    let token = '';
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          token = session.access_token;
        }
      } catch {
        // fallback
      }
    }
    if (!token) {
      token = localStorage.getItem('cb_admin_api_key') || '';
    }
    return {
      'Authorization': `Bearer ${token || 'unauthenticated'}`,
    };
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = adminApiKey.trim();
    if (trimmed) {
      localStorage.setItem('cb_admin_api_key', trimmed);
      showNotification('Admin API Key saved to browser storage.');
    } else {
      localStorage.removeItem('cb_admin_api_key');
      showNotification('Admin API Key cleared.');
    }
    setIsKeyModalOpen(false);
    loadReferralData(true);
  };

  const loadReferralData = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMsg(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/admin/referral?action=list', {
        headers,
      });

      if (response.status === 401 || response.status === 403) {
        setIsKeyModalOpen(true);
        throw new Error('Unauthorized. Please enter your ADMIN_API_KEY or sign in with an authorized Supabase admin account.');
      }

      if (!response.ok) {
        throw new Error(`Failed to load referral registry (${response.status})`);
      }

      const data = await response.json();
      if (data.success) {
        setMetrics(data.metrics || metrics);
        setCodes(data.codes || []);
        setOrders(data.orders || []);
        setRewards(data.rewards || []);
      } else {
        throw new Error(data.error || 'Failed to fetch referral data');
      }
    } catch (err: any) {
      console.error('Error loading referral data:', err);
      setErrorMsg(err.message || 'Unable to connect to Google Sheets referral tracker.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadReferralData();
  }, []);

  // Action: Assign Code to Student
  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalCode) return;

    if (!assignForm.partnerName.trim() || !assignForm.partnerContact.trim()) {
      alert('Please provide student partner name and contact number/UPI.');
      return;
    }

    setIsAssigning(true);
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch('/api/admin/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          action: 'assign_code',
          code: assignModalCode.code,
          partnerName: assignForm.partnerName.trim(),
          partnerContact: assignForm.partnerContact.trim(),
          notes: assignForm.notes.trim(),
        }),
      });

      if (res.status === 401 || res.status === 403) {
        setIsKeyModalOpen(true);
        alert('Unauthorized. Please enter your ADMIN_API_KEY.');
        return;
      }

      const result = await res.json();
      if (result.success) {
        showNotification(`Code ${assignModalCode.code} assigned to ${assignForm.partnerName} and activated!`);
        setAssignModalCode(null);
        setAssignForm({ partnerName: '', partnerContact: '', notes: '' });
        await loadReferralData(true);
      } else {
        alert(result.error || 'Failed to assign code');
      }
    } catch (err: any) {
      alert('Failed to connect to server: ' + err.message);
    } finally {
      setIsAssigning(false);
    }
  };

  // Action: Toggle Status (Activate / Deactivate)
  const handleToggleStatus = async (item: ReferralCodeItem) => {
    const nextStatus = item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const confirmMsg =
      nextStatus === 'INACTIVE'
        ? `Are you sure you want to deactivate code ${item.code}? Customers won't be able to checkout with it.`
        : `Activate code ${item.code}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch('/api/admin/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          action: 'toggle_code_status',
          code: item.code,
          status: nextStatus,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        setIsKeyModalOpen(true);
        alert('Unauthorized. Please enter your ADMIN_API_KEY.');
        return;
      }

      const result = await res.json();
      if (result.success) {
        showNotification(`Status of ${item.code} updated to ${nextStatus}`);
        await loadReferralData(true);
      } else {
        alert(result.error || 'Failed to toggle status');
      }
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  // Action: Verify Order (Payment & Fulfilment)
  const handleVerifyOrder = async (orderId: string, verified: boolean) => {
    const promptText = verified
      ? 'Confirm payment has been received and order has been fulfilled? (This triggers ₹80 reward calculation)'
      : 'Disqualify or cancel this order?';

    if (!window.confirm(promptText)) return;

    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch('/api/admin/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          action: 'verify_order',
          orderId,
          paymentStatus: verified ? 'Verified Paid' : 'Failed',
          fulfilmentStatus: verified ? 'Fulfilled' : 'Cancelled',
          orderStatus: verified ? 'Completed' : 'Cancelled',
        }),
      });

      if (res.status === 401 || res.status === 403) {
        setIsKeyModalOpen(true);
        alert('Unauthorized. Please enter your ADMIN_API_KEY.');
        return;
      }

      const result = await res.json();
      if (result.success) {
        showNotification(
          verified
            ? `Order ${orderId} verified as Paid & Fulfilled!`
            : `Order ${orderId} marked as Cancelled/Disqualified.`
        );
        if (result.rewardSyncResult?.newRewardsGenerated > 0) {
          alert(
            `🎉 Milestone Reached! ${result.rewardSyncResult.newRewardsGenerated} new reward(s) of ₹80 unlocked for ${result.rewardSyncResult.partnerName}!`
          );
        }
        await loadReferralData(true);
      } else {
        alert(result.error || 'Failed to update order');
      }
    } catch (err: any) {
      alert('Error verifying order: ' + err.message);
    }
  };

  // Action: Mark Reward as Paid via UPI
  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutModalReward) return;

    setIsPaying(true);
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch('/api/admin/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          action: 'mark_reward_paid',
          rewardId: payoutModalReward.rewardId,
          upiNotes: payoutForm.upiNotes.trim() || 'Paid via UPI manual transfer',
        }),
      });

      if (res.status === 401 || res.status === 403) {
        setIsKeyModalOpen(true);
        alert('Unauthorized. Please enter your ADMIN_API_KEY.');
        return;
      }

      const result = await res.json();
      if (result.success) {
        showNotification(`Reward ${payoutModalReward.rewardId} recorded as Paid via UPI!`);
        setPayoutModalReward(null);
        setPayoutForm({ upiNotes: '' });
        await loadReferralData(true);
      } else {
        alert(result.error || 'Failed to record payout');
      }
    } catch (err: any) {
      alert('Error updating reward: ' + err.message);
    } finally {
      setIsPaying(false);
    }
  };

  // Filtered Codes
  const filteredCodes = codes.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.partnerContact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header & Google Sheets Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 font-display">
              Refer & Earn Program
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-pink/10 text-brand-pink border border-brand-pink/20 uppercase tracking-wider">
              Refer 2 • Earn ₹80
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Student partner tracking, verified order qualification, and manual UPI reward payouts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 active:scale-98 transition-all cursor-pointer"
            title="Configure Admin API Secret / Key"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>Auth Key</span>
          </button>

          <button
            onClick={() => loadReferralData(true)}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            title="Sync latest live data from Google Sheets"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-pink' : ''}`} />
            <span>Sync Sheets</span>
          </button>

          <a
            href="https://docs.google.com/spreadsheets/d/11rFXjWhOISYTBDqIbllV_qhc8qyVZlFCrgUmAYfYrYk/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 shadow-2xs hover:bg-emerald-100/80 active:scale-98 transition-all"
          >
            <span>Google Sheets Tracker</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Error Alert if any */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Google Sheets Connection Notice</p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              {errorMsg}. Server-side Google Service Account credentials (`GOOGLE_SERVICE_ACCOUNT_EMAIL` & `GOOGLE_PRIVATE_KEY`) must be configured on Vercel to sync directly with Google Sheets. Customer checkout remains resilient and continues seamlessly.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-brand-pink text-brand-pink'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Overview & Metrics
        </button>

        <button
          onClick={() => setActiveTab('codes')}
          className={`pb-3 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'codes'
              ? 'border-brand-pink text-brand-pink'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Referral Codes</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600">
            {codes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'border-brand-pink text-brand-pink'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Referred Orders</span>
          {metrics.pendingReferredOrders > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
              {metrics.pendingReferredOrders}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`pb-3 px-1 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'rewards'
              ? 'border-brand-pink text-brand-pink'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Rewards & UPI Payouts</span>
          {metrics.pendingRewardPayouts > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-brand-pink text-white font-bold">
              ₹{metrics.pendingRewardPayouts}
            </span>
          )}
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 1. OVERVIEW & KPI METRICS                                            */}
      {/* ==================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* 6 Core KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Codes
              </span>
              <span className="text-2xl font-black text-slate-800 font-display mt-1 block">
                {metrics.totalCodes}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Preset in Sheets</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Partners
              </span>
              <span className="text-2xl font-black text-emerald-600 font-display mt-1 block">
                {metrics.activePartners}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Assigned & verified</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pending Orders
              </span>
              <span className="text-2xl font-black text-amber-600 font-display mt-1 block">
                {metrics.pendingReferredOrders}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Awaiting payment check</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Verified Purchases
              </span>
              <span className="text-2xl font-black text-indigo-600 font-display mt-1 block">
                {metrics.verifiedReferrals}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Paid & Fulfilled</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pending Payouts
              </span>
              <span className="text-2xl font-black text-brand-pink font-display mt-1 block">
                {formatPrice(metrics.pendingRewardPayouts)}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Awaiting manual UPI</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Paid Out
              </span>
              <span className="text-2xl font-black text-slate-700 font-display mt-1 block">
                {formatPrice(metrics.totalRewardsPaid)}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Recorded in Sheets</span>
            </div>
          </div>

          {/* Business Logic Explainer Box */}
          <div className="p-5 rounded-2xl bg-[#FFF8F3] border border-brand-pink/20 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-brand-pink">
              <Gift className="w-5 h-5" />
              <h3 className="text-sm font-black uppercase tracking-wide">
                Campaign Mechanics: Refer 2 Friends. Earn ₹80.
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">1. Assign & Share</p>
                <p className="text-[11px] leading-relaxed">
                  Only <strong>ACTIVE</strong> codes assigned to real student partners can be used at checkout. Codes do not give customer discounts.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">2. Verification Gate</p>
                <p className="text-[11px] leading-relaxed">
                  Submitting an order or opening WhatsApp does not qualify. An order must be marked <strong>Verified Paid</strong> and <strong>Fulfilled</strong>.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-800">3. ₹80 Reward per 2 Distinct Friends</p>
                <p className="text-[11px] leading-relaxed">
                  Every 2 verified distinct customer phone purchases automatically unlocks ₹80. Payouts are transferred manually via UPI by the business owner.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. REFERRAL CODES TABLE                                              */}
      {/* ==================================================================== */}
      {activeTab === 'codes' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search code, partner or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-pink/20"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="unassigned">Unassigned</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Referral Code</th>
                    <th className="py-3 px-4">Partner Name</th>
                    <th className="py-3 px-4">Partner Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Verified Referrals</th>
                    <th className="py-3 px-4 text-center">Earned Rewards</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCodes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No referral codes found.
                      </td>
                    </tr>
                  ) : (
                    filteredCodes.map((item) => (
                      <tr key={item.code} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-brand-ink">
                          {item.code}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {item.partnerName || <span className="text-slate-400 italic font-normal">Not Assigned</span>}
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                          {item.partnerContact || <span className="text-slate-400 font-sans italic">—</span>}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : item.status === 'UNASSIGNED'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                          {item.verifiedReferrals ?? 0}
                        </td>

                        <td className="py-3.5 px-4 text-center font-black text-brand-pink">
                          {formatPrice(item.earnedRewards ?? 0)}
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          {item.status === 'UNASSIGNED' ? (
                            <button
                              onClick={() => {
                                setAssignModalCode(item);
                                setAssignForm({ partnerName: '', partnerContact: '', notes: '' });
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg text-white bg-brand-pink hover:bg-brand-pink-hover active:scale-95 transition-all cursor-pointer"
                            >
                              Assign Student
                            </button>
                          ) : (
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setAssignModalCode(item);
                                  setAssignForm({
                                    partnerName: item.partnerName,
                                    partnerContact: item.partnerContact,
                                    notes: item.notes || '',
                                  });
                                }}
                                className="px-2 py-1 text-[11px] font-bold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleToggleStatus(item)}
                                className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                                  item.status === 'ACTIVE'
                                    ? 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                }`}
                              >
                                {item.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. REFERRED ORDERS TABLE                                             */}
      {/* ==================================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Referral Code & Partner</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Fulfilment</th>
                    <th className="py-3 px-4">Eligibility</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 space-y-1">
                        <p className="font-semibold">No referred orders recorded yet.</p>
                        <p className="text-[11px]">
                          Orders submitted through checkout with an active referral code will appear here.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.orderId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {o.orderId}
                          <span className="block text-[10px] text-slate-400 font-sans font-normal">
                            {new Date(o.timestamp).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 block">{o.customerName}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{o.customerPhone}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-brand-pink block">{o.referralCode || 'Direct'}</span>
                          <span className="text-[11px] text-slate-500">{o.referralPartner || 'None'}</span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {formatPrice(o.orderTotal)}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.paymentStatus === 'Verified Paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {o.paymentStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.fulfilmentStatus === 'Fulfilled'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {o.fulfilmentStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.referralEligibility === 'Rewarded'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : o.referralEligibility === 'Eligible'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : o.referralEligibility === 'Disqualified'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {o.referralEligibility}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-1">
                          {o.paymentStatus !== 'Verified Paid' || o.fulfilmentStatus !== 'Fulfilled' ? (
                            <button
                              onClick={() => handleVerifyOrder(o.orderId, true)}
                              className="px-2.5 py-1 text-[11px] font-bold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 active:scale-95 transition-all cursor-pointer"
                              title="Mark order as Verified Paid and Fulfilled to qualify for referral reward"
                            >
                              Verify Paid & Delivered
                            </button>
                          ) : (
                            <span className="text-emerald-600 text-xs font-bold inline-flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 stroke-[3]" /> Verified
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. REWARDS & MANUAL UPI PAYOUTS                                      */}
      {/* ==================================================================== */}
      {activeTab === 'rewards' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Reward ID</th>
                    <th className="py-3 px-4">Partner Name</th>
                    <th className="py-3 px-4">Referral Code</th>
                    <th className="py-3 px-4">Eligible Order IDs (2 Orders)</th>
                    <th className="py-3 px-4 text-center">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Payment Date / UPI</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rewards.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 space-y-1">
                        <p className="font-semibold">No referral rewards generated yet.</p>
                        <p className="text-[11px]">
                          When 2 distinct customers purchase and are verified as paid/fulfilled, a ₹80 reward batch is automatically generated here.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    rewards.map((r) => (
                      <tr key={r.rewardId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {r.rewardId}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {r.referralPartner}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-brand-pink">
                          {r.referralCode}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                          {r.eligibleOrderIds}
                        </td>

                        <td className="py-3.5 px-4 text-center font-black text-emerald-600 text-sm">
                          ₹{r.rewardAmount}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              r.rewardStatus === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {r.rewardStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          {r.paymentDate ? (
                            <div>
                              <span className="block text-[11px] font-bold text-slate-700">
                                {new Date(r.paymentDate).toLocaleDateString()}
                              </span>
                              <span className="block text-[10px] text-slate-400">{r.upiNotes}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic font-normal">Pending Transfer</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {r.rewardStatus === 'Pending Payout' ? (
                            <button
                              onClick={() => {
                                setPayoutModalReward(r);
                                setPayoutForm({ upiNotes: '' });
                              }}
                              className="px-3 py-1.5 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer shadow-xs"
                            >
                              Mark Paid via UPI
                            </button>
                          ) : (
                            <span className="text-emerald-600 font-bold text-xs inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Payout Settled
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: ASSIGN CODE TO STUDENT PARTNER                                */}
      {/* ==================================================================== */}
      {assignModalCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">
                Assign Referral Code: <span className="font-mono text-brand-pink">{assignModalCode.code}</span>
              </h3>
              <button
                onClick={() => setAssignModalCode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Student / Partner Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Rao"
                  value={assignForm.partnerName}
                  onChange={(e) => setAssignForm({ ...assignForm, partnerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Partner Contact (WhatsApp & UPI) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9876543210 (or ananya@upi)"
                  value={assignForm.partnerContact}
                  onChange={(e) => setAssignForm({ ...assignForm, partnerContact: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Used for manual UPI transfers and self-referral prevention.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Campus / College Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SRKR Engineering, Hostel 3"
                  value={assignForm.notes}
                  onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink/20"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignModalCode(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="px-4 py-2 rounded-xl bg-brand-pink text-white font-bold hover:bg-brand-pink-hover active:scale-95 transition-all disabled:opacity-50"
                >
                  {isAssigning ? 'Saving...' : 'Activate & Assign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: MARK REWARD AS PAID VIA UPI                                   */}
      {/* ==================================================================== */}
      {payoutModalReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">
                Record UPI Payout: <span className="text-emerald-600 font-black">₹{payoutModalReward.rewardAmount}</span>
              </h3>
              <button
                onClick={() => setPayoutModalReward(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <p className="font-bold text-slate-700">Recipient: {payoutModalReward.referralPartner}</p>
              <p className="text-slate-500 font-mono text-[11px]">Code: {payoutModalReward.referralCode}</p>
              <p className="text-slate-500 font-mono text-[11px]">Orders: {payoutModalReward.eligibleOrderIds}</p>
            </div>

            <form onSubmit={handlePayoutSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  UPI Transaction ID / Ref Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI Ref 332190812345 / Google Pay"
                  value={payoutForm.upiNotes}
                  onChange={(e) => setPayoutForm({ upiNotes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Transfer ₹80 to the student via your UPI app (Google Pay / PhonePe / Paytm), then confirm here.
                </p>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayoutModalReward(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPaying}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isPaying ? 'Recording...' : 'Confirm UPI Paid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: CONFIGURE ADMIN API KEY                                       */}
      {/* ==================================================================== */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-800 text-sm">
                  Admin Authorization Key
                </h3>
              </div>
              <button
                onClick={() => setIsKeyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Administrative referral actions (assigning codes, changing status, qualifying orders, and recording payouts) require an authenticated server token.
              If not signed in via Supabase Admin, provide the secure <code className="text-pink-600 font-mono bg-pink-50 px-1 py-0.5 rounded">ADMIN_API_KEY</code> configured in your environment.
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ADMIN_API_KEY / Secret Token
                </label>
                <input
                  type="password"
                  placeholder="Enter admin secret..."
                  value={adminApiKey}
                  onChange={(e) => setAdminApiKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 font-mono text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 active:scale-95 transition-all"
                >
                  Save & Authorize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
