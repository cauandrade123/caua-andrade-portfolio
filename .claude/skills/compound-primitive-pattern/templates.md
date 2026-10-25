# Templates dos primitivos

Referência de partida; ajuste os nomes de token ao design system vigente. Cada bloco vai para um arquivo próprio em `src/components/primitives/`.

## `Section.tsx`

```tsx
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  /** Âncora da seção. O heading dela usa o id `${id}-title`. */
  id: string;
};

export function Section({ id, className, children, ...props }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("py-section", className)} {...props}>
      <div className="container">{children}</div>
    </section>
  );
}
```

## `SectionHeader.tsx`

```tsx
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  /** Mesmo `id` da `Section` pai. */
  sectionId: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  level?: "h1" | "h2";
  className?: string;
};

export function SectionHeader({ sectionId, eyebrow, title, subtitle, level: Heading = "h2", className }: SectionHeaderProps) {
  return (
    <header className={cn("mb-8 md:mb-12", className)}>
      <p className="text-label uppercase text-primary">{eyebrow}</p>
      <Heading id={`${sectionId}-title`} className="text-display-md text-foreground">
        {title}
        {subtitle ? <span className="block text-muted-foreground">{subtitle}</span> : null}
      </Heading>
    </header>
  );
}
```

## `Card.tsx`

```tsx
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-lg border bg-card text-card-foreground", {
  variants: {
    variant: {
      default: "shadow-sm",
      interactive: "shadow-sm transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-ring",
      ghost: "border-transparent bg-transparent",
    },
    padding: {
      none: "",
      md: "p-4 md:p-6",
    },
  },
  defaultVariants: { variant: "default", padding: "md" },
});

type CardProps = ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof cardVariants> & {
    asChild?: boolean;
  };

export function Card({ asChild = false, variant, padding, className, ...props }: CardProps) {
  const Component = asChild ? Slot : "div";
  return <Component className={cn(cardVariants({ variant, padding }), className)} {...props} />;
}

export function CardTitle({ className, children, ...props }: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3 className={cn("text-body-lg font-medium", className)} {...props}>
      {children}
    </h3>
  );
}
```

## `Reveal.tsx`

```tsx
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
```

O app também precisa de `<MotionConfig reducedMotion="user">` na raiz (em `src/App.tsx`).

## `Icon.tsx`

```tsx
import { Cloud, Code2, Database, Github, Linkedin, Mail, Server, type LucideProps } from "lucide-react";

const icons = { Cloud, Code2, Database, Github, Linkedin, Mail, Server } as const;

export type IconName = keyof typeof icons;

type IconProps = Omit<LucideProps, "ref"> & { name: IconName };

export function Icon({ name, ...props }: IconProps) {
  const Component = icons[name];
  return <Component aria-hidden="true" {...props} />;
}
```

Ao criar o `Icon` de verdade, acrescente ao registro todos os ícones usados nos dados e troque `iconNameSchema` (em `src/types/common.ts`) por `z.enum([...])` com as mesmas chaves.
