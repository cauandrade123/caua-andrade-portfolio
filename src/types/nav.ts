import { z } from "zod";
import { hrefSchema, uniqueBy } from "./common";

export const navItemSchema = z.object({
  label: z.string().min(1),
  href: hrefSchema,
});

export const navSchema = z.array(navItemSchema).superRefine(uniqueBy((item) => item.href, "href"));

export type NavItem = z.infer<typeof navItemSchema>;
