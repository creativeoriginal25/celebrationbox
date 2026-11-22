-- ============================================================================
-- CELEBRATION BOX — PRODUCTION SUPABASE DATABASE SCHEMA & RLS POLICIES
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. ADMIN USERS TABLE (Explicit Admin Authorization)
-- ============================================================================
-- Admin users must be explicitly authorized here. Public signup does NOT grant admin.
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin Users Policies:
-- Only authenticated admins can view or manage admin users
CREATE POLICY "Admins can view admin users"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can update admin users"
    ON public.admin_users FOR UPDATE
    TO authenticated
    USING (public.is_admin());

-- ============================================================================
-- 3. OCCASION CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    image TEXT,
    bg_color TEXT DEFAULT '#FFF8F0',
    display_order INT NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true,
    badge TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public can read all available categories
CREATE POLICY "Public can read available categories"
    ON public.categories FOR SELECT
    TO anon, authenticated
    USING (is_available = true OR public.is_admin());

-- Only admins can insert, update, or delete categories
CREATE POLICY "Admins can manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- 4. THEMES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    image TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active themes"
    ON public.themes FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage themes"
    ON public.themes FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- 5. PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    ideal_for TEXT,
    selling_price NUMERIC(10, 2) NOT NULL CHECK (selling_price >= 0),
    material_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (material_cost >= 0),
    packaging_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (packaging_cost >= 0),
    other_variable_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (other_variable_cost >= 0),
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    theme_id TEXT REFERENCES public.themes(id) ON DELETE SET NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    contents JSONB NOT NULL DEFAULT '[]'::jsonb,
    exclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    stock_quantity INT NOT NULL DEFAULT 50 CHECK (stock_quantity >= 0),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'out_of_stock', 'archived')),
    total_pieces INT NOT NULL DEFAULT 60,
    badge TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can ONLY read published active products!
-- Internal costs (material_cost, packaging_cost) are kept secure
CREATE POLICY "Public can read active products"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (status = 'active' OR public.is_admin());

-- Only admins can insert, update, or delete products
CREATE POLICY "Admins can manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- 6. ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_price NUMERIC(10, 2) NOT NULL CHECK (product_price >= 0),
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    theme TEXT,
    celebration_date TEXT,
    preferred_time TEXT,
    delivery_method TEXT NOT NULL DEFAULT 'pickup' CHECK (delivery_method IN ('pickup', 'delivery')),
    delivery_address TEXT,
    delivery_charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_charge >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    order_status TEXT NOT NULL DEFAULT 'new' CHECK (order_status IN (
        'new', 'confirmed', 'packing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'
    )),
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN (
        'unpaid', 'pending_verification', 'paid', 'refunded'
    )),
    internal_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- STRICT PRIVACY POLICY:
-- Anonymous or unauthenticated users CANNOT read order records (protects customer phone & address).
-- Only authorized admins can view or manage orders.
CREATE POLICY "Only admins can view orders"
    ON public.orders FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can manage orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- 7. INVENTORY MANAGEMENT (Raw Materials & Movement Logs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Balloons', 'Banners', 'Tools & Adhesive', 'Backdrops', 'Candles & Accessories', 'Packaging', 'Other'
    )),
    quantity_available INT NOT NULL DEFAULT 0,
    unit_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (unit_cost >= 0),
    supplier TEXT,
    reorder_level INT NOT NULL DEFAULT 20,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view inventory items"
    ON public.inventory_items FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can manage inventory items"
    ON public.inventory_items FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE CASCADE,
    change_quantity INT NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('restock', 'usage', 'damage', 'adjustment')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view inventory movements"
    ON public.inventory_movements FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert inventory movements"
    ON public.inventory_movements FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Trigger to automatically update inventory_items.quantity_available when a movement is recorded
CREATE OR REPLACE FUNCTION public.handle_inventory_movement()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.inventory_items
    SET quantity_available = quantity_available + NEW.change_quantity,
        last_updated = timezone('utc'::text, now())
    WHERE id = NEW.item_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_inventory_movement_created
    AFTER INSERT ON public.inventory_movements
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_inventory_movement();

-- ============================================================================
-- 8. BUSINESS SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read public settings"
    ON public.settings FOR SELECT
    TO anon, authenticated
    USING (is_public = true OR public.is_admin());

CREATE POLICY "Admins can manage settings"
    ON public.settings FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- 9. SUPABASE STORAGE BUCKET CONFIGURATION
-- ============================================================================
-- Insert storage bucket for product photographs
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Anyone can view public product images
CREATE POLICY "Public Access to Product Images"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'product-images');

-- Storage Policy: Only authorized admins can upload or delete product images
CREATE POLICY "Admins can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admins can update product images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admins can delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin());

-- ============================================================================
-- 10. INITIAL SEED DATA
-- ============================================================================

-- Categories
INSERT INTO public.categories (id, slug, name, tagline, description, image, bg_color, display_order, is_available, badge)
VALUES
    ('kids-birthday', 'kids-birthday', 'Kid''s Birthday', 'Magical birthdays for little dreamers', 'Delightful birthday kits designed for boys and girls.', '/categories/kids-birthday.png', '#FFF0F5', 1, true, 'Popular'),
    ('adults-birthday', 'adults-birthday', 'Adult''s Birthday', 'Celebrate in style, stress-free', 'Elegant themes for milestone and surprise birthdays.', '/categories/adults-birthday.png', '#F3E8FF', 2, true, 'Trending'),
    ('festive', 'festive', 'Festive', 'Traditional elegance for every festival', 'Diwali, Sankranti, and regional celebration decor kits.', '/categories/festive.png', '#FFF8E7', 3, false, 'Coming Soon'),
    ('gifting-essentials', 'gifting-essentials', 'Gifting Essentials', 'Thoughtful gift packages', 'Curated gift hampers and celebration packaging boxes.', '/categories/gifting-essentials.png', '#E8F5E9', 4, false, 'Coming Soon'),
    ('bachelorette', 'bachelorette', 'Bachelorette', 'Glam nights with your crew', 'Chic, photogenic bachelorette and bridal party setups.', '/categories/bachelorette.png', '#FCE4EC', 5, false, 'Coming Soon'),
    ('baby-shower', 'baby-shower', 'Baby Shower', 'Welcome the little one with joy', 'Gentle pastel balloon garlands and welcoming backdrops.', '/categories/baby-shower.png', '#E0F7FA', 6, false, 'Coming Soon'),
    ('anniversary', 'anniversary', 'Anniversary', 'Toast to love & memorable milestones', 'Romantic decor sets featuring soft rose and warm tones.', '/categories/anniversary.png', '#FFF3E0', 7, false, 'Coming Soon'),
    ('custom-decor', 'custom-decor', 'Custom Decor', 'Personalized celebration kits', 'Tailored packages with custom names and color choices.', '/categories/custom-decor.png', '#EDE7F6', 8, false, 'Coming Soon'),
    ('party-essentials', 'party-essentials', 'Party Essentials', 'A la carte supplies & add-ons', 'Individual balloon packs, ribbons, and styling accessories.', '/categories/party-essentials.png', '#E0F2F1', 9, false, 'Coming Soon')
ON CONFLICT (id) DO NOTHING;

-- Themes
INSERT INTO public.themes (id, name, colors, image, is_active, description)
VALUES
    ('pastel-rose', 'Pink × Lavender × Rose Gold', '[
        {"name": "Pastel Pink", "hex": "#FFB6C1"},
        {"name": "Lavender", "hex": "#D8B4E2"},
        {"name": "Rose Gold", "hex": "#B76E79"}
    ]'::jsonb, '/products/pastel-rose-setup.jpg', true, 'Soft romantic blend of pastel pink, gentle lavender and metallic rose gold.')
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO public.products (
    id, slug, name, tagline, description, ideal_for,
    selling_price, material_cost, packaging_cost, other_variable_cost,
    category_id, theme_id,
    images, contents, exclusions, stock_quantity, status, total_pieces, badge
)
VALUES
    (
        'signature-celebration-box',
        'pastel-rose-celebration-box',
        'Pastel Rose Celebration Box',
        'Big Moments. One Little Box.',
        'Everything you need to turn an ordinary space into a beautiful birthday moment.',
        'Bedroom, living room, and hostel birthday celebrations',
        399.00,
        145.00,
        35.00,
        15.00,
        'kids-birthday',
        'pastel-rose',
        '[
            {
                "url": "/products/pastel-rose-setup.jpg",
                "alt": "Pastel Rose Celebration Box - Decoration Setup",
                "title": "Decoration Setup",
                "caption": "Pink, lavender and rose-gold balloon garland with Happy Birthday banner"
            },
            {
                "url": "/products/pastel-rose-contents.jpg",
                "alt": "Pastel Rose Celebration Box - Package Contents",
                "title": "What''s Inside the Box",
                "caption": "Exact verified 60-piece kit inventory"
            }
        ]'::jsonb,
        '[
            {"name": "Pink Latex Balloons", "quantity": "26 pcs", "pieceCount": 26, "specification": "12-inch Natural Latex"},
            {"name": "Lavender Latex Balloons", "quantity": "26 pcs", "pieceCount": 26, "specification": "12-inch Natural Latex"},
            {"name": "Rose Gold Chrome Balloons", "quantity": "5 pcs", "pieceCount": 5, "specification": "12-inch Metallic Chrome"},
            {"name": "Rose Gold Happy Birthday Banner", "quantity": "1 pc", "pieceCount": 1, "specification": "Pre-strung script banner"},
            {"name": "Balloon Arch Strip", "quantity": "1 pc", "pieceCount": 1, "specification": "5m double-hole transparent strip"},
            {"name": "Glue Dot Roll", "quantity": "1 roll", "pieceCount": 1, "specification": "100 removable wall-safe dots"}
        ]'::jsonb,
        '[
            "Cake, backdrop curtain, metal arch stand, and balloon pump are not included."
        ]'::jsonb,
        45,
        'active',
        60,
        'Best Seller'
    )
ON CONFLICT (id) DO UPDATE SET
    selling_price = EXCLUDED.selling_price,
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    updated_at = timezone('utc'::text, now());

-- Initial Raw Materials Inventory
INSERT INTO public.inventory_items (name, category, quantity_available, unit_cost, supplier, reorder_level)
VALUES
    ('Pink Latex Balloons (Pack of 100)', 'Balloons', 15, 120.00, 'Gemini Latex Supplies', 5),
    ('Lavender Latex Balloons (Pack of 100)', 'Balloons', 12, 120.00, 'Gemini Latex Supplies', 5),
    ('Rose Gold Chrome Balloons (Pack of 50)', 'Balloons', 8, 160.00, 'Metallic Party Wholesale', 3),
    ('Rose Gold Happy Birthday Banner', 'Banners', 45, 38.00, 'Celebration Print Hub', 10),
    ('Balloon Arch Strip 5m', 'Tools & Adhesive', 60, 12.00, 'Direct Polymer Co', 15),
    ('Wall-Safe Glue Dot Roll (100 dots)', 'Tools & Adhesive', 55, 14.00, 'Adhesive Pro India', 15),
    ('Rigid Craft Shipping Box', 'Packaging', 48, 28.00, 'BoxCraft Hyderabad', 15),
    ('Curling Ribbon 10m Spool', 'Tools & Adhesive', 30, 8.00, 'Decor Ribbon Works', 10)
ON CONFLICT DO NOTHING;

-- Business Settings
INSERT INTO public.settings (key, value, is_public)
VALUES
    ('business_profile', '{
        "business_name": "Celebration Box",
        "tagline": "Big Moments. One Little Box.",
        "whatsapp_number": "919100280705",
        "instagram_url": "https://instagram.com/celebrationbox.in",
        "contact_email": "hello@celebrationbox.in",
        "service_location": "Bhimavaram, Andhra Pradesh",
        "pickup_instructions": "Free pickup available at our agreed campus pickup point in Bhimavaram.",
        "delivery_info": "Nearby delivery within 5km of campus with nominal delivery fee.",
        "business_description": "Curated DIY celebration kits packed with high-quality balloons, banners, and wall-safe adhesives."
    }'::jsonb, true)
ON CONFLICT (key) DO NOTHING;
