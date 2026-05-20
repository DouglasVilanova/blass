import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import CategoryCards from "@/components/sections/CategoryCards";
import Stats from "@/components/sections/Stats";
import Tagline from "@/components/sections/Tagline";
import Highlight from "@/components/sections/Highlight";
import ReachCTA from "@/components/sections/ReachCTA";
import { readStore } from "@/lib/store";
import { getSettings } from "@/lib/settings";

export const revalidate = 0;

export default async function HomePage() {
  const store = await readStore();
  const settings = await getSettings();
  const v = settings.visibility;

  return (
    <>
      <Hero settings={settings} />
      <About settings={settings} />
      <CategoryCards categories={store.categories} intro={settings.categoriesIntro} />
      {v.stats && <Stats settings={settings} />}
      {v.tagline && <Tagline settings={settings.tagline} />}
      {v.highlight && <Highlight settings={settings} />}
      {v.reach && <ReachCTA settings={settings} />}
    </>
  );
}
