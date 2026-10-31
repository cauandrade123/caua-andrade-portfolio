import { useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type ShiningBadgeProps = {
  /** Nome do selo: a classe `.badge-<nome>` em src/index.css tem a imagem. */
  name: string;
  /** Tamanho do selo (classes de largura e altura). */
  className?: string;
};

/**
 * Selo de certificação com um reflexo diagonal (`.badge-shine` em src/index.css). A imagem e a máscara vêm da
 * classe do selo, então o brilho segue o formato do distintivo. O reflexo passa uma vez quando o selo entra na
 * tela e de novo no hover: nada fica se mexendo sozinho. Decorativo: o nome da certificação está no título do card.
 */
export function ShiningBadge({ name, className }: ShiningBadgeProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return <span ref={ref} aria-hidden="true" className={cn("badge-shine shrink-0", `badge-${name}`, inView && "badge-shine-run", className)} />;
}
