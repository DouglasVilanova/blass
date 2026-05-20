import PageHeader from "@/components/gestao/PageHeader";
import SeoEditor from "./editor";
import { getSettings } from "@/lib/settings";

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHeader title="SEO / Scripts" subtitle="HTML livre injetado no <head> e logo após o <body>. Use para Google Analytics, Meta Pixel, GTM, verificações." />
      <SeoEditor initial={s.seo} />
    </>
  );
}
