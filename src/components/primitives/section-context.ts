import { createContext, useContext } from "react";

export type SectionTone = "light" | "navy";

type SectionContextValue = {
  id: string;
  tone: SectionTone;
};

export const SectionContext = createContext<SectionContextValue | null>(null);

export function useSection() {
  const value = useContext(SectionContext);
  if (!value) throw new Error("Este componente deve ficar dentro de <Section>.");
  return value;
}
