import { z } from "zod";
import { slugSchema, uniqueBy, yearSchema } from "./common";

export const certificationSchema = z.object({
  id: slugSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  issuer: z.string().min(1),
  year: yearSchema,
  credentialId: z.string().min(1),
  domain: z.string().min(1),
  credentialUrl: z.string().url().optional(),
  /** Caminho da imagem do selo em `src/assets`. */
  badge: z.string().min(1).optional(),
});

export const certificationsSchema = z
  .array(certificationSchema)
  .superRefine(uniqueBy((certification) => certification.id, "id"));

export type Certification = z.infer<typeof certificationSchema>;
