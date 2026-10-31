import { z } from "zod";
import { brandNameSchema, iconNameSchema, linkSchema } from "./common";

/** Rótulo com singular e plural (escolhido por Intl.PluralRules). */
const pluralSchema = z.object({
  one: z.string().min(1),
  other: z.string().min(1),
});

export type PluralLabel = z.infer<typeof pluralSchema>;

const sectionCopySchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1).optional(),
});

/** Todo texto de interface que não é dado de domínio: títulos, CTAs, rótulos de acessibilidade. */
export const copySchema = z.object({
  a11y: z.object({
    skipToContent: z.string().min(1),
    mainNav: z.string().min(1),
    mobileNav: z.string().min(1),
    openMenu: z.string().min(1),
    closeMenu: z.string().min(1),
    toggleTheme: z.string().min(1),
    externalLink: z.string().min(1),
  }),
  header: z.object({
    contact: linkSchema,
  }),
  /** Hero R10: terminal que digita o nome, frase com a palavra que troca, logos da stack e linha do tempo. */
  hero: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    /** Pasta e comando do terminal da abertura (`~ > whoami`). */
    prompt: z.string().min(1),
    command: z.string().min(1),
    /** "Desenvolvedor back-end. Construo" + uma das `words`, que se reescreve sozinha. */
    lead: z.string().min(1),
    words: z.array(z.string().min(1)).min(2),
    /** As palavras juntas, para leitor de tela e movimento reduzido. */
    wordsSummary: z.string().min(1),
    /**
     * Stack em linha. `logo` é a chave do `BrandIcon`; `icon` (lucide) entra quando o logo da marca é só
     * o nome escrito e não lê a 14 px (Express). Sem os dois, a tecnologia aparece como selo de texto.
     */
    stack: z
      .array(z.object({ name: z.string().min(1), logo: brandNameSchema.optional(), icon: iconNameSchema.optional() }))
      .min(1)
      .max(12),
    stackLabel: z.string().min(1),
    /** Credenciais (o que recrutador procura em quem está começando): trabalho, curso, certificação. */
    credentials: z.array(z.object({ icon: iconNameSchema, label: z.string().min(1) })).min(1).max(4),
    credentialsLabel: z.string().min(1),
    /** Indicador de rolar, no lugar de um CTA. */
    scrollHint: z.string().min(1),
    /** Rótulos dos números (a contagem vem dos dados). */
    stats: z.object({
      projects: pluralSchema,
      technologies: pluralSchema,
      certifications: pluralSchema,
    }),
  }),
  /** Easter egg: mensagem para quem abre o console do navegador. */
  consoleGreeting: z.object({
    title: z.string().min(1),
    message: z.string().min(1),
  }),
  /**
   * Sobre (R11, editorial em 2 colunas): a história em tom de conversa, com fatos dados pelo usuário.
   * O primeiro parágrafo é o destaque.
   */
  about: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    /** Fim do título em âmbar. */
    titleHighlight: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1).max(5),
    photoAlt: z.string().min(1),
  }),
  stacks: sectionCopySchema,
  experience: sectionCopySchema.extend({
    /** Rótulo do fim do período de um cargo ainda em andamento. */
    current: z.string().min(1),
  }),
  certifications: sectionCopySchema.extend({
    labels: z.object({
      achieved: z.string().min(1),
      issuer: z.string().min(1),
      credential: z.string().min(1),
      /** Rótulo do código para quem ainda vai fazer a prova. */
      exam: z.string().min(1),
      domain: z.string().min(1),
    }),
    viewCredential: z.string().min(1),
    /** Selo das certificações que estão sendo estudadas. */
    inProgress: z.string().min(1),
  }),
  projects: sectionCopySchema.extend({
    allProjects: z.string().min(1),
    viewCode: z.string().min(1),
    viewProject: z.string().min(1),
    inProgress: z.string().min(1),
    viewCase: z.string().min(1),
    /** Pilha deslizável da home. */
    deck: z.object({
      label: z.string().min(1),
      previous: z.string().min(1),
      next: z.string().min(1),
      /** "1 de 4". */
      of: z.string().min(1),
      swipeHint: z.string().min(1),
      /** Como o leitor de tela anuncia a pilha ("carrossel") e cada carta ("projeto"). */
      roleDescription: z.string().min(1),
      slideRoleDescription: z.string().min(1),
    }),
  }),
  projectCase: z.object({
    back: z.string().min(1),
    problem: z.string().min(1),
    solution: z.string().min(1),
    /** Eyebrow do scrollytelling ("Como funciona"). */
    howItWorks: z.string().min(1),
    stack: z.string().min(1),
    results: z.string().min(1),
    next: z.string().min(1),
  }),
  contact: sectionCopySchema.extend({
    description: z.string().min(1),
    /** Botão de copiar o e-mail: rótulo, confirmação e erro (o erro oferece uma saída, sem culpar a pessoa). */
    copy: z.object({
      label: z.string().min(1),
      done: z.string().min(1),
      failed: z.string().min(1),
    }),
    /**
     * Botão de baixar o currículo. Sem `href`, o botão não aparece: ponha o PDF em `public/` e o caminho aqui
     * (ex.: "/curriculo-caua-andrade.pdf") quando ele existir.
     */
    resume: z.object({
      label: z.string().min(1),
      href: z.string().startsWith("/").endsWith(".pdf").optional(),
    }),
  }),
  footer: z.object({
    /** Símbolo antes do ano ("©"), aqui e não no componente (regra de texto em JSX). */
    copyright: z.string().min(1),
    rights: z.string().min(1),
    backToTop: z.string().min(1),
  }),
  notFound: z.object({
    title: z.string().min(1),
    message: z.string().min(1),
    backHome: z.string().min(1),
  }),
});

export type Copy = z.infer<typeof copySchema>;
