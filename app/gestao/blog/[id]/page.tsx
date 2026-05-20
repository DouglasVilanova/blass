import { notFound } from "next/navigation";
import { readStore } from "@/lib/store";
import { updatePost } from "../../actions";
import PostForm from "@/components/gestao/PostForm";

export default async function EditarPost({ params }: { params: { id: string } }) {
  const { blogPosts, blogCategories } = await readStore();
  const post = blogPosts.find((p) => p.id === params.id);
  if (!post) notFound();

  async function action(fd: FormData) {
    "use server";
    await updatePost(params.id, fd);
  }
  return (
    <div>
      <h1 className="font-display text-3xl">Editar post</h1>
      <p className="text-brown/70 mt-2">{post.title}</p>
      <div className="mt-8"><PostForm action={action} categories={blogCategories} initial={post} /></div>
    </div>
  );
}
