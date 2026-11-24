import {
  ReferralOrderRecord,
  ReferralRewardRecord,
  fetchOrders,
  fetchRewards,
  appendRewardRecord,
  updateOrderStatus,
} from './googleSheets';

export interface RewardCalculationResult {
  code: string;
  partnerName: string;
  totalVerifiedOrders: number;
  distinctCustomersCount: number;
  newRewardsGenerated: number;
  totalRewardsEarned: number;
  pendingPayoutAmount: number;
}

// In-process Mutex Queue to prevent concurrent race conditions on reward evaluation
class AsyncLock {
  private queue: Promise<void> = Promise.resolve();

  async acquire<T>(fn: () => Promise<T>): Promise<T> {
    let release: () => void;
    const ticket = new Promise<void>((resolve) => {
      release = resolve;
    });

    const previous = this.queue;
    this.queue = this.queue.then(() => ticket);

    await previous;
    try {
      return await fn();
    } finally {
      release!();
    }
  }
}

const rewardLock = new AsyncLock();

/**
 * Clean and standardize Indian mobile number to 10 digits
 */
export const normalizePhone = (phone?: string): string => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    return digits.slice(2);
  }
  return digits.slice(-10);
};

/**
 * Calculates and synchronizes rewards based on the 2-distinct-customer = ₹80 rule.
 * Idempotent & Concurrency-Safe:
 * - Deterministic composite key per order pair (CBX-REW-{orderId1}-{orderId2}).
 * - Serialized via async mutex.
 * - Double checks against the latest persistent rewards from durable storage.
 */
export const syncRewardsForCode = async (
  targetCode: string
): Promise<RewardCalculationResult> => {
  return rewardLock.acquire(async () => {
    const normalizedCode = targetCode.trim().toUpperCase();

    // Read latest orders and rewards
    const allOrders = await fetchOrders();
    const allRewards = await fetchRewards();

    // 1. Gather all order IDs and composite reward IDs that have already been allocated
    const allocatedOrderIds = new Set<string>();
    const existingRewardIds = new Set<string>();

    allRewards.forEach((r) => {
      if (r.rewardId) existingRewardIds.add(r.rewardId.trim());
      if (r.eligibleOrderIds) {
        r.eligibleOrderIds
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean)
          .forEach((id) => allocatedOrderIds.add(id));
      }
    });

    // 2. Filter orders for this specific referral code
    const codeOrders = allOrders.filter(
      (o) => (o.referralCode || '').trim().toUpperCase() === normalizedCode
    );

    const partnerName = codeOrders[0]?.referralPartner || 'Referral Partner';

    // 3. Filter orders that qualify for referral reward:
    // - paymentStatus === 'Verified Paid'
    // - fulfilmentStatus === 'Fulfilled'
    // - orderStatus !== 'Cancelled'
    // - not already allocated to an existing reward
    const verifiedOrders = codeOrders.filter(
      (o) =>
        o.paymentStatus === 'Verified Paid' &&
        o.fulfilmentStatus === 'Fulfilled' &&
        o.orderStatus !== 'Cancelled'
    );

    // Group by distinct customer phone number (New distinct customers only)
    // Pick the earliest unallocated order per unique customer phone
    const customerEarliestOrder = new Map<string, ReferralOrderRecord>();

    verifiedOrders.forEach((order) => {
      if (allocatedOrderIds.has(order.orderId)) {
        return;
      }

      const cleanPhone = normalizePhone(order.customerPhone);
      if (!cleanPhone || cleanPhone.length !== 10) return;

      if (!customerEarliestOrder.has(cleanPhone)) {
        customerEarliestOrder.set(cleanPhone, order);
      }
    });

    const availableEligibleOrders = Array.from(customerEarliestOrder.values()).sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // 4. Batch in pairs of 2 distinct orders
    let newRewardsCount = 0;
    for (let i = 0; i + 1 < availableEligibleOrders.length; i += 2) {
      const order1 = availableEligibleOrders[i];
      const order2 = availableEligibleOrders[i + 1];

      // Double check allocation
      if (allocatedOrderIds.has(order1.orderId) || allocatedOrderIds.has(order2.orderId)) {
        continue;
      }

      // Deterministic Reward ID based on sorted order IDs
      const sortedPair = [order1.orderId, order2.orderId].sort();
      const rewardId = `CBX-REW-${sortedPair[0]}_${sortedPair[1]}`;

      // Prevent duplicate insertion if this exact pair was already rewarded
      if (existingRewardIds.has(rewardId)) {
        allocatedOrderIds.add(order1.orderId);
        allocatedOrderIds.add(order2.orderId);
        continue;
      }

      const newReward: ReferralRewardRecord = {
        rewardId,
        referralPartner: order1.referralPartner || partnerName,
        referralCode: normalizedCode,
        eligibleOrderIds: `${sortedPair[0]}, ${sortedPair[1]}`,
        rewardAmount: 80,
        rewardStatus: 'Pending Payout',
        createdAt: new Date().toISOString(),
        upiNotes: `Automated reward for verified orders: ${sortedPair[0]}, ${sortedPair[1]}`,
      };

      // Save to Google Sheets
      await appendRewardRecord(newReward);
      allocatedOrderIds.add(order1.orderId);
      allocatedOrderIds.add(order2.orderId);
      existingRewardIds.add(rewardId);

      // Update order eligibility in orders tab to 'Rewarded'
      try {
        await updateOrderStatus(
          order1.orderId,
          order1.paymentStatus,
          order1.fulfilmentStatus,
          order1.orderStatus,
          'Rewarded'
        );
        await updateOrderStatus(
          order2.orderId,
          order2.paymentStatus,
          order2.fulfilmentStatus,
          order2.orderStatus,
          'Rewarded'
        );
      } catch (err) {
        console.warn('Could not update order status tag to Rewarded:', err);
      }

      newRewardsCount++;
    }

    // 5. Compute totals
    const latestRewards = (await fetchRewards()).filter(
      (r) => (r.referralCode || '').trim().toUpperCase() === normalizedCode
    );

    const totalRewardsEarned = latestRewards.reduce((sum, r) => sum + (r.rewardAmount || 80), 0);
    const pendingPayoutAmount = latestRewards
      .filter((r) => r.rewardStatus === 'Pending Payout')
      .reduce((sum, r) => sum + (r.rewardAmount || 80), 0);

    return {
      code: normalizedCode,
      partnerName,
      totalVerifiedOrders: verifiedOrders.length,
      distinctCustomersCount: customerEarliestOrder.size,
      newRewardsGenerated: newRewardsCount,
      totalRewardsEarned,
      pendingPayoutAmount,
    };
  });
};
