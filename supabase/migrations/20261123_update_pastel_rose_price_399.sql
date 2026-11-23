-- Migration: Update Pastel Rose Celebration Box Selling Price to ₹399
-- Date: 2026-11-23

UPDATE public.products
SET price = 399.00,
    compare_at_price = 499.00,
    updated_at = timezone('utc'::text, now())
WHERE slug = 'pastel-rose-celebration-box' 
   OR id = '00000000-0000-0000-0000-000000000001'::uuid;
