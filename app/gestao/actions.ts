"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mutate, newId, slugify } from "@/lib/store";
import type { BlogCategory, BlogPost, Category, Product, SiteSettings } from "@/lib/types";

// ---------- PRODUTOS ----------

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const id = newId();
  const slug = slugify(String(formData.get("slug") || name));
  await mutate((s) => {
    const p: Product = {
      id,
      slug,
      name,
      category: String(formData.get("category") ?? s.categories[0]?.slug ?? ""),
      subcategory: String(formData.get("subcategory") ?? "") || undefined,
      shortDescription: String(formData.get("shortDescription") ?? "") || undefined,
      description: String(formData.get("description") ?? "") || undefined,
      image: String(formData.get("image") ?? "") || undefined,
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      createdAt: new Date().toISOString(),
    };
    s.products.unshift(p);
  });
  revalidatePath("/produtos");
  revalidatePath("/gestao/produtos");
  redirect("/gestao/produtos");
}

export async function updateProduct(id: string, formData: FormData) {
  await mutate((s) => {
    const p = s.products.find((x) => x.id === id);
    if (!p) return;
    p.name = String(formData.get("name") ?? p.name);
    p.slug = slugify(String(formData.get("slug") || p.name));
    p.category = String(formData.get("category") ?? p.category);
    p.subcategory = String(formData.get("subcategory") ?? "") || undefined;
    p.shortDescription = String(formData.get("shortDescription") ?? "") || undefined;
    p.description = String(formData.get("description") ?? "") || undefined;
    p.image = String(formData.get("image") ?? "") || undefined;
    p.featured = formData.get("featured") === "on";
    p.published = formData.get("published") === "on";
  });
  revalidatePath("/produtos");
  revalidatePath("/gestao/produtos");
  redirect("/gestao/produtos");
}

export async function deleteProduct(id: string) {
  await mutate((s) => {
    s.products = s.products.filter((p) => p.id !== id);
  });
  revalidatePath("/produtos");
  revalidatePath("/gestao/produtos");
}

// ---------- CATEGORIAS ----------

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await mutate((s) => {
    const slug = slugify(String(formData.get("slug") || name));
    if (s.categories.find((c) => c.slug === slug)) return;
    const c: Category = {
      slug,
      name,
      description: String(formData.get("description") ?? "") || undefined,
      icon: String(formData.get("icon") ?? "lamp"),
      subcategories: [],
    };
    s.categories.push(c);
  });
  revalidatePath("/produtos");
  revalidatePath("/gestao/categorias");
  redirect("/gestao/categorias");
}

export async function updateCategory(slug: string, formData: FormData) {
  await mutate((s) => {
    const c = s.categories.find((x) => x.slug === slug);
    if (!c) return;
    c.name = String(formData.get("name") ?? c.name);
    c.description = String(formData.get("description") ?? "") || undefined;
    c.icon = String(formData.get("icon") ?? c.icon ?? "lamp");
  });
  revalidatePath("/produtos");
  revalidatePath("/gestao/categorias");
}

export async function deleteCategory(slug: string) {
  await mutate((s) => {
    s.categories = s.categories.filter((c) => c.slug !== slug);
    s.products = s.products.filter((p) => p.category !== slug);
  });
  revalidatePath("/produtos");
  revalidatePath("/gestao/categorias");
}

export async function addSubcategory(catSlug: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await mutate((s) => {
    const c = s.categories.find((x) => x.slug === catSlug);
    if (!c) return;
    const slug = slugify(String(formData.get("slug") || name));
    if (c.subcategories.find((sc) => sc.slug === slug)) return;
    c.subcategories.push({ slug, name });
  });
  revalidatePath("/produtos");
  revalidatePath("/gestao/categorias");
}

export async function removeSubcategory(catSlug: string, subSlug: string) {
  await mutate((s) => {
    const c = s.categories.find((x) => x.slug === catSlug);
    if (!c) return;
    c.subcategories = c.subcategories.filter((sc) => sc.slug !== subSlug);
  });
  revalidatePath("/produtos");
  revalidatePath("/gestao/categorias");
}

// ---------- BLOG ----------

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  await mutate((s) => {
    const slug = slugify(String(formData.get("slug") || title));
    const post: BlogPost = {
      id: newId(),
      slug,
      title,
      excerpt: String(formData.get("excerpt") ?? "") || undefined,
      body: String(formData.get("body") ?? ""),
      coverImage: String(formData.get("coverImage") ?? "") || undefined,
      category: String(formData.get("category") ?? "") || undefined,
      published: formData.get("published") === "on",
      publishedAt: formData.get("published") === "on" ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
    };
    s.blogPosts.unshift(post);
  });
  revalidatePath("/blog");
  revalidatePath("/gestao/blog");
  redirect("/gestao/blog");
}

export async function updatePost(id: string, formData: FormData) {
  await mutate((s) => {
    const p = s.blogPosts.find((x) => x.id === id);
    if (!p) return;
    const wasPublished = p.published;
    p.title = String(formData.get("title") ?? p.title);
    p.slug = slugify(String(formData.get("slug") || p.title));
    p.excerpt = String(formData.get("excerpt") ?? "") || undefined;
    p.body = String(formData.get("body") ?? p.body);
    p.coverImage = String(formData.get("coverImage") ?? "") || undefined;
    p.category = String(formData.get("category") ?? "") || undefined;
    p.published = formData.get("published") === "on";
    if (p.published && !wasPublished) p.publishedAt = new Date().toISOString();
  });
  revalidatePath("/blog");
  revalidatePath("/gestao/blog");
  redirect("/gestao/blog");
}

export async function deletePost(id: string) {
  await mutate((s) => {
    s.blogPosts = s.blogPosts.filter((p) => p.id !== id);
  });
  revalidatePath("/blog");
  revalidatePath("/gestao/blog");
}

export async function createBlogCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await mutate((s) => {
    const slug = slugify(String(formData.get("slug") || name));
    if (s.blogCategories.find((c) => c.slug === slug)) return;
    s.blogCategories.push({ slug, name });
  });
  revalidatePath("/gestao/blog");
}

export async function deleteBlogCategory(slug: string) {
  await mutate((s) => {
    s.blogCategories = s.blogCategories.filter((c) => c.slug !== slug);
  });
  revalidatePath("/gestao/blog");
}

// ---------- SETTINGS ----------

export async function updateSettings(formData: FormData) {
  await mutate((s) => {
    const get = (k: string) => String(formData.get(k) ?? "");
    s.settings.hero.title = get("hero.title") || s.settings.hero.title;
    s.settings.hero.subtitle = get("hero.subtitle") || s.settings.hero.subtitle;
    s.settings.hero.image = get("hero.image") || s.settings.hero.image;

    s.settings.about.paragraphs = get("about.paragraphs").split("\n\n").filter(Boolean);

    s.settings.stats.years = get("stats.years") || s.settings.stats.years;
    s.settings.stats.resellers = get("stats.resellers") || s.settings.stats.resellers;
    s.settings.stats.coverage = get("stats.coverage") || s.settings.stats.coverage;

    s.settings.highlight.tag = get("highlight.tag") || s.settings.highlight.tag;
    s.settings.highlight.title = get("highlight.title") || s.settings.highlight.title;
    s.settings.highlight.subtitle = get("highlight.subtitle") || s.settings.highlight.subtitle;
    s.settings.highlight.body = get("highlight.body") || s.settings.highlight.body;
    s.settings.highlight.image = get("highlight.image") || s.settings.highlight.image;

    s.settings.reach.title = get("reach.title") || s.settings.reach.title;
    s.settings.reach.body = get("reach.body") || s.settings.reach.body;
    s.settings.reach.ctaLabel = get("reach.ctaLabel") || s.settings.reach.ctaLabel;
    s.settings.reach.ctaHref = get("reach.ctaHref") || s.settings.reach.ctaHref;

    s.settings.contact.phone = get("contact.phone") || s.settings.contact.phone;
    s.settings.contact.phoneDigits = get("contact.phoneDigits") || s.settings.contact.phoneDigits;
    s.settings.contact.email = get("contact.email") || s.settings.contact.email;
    s.settings.contact.address = get("contact.address") || s.settings.contact.address;
    s.settings.contact.instagram = get("contact.instagram") || s.settings.contact.instagram;
    s.settings.contact.facebook = get("contact.facebook") || s.settings.contact.facebook;
    s.settings.contact.linkedin = get("contact.linkedin") || s.settings.contact.linkedin;
  });
  revalidatePath("/");
  revalidatePath("/gestao/configuracoes");
}
