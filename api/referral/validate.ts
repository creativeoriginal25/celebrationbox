import { fetchReferralCodes } from '../lib/googleSheets';

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    let rawCode = '';
    if (req.method === 'GET') {
      rawCode = (req.query?.code as string) || '';
    } else if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      rawCode = body?.code || '';
    }

    const code = (rawCode || '').trim().toUpperCase();

    if (!code) {
      return res.status(400).json({
        valid: false,
        error: 'Referral code is required for validation.',
      });
    }

    // Format validation (format: CBX-XXXX)
    if (!/^CBX-[A-Z0-9]{4}$/i.test(code)) {
      return res.status(200).json({
        valid: false,
        code,
        error: 'Invalid code format. Codes must match CBX-XXXX format.',
      });
    }

    const allCodes = await fetchReferralCodes();
    const matchedRecord = allCodes.find(
      (c) => (c.code || '').trim().toUpperCase() === code
    );

    if (!matchedRecord) {
      return res.status(200).json({
        valid: false,
        code,
        error: 'Referral code does not exist.',
      });
    }

    if (matchedRecord.status === 'INACTIVE') {
      return res.status(200).json({
        valid: false,
        code,
        error: 'This referral code is currently inactive.',
      });
    }

    if (matchedRecord.status === 'ACTIVE' || matchedRecord.status === 'UNASSIGNED') {
      // Valid referral code from Google Sheet
      return res.status(200).json({
        valid: true,
        code,
        message: 'Referral code applied!',
      });
    }

    return res.status(200).json({
      valid: false,
      code,
      error: 'Referral code is not eligible for use.',
    });
  } catch (err: any) {
    console.error('API /api/referral/validate error:', err);
    return res.status(500).json({
      valid: false,
      error: 'An internal error occurred while validating referral code.',
    });
  }
}
