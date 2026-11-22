import { OrderDetails, CartOrderDetails } from '../types';
import { BUSINESS_CONFIG, isWhatsAppConfigured } from '../config/business';
import { calculateSubtotal, formatPrice } from '../utils/currency';
import { formatOrderWhatsAppMessage } from '../components/checkout/formatWhatsAppMessage';

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
  return formatOrderWhatsAppMessage({
    productName: order.productName,
    quantity: order.quantity,
    unitPrice: order.productPrice,
    total: order.productPrice * order.quantity,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    fulfilment: order.deliveryMethod,
    deliveryAddress: order.deliveryAddress,
    personalMessage: order.birthdayMessage,
    celebrationDate: order.celebrationDate,
    preferredTime: order.preferredTime,
  });
};

/**
 * Builds multi-product shopping cart WhatsApp order message
 */
export const generateCartWhatsAppOrderMessage = (cartOrder: CartOrderDetails): string => {
  const total = cartOrder.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return formatOrderWhatsAppMessage({
    productName: cartOrder.items[0]?.name || 'Celebration Box',
    quantity: cartOrder.items[0]?.quantity || 1,
    unitPrice: cartOrder.items[0]?.price || 0,
    total,
    customerName: cartOrder.customerName,
    customerPhone: cartOrder.customerPhone,
    fulfilment: cartOrder.deliveryMethod,
    deliveryAddress: cartOrder.deliveryAddress,
    personalMessage: cartOrder.birthdayMessage,
    celebrationDate: cartOrder.celebrationDate,
    preferredTime: cartOrder.preferredTime,
    cartItems: cartOrder.items,
  });
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
