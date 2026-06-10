"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { newId, slugify } from "@/lib/store";
import { requireAdmin } from "@/lib/auth-guard";
import { deleteImageUrls } from "@/lib/upload";
import {
  upsertProduct, deleteProductDb, getProductById,
  upsertCategory, deleteCategoryDb,
  upsertBlogPost, deleteBlogPostDb,
  upsertBlogCategory, deleteBlogCategoryDb,
  getCategories, getBlogCategories,
  getBlogPosts, countFeaturedProducts,
} from "@/lib/db";

const MAX_FEATURED = 6;
import type { BlogCategory, BlogPost, Category, Product } from "@/lib/types";

// ────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────

function parseJsonArray(formData: FormData, key: string): string[] {
  try {
    const raw = String(formData.get(key) ?? "[]");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
  } catch { return []; }
}

/** Collect all image URLs of a product (main + gallery) */
function productImages(p: Product): string[] {
  return [p.image, ...(p.gallery ?? [])].filter(Boolean) as string[];
}

/** Images that were in old but removed in new (to clean from storage) */
function removedImages(oldUrls: string[], newUrls: string[]): string[] {
  const newSet = new Set(newUrls);
  return oldUrls.filter((u) => u && !newSet.has(u));
}

// ────────────────────────────────────────────────────────────
// PRODUTOS
// ────────────────────────────────────────────────────────────

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  let featured = formData.get("featured") === "on";

  // Enforce max featured limit
  if (featured) {
    const count = await countFeaturedProducts();
    if (count >= MAX_FEATURED) {
      featured = false;
      // Silently demote — admin sees product saved but not featured
      // (better UX would be a toast warning, but actions can't return + redirect)
    }
  }

  const p: Product = {
    id: newId(),
    slug: slugify(String(formData.get("slug") || name)),
    name,
    category: String(formData.get("category") ?? ""),
    subcategory: String(formData.get("subcategory") ?? "") || undefined,
    shortDescription: String(formData.get("shortDescription") ?? "") || undefined,
    description: String(formData.get("description") ?? "") || undefined,
    image: String(formData.get("image") ?? "") || undefined,
    gallery: parseJsonArray(formData, "gallery"),
    tags: parseJsonArray(formData, "tags"),
    featured,
    published: formData.get("published") === "on",
    createdAt: new Date().toISOString(),
  };

  await upsertProduct(p);
  revalidatePath("/produtos", "layout");
  revalidatePath("/gestao/produtos");
  redirect("/gestao/produtos");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  // Fetch existing to preserve createdAt and detect removed images
  const existing = await getProductById(id);

  const newImage = String(formData.get("image") ?? "") || undefined;
  const newGallery = parseJsonArray(formData, "gallery");

  let featured = formData.get("featured") === "on";

  // Enforce max featured limit (exclude self when counting)
  if (featured && !existing?.featured) {
    const count = await countFeaturedProducts(id);
    if (count >= MAX_FEATURED) {
      featured = false; // demoted silently
    }
  }

  const p: Product = {
    id,
    slug: slugify(String(formData.get("slug") || formData.get("name") || id)),
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    subcategory: String(formData.get("subcategory") ?? "") || undefined,
    shortDescription: String(formData.get("shortDescription") ?? "") || undefined,
    description: String(formData.get("description") ?? "") || undefined,
    image: newImage,
    gallery: newGallery,
    tags: parseJsonArray(formData, "tags"),
    featured,
    published: formData.get("published") === "on",
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };

  // Delete storage files that were removed during edit
  if (existing) {
    const oldUrls = productImages(existing);
    const newUrls = productImages(p);
    const toDelete = removedImages(oldUrls, newUrls);
    if (toDelete.length > 0) {
      await deleteImageUrls(toDelete).catch(console.error);
    }
  }

  await upsertProduct(p);
  revalidatePath("/produtos", "layout");
  revalidatePath(`/produtos/${p.category}/${p.slug}`);
  revalidatePath("/gestao/produtos");
  redirect("/gestao/produtos");
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  // Fetch before delete to clean up storage
  const existing = await getProductById(id);
  if (existing) {
    const urls = productImages(existing);
    if (urls.length > 0) {
      await deleteImageUrls(urls).catch(console.error);
    }
  }

  await deleteProductDb(id);
  revalidatePath("/produtos", "layout");
  revalidatePath("/gestao/produtos");
}

export async function deleteProducts(ids: string[]): Promise<{ deleted: number; error?: string }> {
  await requireAdmin();

  if (!ids || ids.length === 0) return { deleted: 0 };

  // Collect all image URLs across all products
  const allUrls: string[] = [];
  for (const id of ids) {
    const p = await getProductById(id);
    if (p) allUrls.push(...productImages(p));
  }

  // Delete storage files in batch
  if (allUrls.length > 0) {
    await deleteImageUrls(allUrls).catch(console.error);
  }

  // Delete products in batch
  let deleted = 0;
  for (const id of ids) {
    try {
      await deleteProductDb(id);
      deleted++;
    } catch (e) {
      console.error(`Falha ao excluir ${id}`, e);
    }
  }

  revalidatePath("/produtos", "layout");
  revalidatePath("/gestao/produtos");
  return { deleted };
}

// ────────────────────────────────────────────────────────────
// CATEGORIAS
// ────────────────────────────────────────────────────────────

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const c: Category = {
    slug: slugify(String(formData.get("slug") || name)),
    name,
    description: String(formData.get("description") ?? "") || undefined,
    icon: String(formData.get("icon") ?? "lamp"),
    subcategories: [],
  };
  await upsertCategory(c);
  revalidatePath("/produtos", "layout");
  revalidatePath("/gestao/categorias");
  redirect("/gestao/categorias");
}

export async function updateCategory(slug: string, formData: FormData) {
  await requireAdmin();

  const categories = await getCategories();
  const existing = categories.find((c) => c.slug === slug);
  if (!existing) return;
  const updated: Category = {
    ...existing,
    name: String(formData.get("name") ?? existing.name),
    description: String(formData.get("description") ?? "") || undefined,
    icon: String(formData.get("icon") ?? existing.icon ?? "lamp"),
  };
  await upsertCategory(updated);
  revalidatePath("/produtos", "layout");
  revalidatePath("/gestao/categorias");
}

export async function deleteCategory(slug: string) {
  await requireAdmin();
  await deleteCategoryDb(slug);
  revalidatePath("/produtos", "layout");
  revalidatePath("/gestao/categorias");
}

export async function addSubcategory(catSlug: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === catSlug);
  if (!cat) return;
  const sub = { slug: slugify(String(formData.get("slug") || name)), name };
  if (cat.subcategories.find((s) => s.slug === sub.slug)) return;
  await upsertCategory({ ...cat, subcategories: [...cat.subcategories, sub] });
  revalidatePath("/produtos", "layout");
  revalidatePath("/gestao/categorias");
}

// Inline creation from product form (no redirect, returns new item)
export async function createCategoryInline(
  name: string
): Promise<{ slug: string; name: string } | { error: string }> {
  try {
    await requireAdmin();
    const clean = name.trim();
    if (!clean) return { error: "Nome obrigatório." };

    const categories = await getCategories();
    const slug = slugify(clean);
    if (categories.find((c) => c.slug === slug)) {
      return { error: `Categoria "${clean}" já existe.` };
    }

    await upsertCategory({
      slug,
      name: clean,
      icon: "lamp",
      subcategories: [],
    });
    revalidatePath("/produtos", "layout");
    revalidatePath("/gestao/categorias");
    return { slug, name: clean };
  } catch (e: any) {
    return { error: e?.message ?? "Erro ao criar categoria" };
  }
}

export async function createSubcategoryInline(
  catSlug: string,
  name: string
): Promise<{ slug: string; name: string } | { error: string }> {
  try {
    await requireAdmin();
    const clean = name.trim();
    if (!clean) return { error: "Nome obrigatório." };
    if (!catSlug) return { error: "Selecione uma categoria primeiro." };

    const categories = await getCategories();
    const cat = categories.find((c) => c.slug === catSlug);
    if (!cat) return { error: "Categoria não encontrada." };

    const slug = slugify(clean);
    if (cat.subcategories.find((s) => s.slug === slug)) {
      return { error: `Subcategoria "${clean}" já existe.` };
    }

    await upsertCategory({
      ...cat,
      subcategories: [...cat.subcategories, { slug, name: clean }],
    });
    revalidatePath("/produtos", "layout");
    revalidatePath("/gestao/categorias");
    return { slug, name: clean };
  } catch (e: any) {
    return { error: e?.message ?? "Erro ao criar subcategoria" };
  }
}

export async function removeSubcategory(catSlug: string, subSlug: string) {
  await requireAdmin();

  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === catSlug);
  if (!cat) return;
  await upsertCategory({ ...cat, subcategories: cat.subcategories.filter((s) => s.slug !== subSlug) });
  revalidatePath("/produtos", "layout");
  revalidatePath("/gestao/categorias");
}

// ────────────────────────────────────────────────────────────
// BLOG
// ────────────────────────────────────────────────────────────

export async function createPost(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const published = formData.get("published") === "on";
  const post: BlogPost = {
    id: newId(),
    slug: slugify(String(formData.get("slug") || title)),
    title,
    excerpt: String(formData.get("excerpt") ?? "") || undefined,
    body: String(formData.get("body") ?? ""),
    coverImage: String(formData.get("coverImage") ?? "") || undefined,
    category: String(formData.get("category") ?? "") || undefined,
    published,
    publishedAt: published ? new Date().toISOString() : undefined,
    createdAt: new Date().toISOString(),
  };
  await upsertBlogPost(post);
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/gestao/blog");
  redirect("/gestao/blog");
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin();

  // Fetch existing to preserve publishedAt and createdAt
  const posts = await getBlogPosts();
  const existing = posts.find((p) => p.id === id);
  const published = formData.get("published") === "on";
  const wasPublished = existing?.published ?? false;

  const post: BlogPost = {
    id,
    slug: slugify(String(formData.get("slug") || formData.get("title") || id)),
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? "") || undefined,
    body: String(formData.get("body") ?? ""),
    coverImage: String(formData.get("coverImage") ?? "") || undefined,
    category: String(formData.get("category") ?? "") || undefined,
    published,
    // Only stamp publishedAt on first publish
    publishedAt: published ? (existing?.publishedAt ?? new Date().toISOString()) : undefined,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };

  await upsertBlogPost(post);
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/gestao/blog");
  redirect("/gestao/blog");
}

export async function deletePost(id: string) {
  await requireAdmin();
  await deleteBlogPostDb(id);
  revalidatePath("/blog");
  revalidatePath("/gestao/blog");
}

export async function createBlogCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const c: BlogCategory = { slug: slugify(String(formData.get("slug") || name)), name };
  await upsertBlogCategory(c);
  revalidatePath("/gestao/blog");
}

export async function deleteBlogCategory(slug: string) {
  await requireAdmin();
  await deleteBlogCategoryDb(slug);
  revalidatePath("/gestao/blog");
}
