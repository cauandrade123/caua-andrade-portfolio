import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ProjectStack } from "@/components/ProjectStack";
import { AboutSection } from "@/components/AboutSection";
import { StacksSection } from "@/components/StacksSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { CertificationSection } from "@/components/CertificationSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { SkipLink } from "@/components/SkipLink";

// R11: a vitrine (pilha deslizável) fica dentro do palco da hero, abaixo de "Projetos". `ProjectStack` só
// aparece com movimento reduzido, como lista. `ProjectsSection` (cards) e `ProjectShowcase` (scrollytelling com
// código, R9) ficam no código como alternativas (docs/design/alternatives.md).
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <ProjectStack />
        <AboutSection />
        <StacksSection />
        <ExperienceSection />
        <CertificationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
