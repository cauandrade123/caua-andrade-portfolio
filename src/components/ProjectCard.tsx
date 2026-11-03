import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/primitives/Icon";
import { copy } from "@/data";
import {
  caseArrow,
  iconGlyph,
  iconTile,
  indexNumber,
  partEntrance,
  pitchOut,
  problemIn,
  tagGlow,
  tagList,
} from "@/lib/project-card-motion";
import type { Project } from "@/types";

/** Moldura da carta (grade da home; a pilha guardada também usa): o conteúdo vem do `ProjectCard`. */
export const projectCardShell = "rounded-3xl border border-primary-foreground/10 bg-surface-raised p-5 shadow-depth-xl sm:p-6 md:p-8";

type ProjectCardProps = {
  project: Project;
  /** Posição na lista, a partir de 1 ("01"). */
  position: number;
  onOpenCase: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** Troca de estado sem animar (foco pelo teclado). */
  instant?: boolean;
};

/**
 * Conteúdo de uma carta de projeto: ícone do domínio, título, uma frase, tags e ações. Nada de código.
 * As partes reagem aos rótulos que vêm do `ProjectTile` (entrada e hover, ver src/lib/project-card-motion.ts).
 */
export function ProjectCard({ project, position, onOpenCase, instant = false }: ProjectCardProps) {
  const { projects: texts } = copy;
  const problem = project.case?.problem;

  return (
    <>
      <motion.div variants={partEntrance} className="flex items-center justify-between gap-4">
        <motion.span
          variants={iconTile}
          custom={instant}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-glow text-surface-navy md:h-14 md:w-14"
        >
          <motion.span variants={iconGlyph} custom={instant} className="flex">
            <Icon name={project.icon} className="h-6 w-6 md:h-7 md:w-7" />
          </motion.span>
        </motion.span>
        <p className="flex flex-wrap items-center justify-end gap-2 text-xs uppercase tabular-nums tracking-widest text-primary-foreground/70">
          <motion.span variants={indexNumber} custom={instant} aria-hidden="true" className="text-glow">
            {String(position).padStart(2, "0")}
          </motion.span>
          <span>{project.year}</span>
          {project.status === "in-progress" ? (
            <span className="rounded-full border border-primary-foreground/25 px-2 py-0.5">{texts.inProgress}</span>
          ) : null}
        </p>
      </motion.div>

      {/* Um passo menor que antes (sem sm:text-3xl): na grade são 2 colunas. */}
      <motion.h3 variants={partEntrance} className="mt-5 text-balance font-display text-2xl font-semibold leading-tight tracking-tight md:mt-6">
        {project.title}
      </motion.h3>

      {/*
        Assinatura: a frase sai para cima e entra o desafio de engenharia do case. As duas ocupam a mesma célula
        do grid, então a altura do card não muda. Card sem case (API Gateway) fica só com a frase.
      */}
      <motion.div variants={partEntrance} className="mt-2 grid md:mt-3">
        <motion.p
          variants={problem ? pitchOut : undefined}
          custom={instant}
          className="col-start-1 row-start-1 text-base leading-normal text-primary-foreground/80 sm:text-lg"
        >
          {project.pitch}
        </motion.p>
        {problem ? (
          <motion.p variants={problemIn} custom={instant} className="col-start-1 row-start-1">
            <span className="block text-xs uppercase tracking-widest text-glow">{copy.projectCase.problem}</span>
            <span className="mt-1 block text-base leading-normal text-primary-foreground sm:text-lg">{problem}</span>
          </motion.p>
        ) : null}
      </motion.div>

      <motion.ul variants={tagList} custom={instant} className="mt-4 flex flex-wrap gap-1.5 md:mt-5">
        {project.tags.map((tag) => (
          <li key={tag} className="relative rounded-full border border-primary-foreground/15 px-3 py-1 text-sm text-primary-foreground/80">
            {/* Borda âmbar por cima da cinza: acende uma tag depois da outra no hover. */}
            <motion.span
              variants={tagGlow}
              custom={instant}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full border border-glow/70"
            />
            {tag}
          </li>
        ))}
      </motion.ul>

      {/* `mt-auto`: na grade, os botões ficam presos embaixo e alinham entre cards da mesma linha. */}
      <motion.div variants={partEntrance} className="mt-auto flex items-center gap-3 pt-6">
        {project.case ? (
          <Link
            to={`/projects/${project.slug}`}
            onClick={onOpenCase}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary-foreground px-5 text-sm font-medium text-surface-navy transition duration-150 hover:shadow-glow-light active:scale-95"
          >
            {texts.viewCase}
            <motion.span variants={caseArrow} custom={instant} className="flex">
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </motion.span>
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
      </motion.div>
    </>
  );
}
