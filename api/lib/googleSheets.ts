import { google } from 'googleapis';

export interface ReferralCodeRecord {
  code: string;
  partnerName: string;
  partnerContact: string;
  notes?: string;
  status: 'UNASSIGNED' | 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface ReferralOrderRecord {
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
  orderStatus: string; // 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
  paymentStatus: string; // 'Pending' | 'Verified Paid' | 'Failed' | 'Refunded'
  fulfilmentStatus: string; // 'Pending' | 'Fulfilled' | 'Cancelled'
  referralEligibility: string; // 'Eligible' | 'Pending Verification' | 'Disqualified' | 'Rewarded'
  notes?: string;
}

export interface ReferralRewardRecord {
  rewardId: string;
  referralPartner: string;
  referralCode: string;
  eligibleOrderIds: string; // comma-separated order IDs
  rewardAmount: number; // ₹80 per 2 verified distinct orders
  rewardStatus: 'Pending Payout' | 'Paid';
  createdAt: string;
  paymentDate?: string;
  upiNotes?: string;
}

// Fixed Spreadsheet ID provided in specification
export const DEFAULT_SPREADSHEET_ID = '11rFXjWhOISYTBDqIbllV_qhc8qyVZlFCrgUmAYfYrYk';

// The exact 10 initial codes specified in Part 2
export const INITIAL_PRESET_CODES: string[] = [
  'CBX-K7M2',
  'CBX-R9P4',
  'CBX-T3V8',
  'CBX-N6W2',
  'CBX-F8K5',
  'CBX-H4R7',
  'CBX-P2Y9',
  'CBX-M5T3',
  'CBX-V7D6',
  'CBX-S9L4',
];

// Anti-Formula Injection: Prevent Excel / Google Sheets formula execution
export const sanitizeForSheet = (input: unknown): string => {
  if (input === null || input === undefined) return '';
  const str = String(input).trim();
  // If string starts with =, +, -, @, \t, or \r prefix with single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
};

/**
 * Check whether server-side Google Sheets credentials are configured
 */
export const isGoogleSheetsConfigured = (): boolean => {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );
};

/**
 * Obtain authenticated Google Sheets client or null if not configured
 */
export const getGoogleSheetsClient = () => {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    return null;
  }

  // Handle newlines in private key string provided via env variable
  privateKey = privateKey.replace(/\\n/g, '\n');

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (err) {
    console.error('Failed to initialize Google Sheets client:', err);
    return null;
  }
};

export const getSpreadsheetId = () => {
  return process.env.GOOGLE_SHEET_ID || DEFAULT_SPREADSHEET_ID;
};

/**
 * Fetch all referral codes from Google Sheets
 */
export const fetchReferralCodes = async (): Promise<ReferralCodeRecord[]> => {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  if (sheets && spreadsheetId) {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "'Referral Codes'!A2:G",
    });

    const rows = response.data.values || [];
    if (rows.length > 0) {
      return rows.map((row) => ({
        code: (row[0] || '').trim().toUpperCase(),
        partnerName: row[1] || '',
        partnerContact: row[2] || '',
        notes: row[3] || '',
        status: (row[4] || 'UNASSIGNED').trim().toUpperCase() as 'UNASSIGNED' | 'ACTIVE' | 'INACTIVE',
        createdAt: row[5] || '',
        updatedAt: row[6] || '',
      }));
    }
  }

  // If Google Sheets credentials are not configured, return the initial preset codes with UNASSIGNED status
  const now = new Date().toISOString();
  return INITIAL_PRESET_CODES.map((code) => ({
    code,
    partnerName: '',
    partnerContact: '',
    status: 'UNASSIGNED',
    createdAt: now,
    updatedAt: now,
  }));
};

/**
 * Fetch all orders from Google Sheets (durable storage only)
 */
export const fetchOrders = async (): Promise<ReferralOrderRecord[]> => {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  if (!sheets || !spreadsheetId) {
    return [];
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "'Orders'!A2:O",
  });

  const rows = response.data.values || [];
  return rows.map((row) => ({
    orderId: row[0] || '',
    timestamp: row[1] || '',
    customerName: row[2] || '',
    customerPhone: row[3] || '',
    product: row[4] || '',
    quantity: parseInt(row[5] || '1', 10),
    orderTotal: parseFloat(row[6] || '0'),
    fulfilmentMethod: row[7] || '',
    referralCode: (row[8] || '').trim().toUpperCase(),
    referralPartner: row[9] || '',
    orderStatus: row[10] || 'Pending',
    paymentStatus: row[11] || 'Pending',
    fulfilmentStatus: row[12] || 'Pending',
    referralEligibility: row[13] || 'Pending Verification',
    notes: row[14] || '',
  }));
};

/**
 * Fetch all rewards from Google Sheets (durable storage only)
 */
export const fetchRewards = async (): Promise<ReferralRewardRecord[]> => {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  if (!sheets || !spreadsheetId) {
    return [];
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "'Rewards'!A2:I",
  });

  const rows = response.data.values || [];
  return rows.map((row) => ({
    rewardId: row[0] || '',
    referralPartner: row[1] || '',
    referralCode: (row[2] || '').trim().toUpperCase(),
    eligibleOrderIds: row[3] || '',
    rewardAmount: parseFloat(row[4] || '80'),
    rewardStatus: (row[5] || 'Pending Payout') as 'Pending Payout' | 'Paid',
    createdAt: row[6] || '',
    paymentDate: row[7] || '',
    upiNotes: row[8] || '',
  }));
};

/**
 * Append order record to Google Sheets Orders tab (DURABLE STORAGE ONLY)
 * Throws error if durable storage is unconfigured or append fails.
 */
export const appendOrderRecord = async (order: ReferralOrderRecord): Promise<void> => {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  if (!sheets || !spreadsheetId) {
    throw new Error('Durable storage is not configured: Google Sheets API credentials missing.');
  }

  const row = [
    sanitizeForSheet(order.orderId),
    sanitizeForSheet(order.timestamp),
    sanitizeForSheet(order.customerName),
    sanitizeForSheet(order.customerPhone),
    sanitizeForSheet(order.product),
    order.quantity,
    order.orderTotal,
    sanitizeForSheet(order.fulfilmentMethod),
    sanitizeForSheet(order.referralCode),
    sanitizeForSheet(order.referralPartner),
    sanitizeForSheet(order.orderStatus),
    sanitizeForSheet(order.paymentStatus),
    sanitizeForSheet(order.fulfilmentStatus),
    sanitizeForSheet(order.referralEligibility),
    sanitizeForSheet(order.notes || ''),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "'Orders'!A2:O",
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row],
    },
  });
};

/**
 * Update referral code assignment & status in Google Sheets (DURABLE STORAGE ONLY)
 */
export const updateReferralCode = async (codeRecord: ReferralCodeRecord): Promise<void> => {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  if (!sheets || !spreadsheetId) {
    throw new Error('Durable storage is not configured: Google Sheets API credentials missing.');
  }

  const normalizedCode = codeRecord.code.trim().toUpperCase();

  // Find row index
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "'Referral Codes'!A2:A",
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex(
    (r) => (r[0] || '').trim().toUpperCase() === normalizedCode
  );

  const rowValues = [
    sanitizeForSheet(normalizedCode),
    sanitizeForSheet(codeRecord.partnerName),
    sanitizeForSheet(codeRecord.partnerContact),
    sanitizeForSheet(codeRecord.notes || ''),
    sanitizeForSheet(codeRecord.status),
    sanitizeForSheet(codeRecord.createdAt),
    sanitizeForSheet(codeRecord.updatedAt),
  ];

  if (rowIndex !== -1) {
    const sheetRow = rowIndex + 2;
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'Referral Codes'!A${sheetRow}:G${sheetRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowValues],
      },
    });
  } else {
    // Append new row if not already found
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "'Referral Codes'!A2:G",
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowValues],
      },
    });
  }
};

/**
 * Update order status (payment & fulfilment) in Google Sheets (DURABLE STORAGE ONLY)
 */
export const updateOrderStatus = async (
  orderId: string,
  paymentStatus: string,
  fulfilmentStatus: string,
  orderStatus: string,
  eligibility: string
): Promise<void> => {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  if (!sheets || !spreadsheetId) {
    throw new Error('Durable storage is not configured: Google Sheets API credentials missing.');
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "'Orders'!A2:A",
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((r) => (r[0] || '').trim() === orderId.trim());

  if (rowIndex === -1) {
    throw new Error(`Order ${orderId} not found in Google Sheets.`);
  }

  const sheetRow = rowIndex + 2;
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'Orders'!K${sheetRow}:N${sheetRow}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[orderStatus, paymentStatus, fulfilmentStatus, eligibility]],
    },
  });
};

/**
 * Record a new reward row in Google Sheets (DURABLE STORAGE ONLY)
 */
export const appendRewardRecord = async (reward: ReferralRewardRecord): Promise<void> => {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  if (!sheets || !spreadsheetId) {
    throw new Error('Durable storage is not configured: Google Sheets API credentials missing.');
  }

  const row = [
    sanitizeForSheet(reward.rewardId),
    sanitizeForSheet(reward.referralPartner),
    sanitizeForSheet(reward.referralCode),
    sanitizeForSheet(reward.eligibleOrderIds),
    reward.rewardAmount,
    sanitizeForSheet(reward.rewardStatus),
    sanitizeForSheet(reward.createdAt),
    sanitizeForSheet(reward.paymentDate || ''),
    sanitizeForSheet(reward.upiNotes || ''),
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "'Rewards'!A2:I",
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [row],
    },
  });
};

/**
 * Update existing reward payment status in Google Sheets (DURABLE STORAGE ONLY)
 */
export const updateRewardStatus = async (
  rewardId: string,
  status: 'Pending Payout' | 'Paid',
  paymentDate: string,
  upiNotes: string
): Promise<void> => {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  if (!sheets || !spreadsheetId) {
    throw new Error('Durable storage is not configured: Google Sheets API credentials missing.');
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "'Rewards'!A2:A",
  });

  const rows = response.data.values || [];
  const rowIndex = rows.findIndex((r) => (r[0] || '').trim() === rewardId.trim());

  if (rowIndex === -1) {
    throw new Error(`Reward ${rewardId} not found in Google Sheets.`);
  }

  const sheetRow = rowIndex + 2;
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'Rewards'!F${sheetRow}:I${sheetRow}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[status, new Date().toISOString(), paymentDate, upiNotes]],
    },
  });
};
