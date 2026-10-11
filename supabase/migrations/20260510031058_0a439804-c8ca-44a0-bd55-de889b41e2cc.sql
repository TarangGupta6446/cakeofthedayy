
-- Seed categories
INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Birthday', 'birthday', 1),
  ('Wedding', 'wedding', 2),
  ('Cupcakes', 'cupcakes', 3),
  ('Cheesecakes', 'cheesecakes', 4),
  ('Brownies & Bites', 'brownies', 5),
  ('Festive Specials', 'festive', 6)
ON CONFLICT (slug) DO NOTHING;

-- Seed addons
INSERT INTO public.addons (name, price) VALUES
  ('Birthday Candles Set', 50),
  ('Premium Gift Wrap', 100),
  ('Handwritten Greeting Card', 80),
  ('Edible Photo Topper', 250),
  ('Extra Cream Roses', 150)
ON CONFLICT DO NOTHING;

-- Seed products (placeholder image_url uses 'placeholder:<key>' which the UI maps to a gradient card)
WITH cats AS (
  SELECT slug, id FROM public.categories
)
INSERT INTO public.products (slug, name, description, base_price, category_id, image_url, is_featured, is_bestseller, rating)
VALUES
  ('classic-belgian-chocolate', 'Classic Belgian Chocolate', 'Rich, fudgy Belgian chocolate cake layered with silky ganache and finished with cocoa pearls. Our most-loved bake.', 699, (SELECT id FROM cats WHERE slug='birthday'), 'placeholder:chocolate', true, true, 4.9),
  ('red-velvet-dream', 'Red Velvet Dream', 'Velvety red sponge with whipped cream cheese frosting, finished with delicate red crumb.', 749, (SELECT id FROM cats WHERE slug='birthday'), 'placeholder:redvelvet', true, true, 4.8),
  ('vanilla-strawberry-cloud', 'Vanilla Strawberry Cloud', 'Fluffy vanilla sponge soaked in strawberry compote with fresh cream and seasonal berries.', 649, (SELECT id FROM cats WHERE slug='birthday'), 'placeholder:strawberry', true, false, 4.8),
  ('butterscotch-crunch', 'Butterscotch Crunch', 'Caramel-kissed butterscotch sponge with praline crunch and salted caramel drizzle.', 679, (SELECT id FROM cats WHERE slug='birthday'), 'placeholder:butterscotch', false, true, 4.7),
  ('blueberry-cheesecake', 'Blueberry Cheesecake', 'New York-style baked cheesecake on a buttery biscuit base, crowned with blueberry compote.', 899, (SELECT id FROM cats WHERE slug='cheesecakes'), 'placeholder:blueberry', true, false, 4.9),
  ('mango-passion-cheesecake', 'Mango Passion Cheesecake', 'Silky no-bake cheesecake with Alphonso mango glaze and a hint of passionfruit.', 849, (SELECT id FROM cats WHERE slug='cheesecakes'), 'placeholder:mango', false, false, 4.8),
  ('rose-pistachio-wedding', 'Rose & Pistachio Wedding Tier', 'Two-tier rose-water sponge with pistachio buttercream and edible florals. Made to order.', 3499, (SELECT id FROM cats WHERE slug='wedding'), 'placeholder:wedding', true, false, 5.0),
  ('cupcake-six-pack', 'Cupcake Six-Pack', 'A box of six bakery cupcakes — pick any flavors. Perfect for sharing.', 480, (SELECT id FROM cats WHERE slug='cupcakes'), 'placeholder:cupcake', false, true, 4.9),
  ('triple-fudge-brownies', 'Triple Fudge Brownies', 'Box of nine gooey, fudgy brownies with melted chocolate chunks.', 420, (SELECT id FROM cats WHERE slug='brownies'), 'placeholder:brownie', false, true, 4.9),
  ('coffee-walnut-celebration', 'Coffee Walnut Celebration', 'Bold coffee sponge layered with walnut praline and mascarpone cream.', 729, (SELECT id FROM cats WHERE slug='festive'), 'placeholder:coffee', false, false, 4.7)
ON CONFLICT (slug) DO NOTHING;

-- Variants for each product (size + flavor combos that adjust price)
INSERT INTO public.product_variants (product_id, size, flavor, price_delta)
SELECT p.id, s.size, 'Classic', s.delta FROM public.products p
CROSS JOIN (VALUES ('500g', 0::numeric), ('1kg', 350::numeric), ('1.5kg', 700::numeric), ('2kg', 1100::numeric)) AS s(size, delta)
WHERE p.slug NOT IN ('rose-pistachio-wedding','cupcake-six-pack','triple-fudge-brownies')
ON CONFLICT DO NOTHING;
