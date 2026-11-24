-- ============================================================================
-- Migration: Update Pastel Rose Celebration Box to Actual Purchased Kit Materials
-- Description: Updates product details, theme colors, and exact contents
-- ============================================================================

DO $$
DECLARE
    v_product_id UUID := '00000000-0000-0000-0000-000000000001'::uuid;
BEGIN
    -- 1. Update Theme Colours to Baby Pink, Pastel Lavender, and Metallic Copper
    INSERT INTO public.themes (id, name, colour_palette, is_active)
    VALUES
        ('pastel-rose', 'Baby Pink × Pastel Lavender × Metallic Copper', '[
            {"name": "Baby Pink", "hex": "#FFB6C1"},
            {"name": "Pastel Lavender", "hex": "#D8B4E2"},
            {"name": "Metallic Copper", "hex": "#C87A5E"}
        ]'::jsonb, true)
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        colour_palette = EXCLUDED.colour_palette;

    -- 2. Update Product Description & Selling Price (₹399)
    UPDATE public.products
    SET
        name = 'Pastel Rose Celebration Box',
        price = 399.00,
        compare_at_price = 499.00,
        description = 'Create a beautiful birthday corner with our Pastel Rose Celebration Box. A thoughtfully curated combination of baby pink, lavender, and metallic copper balloons, complemented by a shimmering foil backdrop and a Happy Birthday banner. Everything is packed together to make decorating easier.',
        updated_at = timezone('utc'::text, now())
    WHERE id = v_product_id;

    -- 3. Replace Old Contents with Exact Purchased Materials (56 balloons + decor + setup)
    DELETE FROM public.product_contents WHERE product_id = v_product_id;

    INSERT INTO public.product_contents (product_id, item_name, quantity, unit, specification, sort_order)
    VALUES
        (v_product_id, 'Baby Pink Latex Balloons', '20', 'pcs', '10-inch Natural Latex', 1),
        (v_product_id, 'Lavender Latex Balloons', '20', 'pcs', '10-inch Natural Latex', 2),
        (v_product_id, 'Metallic Copper Balloons', '16', 'pcs', '10-inch Metallic Copper', 3),
        (v_product_id, 'Gold Glitter Happy Birthday Letter Banner', '1', 'pc', 'Pre-strung script letter banner', 4),
        (v_product_id, 'Lavender-Pink Metallic Foil Fringe Backdrop', '1', 'pc', 'Tinsel foil fringe curtain', 5),
        (v_product_id, 'Birthday Candles', '2', 'pcs', 'Celebration cake candles', 6),
        (v_product_id, 'Double-Sided Foam Tape', '1', 'pack', 'Mounting wall-safe foam tape', 7);
END $$;
