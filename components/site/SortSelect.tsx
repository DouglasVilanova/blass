"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const sp = useSearchParams();
  const sort = sp.get("sort") ?? "newest";

  function set(value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value === "newest") params.delete("sort");
    else params.set("sort", value);
    router.push(`/produtos?${params.toString()}`, { scroll: false });
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-brown/50 whitespace-nowrap hidden sm:inline">Ordenar por</span>
      <select
        value={sort}
        onChange={(e) => set(e.target.value)}
        className="border border-brown/20 bg-white text-brown text-sm px-3 py-2 rounded focus:outline-none focus:border-orange"
      >
        <option value="newest">Mais recentes</option>
        <option value="az">Nome A–Z</option>
        <option value="za">Nome Z–A</option>
        <option value="featured">Destaques primeiro</option>
      </select>
    </label>
  );
}
