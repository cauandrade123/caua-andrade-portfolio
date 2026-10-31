import { cva, type VariantProps } from "class-variance-authority";
import { useRef, type ComponentPropsWithoutRef, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

const cardVariants = cva("group relative overflow-hidden rounded-2xl border transition-shadow duration-300", {
  variants: {
    tone: {
      light: "border-gray-200 bg-card shadow-depth-sm hover:shadow-depth-lg",
      navy: "border-primary-foreground/10 bg-surface-raised text-primary-foreground shadow-depth-md hover:border-primary-foreground/25",
    },
  },
  defaultVariants: { tone: "light" },
});

type SpotlightCardProps = ComponentPropsWithoutRef<"div"> & VariantProps<typeof cardVariants>;

/** Card com uma luz que segue o cursor do mouse. Em touch e caneta nada acontece. */
export function SpotlightCard({ tone, className, children, onPointerMove, ...props }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const node = ref.current;
    if (!node || event.pointerType !== "mouse") return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    node.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onPointerMove={handlePointerMove} className={cn(cardVariants({ tone }), className)} {...props}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-spotlight opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
