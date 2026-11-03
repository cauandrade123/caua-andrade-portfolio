import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { ProjectTile } from "@/components/ProjectTile";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { copy, projects, site } from "@/data";
import { useHeroStatic } from "@/lib/hero-handoff";
import { useOpenCase, useReturningSlug, useZoomReturn } from "@/lib/use-open-case";
import { cn } from "@/lib/utils";

/**
 * Projetos em grade (R19): 2 colunas no desktop, um embaixo do outro no celular, tudo visível sem arrastar.
 * Vem logo depois da hero. Com a animação, o título visível é a palavra "Projetos" que as letras do nome formam
 * no fim da hero, então aqui o `h2` fica só para leitor de tela e a grade cola na palavra; com a hero parada
 * (movimento reduzido ou tela baixa demais), o título "Projetos" aparece normal.
 * Alternativa guardada: a pilha que passa para o lado (`ProjectDeck`, docs/design/alternatives.md).
 */
export function ProjectStack() {
  const { projects: texts } = copy;
  const heroIsStatic = useHeroStatic();
  const openCase = useOpenCase();
  // Grade em foco (R21): o card sob o mouse (ou com foco) fica inteiro e os outros baixam o brilho. Guarda se o
  // foco veio do teclado: aí os estados trocam sem animar.
  const [focused, setFocused] = useState<{ slug: string; viaKeyboard: boolean } | null>(null);
  useZoomReturn(useReturningSlug());

  return (
    <Section id="projects" variant="navy" width="wide" className={cn("navy-continue", !heroIsStatic && "pt-4 md:pt-6")}>
      {heroIsStatic ? (
        <SectionHeader title={texts.eyebrow} />
      ) : (
        // Exceção registrada em .claude/rules/architecture.md: o "Projetos" visível são letras `aria-hidden` da hero.
        <h2 id="projects-title" className="sr-only">
          {texts.eyebrow}
        </h2>
      )}

      <ul className="grid gap-6 md:grid-cols-2">
        {projects.map((project, index) => (
          <li
            key={project.slug}
            onMouseEnter={() => setFocused({ slug: project.slug, viaKeyboard: false })}
            onMouseLeave={() => setFocused(null)}
            onFocus={() => setFocused((current) => (current?.slug === project.slug ? current : { slug: project.slug, viaKeyboard: true }))}
            onBlur={() => setFocused(null)}
          >
            <ProjectTile
              project={project}
              index={index}
              dimmed={focused !== null && focused.slug !== project.slug}
              active={focused?.slug === project.slug}
              instant={focused?.viaKeyboard ?? false}
              onOpenCase={openCase(project.slug)}
            />
          </li>
        ))}
      </ul>

      <a
        href={site.social.github}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-8 inline-flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground md:mt-10"
      >
        <span className="link-underline">{texts.allProjects}</span>
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-250 ease-out-quint group-hover:translate-x-1" />
        <span className="sr-only">{copy.a11y.externalLink}</span>
      </a>
    </Section>
  );
}
