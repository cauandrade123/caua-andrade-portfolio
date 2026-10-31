import { motionValue } from "framer-motion";
import { useSyncExternalStore } from "react";

/**
 * Ponte entre o nome gigante da hero e o logo do header: 1 enquanto o nome está na tela, 0 quando ele
 * encolheu e o logo assume. Fora da home (ou sem a animação de rolagem) fica em 0 e o logo aparece normal.
 */
export const heroNameShown = motionValue(0);

/**
 * A hero está na versão parada (movimento reduzido, ou a abertura não cabe na altura da tela)? Aí a pilha de
 * projetos não existe e os projetos aparecem como lista na seção seguinte (`ProjectStack`).
 */
export const heroStatic = motionValue(false);

export function useHeroStatic() {
  return useSyncExternalStore(
    (onChange) => heroStatic.on("change", onChange),
    () => heroStatic.get(),
  );
}
