import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@/components/primitives/Icon";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { SpotlightCard } from "@/components/primitives/SpotlightCard";
import { copy, projects, site } from "@/data";
import { sectionNumber } from "@/lib/section-number";
import { projectTransitionName, useZoomNavigate, ZOOM_DURATION_MS } from "@/lib/zoom-navigation";
import type { Project } from "@/types";

export function ProjectsSection() {
  const { projects: texts } = copy;

  return (
    <Section id="projects" width="narrow">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-14">
        <SectionHeader className="mb-0" index={sectionNumber("projects")} eyebrow={texts.eyebrow} title={texts.title} />
        <a
          href={site.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-link"
        >
          <span className="link-underline">{texts.allProjects}</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-250 ease-out-quint group-hover:translate-x-1" />
          <span className="sr-only">{copy.a11y.externalLink}</span>
        </a>
      </div>

      <ul className="space-y-5">
        {projects.map((project, index) => (
          <li key={project.slug} id={`project-${project.slug}`}>
            <Reveal delay={index * 0.06}>
              <ProjectCard project={project} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { projects: texts } = copy;
  const cardRef = useRef<HTMLDivElement>(null);
  const zoomNavigate = useZoomNavigate();
  const { hash, state } = useLocation();
  const casePath = `/projects/${project.slug}`;
  const name = projectTransitionName(project.slug);

  // Volta do case com zoom-out: este card recebe o nome do hero durante a transição.
  useLayoutEffect(() => {
    const card = cardRef.current;
    const returning = hash === `#project-${project.slug}` && (state as { zoom?: boolean } | null)?.zoom === true;
    if (!card || !returning) return;
    card.style.setProperty("view-transition-name", name);
    const timeout = window.setTimeout(() => card.style.removeProperty("view-transition-name"), ZOOM_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [hash, state, project.slug, name]);

  const openCase = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    zoomNavigate(casePath, { source: cardRef.current, name });
  };

  return (
    <div ref={cardRef} className="rounded-2xl transition-transform duration-250 ease-out-quint hover:-translate-y-0.5">
      <SpotlightCard className="hover:shadow-depth-lg">
        <article className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:p-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-navy text-glow shadow-depth-md">
            <Icon name={project.icon} className="h-6 w-6" />
          </span>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-medium text-foreground md:text-xl">{project.title}</h3>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{project.year}</span>
              {project.status === "in-progress" ? (
                <span className="rounded-full border border-link/30 px-2 py-0.5 text-xs text-link">{texts.inProgress}</span>
              ) : null}
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-600">{project.summary}</p>
            <ul className="flex flex-wrap gap-1.5 pt-1">
              {project.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-link/15 bg-link/10 px-3 py-1 text-xs uppercase text-gray-600">
                  {tag}
                </li>
              ))}
            </ul>
            {/* O ::after cobre o card inteiro: clicar em qualquer parte abre o case com zoom. */}
            <Link
              to={casePath}
              onClick={openCase}
              className="group/case inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-link after:absolute after:inset-0 after:rounded-2xl"
            >
              <span className="link-underline">{texts.viewCase}</span>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-250 ease-out-quint group-hover/case:translate-x-1"
              />
              <span className="sr-only">{`: ${project.title}`}</span>
            </Link>
          </div>

          {project.links.github ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${texts.viewCode}: ${project.title}. ${copy.a11y.externalLink}`}
              title={texts.viewCode}
              className="relative z-10 shrink-0 self-start rounded-full bg-gray-100 p-2 text-gray-600 transition duration-150 hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <Icon name="Github" className="h-4 w-4" />
            </a>
          ) : null}
        </article>
      </SpotlightCard>
    </div>
  );
}
