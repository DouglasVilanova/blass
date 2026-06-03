# Blass — Project Memory

## Identidade
- **Cliente:** Blass Iluminação & Componentes
- **Site atual:** https://blass.ind.br
- **Repo:** https://github.com/DouglasVilanova/blass
- **Deploy:** Vercel (framework preset: Next.js)
- **Email:** dodo.vilanova@gmail.com

## Design System
| Token | Valor | Tailwind |
|---|---|---|
| Cream | `#F4E8C5` | `cream` |
| Brown dark | `#3D2317` | `brown` |
| Brown mid | `#5E3520` | `brown-mid` |
| Orange | `#E87422` | `orange` |
| Fonte body | Inter | `font-sans` |
| Fonte display | Marcellus | `font-display` |

Padrão de botões: `.btn-orange`, `.btn-outline` (globals.css)
Padrão zigzag: `.pattern-zigzag` (globals.css)

## Stack
| Camada | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript strict |
| Estilo | Tailwind CSS 3 |
| Banco | Supabase Postgres |
| Auth | Supabase Auth ✅ (login + middleware + guard) |
| Storage | Supabase bucket `site-images` |
| Otimização imagem | Sharp → WebP 1400px max, quality 82 |
| Deploy | Vercel |

## Supabase
- **URL:** `https://xrpjblaodapidqeegzxy.supabase.co`
- **Project ref:** `xrpjblaodapidqeegzxy`
- **Anon key:** em `.env.local` (não commitar)
- **Service role key:** em `.env.local` (não commitar)
- **Bucket:** `site-images` (público, leitura livre)

### Tabelas
| Tabela | Propósito |
|---|---|
| `settings` | Row única id=1, coluna `data JSONB` — todos configs do site |
| `categories` | Categorias de produto com subcategorias como JSONB array |
| `products` | Catálogo completo |
| `blog_categories` | Categorias do blog |
| `blog_posts` | Posts do blog |

### RPC
- `update_settings_section(p_section TEXT, p_value JSONB)` → `jsonb_set` atômico na row de settings

### Migrations executadas
- `supabase/migration.sql` ✅ (tabelas + RLS + seed categorias)
- `supabase/storage.sql` — criar bucket (rodar se storage card no dashboard estiver vermelho)
- `supabase/add-tags.sql` ✅ (coluna `tags JSONB` em products)

## Variáveis de Ambiente
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://blass.ind.br
```
Setadas em: `.env.local` (dev) + Vercel Environment Variables (prod)

## Estrutura de Rotas

### Site público
| Rota | Descrição |
|---|---|
| `/` | Home (hero, sobre, cards categorias, stats, tagline, destaque, reach CTA) |
| `/produtos` | Catálogo e-commerce com filtros avançados |
| `/produtos?cat=iluminacao` | Filtro por categoria (URL param) |
| `/produtos?q=fita&sub=fitas-de-led&tag=Preto` | Filtros combinados |
| `/produtos/[categoria]/[slug]` | Detalhe do produto + galeria + lightbox |
| `/blog` | Listagem de posts |
| `/blog/[slug]` | Post individual |

### Admin `/gestao`
| Rota | Descrição |
|---|---|
| `/gestao` | Dashboard com status Supabase + storage |
| `/gestao/blocos/menu` | Header: telefone + redes sociais |
| `/gestao/blocos/hero` | Hero: título, subtítulo, imagem |
| `/gestao/blocos/sobre` | Parágrafos da seção Sobre |
| `/gestao/blocos/categorias-cards` | Intro dos cards de categoria |
| `/gestao/blocos/stats` | 26 anos / 2000+ revendas / cobertura |
| `/gestao/blocos/tagline` | Faixa "Qualidade que ilumina" |
| `/gestao/blocos/destaque` | Bloco Novidade/Fita COB |
| `/gestao/blocos/reach` | CTA "Quero comprar" + mapa |
| `/gestao/blocos/rodape` | Rodapé: contato completo |
| `/gestao/visibilidade` | Toggles on/off por bloco (filtra menu lateral) |
| `/gestao/seo` | Scripts livres `<head>` e `<body>` |
| `/gestao/produtos` | CRUD produtos (tabela com thumbnail) |
| `/gestao/produtos/novo` | Form novo produto |
| `/gestao/produtos/[id]` | Editar produto |
| `/gestao/categorias` | CRUD categorias + subcategorias inline |
| `/gestao/blog` | CRUD posts + categorias do blog |
| `/gestao/blog/novo` | Form novo post |
| `/gestao/blog/[id]` | Editar post |

## Categorias do produto
### Iluminação
Fitas de LED, Luminárias pontuais, Fontes e drivers, Acionamentos, Acessórios, Perfis para LED, Cabideiros iluminados

### Componentes e Acessórios
Desempenadores de portas, Suportes para tubo cabideiro, Tubo para cabideiro, Puxadores, Tábuas de passar, Suporte prateleira (Fendas / Tucanos / Mão francesa / Invisíveis), Acessórios, Trava porta, Grade forno

## Arquitetura de Dados

### Settings (lib/types.ts → SiteSettings)
```
hero          { title, subtitle, image }
about         { paragraphs: string[] }
categoriesIntro { title, subtitle }
stats         { years, resellers, coverage }
tagline       { line1, highlight1, line2, highlight2, ctaLabel, ctaHref, image }
highlight     { tag, title, subtitle, body, image }
reach         { title, body, ctaLabel, ctaHref }
contact       { phone, phoneDigits, email, address, instagram, facebook, linkedin }
visibility    { stats, tagline, highlight, reach }
seo           { head, bodyStart }
```

### Product (lib/types.ts)
```
id, slug, name, category, subcategory,
shortDescription, description,
image (URL), gallery (string[]),
tags (string[]),  ← filtros: cor, material, tamanho
featured, published, createdAt
```

## Lib Layer
| Arquivo | Responsabilidade |
|---|---|
| `lib/supabase/client.ts` | Browser client (anon key) |
| `lib/supabase/server.ts` | Server client (cookie) + admin (service role) |
| `lib/db.ts` | CRUD: getCategories, getProducts, upsertProduct, etc. |
| `lib/settings.ts` | getSettings() + saveSettingsSection() + mergeSettings() |
| `lib/auth-guard.ts` | requireAdmin() + validatePassword() |
| `lib/rate-limit.ts` | In-memory rate limiter |
| `lib/store.ts` | Facade: readStore() monta Store completo via lib/db |
| `lib/upload.ts` | Sharp optimize → WebP → Supabase Storage upload |
| `lib/types.ts` | Todos os tipos TypeScript |
| `lib/defaults.ts` | SITE_DEFAULTS: conteúdo seed pra fallback |

## Upload de Imagens
- Rota: `POST /api/upload` (Node.js runtime, `app/api/upload/route.ts`)
- Input: `FormData { file: File, folder: "products"|"blog"|"site" }`
- Pipeline: validação MIME → Sharp WebP 1400px q82 (SVG raw) → Supabase Storage
- Retorno: `{ url: string, path: string }`
- Limite: 10 MB input, ~80-250 KB output típico
- Path no bucket: `{folder}/{timestamp}-{random}.webp`

## Componentes Admin (components/gestao/)
| Componente | Uso |
|---|---|
| `SectionEditor` | Wrapper client: useState + useTransition + Toast + botão salvar |
| `ImageUpload` | Drag-drop, preview local, upload, remove |
| `GalleryUpload` | Multi-foto: grid thumbnails, reordenar ←→, remover |
| `ProductForm` | Form completo produto (foto, galeria, identificação, descrição, tags, opções) |
| `PostForm` | Form post blog |
| `Field` | Label + input wrapper padronizado |
| `PageHeader` | H1 + subtitle do admin |
| `Toast` | Provider + hook useToast() |

## Componentes Site (components/site/)
| Componente | Uso |
|---|---|
| `ProductCard` | Card e-commerce (imagem, categoria, tags, badge destaque) |
| `ProductFilters` | Sidebar filtros (busca, sort, categoria, subcategoria, tags, featured) |
| `ProductGallery` | Galeria com thumbnails, setas, dots, lightbox fullscreen |

## Filtros de Produto (/produtos)
Todos via URL search params:
- `?q=` busca texto (nome + descrição)
- `?cat=` categoria slug
- `?sub=` subcategoria slug (múltiplos: `?sub=a&sub=b`)
- `?tag=` tag (múltiplos)
- `?featured=1` só destaques
- `?sort=newest|az|za|featured`

## Visibilidade de Blocos
Settings `visibility.*` controla:
1. Bloco aparece na home pública
2. Item aparece no menu lateral do admin

Blocos toggleáveis: `stats`, `tagline`, `highlight`, `reach`
Blocos sempre visíveis: hero, sobre, categorias-cards, menu, rodape

## Segurança (implementado)
- `middleware.ts` — protege `/gestao/*`, redireciona `/gestao/login`, refresh session
- `lib/auth-guard.ts` — `requireAdmin()` em toda server action de escrita; `validatePassword()` (10 chars + upper + lower + digit)
- `lib/rate-limit.ts` — in-memory, login 5 tentativas/15min por IP+email
- `app/gestao/login/` — página pública de login + signIn/signOut actions
- `app/gestao/security/` — troca de senha com validação de política
- `next.config.mjs` — HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP

### CSP inclui
- Google Analytics / GTM ready
- Supabase storage (`*.supabase.co`)
- YouTube frames (blog vídeos futuros)
- Inline styles (Tailwind)

## Páginas especiais
- `app/not-found.tsx` — 404 branded Blass
- `app/error.tsx` — 500 branded com retry
- `app/opengraph-image.tsx` — OG dinâmico via `next/og` (edge runtime)

## Criar primeiro admin (Supabase)
Dashboard → Authentication → Users → **Add user** → email + senha

## Próximos Passos Planejados
- [x] Auth Supabase: login + middleware + guard ✅
- [x] Troca de senha `/gestao/security` ✅
- [x] Middleware de sessão ✅
- [ ] Upload imagem para blocos do site (hero, destaque, etc.)
- [ ] Formulário de contato funcional (POST `/api/contact` → email via Resend)
- [ ] SEO: sitemap.xml + robots.txt automáticos
- [ ] Página `/quero-comprar` com mapa de revendas
- [ ] Catálogo PDF gerado dinamicamente

## Comandos
```bash
cd C:\Blass
npm run dev          # dev local http://localhost:3000
npm run build        # build prod
git add -A && git commit -m "..." && git push   # deploy (Vercel auto)
```
