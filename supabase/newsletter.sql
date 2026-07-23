-- ============================================================
-- Blass — Newsletter (e-mails "Receba nossas novidades")
-- Run in Supabase SQL Editor. Safe to re-run.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  email       TEXT PRIMARY KEY,
  name        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Caso a tabela já exista sem a coluna name
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS name TEXT;

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Sem policies de leitura/escrita públicas: o insert é feito pela server
-- action (service_role, com validação + rate-limit) e a leitura só no painel.
