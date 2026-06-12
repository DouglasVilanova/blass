-- ============================================================
-- Blass — Storage Bucket
-- Run in Supabase SQL Editor after migration.sql
-- Safe to re-run (idempotent)
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies before recreating (idempotent)
DROP POLICY IF EXISTS "public read site-images"     ON storage.objects;
DROP POLICY IF EXISTS "service upload site-images"  ON storage.objects;
DROP POLICY IF EXISTS "service update site-images"  ON storage.objects;
DROP POLICY IF EXISTS "service delete site-images"  ON storage.objects;

-- Apenas leitura pública. Uploads/updates/deletes são feitos pelo
-- service_role no servidor, que IGNORA RLS — não precisa (e não deve ter)
-- policy de escrita, senão a anon key conseguiria gravar no bucket.
CREATE POLICY "public read site-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');
