"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import type { Category } from "@/lib/types";
import { encodeAttrParam, type Facet } from "@/lib/attributes";

type Props = {
  categories: Category[];
  facets: Facet[];
  total: number;
  filtered: number;
};

export default function ProductFilters({ categories, facets, total, filtered }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const q = sp.get("q") ?? "";
  const cats = sp.getAll("cat");
  const subs = sp.getAll("sub");
  const attrs = sp.getAll("attr");
  const featured = sp.get("featured") === "1";
  // "Acessórios" não é categoria real — é a subcategoria "acessorios" de iluminação/componentes
  const isAcessorios = subs.includes("acessorios");

  const set = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(sp.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      // Reset subcategory when category changes
      if (key === "cat") params.delete("sub");
      router.push(`/produtos?${params.toString()}`, { scroll: false });
    },
    [sp, router]
  );

  const toggleMulti = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(sp.toString());
      const existing = params.getAll(key);
      if (existing.includes(value)) {
        params.delete(key);
        existing.filter((v) => v !== value).forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
      router.push(`/produtos?${params.toString()}`, { scroll: false });
    },
    [sp, router]
  );

  const clearAll = () => router.push("/produtos", { scroll: false });
  const hasFilters = q || cats.length || subs.length || attrs.length || featured;

  // Categoria "acessorios" é escondida da lista (vira o item especial "Acessórios")
  const visibleCats = categories.filter((c) => c.slug !== "acessorios");
  const selectedCat = !isAcessorios && cats.length === 1 ? categories.find((c) => c.slug === cats[0]) : null;

  // "Todas" — limpa categoria e modo acessórios
  const showAll = () => {
    const params = new URLSearchParams(sp.toString());
    params.delete("cat");
    params.delete("sub");
    router.push(`/produtos?${params.toString()}`, { scroll: false });
  };

  // Ativa o modo Acessórios (sub=acessorios, sem categoria fixa)
  const activateAcessorios = () => {
    const params = new URLSearchParams(sp.toString());
    params.delete("cat");
    params.delete("sub");
    params.set("sub", "acessorios");
    router.push(`/produtos?${params.toString()}`, { scroll: false });
  };

  return (
    <aside className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-brown font-semibold">
          <SlidersHorizontal className="w-4 h-4" />
          Filtros
        </div>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-orange hover:underline flex items-center gap-1">
            <X className="w-3 h-3" /> Limpar
          </button>
        )}
      </div>

      {/* Count */}
      <div className="text-xs text-brown/50">
        {filtered === total ? `${total} produtos` : `${filtered} de ${total} produtos`}
      </div>

      {/* Busca */}
      <div className="space-y-2">
        <label className="text-xs tracking-widest text-brown/60 font-semibold uppercase">Buscar</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown/40" />
          <input
            type="search"
            value={q}
            onChange={(e) => set("q", e.target.value)}
            placeholder="Nome do produto…"
            className="w-full pl-9 pr-3 py-2 border border-brown/20 bg-white text-brown text-sm placeholder:text-brown/40 focus:outline-none focus:border-orange"
          />
        </div>
      </div>

      {/* Categorias */}
      <div className="space-y-2">
        <label className="text-xs tracking-widest text-brown/60 font-semibold uppercase">Categoria</label>
        <div className="space-y-1">
          <FilterChip label="Todas" active={!isAcessorios && cats.length === 0} onClick={showAll} />
          {visibleCats.map((c) => (
            <FilterChip
              key={c.slug}
              label={c.name}
              active={!isAcessorios && cats.includes(c.slug)}
              onClick={() => set("cat", !isAcessorios && cats.includes(c.slug) && cats.length === 1 ? null : c.slug)}
            />
          ))}
          <FilterChip label="Acessórios" active={isAcessorios} onClick={activateAcessorios} />
        </div>

        {/* Acessórios de: escolha a(s) categoria(s)-mãe */}
        {isAcessorios && (
          <div className="space-y-1 pl-2 border-l-2 border-orange/30 pt-2">
            <div className="text-[11px] tracking-wide text-brown/50 mb-1">Acessórios de:</div>
            {visibleCats.map((c) => (
              <label key={c.slug} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={cats.includes(c.slug)}
                  onChange={() => toggleMulti("cat", c.slug)}
                  className="w-3.5 h-3.5 accent-orange"
                />
                <span className={`text-sm transition-colors ${cats.includes(c.slug) ? "text-orange font-medium" : "text-brown/70 group-hover:text-brown"}`}>
                  {c.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Subcategorias */}
      {selectedCat && selectedCat.subcategories.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs tracking-widest text-brown/60 font-semibold uppercase">
            {selectedCat.name}
          </label>
          <div className="space-y-1 pl-2 border-l-2 border-orange/30">
            {selectedCat.subcategories.map((sc) => (
              <label key={sc.slug} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={subs.includes(sc.slug)}
                  onChange={() => toggleMulti("sub", sc.slug)}
                  className="w-3.5 h-3.5 accent-orange"
                />
                <span className={`text-sm transition-colors ${subs.includes(sc.slug) ? "text-orange font-medium" : "text-brown/70 group-hover:text-brown"}`}>
                  {sc.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Características — um grupo por faceta (Material, Cor…) */}
      {facets.map((facet) => (
        <div key={facet.name} className="space-y-2">
          <label className="text-xs tracking-widest text-brown/60 font-semibold uppercase">{facet.name}</label>
          <div className="flex flex-wrap gap-1.5">
            {facet.values.map(({ value, count }) => {
              const param = encodeAttrParam(facet.name, value);
              const active = attrs.includes(param);
              return (
                <button
                  key={value}
                  onClick={() => toggleMulti("attr", param)}
                  className={`text-xs px-2.5 py-1 border transition-colors ${
                    active
                      ? "bg-orange text-white border-orange"
                      : "bg-white text-brown/70 border-brown/20 hover:border-orange hover:text-orange"
                  }`}
                >
                  {value} <span className={active ? "text-white/70" : "text-brown/40"}>({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Destaques */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={featured}
          onChange={() => set("featured", featured ? null : "1")}
          className="w-4 h-4 accent-orange"
        />
        <span className="text-sm text-brown">Só destaques</span>
      </label>
    </aside>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-sm px-3 py-1.5 transition-colors ${
        active
          ? "bg-orange text-white font-medium"
          : "text-brown/70 hover:text-orange hover:bg-cream"
      }`}
    >
      {label}
    </button>
  );
}
