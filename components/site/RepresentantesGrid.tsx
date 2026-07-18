"use client";

import { useMemo, useState } from "react";
import { MapPin, Phone, Mail, Search, User } from "lucide-react";
import { waLink } from "@/lib/wa";
import type { Representante } from "@/lib/types";

const UF_NAMES: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará",
  DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão",
  MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais", PA: "Pará",
  PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte", RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima",
  SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins",
};

export default function RepresentantesGrid({ reps }: { reps: Representante[] }) {
  const [uf, setUf] = useState("");
  const [q, setQ] = useState("");

  // UFs disponíveis (só as que têm representante)
  const ufs = useMemo(
    () => [...new Set(reps.flatMap((r) => r.estados))].sort(),
    [reps]
  );

  const filtered = useMemo(() => {
    let out = reps;
    if (uf) out = out.filter((r) => r.estados.includes(uf));
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      out = out.filter(
        (r) =>
          r.nome.toLowerCase().includes(t) ||
          (r.empresa ?? "").toLowerCase().includes(t) ||
          (r.cidade ?? "").toLowerCase().includes(t)
      );
    }
    return out;
  }, [reps, uf, q]);

  return (
    <div className="space-y-8">
      {/* Barra de pesquisa */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <select
          value={uf}
          onChange={(e) => setUf(e.target.value)}
          className="rounded-lg border border-night-line bg-night-soft text-cream-light text-sm px-4 py-3 focus:outline-none focus:border-orange sm:w-64"
          style={{ color: "#FFFCEC" }}
          aria-label="Filtrar por estado"
        >
          <option value="" style={{ color: "#1F1108", backgroundColor: "#FFFCEC" }}>Todos os estados</option>
          {ufs.map((u) => (
            <option key={u} value={u} style={{ color: "#1F1108", backgroundColor: "#FFFCEC" }}>
              {u} — {UF_NAMES[u] ?? u}
            </option>
          ))}
        </select>

        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-light/40" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por empresa, nome ou cidade…"
            className="w-full rounded-lg border border-night-line bg-night-soft text-sm pl-11 pr-4 py-3 focus:outline-none focus:border-orange"
            style={{ color: "#FFFCEC" }}
          />
        </div>

        <div className="text-xs text-cream-light/50 whitespace-nowrap">
          {filtered.length} representante{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Grade de cards */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-cream-light/50">
          Nenhum representante encontrado{uf ? ` em ${UF_NAMES[uf] ?? uf}` : ""}.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-2xl border border-night-line bg-night-soft p-5 flex flex-col">
              <div className="font-exo font-semibold text-lg text-cream-light leading-snug">
                {r.empresa || r.nome}
              </div>

              <div className="mt-3 space-y-2 text-sm text-cream-light/70">
                {r.empresa && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-orange flex-shrink-0" /> {r.nome}
                  </div>
                )}
                {(r.cidade || r.estados.length > 0) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" />
                    <span>{[r.cidade, r.estados.join(", ")].filter(Boolean).join(" / ")}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {r.phones.map((ph) => (
                  <a
                    key={ph}
                    href={waLink(ph, `Olá! Sou cliente e gostaria de falar com o representante ${r.nome}.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-orange/95 hover:bg-orange text-white text-sm px-4 py-2 transition-colors w-max"
                  >
                    <Phone className="w-4 h-4" /> {ph}
                  </a>
                ))}
                {r.emails.map((em) => (
                  <a
                    key={em}
                    href={`mailto:${em}`}
                    className="inline-flex items-center gap-2 text-cream-light/70 hover:text-orange text-sm break-all"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" /> {em}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
