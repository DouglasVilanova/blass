-- ============================================================
-- Blass — Storage Bucket
-- Run in Supabase SQL Editor after migration.sql
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  10485760, -- 10 MB max (Sharp will reduce output to ~100-300 KB)
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif','image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "public read site-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

-- Service role writes (bypasses RLS already, but explicit for clarity)
CREATE POLICY "service upload site-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "service update site-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-images');

CREATE POLICY "service delete site-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-images');
