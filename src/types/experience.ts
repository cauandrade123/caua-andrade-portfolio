import { z } from "zod";
import { slugSchema, uniqueBy } from "./common";

/** Mês no formato `AAAA-MM`. */
const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "use AAAA-MM");

export const experienceSchema = z
  .object({
    id: slugSchema,
    company: z.string().min(1),
    role: z.string().min(1),
    start: monthSchema,
    /** `null` = cargo atual. */
    end: monthSchema.nullable(),
    summary: z.string().min(1),
    highlights: z.array(z.string().min(1)),
    stack: z.array(z.string().min(1)),
  })
  .refine((experience) => experience.end === null || experience.end >= experience.start, {
    message: "end deve ser igual ou posterior a start",
    path: ["end"],
  });

export const experiencesSchema = z.array(experienceSchema).superRefine(uniqueBy((experience) => experience.id, "id"));

export type Experience = z.infer<typeof experienceSchema>;
