import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { SectionContext } from "./section-context";

const sectionVariants = cva("relative py-16 md:py-24", {
  variants: {
    variant: {
      light: "bg-background text-foreground",
      subtle: "bg-gray-50 text-foreground",
      // `clip` e não `hidden`: corta o que vaza sem virar contêiner de rolagem, então `sticky` continua valendo dentro.
      navy: "overflow-clip bg-navy-depth text-primary-foreground",
    },
  },
  defaultVariants: { variant: "light" },
});

const widthVariants = cva("relative mx-auto", {
  variants: {
    width: {
      narrow: "max-w-3xl",
      default: "max-w-5xl",
      wide: "max-w-6xl",
    },
  },
  defaultVariants: { width: "default" },
});

type SectionProps = Omit<ComponentPropsWithoutRef<"section">, "id"> &
  VariantProps<typeof sectionVariants> &
  VariantProps<typeof widthVariants> & {
    /** Âncora da seção. O heading do `SectionHeader` usa o id `${id}-title`. */
    id: string;
  };

// `forwardRef`: o topo do case precisa do elemento para o nome da View Transition (zoom do card).
export const Section = forwardRef<HTMLElement, SectionProps>(function Section({ id, variant, width, className, children, ...props }, ref) {
  return (
    <SectionContext.Provider value={{ id, tone: variant === "navy" ? "navy" : "light" }}>
      {/* `data-tone="navy"` avisa o header que ele está sobre um bloco grafite. */}
      <section
        ref={ref}
        id={id}
        aria-labelledby={`${id}-title`}
        data-tone={variant === "navy" ? "navy" : undefined}
        className={cn(sectionVariants({ variant }), className)}
        {...props}
      >
        <div className="container relative">
          <div className={widthVariants({ width })}>{children}</div>
        </div>
      </section>
    </SectionContext.Provider>
  );
});
