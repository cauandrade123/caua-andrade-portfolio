import { AnimatePresence, motion, useReducedMotion, type PanInfo, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { forwardRef, useLayoutEffect, useState, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@/components/primitives/Icon";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { copy, projects, site } from "@/data";
import { sectionNumber } from "@/lib/section-number";
import { cn } from "@/lib/utils";
import { projectTransitionName, useZoomNavigate, ZOOM_DURATION_MS } from "@/lib/zoom-navigation";
import type { Project } from "@/types";

const OUT_QUINT = [0.22, 1, 0.36, 1] as const;
/** Arrasto mínimo (px) ou velocidade (px/s) para trocar de carta. */
const SWIPE_DISTANCE = 80;
const SWIPE_VELOCITY = 500;

// A carta que sai voa para o lado do gesto; a que entra vem do lado oposto, um pouco menor.
const cardVariants: Variants = {
  enter: (direction: number) => ({ x: direction * 60, opacity: 0, scale: 0.96, rotate: direction * 2 }),
  center: { x: 0, opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.45, ease: OUT_QUINT } },
  exit: (direction: number) => ({ x: direction * -360, opacity: 0, rotate: direction * -10, transition: { duration: 0.35, ease: OUT_QUINT } }),
};

/** Clique comum (sem tecla modificadora): os outros abrem em nova aba e não devem ter zoom. */
const isPlainClick = (event: MouseEvent) => !(event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0);

type ProjectCardProps = { project: Project; position: number; onOpenCase: (event: MouseEvent<HTMLAnchorElement>) => void };

/** Conteúdo de uma carta: ícone do domínio, título, uma frase, tags e ações. Nada de código. */
function ProjectCardBody({ project, position, onOpenCase }: ProjectCardProps) {
  const { projects: texts } = copy;
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-glow text-surface-navy">
          <Icon name={project.icon} className="h-7 w-7" />
        </span>
        <p className="flex flex-wrap items-center justify-end gap-2 font-mono text-xs uppercase tracking-widest text-primary-foreground/70">
          <span aria-hidden="true" className="text-glow">
            {String(position).padStart(2, "0")}
          </span>
          <span>{project.year}</span>
          {project.status === "in-progress" ? (
            <span className="rounded-full border border-primary-foreground/25 px-2 py-0.5">{texts.inProgress}</span>
          ) : null}
        </p>
      </div>

      <h3 className="mt-8 text-balance font-display text-3xl font-bold tracking-tight md:text-4xl">{project.title}</h3>
      <p className="mt-3 text-lg leading-snug text-primary-foreground/80 md:text-xl">{project.pitch}</p>

      <ul className="mt-6 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-primary-foreground/15 px-3 py-1 font-mono text-xs text-primary-foreground/80">
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center gap-3">
        {project.case ? (
          <Link
            to={`/projects/${project.slug}`}
            onClick={onOpenCase}
            className="group/case inline-flex h-11 items-center gap-2 rounded-full bg-primary-foreground px-5 text-sm font-medium text-surface-navy transition duration-150 hover:shadow-glow-light active:scale-95"
          >
            {texts.viewCase}
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-250 ease-out-quint group-hover/case:translate-x-1" />
            <span className="sr-only">{`: ${project.title}`}</span>
          </Link>
        ) : null}
        {project.links.github ? (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${texts.viewCode}: ${project.title}. ${copy.a11y.externalLink}`}
            title={texts.viewCode}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/80 transition duration-150 hover:border-primary-foreground/50 hover:text-primary-foreground active:scale-95"
          >
            <Icon name="Github" className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </>
  );
}

const cardShell = "rounded-3xl border border-primary-foreground/10 bg-surface-raised p-6 shadow-depth-xl md:p-10";

type DeckCardProps = ProjectCardProps & { direction: number; onSwipe: (step: number) => void };

const DeckCard = forwardRef<HTMLElement, DeckCardProps>(function DeckCard({ direction, onSwipe, ...body }, ref) {
  const settle = (_event: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) onSwipe(1);
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) onSwipe(-1);
  };

  return (
    <motion.article
      ref={ref}
      id={`project-${body.project.slug}`}
      custom={direction}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={settle}
      className={cn(cardShell, "relative z-10 cursor-grab touch-pan-y active:cursor-grabbing")}
    >
      <ProjectCardBody {...body} />
    </motion.article>
  );
});

/**
 * Vitrine R10: os projetos como uma pilha de cartas. No celular desliza com o dedo; no desktop, arrastando
 * ou pelos botões e pontos. "Ver case" abre a página com zoom saindo da carta. Com movimento reduzido,
 * vira uma lista comum, com todas as cartas abertas.
 */
export function ProjectStack() {
  const { projects: texts } = copy;
  const { hash, state } = useLocation();
  const returningSlug =
    (state as { zoom?: boolean } | null)?.zoom === true && hash.startsWith("#project-") ? hash.slice("#project-".length) : null;
  const [index, setIndex] = useState(() => Math.max(0, projects.findIndex((project) => project.slug === returningSlug)));
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const zoomNavigate = useZoomNavigate();
  // A carta é achada pelo id (`project-<slug>`): o `ref` dela pertence ao AnimatePresence (modo popLayout).
  const cardOf = (slug: string) => document.getElementById(`project-${slug}`);
  const total = projects.length;
  const project = projects[index];

  const go = (step: number) => {
    setDirection(step);
    setIndex((current) => (current + step + total) % total);
  };
  const jump = (target: number) => {
    if (target === index) return;
    setDirection(target > index ? 1 : -1);
    setIndex(target);
  };

  // Zoom de volta do case: a carta do projeto recebe o nome do hero do case durante a transição.
  useLayoutEffect(() => {
    if (!returningSlug) return;
    const target = cardOf(returningSlug);
    if (!target) return;
    target.style.setProperty("view-transition-name", projectTransitionName(returningSlug));
    const timeout = window.setTimeout(() => target.style.removeProperty("view-transition-name"), ZOOM_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [returningSlug]);

  const openCase = (slug: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    zoomNavigate(`/projects/${slug}`, { source: cardOf(slug), name: projectTransitionName(slug) });
  };

  return (
    <Section id="projects" variant="navy" width="narrow">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-14">
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

      {reduceMotion ? (
        <ul className="space-y-6">
          {projects.map((item, position) => (
            <li key={item.slug} id={`project-${item.slug}`} className={cardShell}>
              <ProjectCardBody project={item} position={position + 1} onOpenCase={openCase(item.slug)} />
            </li>
          ))}
        </ul>
      ) : (
        <div role="region" aria-roledescription="carrossel" aria-label={texts.deck.label}>
          <div className="relative">
            {/* As cartas de baixo da pilha: só aparência, para dar a sensação de baralho. */}
            <div aria-hidden="true" className="absolute inset-x-6 -bottom-6 top-6 rounded-3xl border border-primary-foreground/5 bg-surface-raised/40" />
            <div aria-hidden="true" className="absolute inset-x-3 -bottom-3 top-3 rounded-3xl border border-primary-foreground/10 bg-surface-raised/70" />
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <DeckCard
                key={project.slug}
                project={project}
                position={index + 1}
                direction={direction}
                onSwipe={go}
                onOpenCase={openCase(project.slug)}
              />
            </AnimatePresence>
          </div>

          <div className="mt-12 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={texts.deck.previous}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/20 transition duration-150 hover:border-primary-foreground/50 active:scale-95"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center gap-2">
              <ol className="flex items-center gap-1">
                {projects.map((item, position) => (
                  <li key={item.slug}>
                    <button
                      type="button"
                      onClick={() => jump(position)}
                      aria-label={item.title}
                      aria-current={position === index ? "true" : undefined}
                      className="group flex h-11 w-8 items-center justify-center"
                    >
                      <span
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-250 ease-out-quint",
                          position === index ? "w-6 bg-glow" : "w-1.5 bg-primary-foreground/30 group-hover:bg-primary-foreground/60",
                        )}
                      />
                    </button>
                  </li>
                ))}
              </ol>
              <p aria-live="polite" className="font-mono text-xs text-primary-foreground/70">
                {`${index + 1} ${texts.deck.of} ${total}`}
                <span className="sr-only">{`: ${project.title}`}</span>
              </p>
              <p aria-hidden="true" className="font-mono text-xs text-primary-foreground/50 md:hidden">
                {texts.deck.swipeHint}
              </p>
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              aria-label={texts.deck.next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/20 transition duration-150 hover:border-primary-foreground/50 active:scale-95"
            >
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}
