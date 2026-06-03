import PageHeader from "@/components/gestao/PageHeader";
import ReachEditor from "./editor";
import { getSettings } from "@/lib/settings";

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="CTA / Reach" subtitle="Seção marrom com mapa do Brasil e botão QUERO COMPRAR." />
      <ReachEditor initial={s.reach} />
    </>
  );
}
