import {
  AdminProduct,
  AdminOrder,
  InventoryItem,
  InventoryMovement,
  BusinessSettings,
  OccasionCategory,
  ThemeOption,
} from '../types';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { OCCASION_CATEGORIES } from '../config/categories';
import { AVAILABLE_THEMES, PRODUCTS } from '../config/products';
import { BUSINESS_CONFIG } from '../config/business';

const STORAGE_KEYS = {
  PRODUCTS: 'cb_admin_products_v1',
  ORDERS: 'cb_admin_orders_v1',
  CATEGORIES: 'cb_admin_categories_v1',
  THEMES: 'cb_admin_themes_v1',
  INVENTORY: 'cb_admin_inventory_v1',
  MOVEMENTS: 'cb_admin_movements_v1',
  SETTINGS: 'cb_admin_settings_v1',
};

// Initial Seed Data for Demo/Local mode
const INITIAL_PRODUCTS: AdminProduct[] = [
  {
    id: 'signature-celebration-box',
    slug: 'pastel-rose-celebration-box',
    name: 'Pastel Rose Celebration Box',
    tagline: 'Big Moments. One Little Box.',
    description: 'Everything you need to turn an ordinary space into a beautiful birthday moment.',
    ideal_for: 'Bedroom, living room, and hostel birthday celebrations',
    selling_price: 399.00,
    material_cost: 145.00,
    packaging_cost: 35.00,
    other_variable_cost: 15.00,
    category_id: 'kids-birthday',
    theme_id: 'pastel-rose',
    images: [
      {
        url: '/products/pastel-rose-setup.jpg',
        alt: 'Pastel Rose Celebration Box - Decoration Setup',
        title: 'Decoration Setup',
        caption: 'Pink, lavender and rose-gold balloon garland with Happy Birthday banner',
      },
      {
        url: '/products/pastel-rose-contents.jpg',
        alt: 'Pastel Rose Celebration Box - Package Contents',
        title: "What's Inside the Box",
        caption: 'Exact verified 60-piece kit inventory',
      },
    ],
    contents: [
      { name: 'Pink Latex Balloons', quantity: '26 pcs', pieceCount: 26, specification: '12-inch Natural Latex' },
      { name: 'Lavender Latex Balloons', quantity: '26 pcs', pieceCount: 26, specification: '12-inch Natural Latex' },
      { name: 'Rose Gold Chrome Balloons', quantity: '5 pcs', pieceCount: 5, specification: '12-inch Metallic Chrome' },
      { name: 'Rose Gold Happy Birthday Banner', quantity: '1 pc', pieceCount: 1, specification: 'Pre-strung script banner' },
      { name: 'Balloon Arch Strip', quantity: '1 pc', pieceCount: 1, specification: '5m double-hole transparent strip' },
      { name: 'Glue Dot Roll', quantity: '1 roll', pieceCount: 1, specification: '100 removable wall-safe dots' },
    ],
    exclusions: ['Cake, backdrop curtain, metal arch stand, and balloon pump are not included.'],
    stock_quantity: 45,
    status: 'active',
    total_pieces: 60,
    badge: 'Best Seller',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Pink Latex Balloons (Pack of 100)', category: 'Balloons', quantity_available: 15, unit_cost: 120.00, supplier: 'Gemini Latex Supplies', reorder_level: 5, last_updated: new Date().toISOString() },
  { id: 'inv-2', name: 'Lavender Latex Balloons (Pack of 100)', category: 'Balloons', quantity_available: 12, unit_cost: 120.00, supplier: 'Gemini Latex Supplies', reorder_level: 5, last_updated: new Date().toISOString() },
  { id: 'inv-3', name: 'Rose Gold Chrome Balloons (Pack of 50)', category: 'Balloons', quantity_available: 8, unit_cost: 160.00, supplier: 'Metallic Party Wholesale', reorder_level: 3, last_updated: new Date().toISOString() },
  { id: 'inv-4', name: 'Rose Gold Happy Birthday Banner', category: 'Banners', quantity_available: 45, unit_cost: 38.00, supplier: 'Celebration Print Hub', reorder_level: 10, last_updated: new Date().toISOString() },
  { id: 'inv-5', name: 'Balloon Arch Strip 5m', category: 'Tools & Adhesive', quantity_available: 60, unit_cost: 12.00, supplier: 'Direct Polymer Co', reorder_level: 15, last_updated: new Date().toISOString() },
  { id: 'inv-6', name: 'Wall-Safe Glue Dot Roll (100 dots)', category: 'Tools & Adhesive', quantity_available: 55, unit_cost: 14.00, supplier: 'Adhesive Pro India', reorder_level: 15, last_updated: new Date().toISOString() },
  { id: 'inv-7', name: 'Rigid Craft Shipping Box', category: 'Packaging', quantity_available: 48, unit_cost: 28.00, supplier: 'BoxCraft Hyderabad', reorder_level: 15, last_updated: new Date().toISOString() },
  { id: 'inv-8', name: 'Curling Ribbon 10m Spool', category: 'Tools & Adhesive', quantity_available: 30, unit_cost: 8.00, supplier: 'Decor Ribbon Works', reorder_level: 10, last_updated: new Date().toISOString() },
];

const INITIAL_SETTINGS: BusinessSettings = {
  business_name: BUSINESS_CONFIG.name,
  tagline: BUSINESS_CONFIG.tagline,
  whatsapp_number: BUSINESS_CONFIG.whatsappNumber,
  instagram_url: BUSINESS_CONFIG.instagramUrl,
  contact_email: BUSINESS_CONFIG.email,
  service_location: BUSINESS_CONFIG.campusLocation,
  pickup_instructions: 'Free pickup available at our agreed campus pickup point in Bhimavaram.',
  delivery_info: 'Nearby delivery within 5km of campus with nominal delivery fee.',
  brand_logo_url: '/logo-full.jpg',
  business_description: 'Curated DIY celebration kits packed with high-quality balloons, banners, and wall-safe adhesives.',
};

// Helper to access LocalStorage safely
const getLocalData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalData = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save to ${key}:`, err);
  }
};

// ============================================================================
// PRODUCT MANAGEMENT SERVICE
// ============================================================================

export const getProducts = async (): Promise<AdminProduct[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      return data as AdminProduct[];
    }
    console.warn('Supabase getProducts fallback to local store:', error?.message);
  }
  return getLocalData<AdminProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
};

export const getProductById = async (id: string): Promise<AdminProduct | null> => {
  const products = await getProducts();
  return products.find((p) => p.id === id || p.slug === id) || null;
};

export const createProduct = async (
  product: Omit<AdminProduct, 'created_at' | 'updated_at'>
): Promise<AdminProduct> => {
  const now = new Date().toISOString();
  const newProduct: AdminProduct = {
    ...product,
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single();
    if (!error && data) {
      return data as AdminProduct;
    }
    console.warn('Supabase createProduct fallback to local store:', error?.message);
  }

  const current = getLocalData<AdminProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const updated = [newProduct, ...current];
  setLocalData(STORAGE_KEYS.PRODUCTS, updated);
  return newProduct;
};

export const updateProduct = async (
  id: string,
  updates: Partial<AdminProduct>
): Promise<AdminProduct> => {
  const now = new Date().toISOString();
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      return data as AdminProduct;
    }
    console.warn('Supabase updateProduct fallback to local store:', error?.message);
  }

  const current = getLocalData<AdminProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error('Product not found');
  }
  const updatedProduct = {
    ...current[index],
    ...updates,
    updated_at: now,
  };
  current[index] = updatedProduct;
  setLocalData(STORAGE_KEYS.PRODUCTS, current);
  return updatedProduct;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) return true;
    console.warn('Supabase deleteProduct fallback to local store:', error?.message);
  }

  const current = getLocalData<AdminProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const filtered = current.filter((p) => p.id !== id);
  setLocalData(STORAGE_KEYS.PRODUCTS, filtered);
  return true;
};

export const uploadProductImage = async (file: File): Promise<string> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (!error) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      return data.publicUrl;
    }
    console.warn('Supabase image upload failed, falling back to base64 preview:', error?.message);
  }

  // Fallback to Data URL for instant local previews without cloud storage
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// ============================================================================
// ORDER MANAGEMENT SERVICE
// ============================================================================

export const getOrders = async (): Promise<AdminOrder[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      return data as AdminOrder[];
    }
  }
  return getLocalData<AdminOrder[]>(STORAGE_KEYS.ORDERS, []);
};

export const createOrder = async (
  order: Omit<AdminOrder, 'created_at' | 'updated_at'>
): Promise<AdminOrder> => {
  const now = new Date().toISOString();
  const newOrder: AdminOrder = {
    ...order,
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();
    if (!error && data) {
      return data as AdminOrder;
    }
  }

  const current = getLocalData<AdminOrder[]>(STORAGE_KEYS.ORDERS, []);
  const updated = [newOrder, ...current];
  setLocalData(STORAGE_KEYS.ORDERS, updated);
  return newOrder;
};

export const updateOrder = async (
  id: string,
  updates: Partial<AdminOrder>
): Promise<AdminOrder> => {
  const now = new Date().toISOString();
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('orders')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      return data as AdminOrder;
    }
  }

  const current = getLocalData<AdminOrder[]>(STORAGE_KEYS.ORDERS, []);
  const index = current.findIndex((o) => o.id === id);
  if (index === -1) throw new Error('Order not found');
  const updatedOrder = { ...current[index], ...updates, updated_at: now };
  current[index] = updatedOrder;
  setLocalData(STORAGE_KEYS.ORDERS, current);
  return updatedOrder;
};

export const deleteOrder = async (id: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) return true;
  }
  const current = getLocalData<AdminOrder[]>(STORAGE_KEYS.ORDERS, []);
  setLocalData(
    STORAGE_KEYS.ORDERS,
    current.filter((o) => o.id !== id)
  );
  return true;
};

// ============================================================================
// INVENTORY SERVICE
// ============================================================================

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('name', { ascending: true });
    if (!error && data) {
      return data as InventoryItem[];
    }
  }
  return getLocalData<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
};

export const getInventoryMovements = async (): Promise<InventoryMovement[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('inventory_movements')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      return data as InventoryMovement[];
    }
  }
  return getLocalData<InventoryMovement[]>(STORAGE_KEYS.MOVEMENTS, []);
};

export const addInventoryItem = async (
  item: Omit<InventoryItem, 'id' | 'last_updated'>
): Promise<InventoryItem> => {
  const now = new Date().toISOString();
  const newItem: InventoryItem = {
    ...item,
    id: `inv-${Date.now()}`,
    last_updated: now,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert([newItem])
      .select()
      .single();
    if (!error && data) return data as InventoryItem;
  }

  const current = getLocalData<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
  const updated = [...current, newItem];
  setLocalData(STORAGE_KEYS.INVENTORY, updated);
  return newItem;
};

export const updateInventoryItem = async (
  id: string,
  updates: Partial<InventoryItem>
): Promise<InventoryItem> => {
  const now = new Date().toISOString();
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('inventory_items')
      .update({ ...updates, last_updated: now })
      .eq('id', id)
      .select()
      .single();
    if (!error && data) return data as InventoryItem;
  }

  const current = getLocalData<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
  const idx = current.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error('Item not found');
  const updated = { ...current[idx], ...updates, last_updated: now };
  current[idx] = updated;
  setLocalData(STORAGE_KEYS.INVENTORY, current);
  return updated;
};

export const recordInventoryMovement = async (movement: {
  item_id: string;
  item_name?: string;
  change_quantity: number;
  reason: 'restock' | 'usage' | 'damage' | 'adjustment';
  notes?: string;
}): Promise<InventoryMovement> => {
  const now = new Date().toISOString();
  const newMovement: InventoryMovement = {
    id: `mov-${Date.now()}`,
    ...movement,
    created_at: now,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data } = await supabase
      .from('inventory_movements')
      .insert([newMovement])
      .select()
      .single();
    if (data) return data as InventoryMovement;
  }

  // Local movement update: record log + adjust quantity
  const movements = getLocalData<InventoryMovement[]>(STORAGE_KEYS.MOVEMENTS, []);
  setLocalData(STORAGE_KEYS.MOVEMENTS, [newMovement, ...movements]);

  const items = getLocalData<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
  const idx = items.findIndex((i) => i.id === movement.item_id);
  if (idx !== -1) {
    items[idx].quantity_available = Math.max(
      0,
      items[idx].quantity_available + movement.change_quantity
    );
    items[idx].last_updated = now;
    setLocalData(STORAGE_KEYS.INVENTORY, items);
  }

  return newMovement;
};

// ============================================================================
// CATEGORIES & THEMES SERVICE
// ============================================================================

export const getCategories = async (): Promise<OccasionCategory[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error && data) {
      return data.map((d: any) => ({
        id: d.id,
        slug: d.slug,
        name: d.name,
        tagline: d.tagline || '',
        description: d.description || '',
        image: d.image || '',
        bgColor: d.bg_color || '#FFF8F0',
        isAvailable: Boolean(d.is_available),
        badge: d.badge,
        display_order: d.display_order,
      })) as OccasionCategory[];
    }
  }
  return getLocalData<OccasionCategory[]>(STORAGE_KEYS.CATEGORIES, OCCASION_CATEGORIES);
};

export const updateCategory = async (
  id: string,
  updates: Partial<OccasionCategory>
): Promise<OccasionCategory> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const dbUpdates: any = { ...updates };
    if ('bgColor' in updates) dbUpdates.bg_color = updates.bgColor;
    if ('isAvailable' in updates) dbUpdates.is_available = updates.isAvailable;
    delete dbUpdates.bgColor;
    delete dbUpdates.isAvailable;

    const { data } = await supabase
      .from('categories')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    if (data) return data;
  }

  const current = getLocalData<OccasionCategory[]>(STORAGE_KEYS.CATEGORIES, OCCASION_CATEGORIES);
  const idx = current.findIndex((c) => c.id === id);
  if (idx !== -1) {
    current[idx] = { ...current[idx], ...updates };
    setLocalData(STORAGE_KEYS.CATEGORIES, current);
    return current[idx];
  }
  throw new Error('Category not found');
};

export const getThemes = async (): Promise<ThemeOption[]> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .order('name', { ascending: true });
    if (!error && data) return data as ThemeOption[];
  }
  return getLocalData<ThemeOption[]>(STORAGE_KEYS.THEMES, AVAILABLE_THEMES);
};

export const updateTheme = async (
  id: string,
  updates: Partial<ThemeOption>
): Promise<ThemeOption> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data } = await supabase
      .from('themes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (data) return data as ThemeOption;
  }

  const current = getLocalData<ThemeOption[]>(STORAGE_KEYS.THEMES, AVAILABLE_THEMES);
  const idx = current.findIndex((t) => t.id === id);
  if (idx !== -1) {
    current[idx] = { ...current[idx], ...updates };
    setLocalData(STORAGE_KEYS.THEMES, current);
    return current[idx];
  }
  throw new Error('Theme not found');
};

// ============================================================================
// SETTINGS SERVICE
// ============================================================================

export const getBusinessSettings = async (): Promise<BusinessSettings> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'business_profile')
      .single();
    if (!error && data?.value) {
      return data.value as BusinessSettings;
    }
  }
  return getLocalData<BusinessSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
};

export const updateBusinessSettings = async (
  updates: Partial<BusinessSettings>
): Promise<BusinessSettings> => {
  const current = await getBusinessSettings();
  const updated: BusinessSettings = { ...current, ...updates };

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('settings').upsert({
      key: 'business_profile',
      value: updated,
      is_public: true,
      updated_at: new Date().toISOString(),
    });
  }

  setLocalData(STORAGE_KEYS.SETTINGS, updated);
  return updated;
};
