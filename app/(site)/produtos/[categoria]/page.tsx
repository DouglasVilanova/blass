import { notFound, redirect } from "next/navigation";
import { getCategories } from "@/lib/db";

// Redirect /produtos/[categoria] → /produtos?cat=[categoria]
export default async function CategoryRedirect({ params }: { params: { categoria: string } }) {
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === params.categoria);
  if (!cat) notFound();
  redirect(`/produtos?cat=${params.categoria}`);
}
