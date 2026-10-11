
-- 1. Set search_path on touch_updated_at (handle_new_user already had it)
ALTER FUNCTION public.touch_updated_at() SET search_path = public;

-- 2. Restrict custom_orders insert: must be either anonymous (no user_id) or matching auth.uid().
DROP POLICY IF EXISTS "custom_orders_anyone_insert" ON public.custom_orders;
CREATE POLICY "custom_orders_insert" ON public.custom_orders
  FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- 3. Storage product-images: restrict listing to admins. Files are still publicly served by CDN.
DROP POLICY IF EXISTS "product-images authenticated list" ON storage.objects;
CREATE POLICY "product-images admin list"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
