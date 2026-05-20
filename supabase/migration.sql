-- ============================================================
-- Blass — SQL Migration
-- Run in Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- ---------- SETTINGS ----------
CREATE TABLE IF NOT EXISTS public.settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO public.settings (id, data) VALUES (1, '{}') ON CONFLICT (id) DO NOTHING;

-- ---------- CATEGORIES ----------
CREATE TABLE IF NOT EXISTS public.categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'lamp',
  subcategories JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER DEFAULT 0
);

-- ---------- PRODUCTS ----------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT REFERENCES public.categories(slug) ON DELETE SET NULL,
  subcategory TEXT,
  short_description TEXT,
  description TEXT,
  image TEXT,
  gallery JSONB DEFAULT '[]',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------- BLOG CATEGORIES ----------
CREATE TABLE IF NOT EXISTS public.blog_categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- ---------- BLOG POSTS ----------
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT DEFAULT '',
  cover_image TEXT,
  category TEXT REFERENCES public.blog_categories(slug) ON DELETE SET NULL,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------- RPC: update_settings_section ----------
CREATE OR REPLACE FUNCTION public.update_settings_section(
  p_section TEXT,
  p_value JSONB
) RETURNS VOID AS $$
BEGIN
  UPDATE public.settings
  SET data = jsonb_set(COALESCE(data, '{}'), ARRAY[p_section], p_value, true),
      updated_at = NOW()
  WHERE id = 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------- RLS ----------
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public reads
CREATE POLICY "public read settings"     ON public.settings       FOR SELECT USING (true);
CREATE POLICY "public read categories"   ON public.categories     FOR SELECT USING (true);
CREATE POLICY "public read products"     ON public.products       FOR SELECT USING (published = true);
CREATE POLICY "public read blog_cats"    ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "public read blog_posts"   ON public.blog_posts     FOR SELECT USING (published = true);

-- Service role bypasses RLS automatically — no extra policies needed for writes.
-- When you add Supabase Auth later, replace service_role writes with:
-- USING (auth.role() = 'authenticated')

-- ---------- SEED: categories ----------
INSERT INTO public.categories (slug, name, description, icon, subcategories, sort_order)
VALUES
  ('iluminacao', 'Iluminação', 'Você cria o projeto, nós oferecemos as mais modernas soluções em iluminação e decoração.', 'lamp',
   '[
     {"slug":"fitas-de-led","name":"Fitas de LED"},
     {"slug":"luminarias-pontuais","name":"Luminárias pontuais"},
     {"slug":"fontes-e-drivers","name":"Fontes e drivers"},
     {"slug":"acionamentos","name":"Acionamentos"},
     {"slug":"acessorios","name":"Acessórios"},
     {"slug":"perfis-para-led","name":"Perfis para LED"},
     {"slug":"cabideiros-iluminados","name":"Cabideiros iluminados"}
   ]', 1),
  ('componentes', 'Componentes e Acessórios', 'Acabamentos diferenciados e uma ampla variedade de acessórios para todos os ambientes.', 'wrench',
   '[
     {"slug":"desempenadores-de-portas","name":"Desempenadores de portas"},
     {"slug":"suportes-para-tubo-cabideiro","name":"Suportes para tubo cabideiro"},
     {"slug":"tubo-para-cabideiro","name":"Tubo para cabideiro"},
     {"slug":"puxadores","name":"Puxadores"},
     {"slug":"tabuas-de-passar","name":"Tábuas de passar"},
     {"slug":"suporte-para-prateleira-fendas","name":"Suporte prateleira — Fendas"},
     {"slug":"suporte-para-prateleira-tucanos","name":"Suporte prateleira — Tucanos"},
     {"slug":"suporte-para-prateleira-mao-francesa","name":"Suporte prateleira — Mão francesa"},
     {"slug":"suporte-para-prateleira-invisiveis","name":"Suporte prateleira — Invisíveis"},
     {"slug":"acessorios","name":"Acessórios"},
     {"slug":"trava-porta","name":"Trava porta"},
     {"slug":"grade-forno","name":"Grade forno"}
   ]', 2)
ON CONFLICT (slug) DO NOTHING;

-- ---------- SEED: blog categories ----------
INSERT INTO public.blog_categories (slug, name)
VALUES
  ('iluminacao', 'Iluminação'),
  ('projetos', 'Projetos'),
  ('tendencias', 'Tendências')
ON CONFLICT (slug) DO NOTHING;
