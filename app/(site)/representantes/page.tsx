import { getRepresentantes } from "@/lib/db";
import RepresentantesGrid from "@/components/site/RepresentantesGrid";
import type { Representante } from "@/lib/types";

export const revalidate = 0;
export const metadata = { title: "Representantes — Blass" };

export default async function RepresentantesPage() {
  const reps: Representante[] = await getRepresentantes(true).catch(() => []);

  return (
    <div className="bg-night min-h-screen text-cream-light">
      {/* Cabeçalho */}
      <div className="bg-[#4F2612] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs tracking-widest text-orange mb-1">REPRESENTANTES</div>
          <h1 className="font-exo font-bold text-4xl">Encontre um representante</h1>
          <p className="text-cream-light/60 text-sm mt-2">
            Pesquise pelo seu estado e fale com um representante Blass na sua região.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <RepresentantesGrid reps={reps} />
      </div>
    </div>
  );
}
