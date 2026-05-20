import PageHeader from "@/components/gestao/PageHeader";
import StatsEditor from "./editor";
import { getSettings } from "@/lib/settings";

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Estatísticas" subtitle="Faixa com números (26 anos / 2000+ revendas / mapa do Brasil)." />
      <StatsEditor initial={s.stats} />
    </>
  );
}
