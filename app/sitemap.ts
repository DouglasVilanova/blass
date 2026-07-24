import type { MetadataRoute } from "next";
import { getProducts, getBlogPosts } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

// Revalida de hora em hora — novos produtos/posts entram no sitemap sozinhos.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([
    getProducts(true).catch(() => []),
    getBlogPosts(true).catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/produtos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/representantes`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => p.category && p.slug)
    .map((p) => ({
      url: `${SITE_URL}/produtos/${p.category}/${p.slug}`,
      lastModified: p.createdAt ? new Date(p.createdAt) : undefined,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const postRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.publishedAt
        ? new Date(p.publishedAt)
        : p.createdAt
        ? new Date(p.createdAt)
        : undefined,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [...staticRoutes, ...productRoutes, ...postRoutes];
}
