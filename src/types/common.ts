import { z } from "zod";

/** Ícones que os dados podem usar. O registro de `Icon` (lucide-react) precisa ter exatamente estas chaves. */
export const ICON_NAMES = [
  "Building2",
  "Cloud",
  "Code2",
  "Container",
  "Database",
  "FileSpreadsheet",
  "GitBranch",
  "Github",
  "HardDrive",
  "Layers",
  "Linkedin",
  "Mail",
  "Scissors",
  "Server",
  "Shield",
  "Workflow",
] as const;

export const iconNameSchema = z.enum(ICON_NAMES);

export type IconName = z.infer<typeof iconNameSchema>;

/** Logos de marca (pacote simple-icons) que os dados podem usar. AWS e Azure não existem lá. */
export const BRAND_NAMES = ["nodedotjs", "javascript", "express", "mysql", "docker"] as const;

export const brandNameSchema = z.enum(BRAND_NAMES);

export type BrandName = z.infer<typeof brandNameSchema>;

/** Âncora interna (`#id`), rota (`/rota`), `mailto:` ou URL absoluta. */
export const hrefSchema = z.string().min(1);

export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use kebab-case");

export const yearSchema = z.number().int().min(2000).max(2100);

export const linkSchema = z.object({
  label: z.string().min(1),
  href: hrefSchema,
});

export type Link = z.infer<typeof linkSchema>;

/** Para `superRefine` de listas: rejeita itens com a mesma chave (ex.: slugs duplicados). */
export const uniqueBy =
  <T>(key: (item: T) => string, field: string) =>
  (items: T[], ctx: z.RefinementCtx) => {
    const seen = new Set<string>();
    items.forEach((item, index) => {
      const value = key(item);
      if (seen.has(value)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${field} duplicado: ${value}`, path: [index] });
      }
      seen.add(value);
    });
  };
