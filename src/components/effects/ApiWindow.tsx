import { AnimatePresence, motion, type MotionValue, type Variants } from "framer-motion";
import { Globe, SquareTerminal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseStep, CaseStory } from "@/types";

type ApiWindowProps = {
  story: Pick<CaseStory, "kind" | "window">;
  step: CaseStep;
  /** Deslocamento vertical dos selos (parallax). Sem ele, os selos ficam numa linha embaixo da janela, sem 3D. */
  parallax?: { near: MotionValue<number>; far: MotionValue<number> };
  /** Versão pequena (janelas flutuantes da hero): até 4 linhas, sem selos e sem altura mínima. */
  compact?: boolean;
  className?: string;
};

const COMPACT_LINES = 4;

const OUT_QUINT = [0.22, 1, 0.36, 1] as const;

// A tela "digita": as linhas entram uma depois da outra e saem juntas, rápido.
const screenVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: OUT_QUINT } },
};

const chipTone = {
  accent: "bg-glow text-surface-navy",
  neutral: "border border-primary-foreground/15 bg-surface-navy text-primary-foreground",
} as const;

// Primeiro selo no canto de cima à direita, segundo embaixo à esquerda, cada um numa profundidade.
const chipPlacement = ["-right-4 -top-5 depth-near lg:-right-10", "-bottom-5 -left-4 depth-far lg:-left-10"] as const;

/** Janela de cliente de API (ou terminal) do "Como funciona". Ilustração: o texto de cada etapa está na lista ao lado. */
export function ApiWindow({ story, step, parallax, compact = false, className }: ApiWindowProps) {
  const KindIcon = story.kind === "http" ? Globe : SquareTerminal;
  const { command, chips } = step.screen;
  const lines = compact ? step.screen.lines.slice(0, COMPACT_LINES) : step.screen.lines;
  // Ids de etapa se repetem entre projetos (ex.: "cadastro"); a janela entra na chave para a troca animar.
  const screenKey = `${story.window}:${step.id}`;

  const renderChip = (chip: (typeof chips)[number], index: number) => (
    <motion.span
      key={`${screenKey}-${chip.label}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25, delay: 0.15 + index * 0.08, ease: OUT_QUINT }}
      className={cn("inline-flex rounded-md px-3 py-1.5 font-mono text-xs font-medium shadow-depth-lg", chipTone[chip.tone])}
    >
      {chip.label}
    </motion.span>
  );

  return (
    <div aria-hidden="true" className={cn("relative", parallax && "preserve-3d", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-primary-foreground/10 bg-surface-raised font-mono text-xs shadow-depth-xl",
          !compact && "sm:text-sm",
        )}
      >
        <div className="flex items-center gap-2 border-b border-primary-foreground/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground/20" />
          <span className="ml-3 inline-flex min-w-0 items-center gap-1.5 truncate text-primary-foreground/70">
            <KindIcon className="h-3.5 w-3.5 shrink-0" />
            {story.window}
          </span>
        </div>

        <div className={compact ? "p-4" : "min-h-64 px-5 py-5"}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={screenKey} variants={screenVariants} initial="hidden" animate="visible" exit="exit" className="space-y-1">
              <motion.p variants={lineVariants} className="mb-3 break-words font-medium text-glow">
                {command}
              </motion.p>
              {lines.map((line, index) =>
                line ? (
                  <motion.p key={index} variants={lineVariants} className="whitespace-pre-wrap break-words text-primary-foreground/80">
                    {line}
                  </motion.p>
                ) : (
                  <div key={index} className="h-3" />
                ),
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {compact ? null : parallax ? (
        chips.map((chip, index) => (
          <div key={index} className={cn("absolute preserve-3d", chipPlacement[index])}>
            {/* eslint-disable-next-line no-restricted-syntax -- MotionValue */}
            <motion.div style={{ y: index === 0 ? parallax.near : parallax.far }}>
              <AnimatePresence mode="wait">{renderChip(chip, index)}</AnimatePresence>
            </motion.div>
          </div>
        ))
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          <AnimatePresence initial={false}>{chips.map(renderChip)}</AnimatePresence>
        </div>
      )}
    </div>
  );
}
