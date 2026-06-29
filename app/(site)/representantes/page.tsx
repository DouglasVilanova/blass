import { getRepresentantes } from "@/lib/db";
import { waLink } from "@/lib/wa";
import { MapPin, Phone, Mail } from "lucide-react";
import type { Representante } from "@/lib/types";

export const revalidate = 0;
export const metadata = { title: "Representantes — Blass" };

export default async function RepresentantesPage() {
  const reps: Representante[] = await getRepresentantes(true).catch(() => []);

  // Agrupa por estado (UF) — um representante pode atender vários estados
  const byEstado = new Map<string, Representante[]>();
  for (const r of reps) {
    const ufs = r.estados.length ? r.estados : ["Outros"];
    for (const uf of ufs) {
      if (!byEstado.has(uf)) byEstado.set(uf, []);
      byEstado.get(uf)!.push(r);
    }
  }
  const estados = [...byEstado.keys()].sort();

  return (
    <div className="bg-night min-h-screen text-cream-light">
      {/* Cabeçalho */}
      <div className="bg-[#4F2612] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs tracking-widest text-orange mb-1">REPRESENTANTES</div>
          <h1 className="font-exo font-bold text-4xl">Encontre um representante</h1>
          <p className="text-cream-light/60 text-sm mt-2">
            Fale com um representante Blass na sua região.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {reps.length === 0 ? (
          <div className="py-20 text-center text-cream-light/50">
            Nenhum representante cadastrado ainda.
          </div>
        ) : (
          <div className="space-y-12">
            {estados.map((uf) => (
              <section key={uf}>
                <h2 className="font-exo font-bold text-2xl text-orange mb-5">{uf}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {byEstado.get(uf)!.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-night-line bg-night-soft p-5">
                      <div className="font-exo font-semibold text-lg text-cream-light">{r.empresa || r.nome}</div>
                      {r.empresa && <div className="text-cream-light/70 text-sm">{r.nome}</div>}
                      {r.cidade && (
                        <div className="flex items-center gap-1.5 text-cream-light/60 text-sm mt-2">
                          <MapPin className="w-4 h-4 text-orange" />
                          {r.cidade}
                        </div>
                      )}
                      <div className="mt-4 flex flex-col gap-2">
                        {r.phones.map((ph) => (
                          <a key={ph} href={waLink(ph, `Olá! Sou cliente e gostaria de falar com o representante ${r.nome}.`)}
                             target="_blank" rel="noreferrer"
                             className="inline-flex items-center gap-2 rounded-full bg-orange/95 hover:bg-orange text-white text-sm px-4 py-2 transition-colors w-max">
                            <Phone className="w-4 h-4" /> {ph}
                          </a>
                        ))}
                        {r.emails.map((em) => (
                          <a key={em} href={`mailto:${em}`} className="inline-flex items-center gap-2 text-cream-light/70 hover:text-orange text-sm break-all">
                            <Mail className="w-4 h-4 flex-shrink-0" /> {em}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
