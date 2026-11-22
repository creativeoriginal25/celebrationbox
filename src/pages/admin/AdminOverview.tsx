import React from 'react';
import {
  ShoppingBag,
  IndianRupee,
  Package,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Phone,
} from 'lucide-react';
import { AdminProduct, AdminOrder, InventoryItem } from '../../types';
import { formatPrice } from '../../utils/currency';

interface AdminOverviewProps {
  products: AdminProduct[];
  orders: AdminOrder[];
  inventory: InventoryItem[];
  onNavigateTab: (tab: string) => void;
  onOpenAddProduct: () => void;
  onOpenCreateOrder: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  products,
  orders,
  inventory,
  onNavigateTab,
  onOpenAddProduct,
  onOpenCreateOrder,
}) => {
  // Metric 1: Total Orders
  const totalOrdersCount = orders.length;

  // Metric 2: Revenue from verified paid orders
  const verifiedPaidRevenue = orders
    .filter((o) => o.payment_status === 'paid')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  // Metric 3: Active Products
  const activeProductsCount = products.filter((p) => p.status === 'active').length;

  // Metric 4: Pending Orders (New, Confirmed, or Packing)
  const pendingOrdersCount = orders.filter((o) =>
    ['new', 'confirmed', 'packing'].includes(o.order_status)
  ).length;

  // Low-Stock items (quantity <= reorder_level)
  const lowStockItems = inventory.filter((i) => i.quantity_available <= i.reorder_level);

  // Recent 5 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-ink tracking-tight font-display">
            Business Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time verified metrics, active orders, and material inventory.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddProduct}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          <button
            onClick={onOpenCreateOrder}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-brand-teal" />
            <span>Record Order</span>
          </button>
        </div>
      </div>

      {/* 4 PRIMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-brand-ink">
              {totalOrdersCount}
            </span>
            <span className="text-[11px] text-slate-400">all time</span>
          </div>
        </div>

        {/* Metric 2: Verified Paid Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Paid Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-brand-teal flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-brand-teal">
              {formatPrice(verifiedPaidRevenue)}
            </span>
            <span className="text-[11px] text-slate-400">verified paid</span>
          </div>
        </div>

        {/* Metric 3: Active Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Products
            </span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-brand-pink flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-brand-ink">
              {activeProductsCount}
            </span>
            <span className="text-[11px] text-slate-400">in store</span>
          </div>
        </div>

        {/* Metric 4: Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-600">
              {pendingOrdersCount}
            </span>
            <span className="text-[11px] text-slate-400">needs packing/delivery</span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: RECENT ORDERS & LOW-STOCK MATERIALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-brand-ink">Recent Customer Orders</h2>
              <p className="text-xs text-slate-500">Orders placed by customers or entered manually</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-brand-pink hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                No orders recorded yet. WhatsApp order inquiries can be entered as confirmed orders anytime.
              </p>
              <button
                onClick={onOpenCreateOrder}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record WhatsApp Order</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-2">
                    <th className="pb-2.5">Order</th>
                    <th className="pb-2.5">Customer</th>
                    <th className="pb-2.5">Product</th>
                    <th className="pb-2.5">Amount</th>
                    <th className="pb-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-700">{order.id}</td>
                      <td className="py-3">
                        <div className="font-bold text-slate-800">{order.customer_name}</div>
                        <div className="text-[11px] text-slate-400">{order.customer_phone}</div>
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-slate-700">{order.product_name}</span>
                        <span className="text-[11px] text-slate-400 block">Qty: {order.quantity}</span>
                      </td>
                      <td className="py-3 font-bold text-slate-800">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.order_status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : order.order_status === 'cancelled'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {order.order_status.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-base font-extrabold text-brand-ink">Stock Alerts</h2>
            </div>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs font-bold text-brand-pink hover:underline cursor-pointer"
            >
              Manage
            </button>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-emerald-800 space-y-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
              <p className="text-xs font-bold">All Materials Healthy</p>
              <p className="text-[11px] text-emerald-700">
                All raw decoration materials and packaging are above reorder thresholds.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Category: {item.category} • Min: {item.reorder_level}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-rose-600 text-sm block">
                      {item.quantity_available} left
                    </span>
                    <button
                      onClick={() => onNavigateTab('inventory')}
                      className="text-[10px] font-bold text-brand-teal hover:underline cursor-pointer"
                    >
                      Restock →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
