import { z } from "zod";
import { hrefSchema, iconNameSchema, slugSchema, uniqueBy } from "./common";

export const contactLinkSchema = z.object({
  id: slugSchema,
  label: z.string().min(1),
  /** Texto exibido (e-mail, handle). */
  value: z.string().min(1),
  href: hrefSchema,
  icon: iconNameSchema,
  /** Abre em nova aba. */
  external: z.boolean(),
});

export const contactSchema = z.array(contactLinkSchema).superRefine(uniqueBy((link) => link.id, "id"));

export type ContactLink = z.infer<typeof contactLinkSchema>;
