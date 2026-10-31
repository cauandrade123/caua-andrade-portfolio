import { AnimatePresence, motion, type PanInfo, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { forwardRef, useState, type MouseEvent } from "react";
import { ProjectCard, projectCardShell } from "@/components/ProjectCard";
import { copy, projects } from "@/data";
import { projectCardId, useOpenCase, useReturningSlug, useZoomReturn } from "@/lib/use-open-case";
import { cn } from "@/lib/utils";
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

type DeckCardProps = {
  project: Project;
  position: number;
  total: number;
  direction: number;
  onSwipe: (step: number) => void;
  onOpenCase: (event: MouseEvent<HTMLAnchorElement>) => void;
};

// forwardRef: o AnimatePresence (modo popLayout) precisa do ref da carta. Por isso o zoom acha a carta pelo id.
const DeckCard = forwardRef<HTMLElement, DeckCardProps>(function DeckCard({ project, position, total, direction, onSwipe, onOpenCase }, ref) {
  const settle = (_event: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) onSwipe(1);
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) onSwipe(-1);
  };

  return (
    <motion.article
      ref={ref}
      id={projectCardId(project.slug)}
      // Padrão de carrossel (APG): cada carta é um grupo que se anuncia como "projeto, 2 de 4".
      role="group"
      aria-roledescription={copy.projects.deck.slideRoleDescription}
      aria-label={`${position} ${copy.projects.deck.of} ${total}`}
      custom={direction}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={settle}
      className={cn(projectCardShell, "relative z-10 cursor-grab touch-pan-y active:cursor-grabbing short:p-5")}
    >
      <ProjectCard project={project} position={position} onOpenCase={onOpenCase} compactOnShortScreens />
    </motion.article>
  );
});

/**
 * Pilha de cartas dos projetos: arrastar para o lado (dedo ou mouse), setas ou pontos. Fica dentro do palco
 * da hero, logo abaixo de "Projetos". Quem volta de um case cai na carta daquele projeto.
 */
export function ProjectDeck() {
  const { projects: texts } = copy;
  const returningSlug = useReturningSlug();
  const [index, setIndex] = useState(() => Math.max(0, projects.findIndex((project) => project.slug === returningSlug)));
  const [direction, setDirection] = useState(1);
  const openCase = useOpenCase();
  useZoomReturn(returningSlug);

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

  return (
    <div role="region" aria-roledescription={texts.deck.roleDescription} aria-label={texts.deck.label}>
      <div className="relative">
        {/* As cartas de baixo da pilha: só aparência, para dar a sensação de baralho. */}
        <div aria-hidden="true" className="absolute inset-x-6 -bottom-6 top-6 rounded-3xl border border-primary-foreground/5 bg-surface-raised/40" />
        <div aria-hidden="true" className="absolute inset-x-3 -bottom-3 top-3 rounded-3xl border border-primary-foreground/10 bg-surface-raised/70" />
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <DeckCard
            key={project.slug}
            project={project}
            position={index + 1}
            total={total}
            direction={direction}
            onSwipe={go}
            onOpenCase={openCase(project.slug)}
          />
        </AnimatePresence>
      </div>

      {/* Em tela baixa o respiro cai para o mínimo que ainda livra as cartas de baixo da pilha (24 px). */}
      <div className="mt-8 flex items-center justify-between gap-4 md:mt-12 short:mt-8">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={texts.deck.previous}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/20 transition duration-150 hover:border-primary-foreground/50 active:scale-95"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center gap-1">
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
                      // Inativo a 45%: com 30% o ponto (único sinal visual do botão) ficava abaixo de 3:1 no grafite.
                      position === index ? "w-6 bg-glow" : "w-1.5 bg-primary-foreground/45 group-hover:bg-primary-foreground/70",
                    )}
                  />
                </button>
              </li>
            ))}
          </ol>
          {/* Contador e dica na mesma linha: em 667 px de altura, uma linha a mais empurrava a dica para fora da tela. */}
          <div className="flex items-center gap-2 text-xs">
            <p aria-live="polite" className="tabular-nums text-primary-foreground/70">
              {`${index + 1} ${texts.deck.of} ${total}`}
              <span className="sr-only">{`: ${project.title}`}</span>
            </p>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-primary-foreground/30 md:hidden" />
            <p aria-hidden="true" className="text-primary-foreground/50 md:hidden">
              {texts.deck.swipeHint}
            </p>
          </div>
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
  );
}
