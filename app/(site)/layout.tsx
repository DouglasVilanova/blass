import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { readStore } from "@/lib/store";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const store = await readStore();
  return (
    <div className="font-exo bg-night text-cream-light relative">
      <Header settings={store.settings} />
      <main>{children}</main>
      <Footer settings={store.settings} />
    </div>
  );
}
