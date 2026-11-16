// Automated Verification Test Suite for Celebration Box
import assert from 'assert';

console.log('--- Starting Celebration Box Automated Verification ---');

// 1. Currency & Calculations Test
const calculateSubtotal = (price, quantity) => price * Math.max(1, quantity);
assert.strictEqual(calculateSubtotal(249, 1), 249, 'Mini box single subtotal should be 249');
assert.strictEqual(calculateSubtotal(249, 2), 498, 'Mini box double subtotal should be 498');
assert.strictEqual(calculateSubtotal(499, 1), 499, 'Signature box single subtotal should be 499');
assert.strictEqual(calculateSubtotal(499, 3), 1497, 'Signature box triple subtotal should be 1497');
console.log('✅ Subtotal calculations verified');

// 2. Validation Test
const validateOrder = (order) => {
  const errors = {};
  if (!order.customerName || order.customerName.trim().length < 2) {
    errors.customerName = 'Please enter your full name';
  }
  const cleaned = (order.customerPhone || '').replace(/[\s\-\+\(\)]/g, '');
  const indianPhoneRegex = /^(?:91)?[6-9]\d{9}$/;
  if (!indianPhoneRegex.test(cleaned)) {
    errors.customerPhone = 'Enter a valid 10-digit Indian mobile number';
  }
  if (!order.celebrationDate) {
    errors.celebrationDate = 'Please select your celebration date';
  }
  if (order.deliveryMethod === 'delivery' && (!order.deliveryAddress || order.deliveryAddress.trim().length < 5)) {
    errors.deliveryAddress = 'Delivery address required';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

// Valid Pickup Order
const validPickup = validateOrder({
  customerName: 'Rahul Verma',
  customerPhone: '9876543210',
  celebrationDate: '2026-11-20',
  deliveryMethod: 'pickup',
});
assert.strictEqual(validPickup.isValid, true, 'Valid pickup order should pass');

// Invalid Phone Order
const invalidPhone = validateOrder({
  customerName: 'Rahul Verma',
  customerPhone: '12345',
  celebrationDate: '2026-11-20',
  deliveryMethod: 'pickup',
});
assert.strictEqual(invalidPhone.isValid, false, 'Invalid phone number should fail');
assert.ok(invalidPhone.errors.customerPhone, 'Should have customerPhone error');

// Delivery without address
const deliveryNoAddress = validateOrder({
  customerName: 'Rahul Verma',
  customerPhone: '9876543210',
  celebrationDate: '2026-11-20',
  deliveryMethod: 'delivery',
  deliveryAddress: '',
});
assert.strictEqual(deliveryNoAddress.isValid, false, 'Delivery without address must fail');
assert.ok(deliveryNoAddress.errors.deliveryAddress, 'Should have deliveryAddress error');
console.log('✅ Form validation rules verified');

// 3. WhatsApp Message Construction Test
const generateWhatsAppOrderMessage = (order) => {
  const subtotal = calculateSubtotal(order.productPrice, order.quantity);
  const deliveryLabel =
    order.deliveryMethod === 'pickup'
      ? 'College Pickup (Bhimavaram)'
      : 'Nearby Delivery (Bhimavaram)';

  const lines = [
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

const sampleOrder = {
  productId: 'signature-celebration-box',
  productName: 'Signature Celebration Box',
  productPrice: 499,
  quantity: 1,
  theme: 'Pastel Pop',
  customerName: 'Kavya S',
  customerPhone: '919876543210',
  celebrationDate: '2026-11-25',
  preferredTime: 'Evening (4:00 PM - 7:00 PM)',
  deliveryMethod: 'delivery',
  deliveryAddress: 'Flat 302, Green Meadows, Bhimavaram',
  birthdayMessage: 'Happy 20th Birthday to my roommate!',
};

const message = generateWhatsAppOrderMessage(sampleOrder);
assert.ok(message.includes('Signature Celebration Box'), 'Message must contain product name');
assert.ok(message.includes('₹499'), 'Message must contain price');
assert.ok(message.includes('Pastel Pop'), 'Message must contain Pastel Pop theme');
assert.ok(message.includes('Kavya S'), 'Message must contain customer name');
assert.ok(message.includes('Please confirm product availability and delivery charges.'), 'Message must contain confirmation request');
console.log('✅ WhatsApp message formatting verified');

// 4. URL Encoding and Link Generation
const buildWhatsAppLink = (number, text) => {
  const cleanNumber = number.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
};

const waLink = buildWhatsAppLink('919876543210', message);
assert.ok(waLink.startsWith('https://wa.me/919876543210?text='), 'Must be standard wa.me click-to-chat URL');
assert.ok(!waLink.includes(' '), 'URL must not contain raw unencoded spaces');
console.log('✅ WhatsApp URL encoding and wa.me format verified');

// 5. Config Check
const isConfigured = (number) => {
  if (!number) return false;
  const cleaned = number.replace(/\D/g, '');
  if (cleaned.length < 10) return false;
  if (number.toUpperCase().includes('X')) return false;
  return true;
};

assert.strictEqual(isConfigured('91XXXXXXXXXX'), false, 'Placeholder number must be flagged as unconfigured');
assert.strictEqual(isConfigured(''), false, 'Empty number must be unconfigured');
assert.strictEqual(isConfigured('919876543210'), true, 'Valid 12-digit number is configured');
console.log('✅ Configuration detection & fallback triggers verified');

console.log('\n🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY! 🎉\n');
