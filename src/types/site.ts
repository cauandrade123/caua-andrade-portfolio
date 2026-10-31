import { z } from "zod";

export const siteSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  url: z.string().url(),
  email: z.string().email(),
  social: z.object({
    github: z.string().url(),
    linkedin: z.string().url(),
  }),
});

export type Site = z.infer<typeof siteSchema>;
