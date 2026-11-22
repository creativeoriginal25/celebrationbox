import { Product, OccasionCategory, ProductPackItem, ProductGalleryImage } from '../types';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { PRODUCTS } from '../config/products';
import { OCCASION_CATEGORIES } from '../config/categories';
import { getProducts as getAdminProducts, getCategories as getAdminCategories } from './adminService';

// Fallback in-memory cache
let cachedPublishedProducts: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 10000; // 10 seconds cache for snappy navigation

/**
 * Transforms relational Supabase row or admin product into the public Product interface
 */
export const mapDbProductToPublic = (dbProd: any): Product => {
  // Extract images
  let imagesList: ProductGalleryImage[] = [];
  let mainImageUrl = '/products/pastel-rose-setup.jpg';

  if (Array.isArray(dbProd.product_images) && dbProd.product_images.length > 0) {
    const sortedImages = [...dbProd.product_images].sort(
      (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );
    imagesList = sortedImages.map((img: any, idx: number) => ({
      id: img.id || `img-${idx}`,
      url: img.storage_path || img.url,
      alt: img.alt_text || `${dbProd.name} image`,
      title: img.is_primary ? 'Decoration Setup' : `Gallery Image ${idx + 1}`,
      caption: img.alt_text || dbProd.name,
      type: img.is_primary ? 'setup' : 'details',
      is_primary: img.is_primary,
      sort_order: img.sort_order ?? idx,
    }));
    const primary = sortedImages.find((img: any) => img.is_primary) || sortedImages[0];
    mainImageUrl = primary.storage_path || primary.url;
  } else if (Array.isArray(dbProd.images) && dbProd.images.length > 0) {
    imagesList = dbProd.images.map((img: any, idx: number) => ({
      id: `img-${idx}`,
      url: typeof img === 'string' ? img : img.url,
      alt: typeof img === 'string' ? dbProd.name : img.alt || dbProd.name,
      title: typeof img === 'string' ? `Image ${idx + 1}` : img.title || `Image ${idx + 1}`,
      caption: typeof img === 'string' ? '' : img.caption || '',
      type: idx === 0 ? 'setup' : 'details',
      is_primary: idx === 0,
      sort_order: idx,
    }));
    mainImageUrl = imagesList[0].url;
  }

  // Extract contents
  let inclusionsList: string[] = [];
  let packItemsList: ProductPackItem[] = [];

  if (Array.isArray(dbProd.product_contents) && dbProd.product_contents.length > 0) {
    const sortedContents = [...dbProd.product_contents].sort(
      (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );
    inclusionsList = sortedContents.map(
      (c: any) => `${c.quantity} ${c.unit ? c.unit + ' ' : ''}${c.item_name}`
    );
    packItemsList = sortedContents.map((c: any) => ({
      name: c.item_name,
      quantity: `${c.quantity} ${c.unit || 'pcs'}`,
      pieceCount: parseInt(c.quantity, 10) || 1,
      specification: c.specification || '',
    }));
  } else if (Array.isArray(dbProd.contents) && dbProd.contents.length > 0) {
    inclusionsList = dbProd.contents.map(
      (c: any) => `${c.quantity} ${c.name}`
    );
    packItemsList = dbProd.contents.map((c: any) => ({
      name: c.name,
      quantity: c.quantity,
      pieceCount: c.pieceCount || parseInt(c.quantity, 10) || 1,
      specification: c.specification || '',
    }));
  } else {
    inclusionsList = Array.isArray(dbProd.inclusions) ? dbProd.inclusions : [];
  }

  // Total pieces calculation
  const totalPieces =
    dbProd.total_pieces ||
    packItemsList.reduce((sum, item) => sum + (item.pieceCount || 1), 0) ||
    60;

  // Categories extracted from product_categories join table
  const categoryIds: string[] = [];
  if (Array.isArray(dbProd.product_categories)) {
    dbProd.product_categories.forEach((pc: any) => {
      if (pc.category_id) categoryIds.push(pc.category_id);
    });
  } else if (dbProd.category_id) {
    categoryIds.push(dbProd.category_id);
  }

  // Fallback defaults for exclusions
  const exclusionsList = Array.isArray(dbProd.exclusions)
    ? dbProd.exclusions
    : ['Cake, backdrop curtain, metal arch stand, and balloon pump are not included.'];

  return {
    id: dbProd.id,
    slug: dbProd.slug || dbProd.id,
    sku: dbProd.sku,
    name: dbProd.name,
    tagline: dbProd.short_description || dbProd.tagline || 'Big Moments. One Little Box.',
    price: Number(dbProd.price || dbProd.selling_price || 299),
    compare_at_price: dbProd.compare_at_price ? Number(dbProd.compare_at_price) : undefined,
    description: dbProd.description || 'Everything you need to turn an ordinary space into a beautiful birthday moment.',
    short_description: dbProd.short_description,
    idealFor: dbProd.ideal_for || 'Hostel rooms, bedroom and living room celebrations',
    inclusions: inclusionsList,
    exclusions: exclusionsList,
    image: mainImageUrl,
    badge: dbProd.badge || (dbProd.compare_at_price ? 'Special Offer' : undefined),
    active: dbProd.status === 'published' || dbProd.status === 'active',
    status: dbProd.status,
    stock_quantity: dbProd.stock_quantity ?? 50,
    inventoryStatus:
      (dbProd.stock_quantity ?? 50) <= 0
        ? 'out_of_stock'
        : (dbProd.stock_quantity ?? 50) <= 10
        ? 'low_stock'
        : 'in_stock',
    availableThemes: [dbProd.theme_id || 'pastel-rose'],
    theme_id: dbProd.theme_id || 'pastel-rose',
    categories: categoryIds,
    totalPieces,
    packItems: packItemsList,
    images: imagesList,
  };
};

/**
 * Fetch all published products from Supabase (or fallback store)
 */
export const getPublishedProducts = async (forceRefresh: boolean = false): Promise<Product[]> => {
  const now = Date.now();
  if (!forceRefresh && cachedPublishedProducts && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedPublishedProducts;
  }

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
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapDbProductToPublic);
        cachedPublishedProducts = mapped;
        lastFetchTime = now;
        return mapped;
      }
    } catch (err) {
      console.warn('Error fetching published products from Supabase, falling back:', err);
    }
  }

  // Fallback to local admin store if in Sandbox Mode or offline
  try {
    const adminProducts = await getAdminProducts();
    const publishedAdmin = adminProducts.filter((p) => p.status === 'active' || (p as any).status === 'published');
    if (publishedAdmin.length > 0) {
      const mapped = publishedAdmin.map(mapDbProductToPublic);
      cachedPublishedProducts = mapped;
      lastFetchTime = now;
      return mapped;
    }
  } catch (err) {
    console.warn('Error fetching from local admin store:', err);
  }

  // Ultimate fallback to hardcoded verified baseline
  return PRODUCTS.filter((p) => p.active);
};

/**
 * Fetch a single product by ID or Slug
 */
export const getProductByIdOrSlug = async (idOrSlug: string): Promise<Product | null> => {
  const products = await getPublishedProducts();
  const found = products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (found) return found;

  // If not found in published list, check if it's the baseline product
  const baseline = PRODUCTS.find((p) => p.id === idOrSlug || (p as any).slug === idOrSlug);
  return baseline || null;
};

/**
 * Fetch products relevant to a specific category
 */
export const getProductsForCategory = async (categorySlug: string): Promise<Product[]> => {
  const products = await getPublishedProducts();

  // If product has explicit categories array, match categorySlug or category.id
  const matching = products.filter((p) => {
    if (p.categories && p.categories.length > 0) {
      return p.categories.includes(categorySlug);
    }
    // Default birthday kits match kid's and adult's birthday
    if (categorySlug === 'kids-birthday' || categorySlug === 'adults-birthday') {
      return true;
    }
    return false;
  });

  if (matching.length > 0) {
    return matching;
  }

  // Fallback to active products for birthday categories
  if (categorySlug === 'kids-birthday' || categorySlug === 'adults-birthday') {
    return products.slice(0, 1);
  }

  return [];
};

/**
 * Re-verifies live price and availability at checkout time
 * Prevents trusting outdated localStorage prices
 */
export const verifyProductPrice = async (
  productId: string
): Promise<{ price: number; isAvailable: boolean; name: string }> => {
  try {
    const product = await getProductByIdOrSlug(productId);
    if (!product || !product.active) {
      return { price: 299, isAvailable: false, name: product?.name || 'Product' };
    }
    return {
      price: product.price,
      isAvailable: product.active && (product.stock_quantity ?? 50) > 0,
      name: product.name,
    };
  } catch {
    return { price: 299, isAvailable: true, name: 'Celebration Box' };
  }
};
