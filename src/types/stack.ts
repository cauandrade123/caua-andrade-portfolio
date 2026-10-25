import { z } from "zod";
import { iconNameSchema, slugSchema, uniqueBy } from "./common";

export const stackItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  icon: iconNameSchema,
});

export const stackCategorySchema = z.object({
  id: slugSchema,
  title: z.string().min(1),
  items: z.array(stackItemSchema).min(1),
});

export const stacksSchema = z.array(stackCategorySchema).superRefine(uniqueBy((category) => category.id, "id"));

export type StackItem = z.infer<typeof stackItemSchema>;
export type StackCategory = z.infer<typeof stackCategorySchema>;
