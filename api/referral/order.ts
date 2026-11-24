import {
  appendOrderRecord,
  fetchReferralCodes,
  ReferralOrderRecord,
  isGoogleSheetsConfigured,
} from '../lib/googleSheets';
import { normalizePhone } from '../lib/rewardEngine';
import { PRODUCTS } from '../../src/config/products';

// In-memory rate limiting / deduplication store (recent submissions in last 15 seconds)
const recentSubmissions = new Map<string, number>();

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const {
      customerName,
      customerPhone,
      productId,
      quantity,
      deliveryMethod,
      deliveryAddress,
      personalMessage,
      referralCode: rawReferralCode,
      cartItems,
    } = body;

    // 1. Validation of customer details
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Please enter your full name.' });
    }

    const cleanPhone = normalizePhone(customerPhone);
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit Indian mobile number.',
      });
    }

    // Rate limiting & spam prevention (prevent duplicate submissions within 15 seconds)
    const dedupKey = `${cleanPhone}-${productId || 'cart'}`;
    const nowMs = Date.now();
    const lastSub = recentSubmissions.get(dedupKey);
    if (lastSub && nowMs - lastSub < 15000) {
      return res.status(429).json({
        success: false,
        error: 'Please wait a moment before resubmitting your order.',
      });
    }
    recentSubmissions.set(dedupKey, nowMs);

    // 2. Server-side authoritative price calculation derived directly from actual product catalogue
    let productName = 'Pastel Rose Celebration Box';
    let orderQuantity = Math.max(1, parseInt(quantity, 10) || 1);
    let orderTotal = 0;

    if (Array.isArray(cartItems) && cartItems.length > 0) {
      // Multi-product cart - cross-reference each item with central PRODUCTS catalogue
      productName = cartItems.map((item: any) => `${item.name} (x${item.quantity})`).join(', ');
      orderTotal = cartItems.reduce((sum: number, item: any) => {
        const itemCatalog = PRODUCTS.find((p) => p.id === item.id || p.slug === item.id);
        const itemPrice = itemCatalog ? itemCatalog.price : Number(item.price);
        const itemQty = Math.max(1, parseInt(item.quantity, 10) || 1);
        return sum + itemPrice * itemQty;
      }, 0);
      orderQuantity = cartItems.reduce((sum: number, item: any) => sum + (parseInt(item.quantity, 10) || 1), 0);
    } else {
      // Single product Buy Now - cross-reference with central PRODUCTS catalogue
      const catalogProduct = PRODUCTS.find((p) => p.id === productId || p.slug === productId) || PRODUCTS[0];
      productName = catalogProduct.name;
      orderTotal = catalogProduct.price * orderQuantity;
    }

    // 3. Referral code validation (if supplied)
    let validatedCode = '';
    let referralPartner = '';
    let referralEligibility = 'Not Referred';

    if (rawReferralCode && typeof rawReferralCode === 'string' && rawReferralCode.trim()) {
      const code = rawReferralCode.trim().toUpperCase();
      const allCodes = await fetchReferralCodes();
      const matched = allCodes.find((c) => (c.code || '').trim().toUpperCase() === code);

      if (!matched) {
        return res.status(400).json({
          success: false,
          error: `Referral code "${code}" does not exist. Please remove it or enter a valid code.`,
        });
      }

      if (matched.status !== 'ACTIVE') {
        return res.status(400).json({
          success: false,
          error: `Referral code "${code}" is ${matched.status.toLowerCase()}. Only active partner codes are eligible.`,
        });
      }

      // Self-Referral Prevention: Ensure customer phone does NOT match partner contact phone
      const partnerPhone = normalizePhone(matched.partnerContact);
      if (partnerPhone && partnerPhone === cleanPhone) {
        return res.status(400).json({
          success: false,
          error: 'Self-referrals are not permitted. Please place your order without your own referral code.',
        });
      }

      validatedCode = code;
      referralPartner = matched.partnerName || 'Celebration Partner';
      referralEligibility = 'Pending Verification';
    }

    // 4. Generate unique Order ID on the server
    const timestamp = new Date().toISOString();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderId = `CBX-ORD-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    // 5. Build order record
    const orderRecord: ReferralOrderRecord = {
      orderId,
      timestamp,
      customerName: customerName.trim(),
      customerPhone: `+91 ${cleanPhone}`,
      product: productName,
      quantity: orderQuantity,
      orderTotal,
      fulfilmentMethod: deliveryMethod === 'delivery' ? 'Nearby Delivery (Bhimavaram)' : 'Campus Pickup (Bhimavaram)',
      referralCode: validatedCode,
      referralPartner,
      orderStatus: 'Pending',
      paymentStatus: 'Pending',
      fulfilmentStatus: 'Pending',
      referralEligibility,
      notes: personalMessage ? `Customer note: ${personalMessage}` : undefined,
    };

    // 6. Record order in Google Sheets (DURABLE STORAGE VERIFICATION)
    if (!isGoogleSheetsConfigured()) {
      return res.status(503).json({
        success: false,
        savedToDurableStorage: false,
        orderId,
        referralCode: validatedCode || undefined,
        orderTotal,
        productName,
        error: 'Durable storage is not configured. Google Sheets server credentials are required before orders can be recorded.',
      });
    }

    try {
      await appendOrderRecord(orderRecord);

      return res.status(200).json({
        success: true,
        savedToDurableStorage: true,
        orderId,
        referralCode: validatedCode || undefined,
        orderTotal,
        productName,
        message: 'Order verified and recorded in Google Sheets.',
      });
    } catch (storageErr: any) {
      console.error('Google Sheets append failed:', storageErr);
      return res.status(500).json({
        success: false,
        savedToDurableStorage: false,
        orderId,
        referralCode: validatedCode || undefined,
        orderTotal,
        productName,
        error: 'Failed to record order to durable storage: ' + (storageErr?.message || 'Write error'),
      });
    }
  } catch (err: any) {
    console.error('API /api/referral/order error:', err);
    return res.status(500).json({
      success: false,
      savedToDurableStorage: false,
      error: 'An internal error occurred while processing the order.',
    });
  }
}
