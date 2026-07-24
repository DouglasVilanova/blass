import PageHeader from "@/components/gestao/PageHeader";
import SeoEditor from "./editor";
import { getSettings } from "@/lib/settings";

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="SEO / Scripts" subtitle="Verificação de propriedade (Google/Bing) renderizada no servidor + HTML livre para Analytics, GTM e Meta Pixel." />
      <SeoEditor initial={s.seo} />
    </>
  );
}
