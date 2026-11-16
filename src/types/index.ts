export interface ProductPackItem {
  name: string;
  quantity: string;
  pieceCount: number;
  specification?: string;
  note?: string;
}

export interface ProductGalleryImage {
  id: string;
  url: string;
  alt: string;
  title: string;
  caption: string;
  type: 'main' | 'flatlay' | 'details' | 'setup' | 'packaging';
}

export interface OccasionCategory {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  bgColor: string;
  isAvailable: boolean;
  badge?: string;
  availableNotice?: string;
  relatedProductIds?: ('mini-celebration-box' | 'signature-celebration-box')[];
}

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
  totalPieces?: number;
  packItems?: ProductPackItem[];
  inventoryStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
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

export interface CartItem {
  id: 'mini-celebration-box' | 'signature-celebration-box';
  name: string;
  price: number;
  quantity: number;
  image: string;
  theme: string;
}

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

export interface CartOrderDetails {
  items: CartItem[];
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
