import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { ApiWindow } from "@/components/effects/ApiWindow";
import { Icon } from "@/components/primitives/Icon";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { copy, projects, site } from "@/data";
import { sectionNumber } from "@/lib/section-number";
import { useActiveStep } from "@/lib/use-active-step";
import { useCycle } from "@/lib/use-cycle";
import { useMediaQuery } from "@/lib/use-media-query";
import { useSceneTilt } from "@/lib/use-scene-tilt";
import { cn } from "@/lib/utils";
import { projectTransitionName, useZoomNavigate, ZOOM_DURATION_MS } from "@/lib/zoom-navigation";
import type { CaseStep, CaseStory, Project } from "@/types";

type Showcase = { frame: Pick<CaseStory, "kind" | "window">; steps: CaseStep[] };

/** Janela de cada projeto: as etapas do case (mini-replay) ou, sem case, a prévia de uma tela só. */
function showcaseOf(project: Project): Showcase {
  const story = project.case?.story;
  if (story) return { frame: story, steps: story.steps };
  const { preview } = project;
  // O schema de projects garante story ou preview; isto só protege contra um dado montado à mão.
  if (!preview) throw new Error(`Projeto sem tela para a vitrine: ${project.slug}`);
  return { frame: preview, steps: [{ id: "preview", title: project.title, body: project.summary, screen: preview.screen }] };
}

const showcases = projects.map(showcaseOf);

const pad = (value: number) => String(value).padStart(2, "0");

/** Clique comum (sem tecla modificadora): os outros abrem em nova aba e não devem ter zoom. */
const isPlainClick = (event: MouseEvent) => !(event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0);

/**
 * Vitrine da home (R9): os projetos rolam à esquerda e uma janela presa em 3D, à direita, faz um
 * mini-replay das etapas do case do projeto no centro da tela. "Ver case" abre a página com zoom, saindo
 * da própria janela. No celular, cada projeto leva a própria janela plana; com movimento reduzido, nada roda.
 */
export function ProjectShowcase() {
  const { projects: texts } = copy;
  const { hash, state } = useLocation();
  const returningSlug =
    (state as { zoom?: boolean } | null)?.zoom === true && hash.startsWith("#project-") ? hash.slice("#project-".length) : null;
  const { active, register } = useActiveStep(projects.length, Math.max(0, projects.findIndex((project) => project.slug === returningSlug)));

  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const sceneRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const { tilt, parallax } = useSceneTilt(sceneRef);
  const sceneInView = useInView(sceneRef, { margin: "-20% 0px" });
  const zoomNavigate = useZoomNavigate();

  const project = projects[active] ?? projects[0];
  const current = showcases[active] ?? showcases[0];
  const replay = useCycle(current.steps.length, { running: isDesktop && sceneInView && !reduceMotion, resetKey: project.slug });
  const step = current.steps[replay];

  // Zoom de volta do case: quem recebe o nome do hero é a janela (desktop) ou o próprio projeto (celular).
  useLayoutEffect(() => {
    if (!returningSlug) return;
    const index = projects.findIndex((candidate) => candidate.slug === returningSlug);
    const target = isDesktop ? windowRef.current : itemRefs.current[index];
    if (!target || index === -1) return;
    target.style.setProperty("view-transition-name", projectTransitionName(returningSlug));
    const timeout = window.setTimeout(() => target.style.removeProperty("view-transition-name"), ZOOM_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [returningSlug, isDesktop]);

  const openCase = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    const { slug } = projects[index];
    // No desktop, o projeto ativo cresce a partir da janela; os outros, a partir do próprio bloco.
    const source = isDesktop && index === active ? windowRef.current : itemRefs.current[index];
    zoomNavigate(`/projects/${slug}`, { source, name: projectTransitionName(slug) });
  };

  return (
    <Section id="projects" variant="navy" width="wide">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader className="mb-0 md:mb-0" index={sectionNumber("projects")} eyebrow={texts.eyebrow} title={texts.title} />
        <a
          href={site.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
        >
          <span className="link-underline">{texts.allProjects}</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-250 ease-out-quint group-hover:translate-x-1" />
          <span className="sr-only">{copy.a11y.externalLink}</span>
        </a>
      </div>

      <div ref={sceneRef} className="mt-12 md:mt-0 md:grid md:grid-cols-2 md:gap-12 lg:gap-20">
        <ol className="space-y-20 md:space-y-0">
          {projects.map((item, index) => (
            // A última ocupa a tela toda: assim ela chega ao centro com a janela ainda presa.
            <li
              key={item.slug}
              id={`project-${item.slug}`}
              ref={(node) => {
                register(index)(node);
                itemRefs.current[index] = node;
              }}
              className="rounded-2xl md:flex md:min-h-step md:items-center md:last:min-h-screen"
            >
              <article className={cn("w-full transition duration-250 ease-out-quint", index !== active && "md:opacity-70")}>
                <p className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest text-primary-foreground/70">
                  <span aria-hidden="true" className="text-glow">
                    {pad(index + 1)}
                  </span>
                  <span>{item.year}</span>
                  {item.status === "in-progress" ? (
                    <span className="rounded-full border border-primary-foreground/25 px-2 py-0.5">{texts.inProgress}</span>
                  ) : null}
                </p>
                <h3 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{item.title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">{item.summary}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-primary-foreground/15 px-3 py-1 font-mono text-xs text-primary-foreground/80">
                      {tag}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-center gap-3">
                  {item.case ? (
                    <Link
                      to={`/projects/${item.slug}`}
                      onClick={(event) => openCase(event, index)}
                      className="group/case inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-2.5 text-sm font-medium text-surface-navy transition duration-150 hover:shadow-glow-light active:scale-95"
                    >
                      {texts.viewCase}
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-250 ease-out-quint group-hover/case:translate-x-1"
                      />
                      <span className="sr-only">{`: ${item.title}`}</span>
                    </Link>
                  ) : null}
                  {item.links.github ? (
                    <a
                      href={item.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${texts.viewCode}: ${item.title}. ${copy.a11y.externalLink}`}
                      title={texts.viewCode}
                      className="rounded-full border border-primary-foreground/20 p-2.5 text-primary-foreground/80 transition duration-150 hover:border-primary-foreground/50 hover:text-primary-foreground active:scale-95"
                    >
                      <Icon name="Github" className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>

                <ApiWindow story={showcases[index].frame} step={showcases[index].steps[0]} className="mt-8 md:hidden" />
              </article>
            </li>
          ))}
        </ol>

        <div className="hidden md:block">
          <div className="perspective-story sticky top-0 flex h-screen flex-col justify-center gap-6">
            <div ref={windowRef} className="rounded-xl">
              {/* eslint-disable-next-line no-restricted-syntax -- MotionValue */}
              <motion.div className="preserve-3d" style={reduceMotion ? undefined : tilt}>
                <ApiWindow story={current.frame} step={step} parallax={reduceMotion ? undefined : parallax} />
              </motion.div>
            </div>

            {/* Andamento do mini-replay: uma barra por etapa do case e o título da etapa na tela. */}
            <div aria-hidden="true" className="font-mono text-xs text-primary-foreground/70">
              <div className="flex gap-1.5">
                {current.steps.map((candidate, index) => (
                  <span
                    key={`${current.frame.window}:${candidate.id}`}
                    className={cn("h-0.5 flex-1 rounded-full transition-colors duration-250", index <= replay ? "bg-glow" : "bg-primary-foreground/15")}
                  />
                ))}
              </div>
              <p className="mt-3 truncate">{`${pad(replay + 1)} · ${step.title}`}</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
