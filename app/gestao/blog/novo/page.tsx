import { readStore } from "@/lib/store";
import { createPost } from "../../actions";
import PostForm from "@/components/gestao/PostForm";

export default async function NovoPost() {
  const { blogCategories } = await readStore();
  return (
    <div>
      <h1 className="font-display text-3xl">Novo post</h1>
      <div className="mt-8"><PostForm action={createPost} categories={blogCategories} /></div>
    </div>
  );
}
