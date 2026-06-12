import type { Product, ProductAttribute } from "./types";

/** Características do produto — converte tags legadas em grupo "Características" */
export function productAttrs(p: Product): ProductAttribute[] {
  if (p.attributes && p.attributes.length > 0) return p.attributes;
  if (p.tags && p.tags.length > 0) return [{ name: "Características", values: p.tags }];
  return [];
}

/** Param de URL `attr=Nome:Valor` → Map<nome, valores[]> */
export function parseAttrParams(raw: string[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const item of raw) {
    const i = item.indexOf(":");
    if (i <= 0) continue;
    const name = item.slice(0, i);
    const value = item.slice(i + 1);
    if (!value) continue;
    const list = map.get(name) ?? [];
    if (!list.includes(value)) list.push(value);
    map.set(name, list);
  }
  return map;
}

export function encodeAttrParam(name: string, value: string): string {
  return `${name}:${value}`;
}

export type Facet = { name: string; values: { value: string; count: number }[] };

/** Agrega facetas (grupo → valores com contagem) a partir de uma lista de produtos */
export function buildFacets(products: Product[]): Facet[] {
  const groups = new Map<string, Map<string, number>>();
  for (const p of products) {
    for (const attr of productAttrs(p)) {
      const vals = groups.get(attr.name) ?? new Map<string, number>();
      for (const v of attr.values) {
        vals.set(v, (vals.get(v) ?? 0) + 1);
      }
      groups.set(attr.name, vals);
    }
  }
  return [...groups.entries()]
    .map(([name, vals]) => ({
      name,
      values: [...vals.entries()]
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => a.value.localeCompare(b.value, "pt")),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt"));
}

/** Produto satisfaz seleção? Mesmo grupo = OU, grupos diferentes = E */
export function matchesAttrSelection(p: Product, selection: Map<string, string[]>): boolean {
  if (selection.size === 0) return true;
  const attrs = productAttrs(p);
  for (const [name, wanted] of selection) {
    const group = attrs.find((a) => a.name === name);
    if (!group || !wanted.some((v) => group.values.includes(v))) return false;
  }
  return true;
}
