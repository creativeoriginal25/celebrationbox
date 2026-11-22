import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Phone,
  Calendar,
  MapPin,
  IndianRupee,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { AdminOrder, AdminProduct, OrderStatus, PaymentStatus, DeliveryMethod } from '../../types';
import { formatPrice } from '../../utils/currency';
import { createOrder, updateOrder, deleteOrder } from '../../services/adminService';

interface AdminOrdersProps {
  orders: AdminOrder[];
  products: AdminProduct[];
  onRefresh: () => void;
  isInitialCreateOpen?: boolean;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  products,
  onRefresh,
  isInitialCreateOpen = false,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(isInitialCreateOpen);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Form State for Manual Order Entry
  const [manualOrder, setManualOrder] = useState<{
    customer_name: string;
    customer_phone: string;
    product_id: string;
    quantity: number;
    theme: string;
    celebration_date: string;
    preferred_time: string;
    delivery_method: DeliveryMethod;
    delivery_address: string;
    delivery_charge: number;
    order_status: OrderStatus;
    payment_status: PaymentStatus;
    internal_notes: string;
  }>({
    customer_name: '',
    customer_phone: '',
    product_id: products[0]?.id || 'signature-celebration-box',
    quantity: 1,
    theme: 'Pink × Lavender × Rose Gold',
    celebration_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferred_time: 'Evening (4:00 PM - 7:00 PM)',
    delivery_method: 'pickup',
    delivery_address: '',
    delivery_charge: 0,
    order_status: 'confirmed',
    payment_status: 'pending_verification',
    internal_notes: 'WhatsApp customer order placed directly.',
  });

  const selectedProduct = products.find((p) => p.id === manualOrder.product_id) || products[0];

  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualOrder.customer_name.trim() || !manualOrder.customer_phone.trim()) {
      alert('Please fill customer name and phone number.');
      return;
    }

    const price = selectedProduct ? selectedProduct.selling_price : 399;
    const total = price * manualOrder.quantity + Number(manualOrder.delivery_charge || 0);
    const orderId = `CB-${Date.now().toString().slice(-6)}`;

    try {
      await createOrder({
        id: orderId,
        customer_name: manualOrder.customer_name.trim(),
        customer_phone: manualOrder.customer_phone.trim(),
        product_id: selectedProduct?.id || 'signature-celebration-box',
        product_name: selectedProduct?.name || 'Pastel Rose Celebration Box',
        product_price: price,
        quantity: manualOrder.quantity,
        theme: manualOrder.theme,
        celebration_date: manualOrder.celebration_date,
        preferred_time: manualOrder.preferred_time,
        delivery_method: manualOrder.delivery_method,
        delivery_address:
          manualOrder.delivery_method === 'delivery' ? manualOrder.delivery_address : undefined,
        delivery_charge: Number(manualOrder.delivery_charge || 0),
        total_amount: total,
        order_status: manualOrder.order_status,
        payment_status: manualOrder.payment_status,
        internal_notes: manualOrder.internal_notes,
      });

      setIsCreateModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err?.message || 'Failed to create order');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, updates: Partial<AdminOrder>) => {
    try {
      await updateOrder(orderId, updates);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, ...updates } : null));
      }
      onRefresh();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
      await deleteOrder(orderId);
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
      onRefresh();
    }
  };

  // Filtered Orders List
  const filteredOrders = orders.filter((o) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(query) ||
      o.customer_name.toLowerCase().includes(query) ||
      o.customer_phone.toLowerCase().includes(query) ||
      o.product_name.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || o.order_status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || o.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-ink tracking-tight font-display">
            Order Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log and manage confirmed orders, delivery schedules, and payment verification.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Customer Order</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order ID, customer, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-pink"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="all">All Order Statuses</option>
            <option value="new">New</option>
            <option value="confirmed">Confirmed</option>
            <option value="packing">Packing</option>
            <option value="ready_for_pickup">Ready for Pickup</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700"
          >
            <option value="all">All Payment Statuses</option>
            <option value="unpaid">Unpaid</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product & Qty</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Celebration Date</th>
                <th className="py-3 px-4">Fulfilment</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 space-y-2">
                    <p className="font-semibold">No orders found.</p>
                    <p className="text-[11px] text-slate-400">
                      When customers message on WhatsApp to confirm an order, log it here to track packing and delivery.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {order.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{order.customer_name}</div>
                      <a
                        href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-brand-teal hover:underline inline-flex items-center gap-1 font-mono"
                      >
                        <Phone className="w-2.5 h-2.5" />
                        <span>{order.customer_phone}</span>
                      </a>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{order.product_name}</span>
                      <span className="text-[11px] text-slate-400 block">
                        Qty: {order.quantity} • {order.theme || 'Default Theme'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">
                        {formatPrice(order.total_amount)}
                      </span>
                      {Number(order.delivery_charge || 0) > 0 && (
                        <span className="text-[10px] text-slate-400 block">
                          (+₹{order.delivery_charge} del)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-slate-700 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.celebration_date || 'Not specified'}</span>
                      </div>
                      {order.preferred_time && (
                        <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                          {order.preferred_time}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          order.delivery_method === 'pickup'
                            ? 'bg-teal-50 text-brand-teal border border-teal-100'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}
                      >
                        {order.delivery_method === 'pickup' ? 'Campus Pickup' : 'Delivery'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.payment_status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : order.payment_status === 'pending_verification'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : order.payment_status === 'refunded'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {order.payment_status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={order.order_status}
                        onChange={(e) =>
                          handleUpdateOrderStatus(order.id, {
                            order_status: e.target.value as OrderStatus,
                          })
                        }
                        className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-bold bg-white text-slate-800 cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packing">Packing</option>
                        <option value="ready_for_pickup">Ready for Pickup</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-slate-400 hover:text-brand-pink rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete order record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MANUAL ORDER CREATION MODAL                                    */}
      {/* ============================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl my-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-base font-extrabold text-brand-ink font-display">
                Record WhatsApp / Customer Order
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Customer Name <span className="text-brand-pink">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={manualOrder.customer_name}
                    onChange={(e) =>
                      setManualOrder({ ...manualOrder, customer_name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    WhatsApp Mobile Number <span className="text-brand-pink">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={manualOrder.customer_phone}
                    onChange={(e) =>
                      setManualOrder({ ...manualOrder, customer_phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Product</label>
                  <select
                    value={manualOrder.product_id}
                    onChange={(e) =>
                      setManualOrder({ ...manualOrder, product_id: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({formatPrice(p.selling_price)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={manualOrder.quantity}
                    onChange={(e) =>
                      setManualOrder({ ...manualOrder, quantity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Celebration Date</label>
                  <input
                    type="date"
                    value={manualOrder.celebration_date}
                    onChange={(e) =>
                      setManualOrder({ ...manualOrder, celebration_date: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fulfilment</label>
                  <select
                    value={manualOrder.delivery_method}
                    onChange={(e) =>
                      setManualOrder({
                        ...manualOrder,
                        delivery_method: e.target.value as DeliveryMethod,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="pickup">College Campus Pickup (Free)</option>
                    <option value="delivery">Nearby Delivery</option>
                  </select>
                </div>
              </div>

              {manualOrder.delivery_method === 'delivery' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      placeholder="Room number, hostel, or street address"
                      value={manualOrder.delivery_address}
                      onChange={(e) =>
                        setManualOrder({ ...manualOrder, delivery_address: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Delivery Fee (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={manualOrder.delivery_charge}
                      onChange={(e) =>
                        setManualOrder({
                          ...manualOrder,
                          delivery_charge: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={manualOrder.payment_status}
                    onChange={(e) =>
                      setManualOrder({
                        ...manualOrder,
                        payment_status: e.target.value as PaymentStatus,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="pending_verification">Pending Verification</option>
                    <option value="paid">Paid (Counts in Revenue)</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Order Status</label>
                  <select
                    value={manualOrder.order_status}
                    onChange={(e) =>
                      setManualOrder({
                        ...manualOrder,
                        order_status: e.target.value as OrderStatus,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                  >
                    <option value="new">New</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="packing">Packing</option>
                    <option value="ready_for_pickup">Ready for Pickup</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Internal Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes on customer requests, payment confirmation, or packaging instructions."
                  value={manualOrder.internal_notes}
                  onChange={(e) =>
                    setManualOrder({ ...manualOrder, internal_notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Total Calculated:</span>
                  <span className="text-base font-black text-brand-pink">
                    {formatPrice(
                      (selectedProduct ? selectedProduct.selling_price : 399) *
                        manualOrder.quantity +
                        Number(manualOrder.delivery_charge || 0)
                    )}
                  </span>
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white font-bold shadow-xs cursor-pointer"
                  >
                    Save Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* ORDER DETAILS & STATUS UPDATE MODAL                            */}
      {/* ============================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase">Order Details</span>
                <h2 className="text-base font-black text-brand-ink font-mono">
                  {selectedOrder.id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-sm">{selectedOrder.customer_name}</span>
                  <a
                    href={`https://wa.me/${selectedOrder.customer_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100 inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Open WhatsApp</span>
                  </a>
                </div>
                <p className="text-slate-500 font-mono">{selectedOrder.customer_phone}</p>
                {selectedOrder.delivery_address && (
                  <div className="flex items-start gap-1.5 pt-1 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{selectedOrder.delivery_address}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Order Status
                  </span>
                  <select
                    value={selectedOrder.order_status}
                    onChange={(e) =>
                      handleUpdateOrderStatus(selectedOrder.id, {
                        order_status: e.target.value as OrderStatus,
                      })
                    }
                    className="w-full font-bold text-slate-800 text-xs bg-transparent"
                  >
                    <option value="new">New</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="packing">Packing</option>
                    <option value="ready_for_pickup">Ready for Pickup</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Payment Status
                  </span>
                  <select
                    value={selectedOrder.payment_status}
                    onChange={(e) =>
                      handleUpdateOrderStatus(selectedOrder.id, {
                        payment_status: e.target.value as PaymentStatus,
                      })
                    }
                    className="w-full font-bold text-slate-800 text-xs bg-transparent"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="pending_verification">Pending Verification</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Product:</span>
                  <span className="font-bold text-slate-800">{selectedOrder.product_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quantity:</span>
                  <span className="font-bold text-slate-800">{selectedOrder.quantity} kit(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Fee:</span>
                  <span className="font-bold text-slate-800">
                    {formatPrice(selectedOrder.delivery_charge || 0)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 font-extrabold text-brand-pink text-sm">
                  <span>Total Amount:</span>
                  <span>{formatPrice(selectedOrder.total_amount)}</span>
                </div>
              </div>

              {selectedOrder.internal_notes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs">
                  <span className="font-bold text-slate-700 block mb-0.5">Internal Notes:</span>
                  {selectedOrder.internal_notes}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
