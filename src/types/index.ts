export interface Product {
  id: 'mini-celebration-box' | 'signature-celebration-box';
  name: string;
  tagline: string;
  price: number;
  description: string;
  idealFor: string;
  inclusions: string[];
  exclusions: string[];
  image: string;
  badge?: string;
  popular?: boolean;
  active: boolean;
  availableThemes: string[];
  dimensionsOrSpecs?: string[];
}

export interface ThemeOption {
  id: string;
  name: string;
  colors: {
    name: string;
    hex: string;
  }[];
  isAvailable: boolean;
  description: string;
}

export type DeliveryMethod = 'pickup' | 'delivery';

export interface OrderDetails {
  productId: 'mini-celebration-box' | 'signature-celebration-box';
  productName: string;
  productPrice: number;
  quantity: number;
  theme: string;
  customerName: string;
  customerPhone: string;
  celebrationDate: string;
  preferredTime: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string;
  birthdayMessage?: string;
}

export interface OrderSummary {
  subtotal: number;
  deliveryChargeNote: string;
  totalKnownAmount: number;
}

export interface BusinessConfig {
  name: string;
  tagline: string;
  descriptor: string;
  whatsappNumber: string;
  instagramUrl: string;
  email: string;
  campusLocation: string;
  currencySymbol: string;
}

