-- Imagem do painel de nível 1 da categoria (aparece em /produtos).
-- Vazio = o site usa a imagem padrão. Editável em /gestao/categorias.
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image TEXT;
