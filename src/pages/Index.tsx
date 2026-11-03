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
import { seo } from "@/data";
import { usePageMeta } from "@/lib/use-page-meta";

// R19: os projetos são uma grade (`ProjectStack`) logo depois da hero, que termina com as letras formando
// "Projetos". `ProjectDeck` (pilha deslizável, R11), `ProjectsSection` (cards) e `ProjectShowcase`
// (scrollytelling com código, R9) ficam no código como alternativas (docs/design/alternatives.md).
const Index = () => {
  // A home declara o próprio meta: quem entra por um case (HTML com as tags do case) e volta pelo app precisa
  // ver o título da home, não o valor "anterior" que o usePageMeta restauraria.
  usePageMeta({ title: seo.home.title, description: seo.home.description, path: "/", type: "profile" });

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
