"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { newId, slugify } from "@/lib/store";
import {
  upsertProduct, deleteProductDb,
  upsertCategory, deleteCategoryDb,
  upsertBlogPost, deleteBlogPostDb,
  upsertBlogCategory, deleteBlogCategoryDb,
  getCategories, getBlogCategories,
} from "@/lib/db";
import type { BlogCategory, BlogPost, Category, Product } from "@/lib/types";

// ────────────────────────────────────────────────────────────
// PRODUTOS
// ────────────────────────────────────────────────────────────

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const p: Product = {
    id: newId(),
    slug: slugify(String(formData.get("slug") || name)),
    name,
    category: String(formData.get("category") ?? ""),
    subcategory: String(formData.get("subcategory") ?? "") || undefined,
    shortDescription: String(formData.get("shortDescription") ?? "") || undefined,
    description: String(formData.get("description") ?? "") || undefined,
    image: String(formData.get("image") ?? "") || undefined,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    createdAt: new Date().toISOString(),
  };
  await upsertProduct(p);
  revalidatePath("/produtos");
  revalidatePath("/gestao/produtos");
  redirect("/gestao/produtos");
}

export async function updateProduct(id: string, formData: FormData) {
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === String(formData.get("category") ?? ""));
  const p: Product = {
    id,
    slug: slugify(String(formData.get("slug") || formData.get("name") || id)),
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    subcategory: String(formData.get("subcategory") ?? "") || undefined,
    shortDescription: String(formData.get("shortDescription") ?? "") || undefined,
    description: String(formData.get("description") ?? "") || undefined,
    image: String(formData.get("image") ?? "") || undefined,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    createdAt: new Date().toISOString(),
  };
  await upsertProduct(p);
  revalidatePath("/produtos");
  revalidatePath("/gestao/produtos");
  redirect("/gestao/produtos");
}

export async function deleteProduct(id: string) {
  await deleteProductDb(id);
  revalidatePath("/produtos");
  revalidatePath("/gestao/produtos");
}

// ────────────────────────────────────────────────────────────
// CATEGORIAS
// ────────────────────────────────────────────────────────────

export async function createCategory(formData: FormData) {
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
  revalidatePath("/produtos");
  revalidatePath("/gestao/categorias");
  redirect("/gestao/categorias");
}

export async function updateCategory(slug: string, formData: FormData) {
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
  revalidatePath("/produtos");
  revalidatePath("/gestao/categorias");
}

export async function deleteCategory(slug: string) {
  await deleteCategoryDb(slug);
  revalidatePath("/produtos");
  revalidatePath("/gestao/categorias");
}

export async function addSubcategory(catSlug: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === catSlug);
  if (!cat) return;
  const sub = { slug: slugify(String(formData.get("slug") || name)), name };
  if (cat.subcategories.find((s) => s.slug === sub.slug)) return;
  await upsertCategory({ ...cat, subcategories: [...cat.subcategories, sub] });
  revalidatePath("/produtos");
  revalidatePath("/gestao/categorias");
}

export async function removeSubcategory(catSlug: string, subSlug: string) {
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === catSlug);
  if (!cat) return;
  await upsertCategory({ ...cat, subcategories: cat.subcategories.filter((s) => s.slug !== subSlug) });
  revalidatePath("/produtos");
  revalidatePath("/gestao/categorias");
}

// ────────────────────────────────────────────────────────────
// BLOG
// ────────────────────────────────────────────────────────────

export async function createPost(formData: FormData) {
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
  revalidatePath("/gestao/blog");
  redirect("/gestao/blog");
}

export async function updatePost(id: string, formData: FormData) {
  const published = formData.get("published") === "on";
  const post: BlogPost = {
    id,
    slug: slugify(String(formData.get("slug") || formData.get("title") || id)),
    title: String(formData.get("title") ?? ""),
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
  revalidatePath("/gestao/blog");
  redirect("/gestao/blog");
}

export async function deletePost(id: string) {
  await deleteBlogPostDb(id);
  revalidatePath("/blog");
  revalidatePath("/gestao/blog");
}

export async function createBlogCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const c: BlogCategory = { slug: slugify(String(formData.get("slug") || name)), name };
  await upsertBlogCategory(c);
  revalidatePath("/gestao/blog");
}

export async function deleteBlogCategory(slug: string) {
  await deleteBlogCategoryDb(slug);
  revalidatePath("/gestao/blog");
}
