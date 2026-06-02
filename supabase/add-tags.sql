-- Adiciona campo tags em products (cores, tamanhos, material, etc.)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
