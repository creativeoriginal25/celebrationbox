/**
 * Live Google Sheets Referral Service for Celebration Box
 * Direct read integration with official Google Sheet:
 * https://docs.google.com/spreadsheets/d/11rFXjWhOISYTBDqIbllV_qhc8qyVZlFCrgUmAYfYrYk/edit?usp=sharing
 */

export const SPREADSHEET_ID = '11rFXjWhOISYTBDqIbllV_qhc8qyVZlFCrgUmAYfYrYk';
export const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?usp=sharing`;

export interface SheetReferralCode {
  code: string;
  partnerName: string;
  partnerContact: string;
  status: 'UNASSIGNED' | 'ACTIVE' | 'INACTIVE';
  assignedDate?: string;
  verifiedReferrals: number;
  eligibleUnpaidReferrals: number;
  rewardsEarned: number;
  rewardsPaid: number;
  lastUpdated?: string;
}

/**
 * Fetch all referral codes directly from the live Google Sheet
 */
export const fetchLiveReferralCodes = async (): Promise<SheetReferralCode[]> => {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent('Referral Codes')}`;
    const response = await fetch(url);
    if (!response.ok) return [];

    const text = await response.text();
    const match = text.match(/setResponse\((.*)\);/s);
    if (!match) return [];

    const data = JSON.parse(match[1]);
    if (!data.table || !Array.isArray(data.table.rows)) return [];

    return data.table.rows.map((r: any) => {
      const cells = r.c ? r.c.map((cell: any) => (cell ? cell.v : null)) : [];
      return {
        code: String(cells[0] || '').trim().toUpperCase(),
        partnerName: String(cells[1] || '').trim(),
        partnerContact: String(cells[2] || '').trim(),
        status: (String(cells[3] || 'UNASSIGNED').trim().toUpperCase()) as 'UNASSIGNED' | 'ACTIVE' | 'INACTIVE',
        assignedDate: cells[4] ? String(cells[4]) : undefined,
        verifiedReferrals: Number(cells[5] || 0),
        eligibleUnpaidReferrals: Number(cells[6] || 0),
        rewardsEarned: Number(cells[7] || 0),
        rewardsPaid: Number(cells[8] || 0),
        lastUpdated: cells[9] ? String(cells[9]) : undefined,
      };
    });
  } catch (error) {
    console.warn('Could not fetch live Google Sheet referral codes:', error);
    return [];
  }
};

/**
 * Validate a code against the live Google Sheet
 */
export const validateReferralCodeLive = async (
  rawCode: string
): Promise<{ valid: boolean; code: string; message: string; partnerName?: string }> => {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { valid: false, code: '', message: 'Please enter a referral code.' };
  }

  // Must match format CBX-XXXX
  if (!/^CBX-[A-Z0-9]{4}$/i.test(code)) {
    return {
      valid: false,
      code,
      message: 'Invalid code format. Codes must match CBX-XXXX format.',
    };
  }

  const liveCodes = await fetchLiveReferralCodes();
  const matched = liveCodes.find((c) => c.code === code);

  if (!matched) {
    // If sheet could not be reached, allow known preset format
    return {
      valid: true,
      code,
      message: 'Referral code applied!',
    };
  }

  if (matched.status === 'INACTIVE') {
    return {
      valid: false,
      code,
      message: 'This referral code is currently inactive.',
    };
  }

  return {
    valid: true,
    code,
    message: 'Referral code applied!',
    partnerName: matched.partnerName || undefined,
  };
};

/**
 * Look up partner stats from the live Google Sheet
 */
export const fetchPartnerStats = async (
  rawCode: string
): Promise<SheetReferralCode | null> => {
  const code = rawCode.trim().toUpperCase();
  if (!code) return null;

  const liveCodes = await fetchLiveReferralCodes();
  return liveCodes.find((c) => c.code === code) || null;
};
