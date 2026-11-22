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

// ============================================================================
// ADMIN PANEL & DATABASE TYPES
// ============================================================================

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
}

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  ideal_for?: string;
  selling_price: number;
  material_cost: number;
  packaging_cost: number;
  other_variable_cost: number;
  category_id: string;
  theme_id: string;
  images: {
    url: string;
    alt?: string;
    title?: string;
    caption?: string;
  }[];
  contents: {
    name: string;
    quantity: string;
    pieceCount?: number;
    specification?: string;
    note?: string;
  }[];
  exclusions: string[];
  stock_quantity: number;
  status: 'active' | 'draft' | 'out_of_stock' | 'archived';
  total_pieces: number;
  badge?: string;
  created_at?: string;
  updated_at?: string;
}

export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'packing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus =
  | 'unpaid'
  | 'pending_verification'
  | 'paid'
  | 'refunded';

export interface AdminOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  theme?: string;
  celebration_date: string;
  preferred_time?: string;
  delivery_method: DeliveryMethod;
  delivery_address?: string;
  delivery_charge: number;
  total_amount: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity_available: number;
  unit_cost: number;
  supplier: string;
  reorder_level: number;
  last_updated: string;
}

export interface InventoryMovement {
  id: string;
  item_id: string;
  item_name?: string;
  change_quantity: number;
  reason: 'restock' | 'usage' | 'damage' | 'adjustment';
  notes?: string;
  created_at: string;
}

export interface BusinessSettings {
  business_name: string;
  tagline: string;
  whatsapp_number: string;
  instagram_url: string;
  contact_email: string;
  service_location: string;
  pickup_instructions: string;
  delivery_info: string;
  brand_logo_url?: string;
  business_description: string;
}
