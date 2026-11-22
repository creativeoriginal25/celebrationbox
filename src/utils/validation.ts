import { OrderDetails } from '../types';

export interface ValidationErrors {
  customerName?: string;
  customerPhone?: string;
  celebrationDate?: string;
  preferredTime?: string;
  deliveryAddress?: string;
  quantity?: string;
  theme?: string;
}

export const validateOrderForm = (order: Partial<OrderDetails>): { isValid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};

  // Customer Name
  if (!order.customerName || order.customerName.trim().length < 2) {
    errors.customerName = 'Please enter your full name (at least 2 letters)';
  }

  // Customer Phone
  if (!order.customerPhone || order.customerPhone.trim() === '') {
    errors.customerPhone = 'WhatsApp phone number is required';
  } else {
    const cleaned = order.customerPhone.replace(/[\s\-\+\(\)]/g, '');
    const indianPhoneRegex = /^(?:91)?[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(cleaned)) {
      errors.customerPhone = 'Enter a valid 10-digit Indian mobile number';
    }
  }

  // Celebration Date
  if (!order.celebrationDate) {
    errors.celebrationDate = 'Please select your celebration date';
  } else {
    const selectedDate = new Date(order.celebrationDate);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.celebrationDate = 'Celebration date cannot be in the past';
    }
  }

  // Preferred Time
  if (!order.preferredTime || order.preferredTime.trim() === '') {
    errors.preferredTime = 'Please select your preferred time for pickup or delivery';
  }

  // Delivery Address (mandatory only if delivery is selected)
  if (order.deliveryMethod === 'delivery') {
    if (!order.deliveryAddress || order.deliveryAddress.trim().length < 5) {
      errors.deliveryAddress = 'Please enter complete local delivery address / landmark in Bhimavaram';
    }
  }

  // Quantity
  if (!order.quantity || order.quantity < 1) {
    errors.quantity = 'Quantity must be at least 1';
  }

  // Theme check
  if (order.theme && !['Pink × Lavender × Rose Gold', 'Pastel Rose', 'Pastel Pop'].includes(order.theme)) {
    errors.theme = 'Only the Pink × Lavender × Rose Gold theme is currently available';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

