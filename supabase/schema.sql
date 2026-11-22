-- ============================================================================
-- CELEBRATION BOX — OFFICIAL DATABASE MIGRATION & RLS SCHEMA
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. ADMIN USERS TABLE (Explicit Server-Verified Role Check)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Helper function to check if the current user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only authenticated admins can view admin_users list
CREATE POLICY "Admins can view admin users"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- ============================================================================
-- 3. THEMES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.themes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    colour_palette JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active themes"
    ON public.themes FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage themes"
    ON public.themes FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- 4. OCCASION CATEGORIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tagline TEXT,
    description TEXT,
    image TEXT,
    bg_color TEXT DEFAULT '#FFF8F0',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    badge TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT
    TO anon, authenticated
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- 5. PRODUCTS TABLE (Exact Numeric Currency, Strict Status Constraint)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT UNIQUE,
    short_description TEXT,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(10, 2) CHECK (compare_at_price >= 0),
    theme_id TEXT REFERENCES public.themes(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- CRITICAL RLS SECURITY:
-- Public visitors can ONLY query published products!
-- Draft and archived products are completely inaccessible to public viewers.
CREATE POLICY "Public can view published products"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can manage all products"
    ON public.products FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- 6. PRODUCT IMAGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    alt_text TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published product images"
    ON public.product_images FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = product_images.product_id
            AND (p.status = 'published' OR public.is_admin())
        )
    );

CREATE POLICY "Admins can manage product images"
    ON public.product_images FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- 7. PRODUCT CONTENTS TABLE (Itemized Verified Pieces & Quantities)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    quantity TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT 'pcs',
    specification TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_product_contents_product_id ON public.product_contents(product_id);

ALTER TABLE public.product_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published product contents"
    ON public.product_contents FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = product_contents.product_id
            AND (p.status = 'published' OR public.is_admin())
        )
    );

CREATE POLICY "Admins can manage product contents"
    ON public.product_contents FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- 8. PRODUCT CATEGORIES (Many-to-Many Association)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.product_categories (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_product_categories_cat ON public.product_categories(category_id);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view product categories"
    ON public.product_categories FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.products p
            WHERE p.id = product_categories.product_id
            AND (p.status = 'published' OR public.is_admin())
        )
    );

CREATE POLICY "Admins can manage product categories"
    ON public.product_categories FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ============================================================================
-- 9. ORDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
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

-- Strict Customer Privacy: Unauthenticated users CANNOT read order records
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
-- 10. SUPABASE STORAGE BUCKET CONFIGURATION (product-images)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view images
CREATE POLICY "Public can view product images"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'product-images');

-- Only authorized admins can upload or delete images
CREATE POLICY "Admins can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admins can delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin());

-- ============================================================================
-- 11. INITIAL SEED DATA (Pastel Rose Celebration Box at ₹299)
-- ============================================================================

-- Themes
INSERT INTO public.themes (id, name, colour_palette, is_active)
VALUES
    ('pastel-rose', 'Pink, Lavender and Rose Gold', '[
        {"name": "Pastel Pink", "hex": "#FFB6C1"},
        {"name": "Lavender", "hex": "#D8B4E2"},
        {"name": "Rose Gold", "hex": "#B76E79"}
    ]'::jsonb, true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    colour_palette = EXCLUDED.colour_palette;

-- Categories
INSERT INTO public.categories (id, name, slug, tagline, description, image, bg_color, display_order, is_active, badge)
VALUES
    ('kids-birthday', 'Kid''s Birthday', 'kids-birthday', 'Magical birthdays for little dreamers', 'Delightful birthday kits designed for boys and girls.', '/categories/kids-birthday.png', '#FFF0F5', 1, true, 'Popular'),
    ('adults-birthday', 'Adult''s Birthday', 'adults-birthday', 'Celebrate in style, stress-free', 'Elegant themes for milestone and surprise birthdays.', '/categories/adults-birthday.png', '#F3E8FF', 2, true, 'Trending'),
    ('festive', 'Festive', 'festive', 'Traditional elegance for every festival', 'Diwali, Sankranti, and regional celebration decor kits.', '/categories/festive.png', '#FFF8E7', 3, false, 'Coming Soon'),
    ('gifting-essentials', 'Gifting Essentials', 'gifting-essentials', 'Thoughtful gift packages', 'Curated gift hampers and celebration packaging boxes.', '/categories/gifting-essentials.png', '#E8F5E9', 4, false, 'Coming Soon'),
    ('bachelorette', 'Bachelorette', 'bachelorette', 'Glam nights with your crew', 'Chic, photogenic bachelorette and bridal party setups.', '/categories/bachelorette.png', '#FCE4EC', 5, false, 'Coming Soon'),
    ('baby-shower', 'Baby Shower', 'baby-shower', 'Welcome the little one with joy', 'Gentle pastel balloon garlands and welcoming backdrops.', '/categories/baby-shower.png', '#E0F7FA', 6, false, 'Coming Soon'),
    ('anniversary', 'Anniversary', 'anniversary', 'Toast to love & memorable milestones', 'Romantic decor sets featuring soft rose and warm tones.', '/categories/anniversary.png', '#FFF3E0', 7, false, 'Coming Soon'),
    ('custom-decor', 'Custom Decor', 'custom-decor', 'Personalized celebration kits', 'Tailored packages with custom names and color choices.', '/categories/custom-decor.png', '#EDE7F6', 8, false, 'Coming Soon'),
    ('party-essentials', 'Party Essentials', 'party-essentials', 'A la carte supplies & add-ons', 'Individual balloon packs, ribbons, and styling accessories.', '/categories/party-essentials.png', '#E0F2F1', 9, false, 'Coming Soon')
ON CONFLICT (id) DO NOTHING;

-- Seed Product: Pastel Rose Celebration Box (₹299, 60 pieces)
DO $$
DECLARE
    v_product_id UUID := '00000000-0000-0000-0000-000000000001'::uuid;
BEGIN
    INSERT INTO public.products (
        id, name, slug, sku, short_description, description,
        price, compare_at_price, theme_id, status, stock_quantity
    )
    VALUES (
        v_product_id,
        'Pastel Rose Celebration Box',
        'pastel-rose-celebration-box',
        'CB-PR-001',
        'Big Moments. One Little Box.',
        'Everything you need to turn an ordinary space into a beautiful birthday moment.',
        299.00,
        399.00,
        'pastel-rose',
        'published',
        50
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        price = 299.00,
        status = 'published',
        updated_at = timezone('utc'::text, now());

    -- Assign to categories (Kid's Birthday and Adult's Birthday)
    INSERT INTO public.product_categories (product_id, category_id)
    VALUES
        (v_product_id, 'kids-birthday'),
        (v_product_id, 'adults-birthday')
    ON CONFLICT DO NOTHING;

    -- Delete old images/contents to avoid duplicates on re-run
    DELETE FROM public.product_images WHERE product_id = v_product_id;
    DELETE FROM public.product_contents WHERE product_id = v_product_id;

    -- Product Images (Image 1: Setup preview, Image 2: What's inside infographic)
    INSERT INTO public.product_images (product_id, storage_path, alt_text, sort_order, is_primary)
    VALUES
        (v_product_id, '/products/pastel-rose-setup.jpg', 'Pastel Rose Celebration Box - Decoration Setup', 1, true),
        (v_product_id, '/products/pastel-rose-contents.jpg', 'Pastel Rose Celebration Box - Package Contents', 2, false);

    -- Exact 6 verified kit items (Total 60 pieces)
    INSERT INTO public.product_contents (product_id, item_name, quantity, unit, specification, sort_order)
    VALUES
        (v_product_id, 'Pink Latex Balloons', '26', 'pcs', '12-inch Natural Latex', 1),
        (v_product_id, 'Lavender Latex Balloons', '26', 'pcs', '12-inch Natural Latex', 2),
        (v_product_id, 'Rose Gold Chrome Balloons', '5', 'pcs', '12-inch Metallic Chrome', 3),
        (v_product_id, 'Rose Gold Happy Birthday Banner', '1', 'pc', 'Pre-strung script banner', 4),
        (v_product_id, 'Balloon Arch Strip', '1', 'pc', '5m double-hole transparent strip', 5),
        (v_product_id, 'Glue Dot Roll', '1', 'roll', '100 removable wall-safe dots', 6);
END $$;
