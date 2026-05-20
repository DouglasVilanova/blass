import Link from "next/link";
import { readStore } from "@/lib/store";

export const metadata = { title: "Blog — Blass" };

export default async function BlogIndex() {
  const { blogPosts, blogCategories } = await readStore();
  const posts = blogPosts.filter((p) => p.published).sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="font-display text-4xl text-brown">Blog</h1>
        <p className="text-brown/80 mt-2">Conteúdos sobre iluminação, projetos e tendências.</p>

        <div className="mt-10 grid md:grid-cols-3 gap-8">
          {posts.map((p) => {
            const cat = blogCategories.find((c) => c.slug === p.category);
            return (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group block bg-white border border-brown/10 hover:border-orange transition-colors">
                <div className="aspect-[16/10] bg-cream-dark overflow-hidden">
                  {p.coverImage && <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                </div>
                <div className="p-5">
                  {cat && <div className="text-[10px] tracking-widest text-orange">{cat.name.toUpperCase()}</div>}
                  <h3 className="font-display text-xl text-brown mt-1">{p.title}</h3>
                  {p.excerpt && <p className="text-sm text-brown/70 mt-2 line-clamp-3">{p.excerpt}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
