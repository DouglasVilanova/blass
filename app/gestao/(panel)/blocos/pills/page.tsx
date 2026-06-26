import PageHeader from "@/components/gestao/PageHeader";
import { getSettings } from "@/lib/settings";
import { DEFAULT_STORE } from "@/lib/defaults";
import PillsEditor from "./editor";

export const dynamic = "force-dynamic";

export default async function PillsBlocoPage() {
  const settings = await getSettings();
  const words = settings.pills?.words ?? DEFAULT_STORE.settings.pills.words;

  return (
    <>
      <PageHeader
        title="Bloco — Faixa de palavras (pills)"
        subtitle="Palavras que passam na faixa laranja. Adicione, remova ou reordene."
      />
      <PillsEditor initialWords={words} />
    </>
  );
}
