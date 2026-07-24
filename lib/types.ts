export type Subcategory = { slug: string; name: string; image?: string };
export type Category = {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;          // foto do painel de nível 1 em /produtos
  subcategories: Subcategory[];
};

/** Grupo de característica: nome (ex: "Material") + 1+ valores (ex: ["Alumínio", "Aço"]) */
export type ProductAttribute = { name: string; values: string[] };

export type Product = {
  id: string;
  slug: string;
  name: string;
  code?: string;           // código/SKU do produto
  category: string;        // category slug
  subcategory?: string;    // subcategory slug
  shortDescription?: string;
  description?: string;    // long, html or markdown
  image?: string;
  gallery?: string[];
  /** @deprecated legado — migrado para attributes */
  tags?: string[];
  attributes?: ProductAttribute[];
  featured?: boolean;
  published?: boolean;
  createdAt: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  body: string;
  coverImage?: string;
  category?: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
};

export type BlogCategory = { slug: string; name: string };

export type Representante = {
  id: string;
  nome: string;
  empresa?: string;
  cidade?: string;
  estados: string[];
  phones: string[];
  emails: string[];
  published?: boolean;
  createdAt: string;
};

export type SiteVisibility = {
  stats: boolean;
  tagline: boolean;
  highlight: boolean;
  reach: boolean;
};

/** Posição de uma camada de imagem: centro em x/y (% do box) e largura w (% do box). */
export type LayerPos = { x: number; y: number; w: number };

/** Ajustes de layout/posicionamento por bloco (editáveis no painel). */
export type SiteLayouts = {
  construimos: {
    predioZoom: number; // escala CSS do prédio (1 = sem zoom)
    brilho: LayerPos;
  };
};

export type SiteSeo = {
  head: string;
  bodyStart: string;
  /** Códigos de verificação de propriedade — renderizados server-side no <head> (o robô lê o HTML bruto). */
  verification?: {
    google?: string;
    bing?: string;
    facebook?: string;
  };
};

export type SiteSettings = {
  hero: { title: string; subtitle: string; image: string; banners?: string[] };
  about: { paragraphs: string[] };
  categoriesIntro: { title: string; subtitle: string };
  stats: { years: string; resellers: string; coverage: string };
  tagline: { line1: string; highlight1: string; line2: string; highlight2: string; ctaLabel: string; ctaHref: string; image: string };
  highlight: {
    tag: string;
    title: string;
    subtitle: string;
    body: string;
    image: string;
  };
  reach: { title: string; body: string; ctaLabel: string; ctaHref: string };
  contact: {
    /** @deprecated legado — use phones[] */
    phone: string;
    phones?: string[];
    /** Primeiro número = principal (usado nos botões de WhatsApp do site) */
    phoneDigits: string;
    whatsapps?: string[];
    /** @deprecated legado — use emails[] */
    email: string;
    emails?: string[];
    address: string;
    instagram: string;
    facebook: string;
    linkedin: string;
  };
  visibility: SiteVisibility;
  seo: SiteSeo;
  layouts: SiteLayouts;
  construimos: { title: string; paragraphs: string[] };
  inovacao: { images: string[]; title: string; paragraphs: string[] };
  galeria: { images: string[] };
  pills: { words: string[] };
  tendencias: { text: string; highlight: string; image: string };
  categoriasCards: { cards: { label: string; href: string; off: string; on: string }[] };
  catalogo: { tag: string; title: string; subtitle: string };
};

export type Store = {
  settings: SiteSettings;
  categories: Category[];
  products: Product[];
  blogCategories: BlogCategory[];
  blogPosts: BlogPost[];
};
