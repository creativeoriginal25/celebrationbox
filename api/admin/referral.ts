import { createClient } from '@supabase/supabase-js';
import {
  fetchReferralCodes,
  fetchOrders,
  fetchRewards,
  updateReferralCode,
  updateOrderStatus,
  updateRewardStatus,
  ReferralCodeRecord,
  isGoogleSheetsConfigured,
} from '../lib/googleSheets';
import { syncRewardsForCode } from '../lib/rewardEngine';

/**
 * Server-side administrator verification
 * Validates against server ADMIN_SECRET_KEY / ADMIN_API_KEY, or verified Supabase admin session token.
 */
const verifyAdminAuth = async (req: any): Promise<{ authorized: boolean; error?: string }> => {
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, error: 'Missing or malformed Authorization header.' };
  }

  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  if (!token) {
    return { authorized: false, error: 'Authorization token is empty.' };
  }

  // 1. Verify against server-side secret API keys (never exposed to client)
  const validAdminKeys = [
    process.env.ADMIN_SECRET_KEY,
    process.env.ADMIN_API_KEY,
  ].filter(Boolean) as string[];

  if (validAdminKeys.length > 0 && validAdminKeys.includes(token)) {
    return { authorized: true };
  }

  // 2. Verify Supabase JWT admin session if Supabase is configured
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (user && !error) {
        // Verify user exists in admin_users table
        const { data: adminRecord } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (adminRecord && (adminRecord.role === 'admin' || adminRecord.role === 'owner')) {
          return { authorized: true };
        }
      }
    } catch (err) {
      console.error('Supabase admin token verification error:', err);
    }
  }

  return { authorized: false, error: 'Invalid or unauthorized administrator token.' };
};

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Strict Server-Side Authentication Audit: Every request (list and mutations) requires verified admin authorization
  const authResult = await verifyAdminAuth(req);
  if (!authResult.authorized) {
    return res.status(401).json({
      success: false,
      error: authResult.error || 'Unauthorized: Administrator authentication required.',
    });
  }

  // Check durable Google Sheets configuration
  const durableConfigured = isGoogleSheetsConfigured();

  try {
    const action = req.query?.action || (req.body && req.body.action) || 'list';

    // 1. ACTION: LIST ALL REFERRAL DATA
    if (action === 'list') {
      const [codes, orders, rewards] = await Promise.all([
        fetchReferralCodes(),
        fetchOrders(),
        fetchRewards(),
      ]);

      // Calculate overview metrics
      const totalCodes = codes.length;
      const activePartners = codes.filter((c) => c.status === 'ACTIVE').length;
      const pendingReferredOrders = orders.filter(
        (o) => o.referralCode && o.orderStatus === 'Pending'
      ).length;
      const verifiedReferrals = orders.filter(
        (o) =>
          o.referralCode &&
          o.paymentStatus === 'Verified Paid' &&
          o.fulfilmentStatus === 'Fulfilled'
      ).length;
      const pendingRewardPayouts = rewards
        .filter((r) => r.rewardStatus === 'Pending Payout')
        .reduce((sum, r) => sum + (r.rewardAmount || 80), 0);
      const totalRewardsPaid = rewards
        .filter((r) => r.rewardStatus === 'Paid')
        .reduce((sum, r) => sum + (r.rewardAmount || 80), 0);

      // Add computed verified referrals & rewards earned to each code
      const enrichedCodes = codes.map((c) => {
        const codeUpper = (c.code || '').trim().toUpperCase();
        const codeOrders = orders.filter(
          (o) => (o.referralCode || '').trim().toUpperCase() === codeUpper
        );
        const codeVerified = codeOrders.filter(
          (o) =>
            o.paymentStatus === 'Verified Paid' &&
            o.fulfilmentStatus === 'Fulfilled' &&
            o.orderStatus !== 'Cancelled'
        ).length;
        const codeRewards = rewards.filter(
          (r) => (r.referralCode || '').trim().toUpperCase() === codeUpper
        );
        const rewardsTotal = codeRewards.reduce((sum, r) => sum + (r.rewardAmount || 80), 0);

        return {
          ...c,
          verifiedReferrals: codeVerified,
          earnedRewards: rewardsTotal,
        };
      });

      return res.status(200).json({
        success: true,
        durableStorageConfigured: durableConfigured,
        metrics: {
          totalCodes,
          activePartners,
          pendingReferredOrders,
          verifiedReferrals,
          pendingRewardPayouts,
          totalRewardsPaid,
        },
        codes: enrichedCodes,
        orders,
        rewards,
      });
    }

    // 2. ACTION: ASSIGN CODE TO PARTNER
    if (action === 'assign_code') {
      const { code, partnerName, partnerContact, notes } = req.body;
      if (!code || !partnerName || !partnerContact) {
        return res.status(400).json({
          success: false,
          error: 'Code, Partner Name, and Partner Contact (Mobile/UPI) are required.',
        });
      }

      if (!durableConfigured) {
        return res.status(503).json({
          success: false,
          error: 'Durable storage is unconfigured. Cannot assign code without Google Sheets credentials.',
        });
      }

      const allCodes = await fetchReferralCodes();
      const existing = allCodes.find(
        (c) => (c.code || '').trim().toUpperCase() === code.trim().toUpperCase()
      );

      const now = new Date().toISOString();
      const updatedRecord: ReferralCodeRecord = {
        code: code.trim().toUpperCase(),
        partnerName: partnerName.trim(),
        partnerContact: partnerContact.trim(),
        notes: notes ? notes.trim() : existing?.notes || '',
        status: 'ACTIVE',
        createdAt: existing?.createdAt || now,
        updatedAt: now,
      };

      await updateReferralCode(updatedRecord);

      return res.status(200).json({
        success: true,
        message: `Referral code ${updatedRecord.code} assigned to ${updatedRecord.partnerName} and activated in Google Sheets.`,
        code: updatedRecord,
      });
    }

    // 3. ACTION: TOGGLE CODE STATUS (ACTIVE / INACTIVE)
    if (action === 'toggle_code_status') {
      const { code, status } = req.body;
      if (!code || !status || !['ACTIVE', 'INACTIVE'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Code and valid status (ACTIVE or INACTIVE) are required.',
        });
      }

      if (!durableConfigured) {
        return res.status(503).json({
          success: false,
          error: 'Durable storage is unconfigured. Cannot update status without Google Sheets credentials.',
        });
      }

      const allCodes = await fetchReferralCodes();
      const existing = allCodes.find(
        (c) => (c.code || '').trim().toUpperCase() === code.trim().toUpperCase()
      );

      if (!existing) {
        return res.status(404).json({ success: false, error: 'Referral code not found in Google Sheets.' });
      }

      const updatedRecord: ReferralCodeRecord = {
        ...existing,
        status: status as 'ACTIVE' | 'INACTIVE',
        updatedAt: new Date().toISOString(),
      };

      await updateReferralCode(updatedRecord);

      return res.status(200).json({
        success: true,
        message: `Status of ${existing.code} updated to ${status} in Google Sheets.`,
        code: updatedRecord,
      });
    }

    // 4. ACTION: VERIFY ORDER (PAYMENT & FULFILMENT)
    if (action === 'verify_order') {
      const { orderId, paymentStatus, fulfilmentStatus, orderStatus } = req.body;
      if (!orderId) {
        return res.status(400).json({ success: false, error: 'Order ID is required.' });
      }

      if (!durableConfigured) {
        return res.status(503).json({
          success: false,
          error: 'Durable storage is unconfigured. Cannot verify order without Google Sheets credentials.',
        });
      }

      const allOrders = await fetchOrders();
      const targetOrder = allOrders.find((o) => o.orderId.trim() === orderId.trim());

      if (!targetOrder) {
        return res.status(404).json({ success: false, error: `Order ${orderId} not found in Google Sheets.` });
      }

      const newPayStatus = paymentStatus || targetOrder.paymentStatus;
      const newFulfilStatus = fulfilmentStatus || targetOrder.fulfilmentStatus;
      const newOrderStatus = orderStatus || targetOrder.orderStatus;

      // Determine referral eligibility
      let eligibility = targetOrder.referralEligibility;
      if (newOrderStatus === 'Cancelled' || newPayStatus === 'Refunded' || newPayStatus === 'Failed') {
        eligibility = 'Disqualified';
      } else if (newPayStatus === 'Verified Paid' && newFulfilStatus === 'Fulfilled') {
        eligibility = 'Eligible';
      } else {
        eligibility = 'Pending Verification';
      }

      await updateOrderStatus(
        orderId,
        newPayStatus,
        newFulfilStatus,
        newOrderStatus,
        eligibility
      );

      // If order has a referral code and became eligible, run concurrency-safe reward engine
      let rewardSyncResult = null;
      if (targetOrder.referralCode && eligibility === 'Eligible') {
        rewardSyncResult = await syncRewardsForCode(targetOrder.referralCode);
      }

      return res.status(200).json({
        success: true,
        message: `Order ${orderId} updated in Google Sheets.`,
        rewardSyncResult,
      });
    }

    // 5. ACTION: MARK REWARD AS PAID VIA UPI
    if (action === 'mark_reward_paid') {
      const { rewardId, upiNotes } = req.body;
      if (!rewardId) {
        return res.status(400).json({ success: false, error: 'Reward ID is required.' });
      }

      if (!durableConfigured) {
        return res.status(503).json({
          success: false,
          error: 'Durable storage is unconfigured. Cannot record payout without Google Sheets credentials.',
        });
      }

      const paymentDate = new Date().toISOString();
      await updateRewardStatus(rewardId, 'Paid', paymentDate, upiNotes || 'Paid via UPI manual transfer');

      return res.status(200).json({
        success: true,
        message: `Reward ${rewardId} marked as Paid in Google Sheets.`,
      });
    }

    return res.status(400).json({ success: false, error: `Unknown action: ${action}` });
  } catch (err: any) {
    console.error('API /api/admin/referral error:', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred in referral admin service: ' + (err.message || ''),
    });
  }
}
