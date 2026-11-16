import { OrderDetails, OrderSummary } from '../types';
import { calculateSubtotal } from '../utils/currency';

const RECENT_ORDERS_STORAGE_KEY = 'celebration_box_recent_orders';

export interface SavedOrder extends OrderDetails {
  orderId: string;
  createdAt: string;
  subtotal: number;
}

export const getOrderSummary = (order: Pick<OrderDetails, 'productPrice' | 'quantity' | 'deliveryMethod'>): OrderSummary => {
  const subtotal = calculateSubtotal(order.productPrice, order.quantity);
  const deliveryChargeNote =
    order.deliveryMethod === 'delivery'
      ? 'Confirmed separately via WhatsApp (local Bhimavaram auto/bike drop)'
      : 'Free College Campus Pickup';

  return {
    subtotal,
    deliveryChargeNote,
    totalKnownAmount: subtotal,
  };
};

export const saveOrderToLocalHistory = (order: OrderDetails): SavedOrder => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `CB-${Date.now().toString().slice(-4)}${randomSuffix}`;
  const subtotal = calculateSubtotal(order.productPrice, order.quantity);

  const savedOrder: SavedOrder = {
    ...order,
    orderId,
    createdAt: new Date().toISOString(),
    subtotal,
  };

  try {
    const existing = getSavedOrderHistory();
    const updated = [savedOrder, ...existing].slice(0, 20); // retain last 20
    localStorage.setItem(RECENT_ORDERS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }

  return savedOrder;
};

export const getSavedOrderHistory = (): SavedOrder[] => {
  try {
    const raw = localStorage.getItem(RECENT_ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

