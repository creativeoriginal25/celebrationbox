import { OrderDetails } from '../types';
import { BUSINESS_CONFIG, isWhatsAppConfigured } from '../config/business';
import { calculateSubtotal, formatPrice } from '../utils/currency';

export interface WhatsAppPayload {
  recipientNumber: string;
  formattedMessage: string;
  waMeUrl: string;
  isConfigured: boolean;
}

/**
 * Constructs the standard, clean customer order message formatted for WhatsApp
 */
export const generateWhatsAppOrderMessage = (order: OrderDetails): string => {
  const subtotal = calculateSubtotal(order.productPrice, order.quantity);
  const deliveryLabel =
    order.deliveryMethod === 'pickup'
      ? 'College Pickup (Bhimavaram)'
      : 'Nearby Delivery (Bhimavaram)';

  const lines: string[] = [
    'Hello Celebration Box! 🎉',
    '',
    'I would like to place an order.',
    '',
    'ORDER DETAILS',
    `Product: ${order.productName}`,
    `Price: ₹${order.productPrice}`,
    `Quantity: ${order.quantity}`,
    `Theme: ${order.theme}`,
    `Subtotal: ₹${subtotal}`,
    '',
    'CUSTOMER DETAILS',
    `Name: ${order.customerName}`,
    `Phone: ${order.customerPhone}`,
    `Celebration Date: ${order.celebrationDate}`,
    `Preferred Time: ${order.preferredTime}`,
    '',
    'DELIVERY DETAILS',
    `Method: ${deliveryLabel}`,
  ];

  if (order.deliveryMethod === 'delivery' && order.deliveryAddress) {
    lines.push(`Address: ${order.deliveryAddress}`);
  }

  if (order.birthdayMessage && order.birthdayMessage.trim()) {
    lines.push('', 'SPECIAL NOTE / BIRTHDAY MESSAGE:');
    lines.push(`"${order.birthdayMessage.trim()}"`);
  }

  lines.push('');
  if (order.deliveryMethod === 'delivery') {
    lines.push('Please confirm product availability and delivery charges.');
  } else {
    lines.push('Please confirm product availability and college pickup instructions.');
  }
  lines.push('');
  lines.push('Thank you!');

  return lines.join('\n');
};

/**
 * Builds the official wa.me click-to-chat link with URL-encoded message
 */
export const buildWhatsAppLink = (number: string, message: string): string => {
  const cleanNumber = number.replace(/\D/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
};

/**
 * Main service method to prepare the WhatsApp order dispatch
 */
export const prepareWhatsAppOrder = (
  order: OrderDetails,
  customNumberOverride?: string
): WhatsAppPayload => {
  const targetNumber = customNumberOverride || BUSINESS_CONFIG.whatsappNumber;
  const isConfigured = isWhatsAppConfigured(targetNumber);
  const formattedMessage = generateWhatsAppOrderMessage(order);
  const waMeUrl = buildWhatsAppLink(targetNumber, formattedMessage);

  return {
    recipientNumber: targetNumber,
    formattedMessage,
    waMeUrl,
    isConfigured,
  };
};

/**
 * Dispatches the order by opening WhatsApp in a new tab/app,
 * or returns false if cannot open or not configured
 */
export const triggerWhatsAppChat = (url: string): boolean => {
  try {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    return !!newWindow;
  } catch (error) {
    console.error('Failed to trigger WhatsApp link:', error);
    return false;
  }
};

