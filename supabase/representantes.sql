-- ============================================================
-- Blass — Representantes
-- Run in Supabase SQL Editor. Safe to re-run.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.representantes (
  id          TEXT PRIMARY KEY,
  nome        TEXT NOT NULL,
  empresa     TEXT,
  cidade      TEXT,
  estado      TEXT,
  phone       TEXT,
  email       TEXT,
  published   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.representantes ENABLE ROW LEVEL SECURITY;

-- Leitura pública só dos publicados (site). Escrita: só service_role (server), que ignora RLS.
DROP POLICY IF EXISTS "public read representantes" ON public.representantes;
CREATE POLICY "public read representantes"
  ON public.representantes FOR SELECT
  USING (published = true);
