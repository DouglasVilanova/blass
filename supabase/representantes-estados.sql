-- ============================================================
-- Representantes: múltiplos estados, e-mails e telefones
-- Run in Supabase SQL Editor. Safe to re-run.
-- ============================================================

ALTER TABLE public.representantes ADD COLUMN IF NOT EXISTS estados JSONB DEFAULT '[]';
ALTER TABLE public.representantes ADD COLUMN IF NOT EXISTS emails JSONB DEFAULT '[]';
ALTER TABLE public.representantes ADD COLUMN IF NOT EXISTS phones JSONB DEFAULT '[]';

-- Migra os campos antigos (TEXT) para arrays, se ainda não migrados
UPDATE public.representantes
SET estados = jsonb_build_array(estado)
WHERE estado IS NOT NULL AND estado <> ''
  AND jsonb_array_length(COALESCE(estados, '[]'::jsonb)) = 0;

UPDATE public.representantes
SET emails = jsonb_build_array(email)
WHERE email IS NOT NULL AND email <> ''
  AND jsonb_array_length(COALESCE(emails, '[]'::jsonb)) = 0;

UPDATE public.representantes
SET phones = jsonb_build_array(phone)
WHERE phone IS NOT NULL AND phone <> ''
  AND jsonb_array_length(COALESCE(phones, '[]'::jsonb)) = 0;
