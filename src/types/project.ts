import { z } from "zod";
import { iconNameSchema, slugSchema, uniqueBy, yearSchema } from "./common";

/** Selo que flutua na frente da janela. `accent` destaca; `neutral` só informa. */
const storyChipSchema = z.object({
  label: z.string().min(1),
  tone: z.enum(["accent", "neutral"]),
});

/** O que a janela de API mostra numa etapa. */
export const screenSchema = z.object({
  /** Primeira linha da janela: rota (`POST /login`), função ou consulta. */
  command: z.string().min(1),
  /** Corpo, resposta ou log. Linha vazia vira espaçamento. */
  lines: z.array(z.string()).min(1).max(8),
  chips: z.array(storyChipSchema).max(2),
});

/** Uma etapa do "Como funciona": o texto fica na lista e `screen` é o que a janela mostra. */
export const caseStepSchema = z.object({
  id: slugSchema,
  title: z.string().min(1),
  body: z.string().min(1),
  screen: screenSchema,
});

/** Scrollytelling da página de case. Tirado do código do repositório, sem inventar rota. */
export const caseStorySchema = z.object({
  title: z.string().min(1),
  /** `http`: cliente de API; `terminal`: log de um processo. */
  kind: z.enum(["http", "terminal"]),
  /** Nome na barra da janela (o repositório). */
  window: z.string().min(1),
  steps: z
    .array(caseStepSchema)
    .min(3)
    .max(5)
    .superRefine(uniqueBy((step) => step.id, "id")),
});

/** Conteúdo da página de case (`/projects/:slug`). */
export const projectCaseSchema = z.object({
  problem: z.string().min(1),
  solution: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  results: z.array(z.string().min(1)),
  /** Sem `story`, a página mostra o bloco "A solução" como texto corrido. */
  story: caseStorySchema.optional(),
});

export const projectSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  /** Uma frase do que o sistema resolve, para ler num olhar (card da pilha na home). */
  pitch: z.string().min(1).max(90),
  /** Notificação que empilha no scroll da hero: o resultado do sistema, como no celular. */
  notification: z.object({ title: z.string().min(1), detail: z.string().min(1) }),
  tags: z.array(z.string().min(1)).min(1),
  year: yearSchema,
  /** `in-progress` marca projeto ainda sem entrega pública. */
  status: z.enum(["published", "in-progress"]),
  icon: iconNameSchema,
  links: z.object({
    github: z.string().url().optional(),
    live: z.string().url().optional(),
  }),
  case: projectCaseSchema.optional(),
  /** Tela da vitrine para projeto sem `case.story` (ex.: sem repositório público). Só o que o resumo afirma. */
  preview: z
    .object({
      kind: z.enum(["http", "terminal"]),
      window: z.string().min(1),
      screen: screenSchema,
    })
    .optional(),
});

export const projectsSchema = z
  .array(projectSchema)
  .superRefine(uniqueBy((project) => project.slug, "slug"))
  .superRefine((projects, ctx) => {
    // A vitrine da home mostra uma janela por projeto: precisa de `case.story` ou de `preview`.
    projects.forEach((project, index) => {
      if (!project.case?.story && !project.preview) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `sem tela para a vitrine: ${project.slug}`, path: [index, "preview"] });
      }
    });
  });

export type CaseStep = z.infer<typeof caseStepSchema>;
export type CaseStory = z.infer<typeof caseStorySchema>;
export type ProjectCase = z.infer<typeof projectCaseSchema>;
export type Project = z.infer<typeof projectSchema>;
