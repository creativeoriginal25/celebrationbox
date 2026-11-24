import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  Clock,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  Package,
  Cake,
  AlertCircle,
  Loader2,
  User,
  Phone,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import { CHECKOUT_CONFIG } from '../components/checkout/checkoutConfig';
import { ReferralCodeInput } from '../components/checkout/ReferralCodeInput';
import { formatOrderWhatsAppMessage, buildWhatsAppUrl } from '../components/checkout/formatWhatsAppMessage';
import { triggerWhatsAppChat } from '../services/whatsappService';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();

  // If cart is empty, redirect to cart page
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-pink-50 text-brand-pink flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-brand-ink font-display">Your cart is empty</h2>
        <p className="text-xs sm:text-sm text-brand-ink-light max-w-sm">
          Please add a celebration box or cake to your cart before proceeding to checkout.
        </p>
        <Link
          to="/celebration-boxes"
          className="px-6 py-3 rounded-xl bg-brand-pink text-white font-bold text-xs sm:text-sm shadow-card"
        >
          Explore Celebration Boxes
        </Link>
      </div>
    );
  }

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [celebrationDate, setCelebrationDate] = useState('');
  const [preferredTime, setPreferredTime] = useState(CHECKOUT_CONFIG.timeSlots[2] || 'Evening (4:00 PM - 7:00 PM)');
  const [personalMessage, setPersonalMessage] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const todayString = new Date().toISOString().split('T')[0];

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validation
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit WhatsApp phone number.');
      return;
    }

    if (deliveryMethod === 'delivery' && (!deliveryAddress.trim() || deliveryAddress.trim().length < 5)) {
      setErrorMessage('Please enter your complete delivery address and room/landmark.');
      return;
    }

    setIsSubmitting(true);

    const serverOrderId = `CBX-ORD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Optional: send to backend durable storage / Google Sheet
    try {
      await fetch('/api/referral/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: cleanPhone,
          deliveryMethod,
          deliveryAddress: deliveryAddress.trim(),
          celebrationDate,
          preferredTime,
          personalMessage: personalMessage.trim(),
          referralCode: referralCode.trim() || undefined,
          cartItems: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: subtotal,
        }),
      });
    } catch {
      // offline fallback
    }

    // Build official WhatsApp message
    const formattedMessage = formatOrderWhatsAppMessage({
      productName: items[0].name,
      quantity: items[0].quantity,
      unitPrice: items[0].price,
      total: subtotal,
      customerName: customerName.trim(),
      customerPhone: cleanPhone,
      fulfilment: deliveryMethod,
      deliveryAddress: deliveryAddress.trim() || undefined,
      personalMessage: personalMessage.trim() || undefined,
      celebrationDate: celebrationDate || undefined,
      preferredTime: preferredTime || undefined,
      orderId: serverOrderId,
      referralCode: referralCode.trim() || undefined,
      cartItems: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
    });

    const waUrl = buildWhatsAppUrl(formattedMessage, CHECKOUT_CONFIG.whatsappNumber);

    // Save order data for order-confirmation page
    const orderConfirmationData = {
      orderId: serverOrderId,
      customerName: customerName.trim(),
      customerPhone: cleanPhone,
      deliveryMethod,
      deliveryAddress: deliveryAddress.trim(),
      celebrationDate,
      preferredTime,
      totalAmount: subtotal,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        isCombo: item.isCombo,
        cakeDetails: item.cakeDetails,
      })),
    };

    try {
      localStorage.setItem('celebration_last_order', JSON.stringify(orderConfirmationData));
    } catch {
      // ignore
    }

    // Clear cart
    clearCart();

    // Trigger WhatsApp deep link
    triggerWhatsAppChat(waUrl);

    // Navigate to /order-confirmation
    navigate('/order-confirmation');
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB]">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-brand-ink/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs text-brand-ink-muted">
            <Link to="/" className="hover:text-brand-pink font-semibold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
            <Link to="/cart" className="hover:text-brand-pink font-semibold transition-colors">
              Cart
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-ink/20" />
            <span className="text-brand-ink font-bold">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-ink font-display">
            Complete Your Order
          </h1>
          <p className="text-xs sm:text-sm text-brand-ink-muted mt-1">
            Please enter your delivery details. Your order will be confirmed with our team on WhatsApp.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-800 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Contact Details */}
            <div className="p-6 rounded-3xl bg-white border border-brand-ink/10 shadow-xs space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-brand-ink flex items-center gap-2">
                <User className="w-4 h-4 text-brand-pink" />
                <span>1. Customer Details</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-brand-ink mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-ink/15 text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-ink mb-1">
                    WhatsApp Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-bold text-brand-ink-muted font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-brand-ink/15 text-sm font-mono text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink"
                    />
                  </div>
                  <span className="text-[10px] text-brand-ink-muted mt-1 block">
                    We will send pickup details and order updates to this WhatsApp number.
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2: Fulfilment Method */}
            <div className="p-6 rounded-3xl bg-white border border-brand-ink/10 shadow-xs space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-brand-ink flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-teal" />
                <span>2. Fulfilment Preference</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Campus Pickup */}
                <div
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                    deliveryMethod === 'pickup'
                      ? 'border-brand-teal bg-[#F0FDF4] shadow-xs'
                      : 'border-brand-ink/10 bg-white hover:border-brand-ink/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-brand-ink">Campus Gate Pickup</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        FREE
                      </span>
                    </div>
                    <p className="text-xs text-brand-ink-muted">
                      Pick up directly at SRKR Engineering College Gate, Bhimavaram.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-brand-teal mt-3">
                    {deliveryMethod === 'pickup' ? '✓ Selected' : 'Select Pickup'}
                  </span>
                </div>

                {/* Option 2: Nearby Delivery */}
                <div
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                    deliveryMethod === 'delivery'
                      ? 'border-brand-pink bg-pink-50/50 shadow-xs'
                      : 'border-brand-ink/10 bg-white hover:border-brand-ink/20'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-brand-ink">Nearby Delivery</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        Bhimavaram
                      </span>
                    </div>
                    <p className="text-xs text-brand-ink-muted">
                      Delivery to hostel, apartment or room in Bhimavaram.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-brand-pink mt-3">
                    {deliveryMethod === 'delivery' ? '✓ Selected' : 'Select Delivery'}
                  </span>
                </div>
              </div>

              {/* Delivery Address (If delivery selected) */}
              {deliveryMethod === 'delivery' && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-brand-ink mb-1">
                    Delivery Address &amp; Room / Landmark <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Boys Hostel 2, Room 304, Near SRKR College, Bhimavaram"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-ink/15 text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink"
                  />
                </div>
              )}
            </div>

            {/* Step 3: Celebration Timing & Special Instructions */}
            <div className="p-6 rounded-3xl bg-white border border-brand-ink/10 shadow-xs space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-brand-ink flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>3. Celebration Date &amp; Time</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-ink mb-1">
                    Celebration Date <span className="text-brand-ink-muted font-normal">(optional)</span>
                  </label>
                  <input
                    type="date"
                    min={todayString}
                    value={celebrationDate}
                    onChange={(e) => setCelebrationDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-ink/15 text-xs sm:text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-ink mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-ink/15 text-xs sm:text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink cursor-pointer"
                  >
                    {CHECKOUT_CONFIG.timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  Additional Instructions / Card Message <span className="text-brand-ink-muted font-normal">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  maxLength={200}
                  placeholder="e.g. Please include extra candles or handle carefully upon arrival."
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-ink/15 text-xs sm:text-sm text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-pink/25 focus:border-brand-pink"
                />
              </div>

              {/* Referral Code */}
              <div className="pt-2">
                <ReferralCodeInput
                  referralCode={referralCode}
                  onSetCode={(code) => setReferralCode(code)}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Order Summary & Submit Action */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-white border border-brand-ink/10 shadow-card space-y-5 sticky top-24">
              <h3 className="text-base font-black uppercase tracking-wider text-brand-ink font-display border-b border-brand-ink/10 pb-3">
                Items in Order ({items.length})
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between text-xs gap-3">
                    <div className="min-w-0">
                      <span className="font-bold text-brand-ink block truncate">{item.name}</span>
                      <span className="text-brand-ink-muted text-[11px]">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </span>
                    </div>
                    <span className="font-extrabold text-brand-ink shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-brand-ink/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-brand-ink-light">Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-brand-ink-light">Fulfilment</span>
                  <span className="font-bold text-emerald-700">
                    {deliveryMethod === 'pickup' ? 'Campus Pickup (FREE)' : 'Delivery (Charges on WA)'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-ink/10 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-black text-brand-ink block">Grand Total</span>
                  <span className="text-[10px] text-brand-ink-muted">Confirmed on WhatsApp</span>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-brand-pink font-display">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm sm:text-base shadow-card hover:shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    <span>Confirm &amp; Order on WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-950 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  No online payment gateway needed. Payment is verified smoothly via UPI upon WhatsApp order confirmation.
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
