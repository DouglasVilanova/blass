import PageHeader from "@/components/gestao/PageHeader";
import { getSettings } from "@/lib/settings";
import { readStore } from "@/lib/store";
import Link from "next/link";
import CategoriasCardsEditor from "./editor";

export default async function Page() {
  const s = await getSettings();
  const { categories } = await readStore();
  return (
    <>
      <PageHeader title="Cards de Categorias" subtitle="Título e subtítulo acima dos cards. Os cards usam o nome e descrição de cada categoria." />
      <CategoriasCardsEditor initial={s.categoriesIntro} />
      <div className="mt-8 bg-white border border-brown/10 p-6 max-w-4xl">
        <div className="text-xs tracking-widest text-brown/60 uppercase font-semibold">Cards exibidos</div>
        <ul className="mt-3 space-y-2 text-sm">
          {categories.map((c) => (
            <li key={c.slug} className="flex items-center justify-between">
              <span>{c.name}</span>
              <Link href="/gestao/categorias" className="text-orange text-xs hover:underline">editar categoria →</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
