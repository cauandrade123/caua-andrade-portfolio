import type { Transition, Variants } from "framer-motion";

/**
 * Coreografia do card de projeto (R21, skill lottie-motion-design). Personalidade "precisa": curva out-quint,
 * sem quique; mola só no follow-through do ícone. Os rótulos descem do card para as partes:
 * - `hidden` / `shown`: entrada da grade (follow-through: cada parte chega 40 ms depois da anterior);
 * - `rest` / `hover`: o hover (ou foco, ou o card chegando ao meio da tela no celular), em batidas.
 * O `custom` de cada parte é `instant`: com foco de teclado o estado troca sem animar.
 * Só transform e opacity; a sombra e o brilho são camadas prontas que só mudam de opacidade.
 */

export const OUT_QUINT = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;

/** Saída: tudo volta junto, rápido e acelerando (~70% da entrada). */
const EXIT: Transition = { duration: 0.15, ease: EASE_IN };
const INSTANT: Transition = { duration: 0 };

/** Batida do hover: atraso (s) a partir do início, duração e curva. */
const beat = (instant: boolean, delay: number, duration: number, ease: Transition["ease"] = OUT_QUINT): Transition =>
  instant ? INSTANT : { delay, duration, ease };
const exit = (instant: boolean) => (instant ? INSTANT : EXIT);

/** Cada bloco do card na entrada (o atraso vem do `staggerChildren` do card). */
export const partEntrance: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.35, ease: OUT_QUINT } },
};

/** 0 ms — principal: o card sobe 6 px e cresce 1%. */
export const cardLift: Variants = {
  rest: (instant: boolean) => ({ y: 0, scale: 1, transition: exit(instant) }),
  hover: (instant: boolean) => ({ y: -6, scale: 1.01, transition: beat(instant, 0, 0.18) }),
};

/** Contra-movimento do card: a sombra desce e espalha; um brilho âmbar fraco nasce por baixo. */
export const cardShadow: Variants = {
  rest: (instant: boolean) => ({ opacity: 0, y: 0, transition: exit(instant) }),
  hover: (instant: boolean) => ({ opacity: 1, y: 6, transition: beat(instant, 0, 0.25) }),
};

/** 40 ms — secundária: o quadrado do ícone gira -8°... */
export const iconTile: Variants = {
  rest: (instant: boolean) => ({ rotate: 0, transition: exit(instant) }),
  hover: (instant: boolean) => ({ rotate: -8, transition: beat(instant, 0.04, 0.18) }),
};

/** ...e o glifo dentro contra-gira e assenta com mola (follow-through). */
export const iconGlyph: Variants = {
  rest: (instant: boolean) => ({ rotate: 0, transition: exit(instant) }),
  hover: (instant: boolean) => ({
    rotate: 8,
    transition: instant ? INSTANT : { delay: 0.08, type: "spring", stiffness: 300, damping: 14 },
  }),
};

/** 60 ms — o número ("01") desliza 4 px e acende. */
export const indexNumber: Variants = {
  rest: (instant: boolean) => ({ x: 0, opacity: 0.75, transition: exit(instant) }),
  hover: (instant: boolean) => ({ x: 4, opacity: 1, transition: beat(instant, 0.06, 0.2) }),
};

/**
 * 80 ms — a frase sai para cima (acelerando)... As duas frases dividem o mesmo lugar, então uma só entra
 * depois que a outra saiu: sobrepostas no meio da troca, viravam um texto embaralhado.
 */
export const pitchOut: Variants = {
  rest: (instant: boolean) => ({ y: 0, opacity: 1, transition: instant ? INSTANT : { delay: 0.1, duration: 0.2, ease: OUT_QUINT } }),
  hover: (instant: boolean) => ({ y: -10, opacity: 0, transition: beat(instant, 0.08, 0.14, EASE_IN) }),
};

/** ...e, com a frase já fora (220 ms), o desafio de engenharia entra de baixo (desacelerando). */
export const problemIn: Variants = {
  rest: (instant: boolean) => ({ y: 10, opacity: 0, transition: instant ? INSTANT : { duration: 0.1, ease: EASE_IN } }),
  hover: (instant: boolean) => ({ y: 0, opacity: 1, transition: beat(instant, 0.22, 0.25) }),
};

/** 140 ms — as tags acendem em sequência, 40 ms cada: a "requisição" atravessando a stack. */
export const tagList: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.35, ease: OUT_QUINT } },
  rest: { transition: { staggerChildren: 0 } },
  hover: (instant: boolean) => ({ transition: instant ? INSTANT : { delayChildren: 0.14, staggerChildren: 0.04 } }),
};

export const tagGlow: Variants = {
  rest: (instant: boolean) => ({ opacity: 0, transition: exit(instant) }),
  hover: (instant: boolean) => ({ opacity: 1, transition: instant ? INSTANT : { duration: 0.15, ease: OUT_QUINT } }),
};

/** 200 ms — ambiente: a linha âmbar se desenha no pé do card, da esquerda para a direita. */
export const baseLine: Variants = {
  rest: (instant: boolean) => ({ scaleX: 0, transition: exit(instant) }),
  hover: (instant: boolean) => ({ scaleX: 1, transition: beat(instant, 0.2, 0.45) }),
};

/** 240 ms — a seta do "Ver case" avança 4 px. */
export const caseArrow: Variants = {
  rest: (instant: boolean) => ({ x: 0, transition: exit(instant) }),
  hover: (instant: boolean) => ({ x: 4, transition: beat(instant, 0.24, 0.2) }),
};

/**
 * Entrada da grade: 96% → 100% e sobe 16 px, 70 ms entre cards (+20 ms por linha de 2). O card ainda abre
 * espaço para as partes chegarem em cascata, 40 ms uma depois da outra.
 */
export const tileEntrance = (index: number): Variants => {
  const delay = index * 0.07 + Math.floor(index / 2) * 0.02;
  return {
    hidden: { opacity: 0, y: 16, scale: 0.96 },
    shown: { opacity: 1, y: 0, scale: 1, transition: { delay, duration: 0.45, ease: OUT_QUINT } },
  };
};

export const tileCascade = (index: number): Variants => ({
  shown: { transition: { delayChildren: index * 0.07 + Math.floor(index / 2) * 0.02 + 0.05, staggerChildren: 0.04 } },
});
