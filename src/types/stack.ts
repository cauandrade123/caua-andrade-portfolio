import { z } from "zod";
import { brandNameSchema, iconNameSchema, slugSchema, uniqueBy } from "./common";

export const stackItemSchema = z.object({
  name: z.string().min(1),
  /** Só quando acrescenta algo ao nome (ex.: os serviços da AWS). "Runtime JavaScript" para Node.js não entra. */
  description: z.string().min(1).optional(),
  /** Logo da marca (BrandIcon). Sem logo livre, usa `icon`. */
  logo: brandNameSchema.optional(),
  icon: iconNameSchema,
});

export const stackCategorySchema = z.object({
  id: slugSchema,
  title: z.string().min(1),
  items: z.array(stackItemSchema).min(1),
});

export const stacksSchema = z.array(stackCategorySchema).superRefine(uniqueBy((category) => category.id, "id"));

/** Tecnologias que só aparecem nas pílulas dos cases (não entram na seção Stacks). */
export const caseTechSchema = z.array(stackItemSchema).superRefine(uniqueBy((item) => item.name, "name"));

export type StackItem = z.infer<typeof stackItemSchema>;
export type StackCategory = z.infer<typeof stackCategorySchema>;
