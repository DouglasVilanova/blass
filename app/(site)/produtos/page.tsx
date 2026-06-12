import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/db";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/site/ProductCard";
import ProductFilters from "@/components/site/ProductFilters";
import { getAdminEmail } from "@/lib/session-server";
import { parseAttrParams, matchesAttrSelection, buildFacets } from "@/lib/attributes";
import { LayoutGrid, List } from "lucide-react";

export const revalidate = 0;
export const metadata = { title: "Produtos — Blass" };

type PageProps = {
  searchParams: {
    q?: string;
    cat?: string;
    sub?: string | string[];
    attr?: string | string[];
    featured?: string;
    sort?: string;
    view?: string;
  };
};

function arr(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function filterProducts(products: Product[], sp: PageProps["searchParams"]): Product[] {
  let out = [...products];

  // Search
  if (sp.q) {
    const q = sp.q.toLowerCase();
    out = out.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }

  // Category
  if (sp.cat) out = out.filter((p) => p.category === sp.cat);

  // Subcategories
  const subs = arr(sp.sub);
  if (subs.length > 0) out = out.filter((p) => p.subcategory && subs.includes(p.subcategory));

  // Características: mesmo grupo = OU, grupos diferentes = E
  const attrSel = parseAttrParams(arr(sp.attr));
  if (attrSel.size > 0) out = out.filter((p) => matchesAttrSelection(p, attrSel));

  // Featured
  if (sp.featured === "1") out = out.filter((p) => p.featured);

  // Sort
  switch (sp.sort) {
    case "az":
      out.sort((a, b) => a.name.localeCompare(b.name, "pt"));
      break;
    case "za":
      out.sort((a, b) => b.name.localeCompare(a.name, "pt"));
      break;
    case "featured":
      out.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
    default: // newest
      out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  return out;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const [allProducts, categories, adminEmail] = await Promise.all([
    getProducts(true), // published only
    getCategories(),
    getAdminEmail(),
  ]);
  const isAdmin = !!adminEmail;

  const filtered = filterProducts(allProducts, searchParams);

  // Facetas: calculadas sobre produtos que batem com os demais filtros
  // (categoria/sub/busca/destaque), ignorando a seleção de características —
  // assim os valores disponíveis refletem o contexto atual sem se auto-excluir.
  const facetBase = filterProducts(allProducts, { ...searchParams, attr: undefined });
  const facets = buildFacets(facetBase);
  const attrSelection = parseAttrParams(arr(searchParams.attr));

  const catMap = Object.fromEntries(categories.map((c) => [c.slug, c]));
  const view = searchParams.view ?? "grid";

  const activeCatName = searchParams.cat
    ? categories.find((c) => c.slug === searchParams.cat)?.name
    : null;

  return (
    <div className="bg-cream min-h-screen">
      {/* Page header */}
      <div className="bg-brown text-cream-light py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs tracking-widest text-orange mb-1">CATÁLOGO</div>
          <h1 className="font-display text-4xl">
            {activeCatName ?? "Todos os Produtos"}
          </h1>
          <p className="text-cream-light/60 text-sm mt-2">
            Iluminação e componentes para móveis e ambientes.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex gap-8 items-start">

          {/* Sidebar filters — desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0 sticky top-4">
            <Suspense>
              <ProductFilters
                categories={categories}
                facets={facets}
                total={allProducts.length}
                filtered={filtered.length}
              />
            </Suspense>
          </div>

          {/* Products area */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="text-sm text-brown/60">
                <span className="font-semibold text-brown">{filtered.length}</span> produto{filtered.length !== 1 ? "s" : ""}
                {searchParams.q && (
                  <span> para "<em>{searchParams.q}</em>"</span>
                )}
              </div>

              {/* Active filter pills */}
              <div className="flex flex-wrap gap-2">
                {arr(searchParams.sub).map((s) => {
                  const cat = categories.find((c) => c.slug === searchParams.cat);
                  const sub = cat?.subcategories.find((sc) => sc.slug === s);
                  return (
                    <span key={s} className="flex items-center gap-1 text-xs bg-orange/10 text-orange px-2 py-1 border border-orange/30">
                      {sub?.name ?? s}
                    </span>
                  );
                })}
                {[...attrSelection.entries()].flatMap(([name, vals]) =>
                  vals.map((v) => (
                    <span key={`${name}:${v}`} className="flex items-center gap-1 text-xs bg-brown/10 text-brown px-2 py-1">
                      <span className="text-brown/50">{name}:</span> {v}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Mobile filters (horizontal scroll) */}
            <div className="lg:hidden mb-6">
              <Suspense>
                <MobileFilters categories={categories} searchParams={searchParams} />
              </Suspense>
            </div>

            {/* Grid or empty */}
            {filtered.length === 0 ? (
              <div className="py-24 text-center">
                <div className="font-display text-3xl text-brown/30">Nenhum produto encontrado</div>
                <p className="text-sm text-brown/50 mt-2">Tente outros filtros.</p>
              </div>
            ) : (
              <div className={`grid gap-4 ${view === "list" ? "grid-cols-1" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} category={catMap[p.category]} isAdmin={isAdmin} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile: horizontal chip scroll for categories
function MobileFilters({ categories, searchParams }: { categories: any[]; searchParams: any }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <a
        href="/produtos"
        className={`flex-shrink-0 text-xs px-3 py-1.5 border whitespace-nowrap ${!searchParams.cat ? "bg-orange text-white border-orange" : "bg-white text-brown border-brown/20"}`}
      >
        Todas
      </a>
      {categories.map((c: any) => (
        <a
          key={c.slug}
          href={`/produtos?cat=${c.slug}`}
          className={`flex-shrink-0 text-xs px-3 py-1.5 border whitespace-nowrap ${searchParams.cat === c.slug ? "bg-orange text-white border-orange" : "bg-white text-brown border-brown/20"}`}
        >
          {c.name}
        </a>
      ))}
    </div>
  );
}
