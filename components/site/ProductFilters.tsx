"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import type { Category } from "@/lib/types";

type Props = {
  categories: Category[];
  allTags: string[];
  total: number;
  filtered: number;
};

export default function ProductFilters({ categories, allTags, total, filtered }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const q = sp.get("q") ?? "";
  const cat = sp.get("cat") ?? "";
  const subs = sp.getAll("sub");
  const tags = sp.getAll("tag");
  const featured = sp.get("featured") === "1";
  const sort = sp.get("sort") ?? "newest";

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
  const hasFilters = q || cat || subs.length || tags.length || featured;

  const selectedCat = categories.find((c) => c.slug === cat);

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
            className="w-full pl-9 pr-3 py-2 border border-brown/20 bg-white text-sm focus:outline-none focus:border-orange"
          />
        </div>
      </div>

      {/* Ordenar */}
      <div className="space-y-2">
        <label className="text-xs tracking-widest text-brown/60 font-semibold uppercase">Ordenar</label>
        <select
          value={sort}
          onChange={(e) => set("sort", e.target.value)}
          className="w-full border border-brown/20 bg-white text-sm px-3 py-2 focus:outline-none focus:border-orange"
        >
          <option value="newest">Mais recentes</option>
          <option value="az">Nome A–Z</option>
          <option value="za">Nome Z–A</option>
          <option value="featured">Destaques primeiro</option>
        </select>
      </div>

      {/* Categorias */}
      <div className="space-y-2">
        <label className="text-xs tracking-widest text-brown/60 font-semibold uppercase">Categoria</label>
        <div className="space-y-1">
          <FilterChip label="Todas" active={!cat} onClick={() => set("cat", null)} />
          {categories.map((c) => (
            <FilterChip
              key={c.slug}
              label={c.name}
              active={cat === c.slug}
              onClick={() => set("cat", cat === c.slug ? null : c.slug)}
              count={undefined}
            />
          ))}
        </div>
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

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs tracking-widest text-brown/60 font-semibold uppercase">Características</label>
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleMulti("tag", tag)}
                className={`text-xs px-2.5 py-1 border transition-colors ${
                  tags.includes(tag)
                    ? "bg-orange text-white border-orange"
                    : "bg-white text-brown/70 border-brown/20 hover:border-orange hover:text-orange"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

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
