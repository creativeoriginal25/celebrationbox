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
import { AVAILABLE_THEMES } from '../config/products';
import { BUSINESS_CONFIG } from '../config/business';

const STORAGE_KEYS = {
  PRODUCTS: 'cb_admin_products_v2',
  ORDERS: 'cb_admin_orders_v2',
  CATEGORIES: 'cb_admin_categories_v2',
  THEMES: 'cb_admin_themes_v2',
  INVENTORY: 'cb_admin_inventory_v2',
  MOVEMENTS: 'cb_admin_movements_v2',
  SETTINGS: 'cb_admin_settings_v2',
};

// Initial Verified Seed Product: Pastel Rose Celebration Box (₹399, 56 balloons)
const INITIAL_PRODUCTS: AdminProduct[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    slug: 'pastel-rose-celebration-box',
    name: 'Pastel Rose Celebration Box',
    tagline: 'Big Moments. One Little Box.',
    description:
      'Create a beautiful birthday corner with our Pastel Rose Celebration Box. A thoughtfully curated combination of baby pink, lavender, and metallic copper balloons, complemented by a shimmering foil backdrop and a Happy Birthday banner. Everything is packed together to make decorating easier.',
    ideal_for: 'Bedroom, living room, and hostel birthday celebrations',
    selling_price: 399.00,
    material_cost: 110.00,
    packaging_cost: 30.00,
    other_variable_cost: 10.00,
    category_id: 'kids-birthday',
    theme_id: 'pastel-rose',
    images: [
      {
        url: '/products/pastel-rose-setup.jpg',
        alt: 'Pastel Rose Celebration Box - Birthday setup preview',
        title: 'Decoration Setup',
        caption: 'Styling inspiration. Cake, table and additional props are not included. Decorative lighting is available separately on rent.',
      },
      {
        url: '/products/pastel-rose-contents.jpg',
        alt: 'Pastel Rose Celebration Box - Package Contents',
        title: "What's Inside the Box",
        caption: 'Actual kit contents • 56 Balloons (20 Pink, 20 Lavender, 16 Copper), Gold Banner, Foil Backdrop, Tape & Candles',
      },
    ],
    contents: [
      { name: 'Baby Pink Latex Balloons', quantity: '20 pcs', pieceCount: 20, specification: '10-inch Natural Latex' },
      { name: 'Lavender Latex Balloons', quantity: '20 pcs', pieceCount: 20, specification: '10-inch Natural Latex' },
      { name: 'Metallic Copper Balloons', quantity: '16 pcs', pieceCount: 16, specification: '10-inch Metallic Copper' },
      { name: 'Gold Glitter Happy Birthday Letter Banner', quantity: '1 pc', pieceCount: 1, specification: 'Script letter banner with thread' },
      { name: 'Lavender-Pink Metallic Foil Fringe Backdrop', quantity: '1 pc', pieceCount: 1, specification: 'Tinsel foil fringe curtain' },
      { name: 'Birthday Candles', quantity: '2 pcs', pieceCount: 2, specification: 'Celebration birthday candles' },
      { name: 'Double-Sided Foam Tape', quantity: 'Included', pieceCount: 1, specification: 'Mounting wall-safe foam tape' },
    ],
    exclusions: [
      'Cake, table, gift boxes, flowers, and props are styling inspiration only and not included.',
      'Decorative lighting string is available separately on rent.',
      'Balloon pump is not included.',
    ],
    stock_quantity: 50,
    status: 'published' as any,
    total_pieces: 56,
    badge: 'Official Birthday Kit',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'inv-1', name: 'Baby Pink Latex Balloons (Pack of 100)', category: 'Balloons', quantity_available: 20, unit_cost: 120.00, supplier: 'Gemini Latex Supplies', reorder_level: 5, last_updated: new Date().toISOString() },
  { id: 'inv-2', name: 'Lavender Latex Balloons (Pack of 100)', category: 'Balloons', quantity_available: 20, unit_cost: 120.00, supplier: 'Gemini Latex Supplies', reorder_level: 5, last_updated: new Date().toISOString() },
  { id: 'inv-3', name: 'Metallic Copper Balloons (Pack of 50)', category: 'Balloons', quantity_available: 16, unit_cost: 160.00, supplier: 'Metallic Party Wholesale', reorder_level: 3, last_updated: new Date().toISOString() },
  { id: 'inv-4', name: 'Gold Glitter Happy Birthday Letter Banner', category: 'Banners', quantity_available: 45, unit_cost: 38.00, supplier: 'Celebration Print Hub', reorder_level: 10, last_updated: new Date().toISOString() },
  { id: 'inv-5', name: 'Lavender-Pink Metallic Foil Fringe Backdrop', category: 'Backdrops', quantity_available: 30, unit_cost: 55.00, supplier: 'Shimmer Decor Hub', reorder_level: 10, last_updated: new Date().toISOString() },
  { id: 'inv-6', name: 'Birthday Candles (Pack of 2)', category: 'Candles & Accessories', quantity_available: 50, unit_cost: 15.00, supplier: 'Celebration Essentials', reorder_level: 15, last_updated: new Date().toISOString() },
  { id: 'inv-7', name: 'Double-Sided Foam Tape', category: 'Tools & Adhesive', quantity_available: 55, unit_cost: 14.00, supplier: 'Adhesive Pro India', reorder_level: 15, last_updated: new Date().toISOString() },
  { id: 'inv-8', name: 'Milky-White Decorative Lighting String (Rental Unit)', category: 'Rental Lighting', quantity_available: 10, unit_cost: 250.00, supplier: 'Luxe Lights Co', reorder_level: 2, last_updated: new Date().toISOString() },
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
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (*),
          product_contents (*),
          product_categories (*)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((d: any) => {
          const images = (d.product_images || []).map((img: any) => ({
            url: img.storage_path,
            alt: img.alt_text,
            title: img.is_primary ? 'Main Image' : 'Gallery Image',
            caption: img.alt_text,
          }));

          const contents = (d.product_contents || []).map((c: any) => ({
            name: c.item_name,
            quantity: `${c.quantity} ${c.unit || ''}`.trim(),
            pieceCount: parseInt(c.quantity, 10) || 1,
            specification: c.specification,
          }));

          const primaryCategory = d.product_categories?.[0]?.category_id || 'kids-birthday';

          return {
            id: d.id,
            slug: d.slug,
            name: d.name,
            tagline: d.short_description || 'Big Moments. One Little Box.',
            description: d.description || '',
            selling_price: Number(d.price),
            compare_at_price: d.compare_at_price ? Number(d.compare_at_price) : undefined,
            material_cost: 110,
            packaging_cost: 30,
            other_variable_cost: 10,
            category_id: primaryCategory,
            theme_id: d.theme_id || 'pastel-rose',
            images: images.length > 0 ? images : [{ url: '/products/pastel-rose-setup.jpg' }],
            contents: contents.length > 0 ? contents : [],
            exclusions: ['Cake, backdrop curtain, metal arch stand, and balloon pump are not included.'],
            stock_quantity: d.stock_quantity ?? 50,
            status: d.status,
            total_pieces: contents.reduce((s: number, c: any) => s + (c.pieceCount || 1), 0) || 60,
            badge: d.compare_at_price ? 'Special Offer' : undefined,
            created_at: d.created_at,
            updated_at: d.updated_at,
          } as AdminProduct;
        });
      }
    } catch (err) {
      console.warn('Supabase getProducts fallback to local store:', err);
    }
  }
  const local = getLocalData<AdminProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  // Auto-migrate any cached fallback with outdated 299 price to 399
  let hasUpdates = false;
  const migrated = local.map((p) => {
    if (p.slug === 'pastel-rose-celebration-box' && (p.selling_price === 299 || !p.selling_price)) {
      hasUpdates = true;
      return { ...p, selling_price: 399.00 };
    }
    return p;
  });
  if (hasUpdates) {
    setLocalData(STORAGE_KEYS.PRODUCTS, migrated);
  }
  return migrated;
};

export const getProductById = async (id: string): Promise<AdminProduct | null> => {
  const products = await getProducts();
  return products.find((p) => p.id === id || p.slug === id) || null;
};

export const createProduct = async (
  product: Omit<AdminProduct, 'created_at' | 'updated_at'> & {
    compare_at_price?: number;
    categories?: string[];
  }
): Promise<AdminProduct> => {
  const now = new Date().toISOString();
  const newProduct: AdminProduct = {
    ...product,
    status: (product.status as any) === 'active' ? 'published' : product.status,
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      // 1. Insert main product row
      const { data: insertedProduct, error: prodErr } = await supabase
        .from('products')
        .insert([
          {
            name: newProduct.name,
            slug: newProduct.slug,
            sku: product.slug ? `CB-${product.slug.toUpperCase().slice(0, 8)}` : `CB-${Date.now().toString().slice(-6)}`,
            short_description: newProduct.tagline,
            description: newProduct.description,
            price: newProduct.selling_price,
            compare_at_price: product.compare_at_price || null,
            theme_id: newProduct.theme_id || 'pastel-rose',
            status: (newProduct.status as any) === 'active' ? 'published' : newProduct.status,
            stock_quantity: newProduct.stock_quantity,
          },
        ])
        .select()
        .single();

      if (prodErr || !insertedProduct) {
        throw new Error(prodErr?.message || 'Failed to insert product in Supabase');
      }

      const assignedId = insertedProduct.id;
      newProduct.id = assignedId;

      // 2. Insert product images
      if (newProduct.images && newProduct.images.length > 0) {
        const imageRows = newProduct.images.map((img, idx) => ({
          product_id: assignedId,
          storage_path: typeof img === 'string' ? img : img.url,
          alt_text: typeof img === 'string' ? newProduct.name : img.alt || newProduct.name,
          sort_order: idx + 1,
          is_primary: idx === 0,
        }));
        await supabase.from('product_images').insert(imageRows);
      }

      // 3. Insert product contents
      if (newProduct.contents && newProduct.contents.length > 0) {
        const contentRows = newProduct.contents.map((c, idx) => ({
          product_id: assignedId,
          item_name: c.name,
          quantity: c.quantity.replace(/[^\d]/g, '') || '1',
          unit: c.quantity.replace(/[\d\s]/g, '') || 'pcs',
          specification: c.specification || '',
          sort_order: idx + 1,
        }));
        await supabase.from('product_contents').insert(contentRows);
      }

      // 4. Insert categories
      const targetCategories = product.categories || [newProduct.category_id || 'kids-birthday'];
      const catRows = targetCategories.map((catId) => ({
        product_id: assignedId,
        category_id: catId,
      }));
      await supabase.from('product_categories').insert(catRows);

      return newProduct;
    } catch (err: any) {
      console.warn('Supabase createProduct fallback to local store:', err?.message);
    }
  }

  const current = getLocalData<AdminProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const updated = [newProduct, ...current];
  setLocalData(STORAGE_KEYS.PRODUCTS, updated);
  return newProduct;
};

export const updateProduct = async (
  id: string,
  updates: Partial<AdminProduct> & {
    compare_at_price?: number;
    categories?: string[];
  }
): Promise<AdminProduct> => {
  const now = new Date().toISOString();
  const supabase = getSupabaseClient();

  if (supabase && isSupabaseConfigured()) {
    try {
      const dbUpdates: any = { updated_at: now };
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
      if (updates.tagline !== undefined) dbUpdates.short_description = updates.tagline;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.selling_price !== undefined) dbUpdates.price = updates.selling_price;
      if (updates.compare_at_price !== undefined) dbUpdates.compare_at_price = updates.compare_at_price;
      if (updates.theme_id !== undefined) dbUpdates.theme_id = updates.theme_id;
      if (updates.stock_quantity !== undefined) dbUpdates.stock_quantity = updates.stock_quantity;
      if (updates.status !== undefined) {
        dbUpdates.status = (updates.status as any) === 'active' ? 'published' : updates.status;
      }

      await supabase.from('products').update(dbUpdates).eq('id', id);

      // Refresh images if provided
      if (updates.images && updates.images.length > 0) {
        await supabase.from('product_images').delete().eq('product_id', id);
        const imageRows = updates.images.map((img, idx) => ({
          product_id: id,
          storage_path: typeof img === 'string' ? img : img.url,
          alt_text: typeof img === 'string' ? updates.name || '' : img.alt || updates.name || '',
          sort_order: idx + 1,
          is_primary: idx === 0,
        }));
        await supabase.from('product_images').insert(imageRows);
      }

      // Refresh contents if provided
      if (updates.contents && updates.contents.length > 0) {
        await supabase.from('product_contents').delete().eq('product_id', id);
        const contentRows = updates.contents.map((c, idx) => ({
          product_id: id,
          item_name: c.name,
          quantity: c.quantity.replace(/[^\d]/g, '') || '1',
          unit: c.quantity.replace(/[\d\s]/g, '') || 'pcs',
          specification: c.specification || '',
          sort_order: idx + 1,
        }));
        await supabase.from('product_contents').insert(contentRows);
      }

      // Refresh categories if provided
      if (updates.categories && updates.categories.length > 0) {
        await supabase.from('product_categories').delete().eq('product_id', id);
        const catRows = updates.categories.map((catId) => ({
          product_id: id,
          category_id: catId,
        }));
        await supabase.from('product_categories').insert(catRows);
      }
    } catch (err) {
      console.warn('Supabase updateProduct fallback to local store:', err);
    }
  }

  const current = getLocalData<AdminProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) {
    const updatedFallback: AdminProduct = {
      id,
      slug: updates.slug || 'pastel-rose-celebration-box',
      name: updates.name || 'Pastel Rose Celebration Box',
      tagline: updates.tagline || 'Big Moments. One Little Box.',
      description: updates.description || '',
      selling_price: updates.selling_price ?? 399,
      material_cost: 110,
      packaging_cost: 30,
      other_variable_cost: 10,
      category_id: updates.category_id || 'kids-birthday',
      theme_id: updates.theme_id || 'pastel-rose',
      images: updates.images || [],
      contents: updates.contents || [],
      exclusions: updates.exclusions || [],
      stock_quantity: updates.stock_quantity ?? 50,
      status: updates.status || 'published',
      total_pieces: 60,
      created_at: now,
      updated_at: now,
    };
    setLocalData(STORAGE_KEYS.PRODUCTS, [updatedFallback, ...current]);
    return updatedFallback;
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
  if (supabase && isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase deleteProduct fallback to local store:', err);
    }
  }

  const current = getLocalData<AdminProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const filtered = current.filter((p) => p.id !== id);
  setLocalData(STORAGE_KEYS.PRODUCTS, filtered);
  return true;
};

export const uploadProductImage = async (file: File): Promise<string> => {
  // Validate file type & size (max 5MB)
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file (JPEG, PNG, WebP).');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image size must be less than 5MB.');
  }

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (!error) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      return data.publicUrl;
    }
    console.warn('Supabase storage upload error, falling back to data URL:', error?.message);
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
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as AdminOrder[];
      }
    } catch (err) {
      console.warn('Supabase getOrders error:', err);
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
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([newOrder])
        .select()
        .single();
      if (!error && data) {
        return data as AdminOrder;
      }
    } catch (err) {
      console.warn('Supabase createOrder error:', err);
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
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ ...updates, updated_at: now })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        return data as AdminOrder;
      }
    } catch (err) {
      console.warn('Supabase updateOrder error:', err);
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
  if (supabase && isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase deleteOrder error:', err);
    }
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
  return getLocalData<InventoryItem[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
};

export const getInventoryMovements = async (): Promise<InventoryMovement[]> => {
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
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          slug: d.slug,
          name: d.name,
          tagline: d.tagline || '',
          description: d.description || '',
          image: d.image || '',
          bgColor: d.bg_color || '#FFF8F0',
          isAvailable: Boolean(d.is_active),
          badge: d.badge,
          display_order: d.display_order,
        })) as OccasionCategory[];
      }
    } catch (err) {
      console.warn('Supabase getCategories error:', err);
    }
  }
  return getLocalData<OccasionCategory[]>(STORAGE_KEYS.CATEGORIES, OCCASION_CATEGORIES);
};

export const updateCategory = async (
  id: string,
  updates: Partial<OccasionCategory>
): Promise<OccasionCategory> => {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.tagline !== undefined) dbUpdates.tagline = updates.tagline;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.badge !== undefined) dbUpdates.badge = updates.badge;
      if (updates.isAvailable !== undefined) dbUpdates.is_active = updates.isAvailable;

      const { data } = await supabase
        .from('categories')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      if (data) return data;
    } catch (err) {
      console.warn('Supabase updateCategory error:', err);
    }
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
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('name', { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          name: d.name,
          colors: d.colour_palette || [],
          colour_palette: d.colour_palette || [],
          isAvailable: Boolean(d.is_active),
          description: '',
        })) as ThemeOption[];
      }
    } catch (err) {
      console.warn('Supabase getThemes error:', err);
    }
  }
  return getLocalData<ThemeOption[]>(STORAGE_KEYS.THEMES, AVAILABLE_THEMES);
};

export const updateTheme = async (
  id: string,
  updates: Partial<ThemeOption>
): Promise<ThemeOption> => {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.isAvailable !== undefined) dbUpdates.is_active = updates.isAvailable;
      if (updates.colors !== undefined) dbUpdates.colour_palette = updates.colors;

      const { data } = await supabase
        .from('themes')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      if (data) return data as ThemeOption;
    } catch (err) {
      console.warn('Supabase updateTheme error:', err);
    }
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
  return getLocalData<BusinessSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
};

export const updateBusinessSettings = async (
  updates: Partial<BusinessSettings>
): Promise<BusinessSettings> => {
  const current = await getBusinessSettings();
  const updated: BusinessSettings = { ...current, ...updates };
  setLocalData(STORAGE_KEYS.SETTINGS, updated);
  return updated;
};
