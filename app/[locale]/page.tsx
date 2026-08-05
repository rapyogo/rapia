import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { HeroSequence } from "@/components/sections/HeroSequence";
import { StoryFlow } from "@/components/sections/StoryFlow";
import { Services } from "@/components/sections/Services";
import { ProblemLevels } from "@/components/sections/ProblemLevels";
import { Process } from "@/components/sections/Process";
import { UseCases } from "@/components/sections/UseCases";
import { Academy } from "@/components/sections/Academy";
import { WhyRapia } from "@/components/sections/WhyRapia";
import { Technologies } from "@/components/sections/Technologies";
import { ForWhom } from "@/components/sections/ForWhom";
import { SocialProof } from "@/components/sections/SocialProof";
import { Content } from "@/components/sections/Content";
import { FinalCTA } from "@/components/sections/FinalCTA";

/**
 * Ordre des sections impose par le cahier des charges :
 * Hero -> Le Probleme -> La Transformation -> Services -> Methode ->
 * Cas d'usage -> Academy -> Pourquoi RAPIA -> Technologies -> Pour qui ->
 * Preuves -> Contenu -> CTA final.
 *
 * `StoryFlow` tient la place de « La Transformation » jusqu'a ce que la video
 * showpiece la remplace (phase 4). Le constat vient donc avant le recit, et
 * non l'inverse : on nomme le probleme, puis on montre la sortie.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSequence />
        <ProblemLevels />
        <StoryFlow />
        <Services />
        <Process />
        <UseCases />
        <Academy />
        <WhyRapia />
        <Technologies />
        <ForWhom />
        <SocialProof />
        <Content />
        <FinalCTA />
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
