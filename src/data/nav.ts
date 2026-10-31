import { navSchema } from "@/types";
import { copy } from "./copy";
import { experiences } from "./experience";

// A experiência só entra no menu quando existir conteúdo em `experience.ts`.
const experienceItem = experiences.length > 0 ? [{ label: copy.experience.title, href: "#experience" }] : [];

// Mesma ordem das seções na home (R9: a vitrine de projetos vem logo depois da hero).
export const nav = navSchema.parse([
  { label: "Projetos", href: "#projects" },
  { label: "Sobre", href: "#about" },
  { label: "Tecnologias", href: "#stacks" },
  ...experienceItem,
  { label: "Certificações", href: "#certifications" },
]);
