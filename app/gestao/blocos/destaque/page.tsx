import PageHeader from "@/components/gestao/PageHeader";
import DestaqueEditor from "./editor";
import { getSettings } from "@/lib/settings";

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Destaque" subtitle="Bloco 'Novidade' com imagem ao lado direito." />
      <DestaqueEditor initial={s.highlight} />
    </>
  );
}
