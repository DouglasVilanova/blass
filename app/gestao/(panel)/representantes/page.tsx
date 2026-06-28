import PageHeader from "@/components/gestao/PageHeader";
import { getRepresentantes } from "@/lib/db";
import RepresentantesManager from "@/components/gestao/RepresentantesManager";

export const dynamic = "force-dynamic";

export default async function RepresentantesPage() {
  const reps = await getRepresentantes(false).catch(() => []);

  return (
    <>
      <PageHeader
        title="Representantes"
        subtitle="Cadastre os representantes da Blass. Os publicados aparecem na página /representantes do site."
      />
      <RepresentantesManager initial={reps} />
    </>
  );
}
