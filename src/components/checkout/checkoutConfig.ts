import { BUSINESS_CONFIG } from '../../config/business';

export interface CheckoutConfig {
  whatsappNumber: string;
  defaultProductId: string;
  defaultProductName: string;
  defaultProductPrice: number;
  pickupPointTitle: string;
  pickupPointDetails: string;
  deliveryTitle: string;
  deliveryDetails: string;
  storageKey: string;
  timeSlots: string[];
}

export const CHECKOUT_CONFIG: CheckoutConfig = {
  // Official Business WhatsApp number (+91 country code included)
  whatsappNumber: BUSINESS_CONFIG.whatsappNumber || '919100280705',

  // Featured flagship product defaults
  defaultProductId: 'signature-celebration-box',
  defaultProductName: 'Pastel Rose Celebration Box',
  defaultProductPrice: 299,

  // Campus Pickup details (FREE for college students in Bhimavaram)
  pickupPointTitle: 'College Campus Pickup',
  pickupPointDetails: 'Free college campus pickup at campus gate (Bhimavaram). Exact spot coordinated on WhatsApp.',

  // Nearby Delivery details (Bhimavaram town)
  deliveryTitle: 'Nearby Delivery',
  deliveryDetails: 'Hostel, room, or residence drop-off within Bhimavaram town. Delivery charge confirmed separately on WhatsApp.',

  // LocalStorage persistence key for unsaved form drafts
  storageKey: 'celebration_box_checkout_draft_v2',

  // Selectable preferred delivery/pickup time windows
  timeSlots: [
    'Morning (10:00 AM - 1:00 PM)',
    'Afternoon (1:00 PM - 4:00 PM)',
    'Evening (4:00 PM - 7:00 PM)',
    'Night (7:00 PM - 9:00 PM)',
  ],
};
