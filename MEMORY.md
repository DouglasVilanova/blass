# Blass — Project Memory

## Identidade
- **Cliente:** Blass Iluminação & Componentes
- **Site atual:** https://blass.ind.br
- **Repo:** https://github.com/DouglasVilanova/blass
- **Deploy:** Vercel (framework preset: Next.js)
- **Email:** dodo.vilanova@gmail.com

## Design System (cores oficiais do Manual de Marca)
| Token | Valor | Tailwind |
|---|---|---|
| Cream | `#FFFADD` | `cream` |
| Brown | `#4F2612` | `brown` |
| Orange | `#F0781A` | `orange` |
| Night (fundo dark) | `#1F1108` | `night` |
| Night deep | `#150B05` | `night-deep` |
| Borda card (novo) | `#BB581D` | — |

Padrão de botões: `.btn-orange`, `.btn-outline` (globals.css)

## LP Nova — Design dark (concluída — 2026-06)
Seguindo o mockup em `C:\Blass\SITE BLASS NOVO\` (`site-exemple.png`). Tema **dark/cinematográfico**: fundo `night`, texto creme, fonte **Exo 2** (`font-exo`, Google Fonts) aplicada só no site via `app/(site)/layout.tsx` (admin segue Inter). Assets otimizados por `scripts/optimize-novo.mjs` → `public/novo/*.webp`.

### Ordem dos blocos da home (`app/(site)/page.tsx`)
| # | Bloco | Componente | Conteúdo / fonte de dados |
|---|---|---|---|
| 1 | Hero | `Hero.tsx` | img fixa `/novo/hero.webp` + texto de `settings.tagline` (line/highlight/cta) |
| 2 | A Blass que construímos | `About.tsx` + `ConstruimosCard.tsx` | texto FIXO + camadas prédio/mão/brilho posicionadas por `settings.layouts.construimos` |
| 3 | Inovação no setor moveleiro | `Inovacao.tsx` + `InovacaoCarousel.tsx` | texto FIXO + galeria editável `settings.inovacao.images` |
| 4 | Faixa Tendências | `Tendencias.tsx` | texto + bg `/novo/tendencias-fundo.webp` (FIXO) |
| 5 | Cards categoria LED | `CategoriasLed.tsx` | 3 cards aceso/apagado (crossfade CSS no hover), zigzag, links `/produtos?cat=` (FIXO) |
| 6 | Galeria "duas décadas" | `GaleriaDecadas.tsx` | esteira auto-rolagem `animate-marquee`, fotos `/novo/galeria-*.webp` (FIXO) |
| 7 | Pills categorias | `PillsCategorias.tsx` | marquee reverso lento, fundo `#FE7824` (FIXO) |
| 8 | Novidades | `FeaturedCarousel.tsx` | produtos com `featured=true` (carrossel dark, card borda laranja) |

Header (`components/Header.tsx`): pill flutuante translúcida sobre o hero, símbolo `/novo/simbolo.webp` + logo `/novo/logo-menu.webp` + nav fixo + WhatsApp/Instagram. Footer (`components/Footer.tsx`): logo `/novo/logo-rodape.webp` + menu + `settings.contact` + redes.

Borda entre blocos: `border-t border-[#6E5E53]` (1px). Borda de cards: degradê `from-[#BB581D]`.

### Editor de posição por bloco
Blocos com camadas sobrepostas têm página `/gestao/blocos/<bloco>` com sliders X/Y/Tamanho + preview ao vivo. Posições em `settings.layouts.<bloco>` (%). Componente de apresentação compartilhado entre site e editor (ex: `ConstruimosCard`) garante preview = resultado. Ver [[editor-posicao-blocos]].

### Blocos admin que sobraram (só os do design novo)
`/gestao/blocos/`: **tagline** (texto do Hero), **construimos** (posições), **inovacao** (galeria), **rodape** (contato). Removidos: hero, sobre, categorias-cards, stats, destaque, reach, menu. Componentes removidos: `Stats`, `ReachCTA`, `Highlight`, `CategoryCards`, `Tagline`, `HeroCarousel`, `BrazilOutline`, `BrandLogo`. Visibilidade reduzida a 1 toggle (Novidades = `visibility.highlight`).

> **NUNCA commit/push sem ordem do usuário** — redesign ajustado tudo localmente.

## Stack
| Camada | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript strict |
| Estilo | Tailwind CSS 3 |
| Banco | Supabase Postgres |
| Auth | **Env-based** (ADMIN_EMAIL/ADMIN_PASSWORD) + cookie HMAC-SHA256 — NÃO usa Supabase Auth |
| Storage | Supabase bucket `site-images` |
| Otimização imagem | Sharp → WebP por pasta: `site` 2400px q90, `products`/`blog` 1600px q85 |
| Deploy | Vercel |

> **REGRA — imagens sempre otimizadas:** toda imagem enviada pelo painel passa por Sharp → WebP antes de ir pro bucket `site-images`. Nunca guardar imagem (base64/binário) no Postgres — só a URL pública do bucket. Economiza espaço de banco e custo. Upload do browser também comprime client-side (canvas ≤2400px) antes do POST, pra não estourar o limite de 4.5 MB da Vercel.

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
| `/` | Home (LP dark nova — ver tabela de blocos acima) |
| `/produtos` | Catálogo e-commerce com filtros avançados |
| `/produtos?cat=iluminacao` | Filtro por categoria (URL param) |
| `/produtos?cat=iluminacao&attr=Cor:Branco&attr=Material:Aluminio` | Filtros combinados (atributos) |
| `/produtos/[categoria]/[slug]` | Detalhe do produto + galeria + lightbox |
| `/blog` | Listagem de posts |
| `/blog/[slug]` | Post individual |

### Admin `/gestao`
| Rota | Descrição |
|---|---|
| `/gestao` | Dashboard com status Supabase + storage |
| `/gestao/blocos/tagline` | **Hero**: texto (line/highlight) + label/href do botão |
| `/gestao/blocos/construimos` | **Bloco 2**: sliders de posição prédio/mão/brilho (`layouts.construimos`) |
| `/gestao/blocos/inovacao` | **Bloco 3**: galeria editável (`inovacao.images`) via GalleryUpload |
| `/gestao/blocos/rodape` | Contato (telefone/email/endereço/redes) — usado no Header e Footer |
| `/gestao/visibilidade` | Toggle do bloco Novidades (`visibility.highlight`) |
| `/gestao/seo` | Scripts livres `<head>` e `<body>` |
| `/gestao/security` | Info de segurança (login env-based) |
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
Campos USADOS na LP nova em **negrito**; os demais continuam no tipo (compat de dados) mas inertes.
```
hero          { title, subtitle, image, banners }   (inerte — Hero usa /novo/hero.webp fixo)
about         { paragraphs }                          (inerte — texto fixo no componente)
categoriesIntro { title, subtitle }                   (inerte)
stats         { years, resellers, coverage }          (inerte)
**tagline**   { line1, highlight1, line2, highlight2, ctaLabel, ctaHref, image }  → texto do Hero
highlight     { tag, ... }                             (só .tag é usado no Novidades)
reach         { ... }                                  (inerte)
**layouts**   { construimos: { predioZoom, mao{x,y,w}, brilho{x,y,w} } }  → posições do bloco 2
**inovacao**  { images: string[] }                     → galeria do bloco 3
**contact**   { phone, phoneDigits, email, address, instagram, facebook, linkedin }  → Header+Footer
**visibility** { highlight, ... }                      (só highlight usado = liga/desliga Novidades)
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
