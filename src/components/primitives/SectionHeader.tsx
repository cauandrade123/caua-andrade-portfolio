import { cn } from "@/lib/utils";
import { useSection } from "./section-context";

type SectionHeaderProps = {
  /** Número da seção, exibido antes do eyebrow (ex.: "01"). */
  index?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  level?: "h1" | "h2";
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({ index, eyebrow, title, subtitle, level: Heading = "h2", align = "left", className }: SectionHeaderProps) {
  const { id, tone } = useSection();
  const navy = tone === "navy";

  return (
    <header className={cn("mb-10 md:mb-14", align === "center" && "text-center", className)}>
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
        <span>{eyebrow}</span>
      </p>
      <Heading id={`${id}-title`} className={cn("text-2xl font-bold sm:text-3xl md:text-4xl", navy ? "text-primary-foreground" : "text-foreground")}>
        {title}
        {subtitle ? <span className={cn("block", navy ? "text-primary-foreground/70" : "text-gray-500")}>{subtitle}</span> : null}
      </Heading>
    </header>
  );
}
