export type Subcategory = { slug: string; name: string };
export type Category = {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  subcategories: Subcategory[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;        // category slug
  subcategory?: string;    // subcategory slug
  shortDescription?: string;
  description?: string;    // long, html or markdown
  image?: string;
  gallery?: string[];
  tags?: string[];         // e.g. ["Preto", "Alumínio", "3mm"]
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

export type SiteVisibility = {
  stats: boolean;
  tagline: boolean;
  highlight: boolean;
  reach: boolean;
};

export type SiteSeo = {
  head: string;
  bodyStart: string;
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
    phone: string;
    phoneDigits: string;
    email: string;
    address: string;
    instagram: string;
    facebook: string;
    linkedin: string;
  };
  visibility: SiteVisibility;
  seo: SiteSeo;
};

export type Store = {
  settings: SiteSettings;
  categories: Category[];
  products: Product[];
  blogCategories: BlogCategory[];
  blogPosts: BlogPost[];
};
