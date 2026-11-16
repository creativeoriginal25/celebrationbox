import { BusinessConfig } from '../types';

export const BUSINESS_CONFIG: BusinessConfig = {
  name: 'Celebration Box',
  tagline: 'Make Every Moment Special.',
  descriptor: 'DIY Party & Celebration Kits',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '919100280705',
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || 'https://instagram.com/celebrationbox.in',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'hello@celebrationbox.in',
  campusLocation: 'Bhimavaram, Andhra Pradesh, India',
  currencySymbol: '₹',
};

// Check if a WhatsApp number is realistically configured (not empty and not containing placeholder 'X')
export const isWhatsAppConfigured = (number: string = BUSINESS_CONFIG.whatsappNumber): boolean => {
  if (!number) return false;
  const cleaned = number.replace(/\D/g, '');
  if (cleaned.length < 10) return false;
  // If it's the placeholder format like 91XXXXXXXXXX
  if (number.toUpperCase().includes('X')) return false;
  return true;
};

// Templates for the business owner to reply to customers on WhatsApp
export interface OwnerMessageTemplate {
  id: string;
  title: string;
  description: string;
  template: (data: { customerName: string; productName: string; amount: number; orderId?: string }) => string;
}

export const OWNER_MESSAGE_TEMPLATES: OwnerMessageTemplate[] = [
  {
    id: 'order-received',
    title: '1. Order Received & Availability Check',
    description: 'Acknowledge order, confirm availability, and provide payment details (UPI/Scanner).',
    template: ({ customerName, productName, amount }) =>
      `Hi ${customerName}! 👋 Thank you for choosing Celebration Box.\n\nWe have received your order for the *${productName}* (Total: ₹${amount}).\n\n✅ *Status:* Kit is currently in stock!\n\nTo confirm your booking, please transfer the kit amount (₹${amount}) to our official UPI:\n📱 UPI ID: celebrationbox@upi\n(Or reply here for our QR code)\n\nOnce paid, please share a screenshot here so we can pack your box! 🎉`,
  },
  {
    id: 'payment-confirmed',
    title: '2. Payment Confirmed',
    description: 'Confirm payment receipt and update preparation status.',
    template: ({ customerName, productName }) =>
      `Payment Received! 🎊 Thank you ${customerName}.\n\nYour *${productName}* is now officially reserved and being lovingly curated with fresh balloons, ribbons, and party essentials.\n\nWe will update you as soon as your box is packed and ready! ✨`,
  },
  {
    id: 'ready-for-pickup',
    title: '3. Order Ready for College Pickup',
    description: 'Send campus pickup location & collection timings.',
    template: ({ customerName, productName }) =>
      `Hi ${customerName}! 🎈 Good news — your *${productName}* is packed and ready for pickup!\n\n📍 *Pickup Spot:* Campus Main Gate / Student Centre (Bhimavaram)\n⏰ *Timings:* Available between 4:00 PM – 7:30 PM today\n\nPlease ping us 10 minutes before you arrive so we can hand over your Celebration Box smoothly. Happy celebrating! 🎂`,
  },
  {
    id: 'delivery-dispatched',
    title: '4. Delivery Dispatched',
    description: 'Notify customer that their box is out for nearby delivery.',
    template: ({ customerName, productName }) =>
      `Hello ${customerName}! 🚚 Your *${productName}* is on its way!\n\nOur local delivery teammate is out for drop-off. Please keep your phone handy. If you have any trouble finding our delivery person, just reply to this chat.\n\nGet ready to unbox some magic! 🎉`,
  },
  {
    id: 'feedback-request',
    title: '5. Celebration Feedback Request',
    description: 'Follow up post-celebration for feedback and photos.',
    template: ({ customerName }) =>
      `Hi ${customerName}! 🥳 We hope the birthday celebration was super memorable and everyone loved the decoration!\n\nWe'd love to see how your DIY setup turned out! Feel free to tag us on Instagram *@celebrationbox.in* or send us a photo here.\n\nIf you have 30 seconds, please let us know how your experience was. Thank you for supporting our student startup! 💛`,
  },
];

