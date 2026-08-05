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

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <HeroSequence />
        <StoryFlow />
        <ProblemLevels />
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
