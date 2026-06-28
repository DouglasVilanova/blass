/**
 * Data access layer — all queries go through here.
 * Uses service-role client (bypasses RLS) for write operations.
 * Uses anon client for reads where possible.
 */
import { createAdminSupabase, createClient } from "./supabase/server";
import type { BlogCategory, BlogPost, Category, Product, Representante } from "./types";

// ────────────────────────────────────────────────────────────
// REPRESENTANTES
// ────────────────────────────────────────────────────────────

export async function getRepresentantes(publishedOnly = false): Promise<Representante[]> {
  const sb = publishedOnly ? createClient() : createAdminSupabase();
  let q = sb.from("representantes").select("*").order("estado").order("cidade").order("nome");
  if (publishedOnly) q = q.eq("published", true);
  const { data } = await q;
  if (!data) return [];
  return data.map(rowToRepresentante);
}

export async function upsertRepresentante(r: Representante): Promise<void> {
  const sb = createAdminSupabase();
  await sb.from("representantes").upsert({
    id: r.id,
    nome: r.nome,
    empresa: r.empresa ?? null,
    cidade: r.cidade ?? null,
    estado: r.estado ?? null,
    phone: r.phone ?? null,
    email: r.email ?? null,
    published: r.published ?? true,
    created_at: r.createdAt,
  });
}

export async function deleteRepresentanteDb(id: string): Promise<void> {
  const sb = createAdminSupabase();
  await sb.from("representantes").delete().eq("id", id);
}

function rowToRepresentante(r: any): Representante {
  return {
    id: r.id,
    nome: r.nome,
    empresa: r.empresa ?? undefined,
    cidade: r.cidade ?? undefined,
    estado: r.estado ?? undefined,
    phone: r.phone ?? undefined,
    email: r.email ?? undefined,
    published: r.published ?? true,
    createdAt: r.created_at,
  };
}

// ────────────────────────────────────────────────────────────
// CATEGORIES
// ────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const sb = createClient();
  const { data } = await sb.from("categories").select("*").order("sort_order");
  if (!data) return [];
  return data.map(rowToCategory);
}

export async function upsertCategory(c: Category): Promise<void> {
  const sb = createAdminSupabase();
  await sb.from("categories").upsert({
    slug: c.slug,
    name: c.name,
    description: c.description ?? null,
    icon: c.icon ?? "lamp",
    subcategories: c.subcategories,
  });
}

export async function deleteCategoryDb(slug: string): Promise<void> {
  const sb = createAdminSupabase();
  await sb.from("categories").delete().eq("slug", slug);
}

function rowToCategory(r: any): Category {
  return {
    slug: r.slug,
    name: r.name,
    description: r.description ?? undefined,
    icon: r.icon ?? "lamp",
    subcategories: Array.isArray(r.subcategories) ? r.subcategories : [],
  };
}

// ────────────────────────────────────────────────────────────
// PRODUCTS
// ────────────────────────────────────────────────────────────

export async function getProducts(publishedOnly = false): Promise<Product[]> {
  // Admin calls (publishedOnly=false) need service-role to bypass RLS and see drafts
  const sb = publishedOnly ? createClient() : createAdminSupabase();
  let q = sb.from("products").select("*").order("created_at", { ascending: false });
  if (publishedOnly) q = q.eq("published", true);
  const { data } = await q;
  if (!data) return [];
  return data.map(rowToProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const sb = createAdminSupabase();
  const { data } = await sb.from("products").select("*").eq("id", id).single();
  return data ? rowToProduct(data) : null;
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const sb = createClient();
  const { data } = await sb
    .from("products")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (!data) return [];
  return data.map(rowToProduct);
}

export async function countFeaturedProducts(excludeId?: string): Promise<number> {
  const sb = createAdminSupabase();
  let q = sb
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("featured", true);
  if (excludeId) q = q.neq("id", excludeId);
  const { count } = await q;
  return count ?? 0;
}

export async function getProductBySlug(slug: string, category?: string): Promise<Product | null> {
  const sb = createClient();
  let q = sb.from("products").select("*").eq("slug", slug).eq("published", true);
  if (category) q = q.eq("category", category);
  const { data } = await q.single();
  return data ? rowToProduct(data) : null;
}

export async function upsertProduct(p: Product): Promise<void> {
  const sb = createAdminSupabase();
  await sb.from("products").upsert({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory ?? null,
    short_description: p.shortDescription ?? null,
    description: p.description ?? null,
    image: p.image ?? null,
    gallery: p.gallery ?? [],
    tags: p.tags ?? [],
    attributes: p.attributes ?? [],
    featured: p.featured ?? false,
    published: p.published ?? true,
    created_at: p.createdAt,
  });
}

export async function deleteProductDb(id: string): Promise<void> {
  const sb = createAdminSupabase();
  await sb.from("products").delete().eq("id", id);
}

function rowToProduct(r: any): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category ?? "",
    subcategory: r.subcategory ?? undefined,
    shortDescription: r.short_description ?? undefined,
    description: r.description ?? undefined,
    image: r.image ?? undefined,
    gallery: r.gallery ?? [],
    tags: Array.isArray(r.tags) ? r.tags : [],
    attributes: Array.isArray(r.attributes) ? r.attributes : [],
    featured: r.featured ?? false,
    published: r.published ?? true,
    createdAt: r.created_at,
  };
}

// ────────────────────────────────────────────────────────────
// BLOG CATEGORIES
// ────────────────────────────────────────────────────────────

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const sb = createClient();
  const { data } = await sb.from("blog_categories").select("*");
  if (!data) return [];
  return data.map((r) => ({ slug: r.slug, name: r.name }));
}

export async function upsertBlogCategory(c: BlogCategory): Promise<void> {
  const sb = createAdminSupabase();
  await sb.from("blog_categories").upsert({ slug: c.slug, name: c.name });
}

export async function deleteBlogCategoryDb(slug: string): Promise<void> {
  const sb = createAdminSupabase();
  await sb.from("blog_categories").delete().eq("slug", slug);
}

// ────────────────────────────────────────────────────────────
// BLOG POSTS
// ────────────────────────────────────────────────────────────

export async function getBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
  const sb = createAdminSupabase(); // need admin to see drafts in admin
  let q = sb.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (publishedOnly) q = q.eq("published", true);
  const { data } = await q;
  if (!data) return [];
  return data.map(rowToPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const sb = createClient();
  const { data } = await sb.from("blog_posts").select("*").eq("slug", slug).eq("published", true).single();
  return data ? rowToPost(data) : null;
}

export async function upsertBlogPost(p: BlogPost): Promise<void> {
  const sb = createAdminSupabase();
  await sb.from("blog_posts").upsert({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? null,
    body: p.body,
    cover_image: p.coverImage ?? null,
    category: p.category ?? null,
    published: p.published,
    published_at: p.publishedAt ?? null,
    created_at: p.createdAt,
  });
}

export async function deleteBlogPostDb(id: string): Promise<void> {
  const sb = createAdminSupabase();
  await sb.from("blog_posts").delete().eq("id", id);
}

function rowToPost(r: any): BlogPost {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? undefined,
    body: r.body ?? "",
    coverImage: r.cover_image ?? undefined,
    category: r.category ?? undefined,
    published: r.published ?? false,
    publishedAt: r.published_at ?? undefined,
    createdAt: r.created_at,
  };
}
