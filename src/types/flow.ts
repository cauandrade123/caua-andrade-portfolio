import { z } from "zod";
import { slugSchema } from "./common";

/** Posição em porcentagem do quadro do desenho (0 a 100). */
const pointSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});

export const flowNodeSchema = z.object({
  id: slugSchema,
  label: z.string().min(1),
  caption: z.string().min(1),
  desktop: pointSchema,
  mobile: pointSchema,
});

export const flowSchema = z
  .object({
    nodes: z.array(flowNodeSchema).min(2),
    links: z.array(z.object({ from: slugSchema, to: slugSchema })).min(1),
  })
  .superRefine((flow, ctx) => {
    const ids = new Set(flow.nodes.map((node) => node.id));
    flow.links.forEach((link, index) => {
      for (const end of ["from", "to"] as const) {
        if (!ids.has(link[end])) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `nó inexistente: ${link[end]}`, path: ["links", index, end] });
        }
      }
    });
  });

export type FlowNode = z.infer<typeof flowNodeSchema>;
export type Flow = z.infer<typeof flowSchema>;
