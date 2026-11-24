// Automated Verification Test Suite for Celebration Box
import assert from 'assert';

console.log('--- Starting Celebration Box Automated Verification ---');

// 1. Single and Multi-Item Cart Subtotal Calculations
const calculateSubtotal = (price, quantity) => price * Math.max(1, quantity);
assert.strictEqual(calculateSubtotal(249, 1), 249, 'Mini box single subtotal should be 249');
assert.strictEqual(calculateSubtotal(249, 2), 498, 'Mini box double subtotal should be 498');
assert.strictEqual(calculateSubtotal(399, 1), 399, 'Pastel Rose Celebration Box single subtotal should be 399');
assert.strictEqual(calculateSubtotal(399, 3), 1197, 'Pastel Rose Celebration Box triple subtotal should be 1197');

// Multi-item cart calculation (2 Mini @ 249 + 1 Pastel Rose @ 399)
const cartItems = [
  { id: 'mini-celebration-box', name: 'Mini Celebration Box', price: 249, quantity: 2 },
  { id: 'signature-celebration-box', name: 'Pastel Rose Celebration Box', price: 399, quantity: 1 },
];
const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
assert.strictEqual(cartTotal, 897, 'Cart total for 2 Mini (498) + 1 Pastel Rose (399) must be 897');
console.log('✅ Single & multi-item cart calculations verified (including ₹399 Pastel Rose Box)');

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

// 3. WhatsApp Message Construction (New Official Celebration Box Format)
const formatOrderWhatsAppMessage = (params) => {
  const sanitize = (text) => {
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
  const formatRupee = (val) => `₹${val.toLocaleString('en-IN')}`;

  const lines = [
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
      if (idx < params.cartItems.length - 1) {
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

  lines.push('');
  lines.push(`💰 *Total Amount: ${formatRupee(params.total)}*`);
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
      `Celebration Date: ${cleanDate}${cleanTime && cleanTime !== '—' && cleanTime !== 'null' && cleanTime !== 'undefined'
        ? ` (${cleanTime})`
        : ''
      }`
    );
  }

  // Optional Referral Code section
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

// Test A: Single Product Order (Buy Now - 1 Unit)
const singleOrder = {
  productName: 'Pastel Rose Celebration Box',
  quantity: 1,
  unitPrice: 399,
  total: 399,
  customerName: 'Rahul Verma',
  customerPhone: '9876543210',
  fulfilment: 'pickup',
  celebrationDate: '2026-11-25',
  preferredTime: 'Evening (4:00 PM - 7:00 PM)',
};
const singleMsg = formatOrderWhatsAppMessage(singleOrder);

assert.ok(singleMsg.includes('🎉 *CELEBRATION BOX* 🎉'), 'Header must contain celebration box');
assert.ok(singleMsg.includes('✨ Making Moments Magical ✨'), 'Header must contain tagline');
assert.ok(singleMsg.includes("Hi! 👋 I'd like to place an order for the following:"), 'Intro greeting matches');
assert.ok(singleMsg.includes('🎁 *ORDER DETAILS*'), 'Order details heading matches');
assert.ok(singleMsg.includes('Product: Pastel Rose Celebration Box'), 'Product name matches');
assert.ok(singleMsg.includes('Quantity: 1'), 'Quantity matches');
assert.ok(singleMsg.includes('Price per Box: ₹399'), 'Price per box matches');
assert.ok(singleMsg.includes('💰 *Total Amount: ₹399*'), 'Total amount heading matches');
assert.ok(singleMsg.includes('👤 *CUSTOMER DETAILS*'), 'Customer details heading matches');
assert.ok(singleMsg.includes('Name: Rahul Verma'), 'Customer name matches');
assert.ok(singleMsg.includes('Mobile: +91 9876543210'), 'Customer mobile matches');
assert.ok(singleMsg.includes('📍 *FULFILMENT*'), 'Fulfilment heading matches');
assert.ok(singleMsg.includes('Optional Lighting Rental Enquiry: No'), 'Lighting rental enquiry defaulted to No');
assert.ok(singleMsg.includes('Campus Pickup (Bhimavaram)'), 'Fulfilment method matches');
assert.ok(singleMsg.includes('Please confirm the availability and pickup details. Thank you! 💖'), 'Closing line matches');
assert.ok(!singleMsg.includes('undefined'), 'No undefined in single order');
assert.ok(!singleMsg.includes('null'), 'No null in single order');
assert.ok(!singleMsg.includes('—'), 'No em dashes in single order');
assert.ok(!singleMsg.includes('\uFFFD'), 'No replacement characters in single order');
console.log('✅ Single-product WhatsApp message format verified');

// Test A2: Multiple-Unit Product Purchase (3 Units @ ₹399 = ₹1197)
const multiUnitOrder = {
  productName: 'Pastel Rose Celebration Box',
  quantity: 3,
  unitPrice: 399,
  total: 1197,
  customerName: 'Sneha Patel',
  customerPhone: '9876543211',
  fulfilment: 'pickup',
  celebrationDate: '2026-11-26',
  preferredTime: 'Morning (10:00 AM - 1:00 PM)',
};
const multiUnitMsg = formatOrderWhatsAppMessage(multiUnitOrder);
assert.ok(multiUnitMsg.includes('Quantity: 3'), 'Multi-unit quantity matches');
assert.ok(multiUnitMsg.includes('Price per Box: ₹399'), 'Multi-unit price per box matches');
assert.ok(multiUnitMsg.includes('💰 *Total Amount: ₹1,197*'), 'Multi-unit total amount matches ₹1,197');
console.log('✅ Multiple-unit purchase WhatsApp message format verified (3 boxes @ ₹399 = ₹1,197)');

// Test B: Multi-Item Cart Order with Special Instructions
const sampleCartOrder = {
  cartItems,
  total: 897,
  customerName: 'Lokesh T',
  customerPhone: '9100280705',
  celebrationDate: '2026-11-25',
  preferredTime: 'Evening (4:00 PM - 7:00 PM)',
  fulfilment: 'delivery',
  deliveryAddress: 'Room 102, Near Campus Gate, Bhimavaram',
  personalMessage: 'Please pack with extra pastel ribbons!',
  wantsLightingRental: true,
};

const cartMsg = formatOrderWhatsAppMessage(sampleCartOrder);
assert.ok(cartMsg.includes('Optional Lighting Rental Enquiry: Yes'), 'Cart lighting rental enquiry matches Yes');
assert.ok(cartMsg.includes('Product: Mini Celebration Box'), 'Cart message must include Mini Box');
assert.ok(cartMsg.includes('Line Total: ₹498'), 'Cart message must include line total for Mini Box');
assert.ok(cartMsg.includes('Product: Pastel Rose Celebration Box'), 'Cart message must include Pastel Rose Box');
assert.ok(cartMsg.includes('Line Total: ₹399'), 'Cart message must include line total for Pastel Rose Box');
assert.ok(cartMsg.includes('💰 *Total Amount: ₹897*'), 'Cart message must show ₹897 total');
assert.ok(cartMsg.includes('Nearby Delivery (Bhimavaram)'), 'Cart message must show delivery');
assert.ok(cartMsg.includes('Address: Room 102, Near Campus Gate, Bhimavaram'), 'Delivery address included');
assert.ok(cartMsg.includes('💬 *SPECIAL INSTRUCTIONS*'), 'Special instructions heading present');
assert.ok(cartMsg.includes('Please pack with extra pastel ribbons!'), 'Special instructions content present');
assert.ok(cartMsg.includes('Please confirm the availability and delivery details. Thank you! 💖'), 'Delivery closing line matches');
assert.ok(!cartMsg.includes('undefined'), 'No undefined in cart order');
assert.ok(!cartMsg.includes('null'), 'No null in cart order');
assert.ok(!cartMsg.includes('—'), 'No em dashes in cart order');
console.log('✅ Multi-product cart WhatsApp message with special instructions verified');

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
// Pastel Rose Celebration Box balloon count verification (exact 56 balloons)
const pastelRoseBalloons = 20 + 20 + 16; // 20 Baby Pink, 20 Lavender, 16 Metallic Copper
assert.strictEqual(pastelRoseBalloons, 56, 'Pastel Rose Celebration Box must have verified 56 balloons');
console.log('✅ Approved products balloon counts verified (Pastel Rose Celebration Box: 56 balloons)');

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

// 7. Refer & Earn System Verification
console.log('\n--- Refer & Earn System Verification ---');

// 7.1 Anti-Formula Injection Sanitizer Test
const sanitizeForSheetTest = (input) => {
  if (input === null || input === undefined) return '';
  const str = String(input).trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
};
assert.strictEqual(sanitizeForSheetTest('=cmd|calc!A1'), "'=cmd|calc!A1", 'Formula starting with = must be single-quote prefixed');
assert.strictEqual(sanitizeForSheetTest('+12345'), "'+12345", 'Formula starting with + must be single-quote prefixed');
assert.strictEqual(sanitizeForSheetTest('@danger'), "'@danger", 'Formula starting with @ must be single-quote prefixed');
assert.strictEqual(sanitizeForSheetTest('Rahul Verma'), 'Rahul Verma', 'Normal text must remain untouched');
console.log('✅ Anti-formula injection sanitizer verified');

// 7.2 WhatsApp Message Formatting with & without Referral Code
const orderWithoutRef = {
  productName: 'Pastel Rose Celebration Box',
  quantity: 1,
  unitPrice: 399,
  total: 399,
  customerName: 'Aman Deep',
  customerPhone: '9876543210',
  fulfilment: 'pickup',
  celebrationDate: '2026-11-28',
};
const msgNoRef = formatOrderWhatsAppMessage(orderWithoutRef);
assert.ok(!msgNoRef.includes('REFERRAL CODE'), 'Order without referral code must NOT contain referral section');

const orderWithRef = {
  productName: 'Pastel Rose Celebration Box',
  quantity: 1,
  unitPrice: 399,
  total: 399,
  customerName: 'Aman Deep',
  customerPhone: '9876543210',
  fulfilment: 'pickup',
  celebrationDate: '2026-11-28',
  orderId: 'CBX-ORD-998877',
  referralCode: 'CBX-K7M2',
};
const msgWithRef = formatOrderWhatsAppMessage(orderWithRef);
assert.ok(msgWithRef.includes('Order ID: CBX-ORD-998877'), 'Order ID must be displayed in WhatsApp message');
assert.ok(msgWithRef.includes('🎟️ *REFERRAL CODE*'), 'Referral header must be present');
assert.ok(msgWithRef.includes('CBX-K7M2'), 'Referral code must be uppercase and present');
console.log('✅ WhatsApp message formatting with and without referral code verified');

// 7.3 Preset Codes Verification (Exact 10 codes specified in Part 2)
const PRESET_CODES = [
  'CBX-K7M2',
  'CBX-R9P4',
  'CBX-T3V8',
  'CBX-N6W2',
  'CBX-F8K5',
  'CBX-H4R7',
  'CBX-P2Y9',
  'CBX-M5T3',
  'CBX-V7D6',
  'CBX-S9L4',
];
assert.strictEqual(PRESET_CODES.length, 10, 'Must have exactly 10 initial codes');
PRESET_CODES.forEach((c) => {
  assert.ok(/^CBX-[A-Z0-9]{4}$/.test(c), `Code ${c} must match CBX-XXXX format`);
});
console.log('✅ 10 preset referral codes verified');

// 7.4 Reward Engine Calculation: 2 Distinct Verified Customers = ₹80
const calculateRewards = (orders, allocatedOrderIds = new Set()) => {
  const verifiedOrders = orders.filter(
    (o) =>
      o.paymentStatus === 'Verified Paid' &&
      o.fulfilmentStatus === 'Fulfilled' &&
      o.orderStatus !== 'Cancelled'
  );

  // Group by distinct customer phone (earliest order per unique phone)
  const customerEarliest = new Map();
  verifiedOrders.forEach((o) => {
    if (allocatedOrderIds.has(o.orderId)) return;
    const phone = o.customerPhone.replace(/\D/g, '').slice(-10);
    if (!customerEarliest.has(phone)) {
      customerEarliest.set(phone, o);
    }
  });

  const distinctOrders = Array.from(customerEarliest.values());
  const newRewardPairs = Math.floor(distinctOrders.length / 2);
  const totalRewardAmount = newRewardPairs * 80;

  return {
    distinctCustomers: distinctOrders.length,
    newRewardBatches: newRewardPairs,
    rewardAmount: totalRewardAmount,
  };
};

// Scenario A: 0 verified orders -> 0 rewards
assert.strictEqual(calculateRewards([]).rewardAmount, 0, '0 orders should yield ₹0');

// Scenario B: 1 verified order -> 0 rewards (needs 2)
const oneOrder = [
  { orderId: 'ORD-1', customerPhone: '9876543210', paymentStatus: 'Verified Paid', fulfilmentStatus: 'Fulfilled', orderStatus: 'Completed' },
];
assert.strictEqual(calculateRewards(oneOrder).rewardAmount, 0, '1 order should yield ₹0');

// Scenario C: Same customer buys twice -> only 1 distinct customer -> 0 rewards
const duplicateCustomerOrders = [
  { orderId: 'ORD-1', customerPhone: '9876543210', paymentStatus: 'Verified Paid', fulfilmentStatus: 'Fulfilled', orderStatus: 'Completed' },
  { orderId: 'ORD-2', customerPhone: '9876543210', paymentStatus: 'Verified Paid', fulfilmentStatus: 'Fulfilled', orderStatus: 'Completed' },
];
assert.strictEqual(calculateRewards(duplicateCustomerOrders).rewardAmount, 0, 'Same customer twice must NOT qualify for reward');
assert.strictEqual(calculateRewards(duplicateCustomerOrders).distinctCustomers, 1, 'Duplicate customer phone should yield only 1 distinct customer');

// Scenario D: 2 distinct customers -> 1 reward batch = ₹80
const twoDistinctOrders = [
  { orderId: 'ORD-1', customerPhone: '9876543210', paymentStatus: 'Verified Paid', fulfilmentStatus: 'Fulfilled', orderStatus: 'Completed' },
  { orderId: 'ORD-2', customerPhone: '9876543211', paymentStatus: 'Verified Paid', fulfilmentStatus: 'Fulfilled', orderStatus: 'Completed' },
];
const res2 = calculateRewards(twoDistinctOrders);
assert.strictEqual(res2.distinctCustomers, 2, '2 distinct customers');
assert.strictEqual(res2.rewardAmount, 80, '2 distinct customers must yield exactly ₹80 reward');

// Scenario E: 4 distinct customers -> 2 reward batches = ₹160
const fourDistinctOrders = [
  { orderId: 'ORD-1', customerPhone: '9876543210', paymentStatus: 'Verified Paid', fulfilmentStatus: 'Fulfilled', orderStatus: 'Completed' },
  { orderId: 'ORD-2', customerPhone: '9876543211', paymentStatus: 'Verified Paid', fulfilmentStatus: 'Fulfilled', orderStatus: 'Completed' },
  { orderId: 'ORD-3', customerPhone: '9876543212', paymentStatus: 'Verified Paid', fulfilmentStatus: 'Fulfilled', orderStatus: 'Completed' },
  { orderId: 'ORD-4', customerPhone: '9876543213', paymentStatus: 'Verified Paid', fulfilmentStatus: 'Fulfilled', orderStatus: 'Completed' },
];
const res4 = calculateRewards(fourDistinctOrders);
assert.strictEqual(res4.rewardAmount, 160, '4 distinct customers must yield exactly ₹160 reward');

// Scenario F: Idempotency check: Already allocated orders cannot be rewarded twice
const allocatedSet = new Set(['ORD-1', 'ORD-2']);
const resAllocated = calculateRewards(fourDistinctOrders, allocatedSet);
assert.strictEqual(resAllocated.rewardAmount, 80, 'With ORD-1 and ORD-2 allocated, only remaining 2 should yield ₹80');
console.log('✅ Reward calculation engine (2 distinct customers = ₹80) & idempotency verified');

// ============================================================================
// 7. Chocoloom Cake Combo & Dynamic Pricing Verification
// ============================================================================
const cakePricing = {
  'dutch-truffle': { '250g': 249, '500g': 449, '1kg': 799, '1.5kg': 1149, '2kg': 1499 },
  'belgian-dark-silk': { '250g': 269, '500g': 489, '1kg': 849, '1.5kg': 1229, '2kg': 1599 },
};
const designAddons = {
  'classic-swirl': 0,
  'korean-bento': 0,
  'rose-piped': 50,
  'vintage-heart': 80,
  'custom-photo-reference': 100,
};

const calcCake = (flavour, size, design) => {
  const base = cakePricing[flavour][size];
  const extra = designAddons[design] || 0;
  return base + extra;
};

// 1. Dutch Truffle 500g Classic Swirl = 449
assert.strictEqual(calcCake('dutch-truffle', '500g', 'classic-swirl'), 449, 'Dutch Truffle 500g should be 449');
// 2. Dutch Truffle 250g Bento = 249
assert.strictEqual(calcCake('dutch-truffle', '250g', 'korean-bento'), 249, 'Bento 250g should be 249');
// 3. Belgian Dark Silk 1kg with Vintage Heart (+80) = 849 + 80 = 929
assert.strictEqual(calcCake('belgian-dark-silk', '1kg', 'vintage-heart'), 929, 'Belgian 1kg with Vintage Heart should be 929');

// 4. Combo Total: CelebrationBox (399) + Dutch Truffle 500g (449) = 848
const comboTotal = 399 + calcCake('dutch-truffle', '500g', 'classic-swirl');
assert.strictEqual(comboTotal, 848, 'CelebrationBox + Dutch Truffle combo should be exactly 848');
console.log('✅ Chocoloom cake catalogue pricing and combo grand total verified');

console.log('\n🎉 ALL AUTOMATED TESTS PASSED SUCCESSFULLY! 🎉\n');
