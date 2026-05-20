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
        <h1 className="font-display text-4xl text-brown mt-2">{post.title}</h1>
        {post.publishedAt && <div className="text-sm text-brown/60 mt-2">{new Date(post.publishedAt).toLocaleDateString("pt-BR")}</div>}
        {post.coverImage && (
          <div className="mt-8 aspect-[16/9] overflow-hidden">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="mt-8 text-brown/85 leading-relaxed whitespace-pre-line">{post.body}</div>
      </div>
    </article>
  );
}
