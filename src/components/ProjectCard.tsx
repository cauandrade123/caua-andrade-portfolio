import { ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/primitives/Icon";
import { copy } from "@/data";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

/** Moldura da carta (pilha e lista): o conteúdo vem do `ProjectCard`. */
export const projectCardShell = "rounded-3xl border border-primary-foreground/10 bg-surface-raised p-5 shadow-depth-xl sm:p-6 md:p-8";

type ProjectCardProps = {
  project: Project;
  /** Posição na lista, a partir de 1 ("01"). */
  position: number;
  onOpenCase: (event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Na pilha da hero (palco com a altura da tela): em tela baixa, some com as tags e aperta o espaço. As tags
   * também aparecem no topo do case. A lista do movimento reduzido rola normalmente e não precisa disso.
   */
  compactOnShortScreens?: boolean;
};

/** Conteúdo de uma carta de projeto: ícone do domínio, título, uma frase, tags e ações. Nada de código. */
export function ProjectCard({ project, position, onOpenCase, compactOnShortScreens = false }: ProjectCardProps) {
  const { projects: texts } = copy;
  const compact = compactOnShortScreens;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <span
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl bg-glow text-surface-navy md:h-14 md:w-14",
            compact && "short:h-10 short:w-10",
          )}
        >
          <Icon name={project.icon} className="h-6 w-6 md:h-7 md:w-7" />
        </span>
        <p className="flex flex-wrap items-center justify-end gap-2 text-xs uppercase tabular-nums tracking-widest text-primary-foreground/70">
          <span aria-hidden="true" className="text-glow">
            {String(position).padStart(2, "0")}
          </span>
          <span>{project.year}</span>
          {project.status === "in-progress" ? (
            <span className="rounded-full border border-primary-foreground/25 px-2 py-0.5">{texts.inProgress}</span>
          ) : null}
        </p>
      </div>

      <h3
        className={cn(
          "mt-5 text-balance font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:mt-6",
          compact && "short:mt-4",
        )}
      >
        {project.title}
      </h3>
      <p className="mt-2 text-base leading-normal text-primary-foreground/80 sm:text-lg md:mt-3">{project.pitch}</p>

      <ul className={cn("mt-4 flex flex-wrap gap-1.5 md:mt-5", compact && "short:hidden")}>
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full border border-primary-foreground/15 px-3 py-1 text-sm text-primary-foreground/80">
            {tag}
          </li>
        ))}
      </ul>

      <div className={cn("mt-6 flex items-center gap-3", compact && "short:mt-5")}>
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
