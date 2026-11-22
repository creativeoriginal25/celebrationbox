import { CHECKOUT_CONFIG } from './checkoutConfig';

export interface FormatOrderParams {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  customerName: string;
  customerPhone: string;
  fulfilment: 'pickup' | 'delivery';
  deliveryAddress?: string;
  personalMessage?: string;
  celebrationDate?: string;
  preferredTime?: string;
  // Optional multi-item cart items support
  cartItems?: Array<{ name: string; quantity: number; price: number }>;
}

/**
 * Pure function to format checkout order details into the official WhatsApp message.
 * Matches exact specified format:
 *
 * 🎉 *CELEBRATION BOX* 🎉
 * ✨ Making Moments Magical ✨
 *
 * Hi! 👋 I'd like to place an order for the following:
 *
 * 🎁 *ORDER DETAILS*
 *
 * Product: {productName}
 * Quantity: {quantity}
 * Price per Box: ₹{unitPrice}
 *
 * 💰 *Total Amount: ₹{totalAmount}*
 *
 * 👤 *CUSTOMER DETAILS*
 *
 * Name: {customerName}
 * Mobile: {customerPhone}
 *
 * 📍 *FULFILMENT*
 * {fulfilmentMethod}
 *
 * Please confirm the availability and pickup details. Thank you! 💖
 */
export const formatOrderWhatsAppMessage = (params: FormatOrderParams): string => {
  const sanitize = (text?: string): string => {
    if (!text) return '';
    return text.replace(/\uFFFD/g, '').trim();
  };

  const cleanCustomerName = sanitize(params.customerName);

  // Format clean 10-digit Indian mobile number: +91 XXXXXXXXXX
  const rawDigits = (params.customerPhone || '').replace(/\D/g, '');
  let formattedMobile = sanitize(params.customerPhone);
  if (rawDigits.length === 10) {
    formattedMobile = `+91 ${rawDigits}`;
  } else if (rawDigits.length === 12 && rawDigits.startsWith('91')) {
    formattedMobile = `+91 ${rawDigits.slice(2)}`;
  }

  // Format rupee amounts cleanly
  const formatRupee = (val: number): string => `₹${val.toLocaleString('en-IN')}`;

  const lines: string[] = [
    '🎉 *CELEBRATION BOX* 🎉',
    '✨ Making Moments Magical ✨',
    '',
    "Hi! 👋 I'd like to place an order for the following:",
    '',
    '🎁 *ORDER DETAILS*',
    '',
  ];

  // 1. ORDER DETAILS (Single item vs Multiple items)
  const isMultiItem = Array.isArray(params.cartItems) && params.cartItems.length > 1;

  if (isMultiItem && params.cartItems) {
    params.cartItems.forEach((item, idx) => {
      lines.push(`Product: ${sanitize(item.name)}`);
      lines.push(`Quantity: ${item.quantity}`);
      lines.push(`Price per Box: ${formatRupee(item.price)}`);
      lines.push(`Line Total: ${formatRupee(item.price * item.quantity)}`);
      if (idx < params.cartItems!.length - 1) {
        lines.push('');
      }
    });
  } else {
    // Single product (Buy Now or single-item cart)
    const singleName =
      params.cartItems && params.cartItems.length === 1
        ? sanitize(params.cartItems[0].name)
        : sanitize(params.productName);
    const singleQty =
      params.cartItems && params.cartItems.length === 1
        ? params.cartItems[0].quantity
        : params.quantity;
    const singlePrice =
      params.cartItems && params.cartItems.length === 1
        ? params.cartItems[0].price
        : params.unitPrice;

    lines.push(`Product: ${singleName}`);
    lines.push(`Quantity: ${singleQty}`);
    lines.push(`Price per Box: ${formatRupee(singlePrice)}`);
  }

  lines.push('');
  lines.push(`💰 *Total Amount: ${formatRupee(params.total)}*`);
  lines.push('');

  // 2. CUSTOMER DETAILS
  lines.push('👤 *CUSTOMER DETAILS*');
  lines.push('');
  lines.push(`Name: ${cleanCustomerName}`);
  lines.push(`Mobile: ${formattedMobile}`);

  const cleanDate = sanitize(params.celebrationDate);
  const cleanTime = sanitize(params.preferredTime);
  if (cleanDate && cleanDate !== '—' && cleanDate !== 'null' && cleanDate !== 'undefined') {
    lines.push(
      `Celebration Date: ${cleanDate}${
        cleanTime && cleanTime !== '—' && cleanTime !== 'null' && cleanTime !== 'undefined'
          ? ` (${cleanTime})`
          : ''
      }`
    );
  }

  lines.push('');

  // 3. FULFILMENT
  lines.push('📍 *FULFILMENT*');
  const cleanAddress = sanitize(params.deliveryAddress);
  if (params.fulfilment === 'delivery') {
    lines.push('Nearby Delivery (Bhimavaram)');
    if (cleanAddress && cleanAddress !== '—' && cleanAddress !== 'null' && cleanAddress !== 'undefined') {
      lines.push(`Address: ${cleanAddress}`);
    }
  } else {
    lines.push('Campus Pickup (Bhimavaram)');
  }

  // 4. SPECIAL INSTRUCTIONS / CUSTOMER MESSAGE (Only when provided)
  const cleanMessage = sanitize(params.personalMessage);
  if (cleanMessage && cleanMessage !== '—' && cleanMessage !== 'null' && cleanMessage !== 'undefined') {
    lines.push('');
    lines.push('💬 *SPECIAL INSTRUCTIONS*');
    lines.push(cleanMessage);
  }

  // 5. CLOSING NOTE
  lines.push('');
  if (params.fulfilment === 'delivery') {
    lines.push('Please confirm the availability and delivery details. Thank you! 💖');
  } else {
    lines.push('Please confirm the availability and pickup details. Thank you! 💖');
  }

  return lines.join('\n');
};

/**
 * Builds the official wa.me direct URL with encoded message
 */
export const buildWhatsAppUrl = (
  message: string,
  targetNumber: string = CHECKOUT_CONFIG.whatsappNumber
): string => {
  let cleanNumber = targetNumber.replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    cleanNumber = `91${cleanNumber}`;
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};
