-- ============================================================
-- Blass — Newsletter (e-mails "Receba nossas novidades")
-- Run in Supabase SQL Editor. Safe to re-run.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  email       TEXT PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Sem policies de leitura/escrita públicas: o insert é feito pela server
-- action (service_role, com validação + rate-limit) e a leitura só no painel.
