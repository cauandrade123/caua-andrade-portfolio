import { motionValue } from "framer-motion";

/**
 * Ponte entre o nome gigante da hero e o logo do header: 1 enquanto o nome está na tela, 0 quando ele
 * encolheu e o logo assume. Fora da home (ou sem a animação de rolagem) fica em 0 e o logo aparece normal.
 */
export const heroNameShown = motionValue(0);
