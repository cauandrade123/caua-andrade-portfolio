import { z } from "zod";

export const siteSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  url: z.string().url(),
  email: z.string().email(),
  /** Caminho do PDF do currículo em `public/`. */
  resumePath: z.string().startsWith("/"),
  social: z.object({
    github: z.string().url(),
    linkedin: z.string().url(),
  }),
});

export type Site = z.infer<typeof siteSchema>;
