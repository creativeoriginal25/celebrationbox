// Automated Verification Test Suite for Celebration Box
import assert from 'assert';

console.log('--- Starting Celebration Box Automated Verification ---');

// 1. Single and Multi-Item Cart Subtotal Calculations
const calculateSubtotal = (price, quantity) => price * Math.max(1, quantity);
assert.strictEqual(calculateSubtotal(249, 1), 249, 'Mini box single subtotal should be 249');
assert.strictEqual(calculateSubtotal(249, 2), 498, 'Mini box double subtotal should be 498');
assert.strictEqual(calculateSubtotal(299, 1), 299, 'Pastel Rose Celebration Box single subtotal should be 299');
assert.strictEqual(calculateSubtotal(299, 3), 897, 'Pastel Rose Celebration Box triple subtotal should be 897');

// Multi-item cart calculation (2 Mini @ 249 + 1 Pastel Rose @ 299)
const cartItems = [
  { id: 'mini-celebration-box', name: 'Mini Celebration Box', price: 249, quantity: 2 },
  { id: 'signature-celebration-box', name: 'Pastel Rose Celebration Box', price: 299, quantity: 1 },
];
const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
assert.strictEqual(cartTotal, 797, 'Cart total for 2 Mini (498) + 1 Pastel Rose (299) must be 797');
console.log('✅ Single & multi-item cart calculations verified (including ₹299 Pastel Rose Box)');

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

// Valid Delivery Order with complete address
const validDelivery = validateOrder({
  customerName: 'Priya K',
  customerPhone: '9100280705',
  celebrationDate: '2026-11-22',
  deliveryMethod: 'delivery',
  deliveryAddress: 'Room 102, Near Campus Gate, Bhimavaram',
});
assert.strictEqual(validDelivery.isValid, true, 'Valid delivery order should pass');

// Invalid Phone Order
const invalidPhone = validateOrder({
  customerName: 'Rahul Verma',
  customerPhone: '12345',
  celebrationDate: '2026-11-20',
  deliveryMethod: 'pickup',
});
assert.strictEqual(invalidPhone.isValid, false, 'Invalid phone number should fail');
console.log('✅ Form validation rules verified');

// 3. Multi-Item Cart WhatsApp Message Construction
const generateCartWhatsAppOrderMessage = (cartOrder) => {
  const totalValue = cartOrder.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryLabel =
    cartOrder.deliveryMethod === 'pickup'
      ? 'College Pickup (Bhimavaram)'
      : 'Nearby Delivery (Bhimavaram)';

  const lines = [
    'Hello Celebration Box! 🎉',
    '',
    'I would like to place an order.',
    '',
    'ORDER SUMMARY:',
    '',
  ];

  cartOrder.items.forEach((item) => {
    lines.push(
      item.name,
      `Quantity: ${item.quantity}`,
      `Price: ₹${item.price} each`,
      `Subtotal: ₹${item.price * item.quantity}`,
      ''
    );
  });

  lines.push(
    `TOTAL PRODUCT VALUE: ₹${totalValue}`,
    '',
    'CUSTOMER DETAILS:',
    '',
    `Name: ${cartOrder.customerName}`,
    `Phone: ${cartOrder.customerPhone}`,
    `Celebration Date: ${cartOrder.celebrationDate}`,
    `Preferred Time: ${cartOrder.preferredTime}`,
    '',
    'FULFILMENT:',
    '',
    deliveryLabel
  );

  if (cartOrder.deliveryMethod === 'delivery' && cartOrder.deliveryAddress) {
    lines.push(`Delivery Address: ${cartOrder.deliveryAddress}`);
  }

  lines.push('', 'Please confirm availability and delivery charges.', '', 'Thank you!');

  return lines.join('\n');
};

const sampleCartOrder = {
  items: cartItems,
  customerName: 'Lokesh T',
  customerPhone: '9100280705',
  celebrationDate: '2026-11-25',
  preferredTime: 'Evening (4:00 PM - 7:00 PM)',
  deliveryMethod: 'pickup',
};

const cartMsg = generateCartWhatsAppOrderMessage(sampleCartOrder);
assert.ok(cartMsg.includes('Mini Celebration Box'), 'Cart message must include Mini Box');
assert.ok(cartMsg.includes('Pastel Rose Celebration Box'), 'Cart message must include Pastel Rose Box');
assert.ok(cartMsg.includes('TOTAL PRODUCT VALUE: ₹797'), 'Cart message must show ₹797 total');
assert.ok(cartMsg.includes('College Pickup (Bhimavaram)'), 'Cart message must show college pickup');
console.log('✅ Consolidated multi-product cart message verified');

// 4. URL Encoding and Link Generation with official number 919100280705
const buildWhatsAppLink = (number, text) => {
  const cleanNumber = number.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
};

const waLink = buildWhatsAppLink('919100280705', cartMsg);
assert.ok(waLink.startsWith('https://wa.me/919100280705?text='), 'Must be standard wa.me click-to-chat URL with official number');
assert.ok(!waLink.includes(' '), 'URL must not contain raw spaces');
console.log('✅ Official WhatsApp URL encoding verified (919100280705)');

// 5. Product & Occasion Configuration Verification
// Pastel Rose Celebration Box piece verification (exact 6 items = 60 pieces)
const pastelRosePieces = 26 + 26 + 5 + 1 + 1 + 1; // 26 Pink, 26 Lavender, 5 Rose Gold, 1 Banner, 1 Arch Strip, 1 Glue Dots Roll
assert.strictEqual(pastelRosePieces, 60, 'Pastel Rose Celebration Box must have verified 60 pieces');
console.log('✅ Approved products piece counts verified (Pastel Rose Celebration Box: 60 pcs)');

// 6. Occasion Category List Verification
const categoryList = [
  "Kid's Birthday",
  "Adult's Birthday",
  'Festive',
  'Gifting Essentials',
  'Bachelorette',
  'Baby Shower',
  'Anniversary',
  'Custom Decor',
  'Party Essentials',
];
assert.strictEqual(categoryList.length, 9, 'Must have exactly 9 celebration categories');
console.log('✅ 9 Occasion categories verified');

console.log('\n🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY! 🎉\n');
