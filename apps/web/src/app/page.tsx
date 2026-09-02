import { HeroSiena } from "@/components/site/hero-siena";
import { getSite } from "@/lib/site";

export default async function Home() {
  const { conference } = await getSite();
  return <HeroSiena conference={conference} />;
}
