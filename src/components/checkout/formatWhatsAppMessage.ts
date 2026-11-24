import { CHECKOUT_CONFIG } from './checkoutConfig';
import {
  CakeCustomizationState,
  calculateCakePrice,
  getCakeFlavour,
  getCakeDesign,
  CHOCOLOOM_CONFIG,
} from '../../config/chocoloomCakes';

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
  // Optional referral code & order ID support
  orderId?: string;
  referralCode?: string;
  wantsLightingRental?: boolean;
  // Optional multi-item cart items support
  cartItems?: Array<{ name: string; quantity: number; price: number }>;
  // Optional Chocoloom Cake Customization
  cakeCustomization?: CakeCustomizationState;
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

  if (params.orderId) {
    lines.push(`Order ID: ${sanitize(params.orderId)}`);
  }

  // Chocoloom Cake Combo Section
  if (params.cakeCustomization?.includeCake) {
    const cake = params.cakeCustomization;
    const flavour = getCakeFlavour(cake.flavourId);
    const design = getCakeDesign(cake.designId);
    const cakePrice = calculateCakePrice(cake);
    const sizeObj = CHOCOLOOM_CONFIG.sizes.find((s) => s.id === cake.size);

    lines.push('');
    lines.push('🎂 *CHOCOLOOM CAKE COMBO* (Bakery Partner)');
    lines.push(`• Bakery: ${CHOCOLOOM_CONFIG.tagline} (${CHOCOLOOM_CONFIG.websiteUrl})`);
    lines.push(`• Flavour: ${flavour.name}`);
    lines.push(`• Size / Weight: ${sizeObj ? sizeObj.label : cake.size}`);
    lines.push(`• Diet Preference: ${cake.dietType === 'eggless' ? '100% Eggless 🟢' : 'Contains Egg 🥚'}`);
    lines.push(`• Cake Design: ${design.name}${design.additionalCost > 0 ? ` (+${formatRupee(design.additionalCost)})` : ''}`);
    if (cake.nameOnCake && cake.nameOnCake.trim()) {
      lines.push(`• Name on Cake: "${sanitize(cake.nameOnCake)}"`);
    }
    if (cake.customMessage && cake.customMessage.trim()) {
      lines.push(`• Cake Message: "${sanitize(cake.customMessage)}"`);
    }
    if (cake.referenceImage) {
      lines.push(`• Reference Photo: Uploaded (${cake.referenceImageName || 'Custom Cake Design'})`);
    }
    if (cake.specialInstructions && cake.specialInstructions.trim()) {
      lines.push(`• Cake Special Instructions: ${sanitize(cake.specialInstructions)}`);
    }
    lines.push(`• Cake Price: ${formatRupee(cakePrice)}`);
  }

  lines.push('');
  if (params.cakeCustomization?.includeCake) {
    const cakePrice = calculateCakePrice(params.cakeCustomization);
    const kitSubtotal = Math.max(0, params.total - cakePrice);
    lines.push(`💰 *Total Amount: ${formatRupee(params.total)}*`);
    lines.push(`   (Decoration Kit: ${formatRupee(kitSubtotal)} + Chocoloom Cake: ${formatRupee(cakePrice)})`);
  } else {
    lines.push(`💰 *Total Amount: ${formatRupee(params.total)}*`);
  }
  lines.push('');
  lines.push(
    `Optional Lighting Rental Enquiry: ${
      params.wantsLightingRental
        ? 'Yes (Note: Decorative lighting is rented separately and not included in checkout total)'
        : 'No'
    }`
  );
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

  // Optional Referral Code Section
  const cleanReferral = sanitize(params.referralCode);
  if (cleanReferral && cleanReferral !== '—' && cleanReferral !== 'null' && cleanReferral !== 'undefined') {
    lines.push('');
    lines.push('🎟️ *REFERRAL CODE*');
    lines.push('');
    lines.push(cleanReferral.toUpperCase());
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
