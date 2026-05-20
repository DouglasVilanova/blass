# Blass — Site institucional + Catálogo + Blog + Gestão

Stack: Next.js 14 (App Router), Tailwind, TypeScript.
Persistência exemplo: `data/store.json` (sem banco). Migrar para Supabase depois.

## Rodar

```bash
cd C:\Blass
npm install
npm run dev
```

Acesse:
- Site: http://localhost:3000
- Produtos: http://localhost:3000/produtos
- Blog: http://localhost:3000/blog
- Gestão: http://localhost:3000/gestao

## Design System

Cores (tailwind.config.ts):
- `cream` `#F4E8C5`
- `brown` `#3D2317`
- `orange` `#E87422`

Fontes (Google Fonts via `next/font`):
- `Inter` — body (`font-sans`)
- `Marcellus` — display/serif (`font-display`)

## Estrutura

```
app/
  (site)/            # site público
    page.tsx         # home (réplica do design)
    produtos/        # listagem + categoria + detalhe
    blog/            # listagem + post
  gestao/            # painel admin (CRUD)
    produtos/
    categorias/      # categorias + subcategorias
    blog/
    configuracoes/   # textos/imagens do site
components/
  sections/          # blocos da home
  gestao/            # forms do admin
lib/
  types.ts           # schema
  defaults.ts        # conteúdo seed
  store.ts           # leitura/escrita do JSON
data/
  store.json         # estado (gerado no primeiro acesso)
```

## Imagens

Drope arquivos em `public/images/` (ex.: `hero.jpg`, `highlight.jpg`, `products/...`). Os caminhos já estão referenciados nos defaults — basta colocar as imagens.

## Migração para Supabase (próximo passo)

1. Criar projeto Supabase
2. Tabelas: `settings` (jsonb), `products`, `categories`, `subcategories`, `blog_posts`, `blog_categories`
3. Storage bucket: `site-images`
4. Substituir `lib/store.ts` por wrappers em `lib/supabase/*`
5. Manter `mutate()` e tipos para não tocar nas pages

Tipos em `lib/types.ts` já estão prontos pra mapear 1:1.
