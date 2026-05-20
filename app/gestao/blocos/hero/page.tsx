import PageHeader from "@/components/gestao/PageHeader";
import HeroEditor from "./editor";
import { getSettings } from "@/lib/settings";

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Hero" subtitle="Foto de fachada + nome BLASS." />
      <HeroEditor initial={s.hero} />
    </>
  );
}
