-- ============================================================
-- Blass — Security Hardening
-- Run in Supabase SQL Editor. Safe to re-run (idempotent).
--
-- Corrige:
--  1. RPC update_settings_section exposta a anon/public
--  2. Storage policies de escrita abertas a qualquer role
-- ============================================================

-- ── 1. RPC: revogar EXECUTE de public/anon ──────────────────
-- Funções Postgres têm EXECUTE para PUBLIC por padrão. A anon key
-- é pública (vai no browser), então qualquer um poderia chamar a RPC
-- e sobrescrever as configurações do site. Só o service_role deve poder.
REVOKE ALL ON FUNCTION public.update_settings_section(TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_settings_section(TEXT, JSONB) FROM anon;
REVOKE ALL ON FUNCTION public.update_settings_section(TEXT, JSONB) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.update_settings_section(TEXT, JSONB) TO service_role;

-- ── 2. Storage: remover policies de escrita abertas ─────────
-- As policies de INSERT/UPDATE/DELETE só checavam bucket_id, permitindo
-- que qualquer role (incl. anon) subisse/apagasse arquivos via API.
-- O service_role ignora RLS automaticamente, então o upload do servidor
-- continua funcionando sem nenhuma policy de escrita. Mantemos apenas a
-- leitura pública (bucket é público para servir as imagens).
DROP POLICY IF EXISTS "service upload site-images"  ON storage.objects;
DROP POLICY IF EXISTS "service update site-images"  ON storage.objects;
DROP POLICY IF EXISTS "service delete site-images"  ON storage.objects;

-- Leitura pública permanece (recriada de forma idempotente)
DROP POLICY IF EXISTS "public read site-images" ON storage.objects;
CREATE POLICY "public read site-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');

-- ── 3. Bucket: remover svg dos mime types aceitos ───────────
-- Defense-in-depth: SVG pode carregar <script>. O app já rasteriza
-- tudo para WebP, então não há perda.
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif']
WHERE id = 'site-images';
