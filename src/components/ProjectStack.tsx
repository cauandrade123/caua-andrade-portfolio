import { ArrowRight } from "lucide-react";
import { ProjectCard, projectCardShell } from "@/components/ProjectCard";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { copy, projects, site } from "@/data";
import { useHeroStatic } from "@/lib/hero-handoff";
import { projectCardId, useOpenCase, useReturningSlug, useZoomReturn } from "@/lib/use-open-case";

/**
 * Projetos como lista comum, quando a hero está parada (movimento reduzido, ou a abertura não cabe na altura da
 * tela). Com a animação, a vitrine é a pilha (`ProjectDeck`) dentro do palco da hero, e esta seção não aparece.
 */
export function ProjectStack() {
  const { projects: texts } = copy;
  const heroIsStatic = useHeroStatic();
  const openCase = useOpenCase();
  useZoomReturn(useReturningSlug());

  if (!heroIsStatic) return null;

  return (
    <Section id="projects" variant="navy" width="narrow">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-14">
        <SectionHeader className="mb-0 md:mb-0" eyebrow={texts.eyebrow} title={texts.title} />
        <a
          href={site.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
        >
          <span className="link-underline">{texts.allProjects}</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">{copy.a11y.externalLink}</span>
        </a>
      </div>

      <ul className="space-y-6">
        {projects.map((project, position) => (
          <li key={project.slug} id={projectCardId(project.slug)} className={projectCardShell}>
            <ProjectCard project={project} position={position + 1} onOpenCase={openCase(project.slug)} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
