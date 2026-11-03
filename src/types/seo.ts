import { z } from "zod";

/**
 * SEO (R22): quem é a pessoa para o Google (JSON-LD `Person`) e os textos da home nos resultados.
 * O `scripts/seo-build.mjs` monta as tags e o JSON-LD do `dist/` a partir daqui; o `index.html` repete os textos
 * da home só para o `npm run dev`.
 */
export const seoSchema = z.object({
  person: z.object({
    fullName: z.string().min(1),
    /** Como as pessoas digitam o nome na busca (com e sem acento, nome curto). */
    alternateNames: z.array(z.string().min(1)).min(1),
    givenName: z.string().min(1),
    familyName: z.string().min(1),
    /** Só cidade, estado e país: sem endereço. */
    address: z.object({
      locality: z.string().min(1),
      region: z.string().min(1),
      country: z.string().length(2),
    }),
    education: z.string().min(1),
    employer: z.string().min(1),
    /** Foto com URL fixa, copiada de `src/assets` no build. */
    image: z.string().startsWith("/"),
  }),
  /** O Google corta o título em ~60 caracteres e a descrição em ~160. */
  home: z.object({
    title: z.string().min(1).max(60),
    description: z.string().min(70).max(160),
  }),
  /** Imagem das prévias (WhatsApp, LinkedIn, X), em `public/`. */
  ogImage: z.object({
    path: z.string().startsWith("/"),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    alt: z.string().min(1),
  }),
  /** Trilha dos cases nos resultados (`BreadcrumbList`). */
  breadcrumbs: z.object({
    home: z.string().min(1),
    projects: z.string().min(1),
  }),
});

export type Seo = z.infer<typeof seoSchema>;
