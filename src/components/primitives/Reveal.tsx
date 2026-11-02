import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Atraso em segundos, para escalonar itens de uma lista. */
  delay?: number;
  className?: string;
};

/** Curva-assinatura do projeto (`ease-out-quint` no Tailwind): entradas desaceleram e pousam suave. */
const OUT_QUINT = [0.22, 1, 0.36, 1] as const;

/**
 * Único wrapper de animação de entrada: aparece uma vez ao entrar na tela e respeita movimento reduzido.
 * Personalidade de movimento: entrada = 450 ms (a duração "lenta" da paleta 150/250/450) com a curva-assinatura
 * e uma subida curta de 16 px (antes eram 700 ms, outra curva e 28 px).
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, delay, ease: OUT_QUINT }}
    >
      {children}
    </motion.div>
  );
}
