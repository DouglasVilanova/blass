import PageHeader from "@/components/gestao/PageHeader";
import SobreEditor from "./editor";
import { getSettings } from "@/lib/settings";

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Sobre" subtitle="Logo + parágrafos descritivos." />
      <SobreEditor initial={s.about} />
    </>
  );
}
