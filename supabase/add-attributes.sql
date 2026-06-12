-- Características estruturadas: [{ "name": "Material", "values": ["Alumínio", "Aço"] }]
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '[]';

-- Migra tags legadas (lista plana) para um grupo "Características"
-- Roda 1x — só converte produtos com tags e sem attributes
UPDATE public.products
SET attributes = jsonb_build_array(
  jsonb_build_object('name', 'Características', 'values', tags)
)
WHERE jsonb_array_length(COALESCE(tags, '[]'::jsonb)) > 0
  AND jsonb_array_length(COALESCE(attributes, '[]'::jsonb)) = 0;
