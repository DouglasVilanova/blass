import PageHeader from "@/components/gestao/PageHeader";
import { getNewsletterSubscribers } from "@/lib/db";
import NewsletterManager from "./manager";

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const subscribers = await getNewsletterSubscribers().catch(() => []);

  return (
    <>
      <PageHeader
        title="Newsletter"
        subtitle="E-mails cadastrados pelo campo 'Receba nossas novidades' do rodapé do site."
      />
      <NewsletterManager initial={subscribers} />
    </>
  );
}
