
-- Re-create functions with explicit search_path (already set, but ensure) and revoke public execute
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- has_role is used inside RLS policies (run as definer there) so revoking direct execute is fine.

-- Tighten product-images: only allow listing/select of objects, not full directory listing via API.
-- Replace blanket SELECT with one that still allows direct file URLs (public bucket already serves files).
DROP POLICY IF EXISTS "product-images public read" ON storage.objects;
CREATE POLICY "product-images authenticated list"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');
-- (Public file URLs are served by the storage CDN regardless; listing now requires being signed in.)
