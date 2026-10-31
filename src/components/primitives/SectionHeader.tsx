import { cn } from "@/lib/utils";
import { useSection } from "./section-context";

type SectionHeaderProps = {
  /**
   * Número da seção, antes do eyebrow (ex.: "01"). Desde a crítica de 27/10 a home não usa: a numeração fica só
   * no menu (com seções sem rótulo, números soltos como "02" e "05" quebravam a sequência).
   */
  index?: string;
  /**
   * Rótulo pequeno acima do título. Opcional: sem `eyebrow` e sem `index`, a linha some. Use só quando o rótulo
   * acrescenta algo ao título (a crítica de design apontou a fórmula "0X · RÓTULO" repetida como cara de template).
   */
  eyebrow?: string;
  title: string;
  /** Fim do título na cor de destaque (ex.: "back-end."): chama atenção por cor, não por tamanho. */
  highlight?: string;
  subtitle?: string;
  level?: "h1" | "h2";
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  index,
  eyebrow,
  title,
  highlight,
  subtitle,
  level: Heading = "h2",
  align = "left",
  className,
}: SectionHeaderProps) {
  const { id, tone } = useSection();
  const navy = tone === "navy";

  return (
    <header className={cn("mb-10 md:mb-14", align === "center" && "text-center", className)}>
      {eyebrow || index ? (
        <p
          className={cn(
            "mb-3 flex items-center gap-3 text-xs uppercase tracking-widest",
            navy ? "text-primary-foreground/80" : "text-link",
            align === "center" && "justify-center",
          )}
        >
          {index ? (
            <span aria-hidden="true" className="tabular-nums opacity-70">
              {index}
            </span>
          ) : null}
          {eyebrow ? <span>{eyebrow}</span> : null}
        </p>
      ) : null}
      <Heading
        id={`${id}-title`}
        // Grill do 10/10: grande e leve. 36/48 px contra 18 px de texto (2,7×), peso 500 para não pesar.
        className={cn(
          "text-balance font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl",
          navy ? "text-primary-foreground" : "text-foreground",
        )}
      >
        {title}
        {highlight ? (
          <>
            {" "}
            <span className={navy ? "text-glow" : "text-link"}>{highlight}</span>
          </>
        ) : null}
        {subtitle ? <span className={cn("block", navy ? "text-primary-foreground/70" : "text-gray-500")}>{subtitle}</span> : null}
      </Heading>
    </header>
  );
}
