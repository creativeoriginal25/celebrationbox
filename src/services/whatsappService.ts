import { OrderDetails, CartOrderDetails } from '../types';
import { BUSINESS_CONFIG, isWhatsAppConfigured } from '../config/business';
import { calculateSubtotal, formatPrice } from '../utils/currency';

export interface WhatsAppPayload {
  recipientNumber: string;
  formattedMessage: string;
  waMeUrl: string;
  isConfigured: boolean;
}

/**
 * Builds standard single-product Buy Now WhatsApp order message
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
 * Builds multi-product shopping cart WhatsApp order message
 */
export const generateCartWhatsAppOrderMessage = (cartOrder: CartOrderDetails): string => {
  const totalValue = cartOrder.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryLabel =
    cartOrder.deliveryMethod === 'pickup'
      ? 'College Pickup (Bhimavaram)'
      : 'Nearby Delivery (Bhimavaram)';

  const lines: string[] = [
    'Hello Celebration Box! 🎉',
    '',
    'I would like to place an order.',
    '',
    'ORDER SUMMARY:',
    '',
  ];

  cartOrder.items.forEach((item) => {
    lines.push(
      item.name,
      `Quantity: ${item.quantity}`,
      `Price: ₹${item.price} each`,
      `Subtotal: ₹${item.price * item.quantity}`,
      ''
    );
  });

  lines.push(
    `TOTAL PRODUCT VALUE: ₹${totalValue}`,
    '',
    'CUSTOMER DETAILS:',
    '',
    `Name: ${cartOrder.customerName}`,
    `Phone: ${cartOrder.customerPhone}`,
    `Celebration Date: ${cartOrder.celebrationDate}`,
    `Preferred Time: ${cartOrder.preferredTime}`,
    '',
    'FULFILMENT:',
    '',
    deliveryLabel
  );

  if (cartOrder.deliveryMethod === 'delivery' && cartOrder.deliveryAddress) {
    lines.push(`Delivery Address: ${cartOrder.deliveryAddress}`);
  }

  if (cartOrder.birthdayMessage && cartOrder.birthdayMessage.trim()) {
    lines.push('', `Special Note: "${cartOrder.birthdayMessage.trim()}"`);
  }

  lines.push('', 'Please confirm availability and delivery charges.', '', 'Thank you!');

  return lines.join('\n');
};

/**
 * Builds the official wa.me click-to-chat link with URL-encoded message
 */
export const buildWhatsAppLink = (number: string, message: string): string => {
  let cleanNumber = number.replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    cleanNumber = `91${cleanNumber}`;
  }
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
};

/**
 * Prepares single-product Buy Now order payload
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
 * Prepares multi-item shopping cart order payload
 */
export const prepareCartWhatsAppOrder = (
  cartOrder: CartOrderDetails,
  customNumberOverride?: string
): WhatsAppPayload => {
  const targetNumber = customNumberOverride || BUSINESS_CONFIG.whatsappNumber;
  const isConfigured = isWhatsAppConfigured(targetNumber);
  const formattedMessage = generateCartWhatsAppOrderMessage(cartOrder);
  const waMeUrl = buildWhatsAppLink(targetNumber, formattedMessage);

  return {
    recipientNumber: targetNumber,
    formattedMessage,
    waMeUrl,
    isConfigured,
  };
};

/**
 * Dispatches order by opening WhatsApp reliably across desktop and mobile.
 * Avoids popup-blocker issues on iOS/Android by navigating directly on mobile,
 * and using window.open with location fallback on desktop.
 */
export const triggerWhatsAppChat = (url: string): boolean => {
  if (typeof window === 'undefined') return false;

  const userAgent =
    navigator.userAgent ||
    navigator.vendor ||
    (window as unknown as { opera?: string }).opera ||
    '';
  const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

  // 1. Mobile devices (iOS Safari, Android Chrome):
  // Direct location navigation triggers the mobile OS to launch the native WhatsApp app
  // without triggering popup blockers or opening broken blank tabs.
  if (isMobile) {
    try {
      window.location.href = url;
      return true;
    } catch (e) {
      console.warn('Direct location navigation on mobile failed, trying fallback:', e);
    }
  }

  // 2. Desktop browsers:
  // Attempt window.open first
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win && !win.closed && typeof win.closed !== 'undefined') {
      win.focus();
      return true;
    }
  } catch (e) {
    console.warn('window.open was blocked on desktop:', e);
  }

  // 3. Fallback: Hidden DOM anchor
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = isMobile ? '_self' : '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 300);
    return true;
  } catch (e) {
    console.warn('Anchor fallback failed:', e);
  }

  // 4. Universal fallback
  try {
    window.location.href = url;
    return true;
  } catch {
    return false;
  }
};

/**
 * Direct WhatsApp chat launcher with default or custom order message
 */
export const openWhatsAppDirectly = (
  customMessage: string = 'Hello Celebration Box! 🎉 I would like to order a Celebration Box for an upcoming celebration.'
): boolean => {
  const targetNumber = BUSINESS_CONFIG.whatsappNumber;
  const url = buildWhatsAppLink(targetNumber, customMessage);
  return triggerWhatsAppChat(url);
};
