import { notFound } from "next/navigation";
import Link from "next/link";
import { readStore } from "@/lib/store";

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { blogPosts, blogCategories } = await readStore();
  const post = blogPosts.find((p) => p.slug === params.slug && p.published);
  if (!post) notFound();
  const cat = blogCategories.find((c) => c.slug === post.category);

  return (
    <article className="bg-cream py-16">
      <div className="mx-auto max-w-3xl px-6">
        <Link href="/blog" className="text-xs text-orange tracking-widest">← VOLTAR PARA O BLOG</Link>
        {cat && <div className="text-xs tracking-widest text-orange mt-6">{cat.name.toUpperCase()}</div>}
        <h1 className="font-exo font-bold text-4xl text-brown mt-2">{post.title}</h1>
        {post.publishedAt && <div className="text-sm text-brown/60 mt-2">{new Date(post.publishedAt).toLocaleDateString("pt-BR")}</div>}
        {post.coverImage && (
          <div className="mt-8 aspect-[16/9] overflow-hidden rounded-lg">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        {/* Corpo em HTML (gerado pelo editor rico, conteúdo só do admin) */}
        <div
          className="blog-body mt-8 text-brown/85 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </div>

      <style>{`
        .blog-body p { margin: 0 0 1em; }
        .blog-body h2 { font-family: var(--font-exo2); font-weight: 800; font-size: 1.6rem; color: #4F2612; margin: 1.6em 0 .5em; }
        .blog-body h3 { font-family: var(--font-exo2); font-weight: 700; font-size: 1.25rem; color: #4F2612; margin: 1.4em 0 .4em; }
        .blog-body ul, .blog-body ol { padding-left: 1.4em; margin: 0 0 1em; }
        .blog-body ul { list-style: disc; }
        .blog-body ol { list-style: decimal; }
        .blog-body li { margin-bottom: .35em; }
        .blog-body a { color: #F0781A; text-decoration: underline; text-underline-offset: 2px; }
        .blog-body strong { font-weight: 700; color: #4F2612; }
        .blog-body blockquote { border-left: 3px solid #F0781A; padding-left: 1em; font-style: italic; color: rgba(79,38,18,.7); margin: 1.2em 0; }
        .blog-body img { max-width: 100%; height: auto; border-radius: .5rem; margin: 1.4em 0; }
        .blog-body hr { border: none; border-top: 1px solid rgba(79,38,18,.15); margin: 1.8em 0; }
        .blog-body code { background: rgba(79,38,18,.08); padding: .1em .4em; border-radius: 4px; font-size: .9em; }
      `}</style>
    </article>
  );
}
