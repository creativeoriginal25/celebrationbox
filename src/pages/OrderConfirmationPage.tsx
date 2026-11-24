import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Cake,
  Calendar,
  Clock,
  MapPin,
  Building2,
  ArrowRight,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '../utils/currency';
import { Confetti, ConfettiRef } from '../components/react-bits/Confetti';
import { BUSINESS_CONFIG } from '../config/business';

export const OrderConfirmationPage: React.FC = () => {
  const confettiRef = useRef<ConfettiRef>(null);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('celebration_last_order');
      if (stored) {
        setOrderData(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    const timer = setTimeout(() => {
      confettiRef.current?.cannons();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDFB] py-12 sm:py-16 relative overflow-hidden">
      <Confetti
        ref={confettiRef}
        colors={['#E91E63', '#FFB400', '#00A8A8', '#FF80AB', '#B388FF']}
        shapes={['circle', 'rect', 'strip']}
        size={14}
        burst={true}
        burstCount={100}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Order Submitted Successfully</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-brand-ink font-display tracking-tight">
            Thank You for Your Order!
          </h1>

          <p className="text-xs sm:text-sm text-brand-ink-light max-w-md mx-auto leading-relaxed">
            Your celebration order enquiry has been initiated on WhatsApp. Our team has received your details and is preparing your order.
          </p>
        </div>

        {/* Order Details Card */}
        {orderData ? (
          <div className="rounded-3xl bg-white border border-brand-ink/10 shadow-card p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-brand-ink/10 gap-2">
              <div>
                <span className="text-xs text-brand-ink-muted uppercase font-bold tracking-wider block">
                  Order Reference
                </span>
                <span className="text-base sm:text-lg font-mono font-black text-brand-pink">
                  {orderData.orderId || 'CBX-ORDER-CONFIRMED'}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-brand-ink-muted uppercase font-bold tracking-wider block">
                  Total Amount
                </span>
                <span className="text-xl sm:text-2xl font-black text-brand-ink font-display">
                  {formatPrice(orderData.totalAmount || 399)}
                </span>
              </div>
            </div>

            {/* Customer & Fulfilment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-brand-cream-50/70 border border-brand-ink/5 space-y-1">
                <span className="font-bold text-brand-ink block uppercase tracking-wider text-[10px] text-brand-ink-muted">
                  Customer
                </span>
                <p className="font-bold text-brand-ink">{orderData.customerName}</p>
                <p className="text-brand-ink-light font-mono">+91 {orderData.customerPhone}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-brand-cream-50/70 border border-brand-ink/5 space-y-1">
                <span className="font-bold text-brand-ink block uppercase tracking-wider text-[10px] text-brand-ink-muted">
                  Fulfilment
                </span>
                <p className="font-bold text-brand-ink">
                  {orderData.deliveryMethod === 'pickup' ? 'Campus Gate Pickup' : 'Nearby Delivery'}
                </p>
                <p className="text-brand-ink-light">
                  {orderData.deliveryMethod === 'pickup'
                    ? 'SRKR Engineering College Gate, Bhimavaram'
                    : orderData.deliveryAddress || 'Bhimavaram'}
                </p>
              </div>
            </div>

            {/* Products In Order */}
            {orderData.items && orderData.items.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                  Items In Your Order
                </h4>
                <div className="space-y-2">
                  {orderData.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#FFFDFB] border border-brand-ink/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-brand-ink block">{item.name}</span>
                        {item.cakeDetails && (
                          <span className="text-[11px] text-brand-pink font-semibold block">
                            Cake: {item.cakeDetails.flavourName} ({item.cakeDetails.size}) • {item.cakeDetails.dietType === 'eggless' ? 'Eggless' : 'Egg'}
                          </span>
                        )}
                        <span className="text-[10px] text-brand-ink-muted">Qty: {item.quantity || 1}</span>
                      </div>
                      <span className="font-extrabold text-brand-ink">
                        {formatPrice((item.price || 399) * (item.quantity || 1))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps Guide */}
            <div className="pt-4 border-t border-brand-ink/10 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-ink">
                What Happens Next?
              </h4>
              <ol className="list-decimal pl-4 space-y-1.5 text-xs text-brand-ink-light leading-relaxed">
                <li>
                  <strong>WhatsApp Order Chat:</strong> Your order message was delivered to our team on WhatsApp ({BUSINESS_CONFIG.whatsappNumber}).
                </li>
                <li>
                  <strong>Preparation &amp; Baking:</strong> Your celebration kit and fresh Chocoloom cake will be prepared for your requested date.
                </li>
                <li>
                  <strong>Pickup / Delivery:</strong> We will notify you on WhatsApp when your package is ready for handover!
                </li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-brand-ink/10 text-center space-y-2">
            <p className="text-xs sm:text-sm text-brand-ink-light">
              Your order message has been dispatched to WhatsApp. Please follow the instructions in your WhatsApp chat to complete confirmation.
            </p>
          </div>
        )}

        {/* Action Button: Continue Shopping */}
        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-pink hover:bg-brand-pink-hover text-white text-xs sm:text-sm font-extrabold shadow-card transition-all cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
