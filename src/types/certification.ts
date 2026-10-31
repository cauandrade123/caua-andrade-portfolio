import { z } from "zod";
import { slugSchema, uniqueBy, yearSchema } from "./common";

export const certificationSchema = z.object({
  id: slugSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  issuer: z.string().min(1),
  /** Liga/desliga o card no site sem apagar o dado (ex.: certificação pré-cadastrada). Padrão: aparece. */
  show: z.boolean().default(true),
  /** `in-progress`: estudando para a prova (sem ano, sem link de credencial, sem selo). */
  status: z.enum(["earned", "in-progress"]).default("earned"),
  /** Ano em que foi obtida. Obrigatório quando `earned`. */
  year: yearSchema.optional(),
  /** Código do exame (ex.: AI-900). */
  credentialId: z.string().min(1),
  domain: z.string().min(1),
  credentialUrl: z.string().url().optional(),
  /**
   * Selo: nome da classe `.badge-<nome>` em `src/index.css`, que aponta a imagem em `src/assets` (o Vite resolve
   * o `url()`). Sem selo, o card mostra um lugar tracejado.
   */
  badge: slugSchema.optional(),
});

export const certificationsSchema = z
  .array(certificationSchema)
  .superRefine(uniqueBy((certification) => certification.id, "id"))
  .superRefine((certifications, ctx) => {
    certifications.forEach((certification, index) => {
      if (certification.status === "earned" && !certification.year) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `certificação obtida sem ano: ${certification.id}`, path: [index, "year"] });
      }
      if (certification.status === "in-progress" && certification.credentialUrl) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `certificação em andamento com link: ${certification.id}`, path: [index, "credentialUrl"] });
      }
    });
  });

export type Certification = z.infer<typeof certificationSchema>;
