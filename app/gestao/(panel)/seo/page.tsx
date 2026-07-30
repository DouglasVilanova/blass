import PageHeader from "@/components/gestao/PageHeader";
import SeoEditor from "./editor";
import { getSettings } from "@/lib/settings";

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="SEO / Scripts" subtitle="Descrição da empresa + verificação de propriedade (server-side) + HTML livre para Analytics, GTM e Meta Pixel." />
      <SeoEditor initial={s.seo} />
    </>
  );
}
