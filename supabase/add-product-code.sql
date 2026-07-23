-- ============================================================
-- Produtos: campo de código (SKU) separado do nome
-- Run in Supabase SQL Editor. Safe to re-run.
-- ============================================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS code TEXT;
