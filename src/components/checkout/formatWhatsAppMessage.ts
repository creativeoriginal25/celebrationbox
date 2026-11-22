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
 * Hi! I'd like to place an order 🎀
 * *Product:* {name}
 * *Qty:* {qty} × ₹{price} = ₹{total}
 * *Name:* {name}
 * *Mobile:* {number}
 * *Fulfilment:* {Campus Pickup | Delivery – address}
 * *Message:* {message or "—"}
 */
export const formatOrderWhatsAppMessage = (params: FormatOrderParams): string => {
  const fulfilmentString =
    params.fulfilment === 'pickup'
      ? 'Campus Pickup'
      : `Delivery – ${params.deliveryAddress?.trim() || 'Address to be confirmed'}`;

  const messageText =
    params.personalMessage && params.personalMessage.trim().length > 0
      ? params.personalMessage.trim()
      : '—';

  // Format clean 10-digit Indian mobile number
  const cleanPhone = params.customerPhone.replace(/\D/g, '').slice(-10);
  const formattedMobile = cleanPhone ? `+91 ${cleanPhone}` : params.customerPhone;

  // Single-product order (Default / Buy Now flow)
  if (!params.cartItems || params.cartItems.length <= 1) {
    const lines = [
      "Hi! I'd like to place an order 🎀",
      `*Product:* ${params.productName}`,
      `*Qty:* ${params.quantity} × ₹${params.unitPrice} = ₹${params.total}`,
      `*Name:* ${params.customerName.trim()}`,
      `*Mobile:* ${formattedMobile}`,
      `*Fulfilment:* ${fulfilmentString}`,
      `*Message:* ${messageText}`,
    ];

    if (params.celebrationDate) {
      lines.push(`*Date:* ${params.celebrationDate}${params.preferredTime ? ` (${params.preferredTime})` : ''}`);
    }

    return lines.join('\n');
  }

  // Multi-item cart order fallback
  const itemLines = params.cartItems
    .map((item) => `• ${item.name} (Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity})`)
    .join('\n');

  const cartLines = [
    "Hi! I'd like to place an order 🎀",
    `*Products:*\n${itemLines}`,
    `*Total:* ₹${params.total}`,
    `*Name:* ${params.customerName.trim()}`,
    `*Mobile:* ${formattedMobile}`,
    `*Fulfilment:* ${fulfilmentString}`,
    `*Message:* ${messageText}`,
  ];

  if (params.celebrationDate) {
    cartLines.push(`*Date:* ${params.celebrationDate}${params.preferredTime ? ` (${params.preferredTime})` : ''}`);
  }

  return cartLines.join('\n');
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
