import { certifications, copy, projects, stacks } from "@/data";
import type { PluralLabel } from "@/types";

const plurals = new Intl.PluralRules("pt-BR");

/** Singular ou plural do rótulo, conforme a contagem. */
export const pluralLabel = (count: number, label: PluralLabel) => (plurals.select(count) === "one" ? label.one : label.other);

/** Números da hero, tirados dos próprios dados: nada digitado à mão. */
export const portfolioStats = [
  { id: "projects", count: projects.length, label: copy.hero.stats.projects },
  { id: "technologies", count: stacks.reduce((total, category) => total + category.items.length, 0), label: copy.hero.stats.technologies },
  // Só as já obtidas e visíveis: certificação em andamento ou escondida não conta.
  {
    id: "certifications",
    count: certifications.filter((certification) => certification.show && certification.status === "earned").length,
    label: copy.hero.stats.certifications,
  },
];
