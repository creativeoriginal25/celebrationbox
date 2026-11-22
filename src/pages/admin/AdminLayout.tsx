import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Boxes,
  TrendingUp,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminCategoriesThemes } from './AdminCategoriesThemes';
import { AdminOrders } from './AdminOrders';
import { AdminInventory } from './AdminInventory';
import { AdminPricingMargins } from './AdminPricingMargins';
import { AdminSettings } from './AdminSettings';
import {
  getProducts,
  getCategories,
  getThemes,
  getOrders,
  getInventoryItems,
  getInventoryMovements,
  getBusinessSettings,
} from '../../services/adminService';
import {
  AdminProduct,
  OccasionCategory,
  ThemeOption,
  AdminOrder,
  InventoryItem,
  InventoryMovement,
  BusinessSettings,
} from '../../types';

interface AdminLayoutProps {
  onNavigateHome: () => void;
  initialTab?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onNavigateHome,
  initialTab = 'overview',
}) => {
  const { user, signOut, isConfigured } = useAdminAuth();
  const [currentTab, setCurrentTab] = useState<string>(initialTab);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // App Data States
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<OccasionCategory[]>([]);
  const [themes, setThemes] = useState<ThemeOption[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>({
    business_name: 'Celebration Box',
    tagline: 'Big Moments. One Little Box.',
    whatsapp_number: '919100280705',
    instagram_url: 'https://instagram.com/celebrationbox.in',
    contact_email: 'hello@celebrationbox.in',
    service_location: 'Bhimavaram, Andhra Pradesh',
    pickup_instructions: 'Free campus pickup in Bhimavaram.',
    delivery_info: 'Nearby delivery with nominal fee.',
    brand_logo_url: '/logo-full.jpg',
    business_description: 'Curated DIY celebration kits.',
  });

  // Load all initial admin data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prods, cats, thms, ords, inv, movs, stgs] = await Promise.all([
        getProducts(),
        getCategories(),
        getThemes(),
        getOrders(),
        getInventoryItems(),
        getInventoryMovements(),
        getBusinessSettings(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setThemes(thms);
      setOrders(ords);
      setInventory(inv);
      setMovements(movs);
      setSettings(stgs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync route / tab changes to browser URL hash so refreshing or deep linking works
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#/admin/') || hash.startsWith('#admin/')) {
        const tab = hash.replace(/^#\/?admin\/?/, '');
        if (tab && ['overview', 'products', 'categories', 'orders', 'inventory', 'pricing', 'settings'].includes(tab)) {
          setCurrentTab(tab);
        }
      }
    }
  }, []);

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    setIsMobileDrawerOpen(false);
    window.location.hash = `/admin/${tabId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nav Items Definition
  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, badge: products.length },
    { id: 'categories', label: 'Categories & Themes', icon: Layers },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.filter(o => o.order_status === 'new').length || undefined },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'pricing', label: 'Pricing & Margins', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row antialiased">
      {/* ============================================================== */}
      {/* DESKTOP SIDEBAR                                                */}
      {/* ============================================================== */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 shrink-0 sticky top-0 h-screen select-none">
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-pink text-white flex items-center justify-center font-black shadow-xs text-xs">
              CB
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-brand-ink leading-tight font-display">
                Celebration Box
              </h2>
              <span className="text-[10px] font-bold tracking-wider uppercase text-brand-pink">
                Admin Panel
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-pink text-white shadow-xs'
                    : 'text-slate-600 hover:text-brand-ink hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer with Live Store link & User Profile */}
        <div className="p-3.5 border-t border-slate-100 space-y-2">
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-brand-teal hover:bg-teal-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Store</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-teal-400" />
          </button>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-[11px] font-bold text-slate-800 block truncate">
                {user?.email || 'Admin'}
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                {isConfigured ? 'Supabase Live' : 'Sandbox Mode'}
              </span>
            </div>
            <button
              onClick={() => signOut()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* MOBILE HEADER & DRAWER                                         */}
      {/* ============================================================== */}
      <div className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-pink text-white flex items-center justify-center font-black text-xs">
              CB
            </div>
            <span className="font-extrabold text-sm text-brand-ink">Admin Panel</span>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1"
        >
          <span>Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-brand-ink/50 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full shadow-2xl flex flex-col p-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-extrabold text-brand-ink text-sm">Navigation</span>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 rounded text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-pink text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => signOut()}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileDrawerOpen(false)} />
        </div>
      )}

      {/* ============================================================== */}
      {/* MAIN ADMIN WORKSPACE                                           */}
      {/* ============================================================== */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 text-xs font-semibold animate-pulse">
            Loading business records...
          </div>
        ) : (
          <>
            {currentTab === 'overview' && (
              <AdminOverview
                products={products}
                orders={orders}
                inventory={inventory}
                onNavigateTab={handleSelectTab}
                onOpenAddProduct={() => handleSelectTab('products')}
                onOpenCreateOrder={() => handleSelectTab('orders')}
              />
            )}

            {currentTab === 'products' && (
              <AdminProducts
                products={products}
                categories={categories}
                themes={themes}
                onRefresh={loadData}
              />
            )}

            {currentTab === 'categories' && (
              <AdminCategoriesThemes
                categories={categories}
                themes={themes}
                onRefresh={loadData}
              />
            )}

            {currentTab === 'orders' && (
              <AdminOrders
                orders={orders}
                products={products}
                onRefresh={loadData}
              />
            )}

            {currentTab === 'inventory' && (
              <AdminInventory
                inventory={inventory}
                movements={movements}
                onRefresh={loadData}
              />
            )}

            {currentTab === 'pricing' && (
              <AdminPricingMargins
                products={products}
                onRefresh={loadData}
              />
            )}

            {currentTab === 'settings' && (
              <AdminSettings
                settings={settings}
                onRefresh={loadData}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};
