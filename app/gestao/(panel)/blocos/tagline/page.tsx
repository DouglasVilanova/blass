import PageHeader from "@/components/gestao/PageHeader";
import TaglineEditor from "./editor";
import { getSettings } from "@/lib/settings";

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Faixa Tagline" subtitle="Imagem de fundo + frase com palavras em laranja + CTA." />
      <TaglineEditor initial={s.tagline} />
    </>
  );
}
