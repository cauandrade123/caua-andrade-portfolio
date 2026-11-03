import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ProjectCard, projectCardShell } from "@/components/ProjectCard";
import { projectCardId } from "@/lib/use-open-case";
import { baseLine, cardLift, cardShadow, OUT_QUINT, tileCascade, tileEntrance } from "@/lib/project-card-motion";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

type ProjectTileProps = {
  project: Project;
  index: number;
  /** Outro card está em foco: este baixa o brilho e encolhe um pouco (staging). */
  dimmed: boolean;
  /** Mouse em cima ou foco dentro do card. */
  active: boolean;
  /** O foco veio do teclado: os estados trocam sem animar. */
  instant: boolean;
  onOpenCase: (event: MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * Card da grade de projetos com a coreografia do R21 (src/lib/project-card-motion.ts):
 * - staging: com outro card em foco, este fica a 60% e encolhe para 98,5%;
 * - entrada: o card sobe e cresce ao entrar na tela, e as partes chegam em cascata;
 * - hover/foco: o card sobe, a sombra desce, o ícone gira, o problema entra, as tags acendem e a linha âmbar
 *   se desenha no pé. Sem hover (celular), a sequência roda uma vez quando o card chega ao meio da tela.
 * Exceção registrada à regra "animação só por Reveal" (.claude/rules/architecture.md).
 */
export function ProjectTile({ project, index, dimmed, active, instant, onOpenCase }: ProjectTileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const entered = useInView(ref, { once: true, amount: 0.25 });
  const centered = useInView(ref, { once: true, margin: "-40% 0px -40% 0px" });
  const [canHover, setCanHover] = useState(true);
  useEffect(() => setCanHover(window.matchMedia("(hover: hover)").matches), []);
  const isActive = active || (!canHover && centered);

  return (
    <motion.div
      className="h-full"
      animate={{ opacity: dimmed ? 0.6 : 1, scale: dimmed ? 0.985 : 1 }}
      transition={instant ? { duration: 0 } : { duration: 0.25, ease: OUT_QUINT }}
    >
      <motion.div
        ref={ref}
        className="h-full"
        variants={tileEntrance(index)}
        initial={["hidden", "rest"]}
        animate={[entered ? "shown" : "hidden", isActive ? "hover" : "rest"]}
      >
        <motion.article
          id={projectCardId(project.slug)}
          variants={{ ...cardLift, ...tileCascade(index) }}
          custom={instant}
          className={cn(projectCardShell, "relative flex h-full flex-col")}
        >
          <ProjectCard project={project} position={index + 1} onOpenCase={onOpenCase} instant={instant} />

          {/* Contra-movimento: sombra mais funda que desce e um brilho âmbar fraco por baixo (só opacidade anima). */}
          <motion.span
            variants={cardShadow}
            custom={instant}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-3xl shadow-photo"
          />
          <motion.span
            variants={cardShadow}
            custom={instant}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 -bottom-4 -z-10 h-10 rounded-full bg-glow/20 blur-2xl"
          />
          {/* Camada ambiente: a linha âmbar que se desenha no pé do card. */}
          <motion.span
            variants={baseLine}
            custom={instant}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 bottom-0 h-0.5 origin-left rounded-full bg-glow"
          />
        </motion.article>
      </motion.div>
    </motion.div>
  );
}
