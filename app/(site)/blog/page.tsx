import Link from "next/link";
import { readStore } from "@/lib/store";
import type { BlogCategory, BlogPost } from "@/lib/types";

export const metadata = {
  title: "Blog",
  description:
    "Novidades, tendências e conteúdos sobre iluminação e componentes para móveis — Blass.",
  alternates: { canonical: "/blog" },
};

/** Card no estilo da referência: foto com badge da categoria sobreposta,
 *  título em caixa alta centralizado, resumo e "LEIA +". */
function PostCard({
  post,
  categories,
  large = false,
}: {
  post: BlogPost;
  categories: BlogCategory[];
  large?: boolean;
}) {
  const cat = categories.find((c) => c.slug === post.category);
  return (
    <Link href={`/blog/${post.slug}`} className="group block text-center">
      {/* Foto + badge */}
      <div className={`relative overflow-hidden bg-cream-dark ${large ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        {cat && (
          <span className="absolute top-3 right-3 rounded-full bg-brown/90 text-cream-light text-[10px] tracking-[0.15em] uppercase px-3 py-1.5">
            {cat.name}
          </span>
        )}
      </div>

      {/* Título + resumo + leia */}
      <h3 className={`font-exo font-bold uppercase text-brown leading-snug mt-5 ${large ? "text-lg md:text-xl" : "text-base"}`}>
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="text-sm text-brown/60 mt-2 line-clamp-3 max-w-md mx-auto">{post.excerpt}</p>
      )}
      <span className="inline-block mt-4 text-xs tracking-[0.25em] text-brown group-hover:text-orange transition-colors font-semibold">
        LEIA +
      </span>
    </Link>
  );
}

export default async function BlogIndex() {
  const { blogPosts, blogCategories } = await readStore();
  const posts = blogPosts
    .filter((p) => p.published)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

  // Recentes em destaque (2 colunas) + anteriores (3 colunas)
  const recentes = posts.slice(0, 4);
  const anteriores = posts.slice(4);

  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="font-exo font-bold text-4xl text-brown">Blog</h1>
        <p className="text-brown/80 mt-2">Conteúdos sobre iluminação, projetos e tendências.</p>

        {posts.length === 0 && (
          <p className="text-brown/50 mt-12 text-center">Nenhum post publicado ainda.</p>
        )}

        {/* Destaques recentes — 2 colunas, cards grandes */}
        {recentes.length > 0 && (
          <div className="mt-12 grid sm:grid-cols-2 gap-x-8 gap-y-14">
            {recentes.map((p) => (
              <PostCard key={p.id} post={p} categories={blogCategories} large />
            ))}
          </div>
        )}

        {/* Anteriores — divisor + 3 colunas menores */}
        {anteriores.length > 0 && (
          <>
            <div className="mt-20 mb-10 flex items-center gap-4">
              <span className="block w-10 h-[3px] bg-brown" />
              <h2 className="font-exo font-bold tracking-[0.25em] text-2xl text-brown uppercase">Anteriores</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {anteriores.map((p) => (
                <PostCard key={p.id} post={p} categories={blogCategories} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
