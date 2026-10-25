import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type TypedOptions = {
  /** Espera antes do primeiro caractere, em ms. */
  delay?: number;
  /** Tempo entre caracteres, em ms. */
  interval?: number;
};

/**
 * Quantos caracteres de um texto de `length` caracteres já foram "digitados". Com movimento reduzido,
 * devolve tudo de uma vez. Só o visual muda: o texto real fica disponível para leitor de tela.
 */
export function useTypedCount(length: number, { delay = 0, interval = 70 }: TypedOptions = {}) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(reduceMotion ? length : 0);

  useEffect(() => {
    if (reduceMotion) {
      setCount(length);
      return;
    }
    setCount(0);
    let typed = 0;
    let timer = 0;
    const tick = () => {
      typed += 1;
      setCount(typed);
      if (typed < length) timer = window.setTimeout(tick, interval);
    };
    timer = window.setTimeout(tick, delay);
    return () => window.clearTimeout(timer);
  }, [length, delay, interval, reduceMotion]);

  return count;
}

type RotatingOptions = {
  /** Só começa quando for verdadeiro (ex.: depois de o nome terminar de ser digitado). */
  start: boolean;
  typeInterval?: number;
  eraseInterval?: number;
  /** Tempo com a palavra inteira na tela, em ms. */
  hold?: number;
};

/**
 * Palavra que se escreve, fica um tempo, se apaga e dá lugar à próxima, em loop.
 * Com movimento reduzido (ou antes de `start`), fica parada na primeira palavra.
 */
export function useRotatingWord(words: string[], { start, typeInterval = 70, eraseInterval = 40, hold = 1600 }: RotatingOptions) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(words[0]?.length ?? 0);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    if (!start || reduceMotion || words.length < 2) return;
    const word = words[index];
    let timer: number;

    if (!erasing && length === word.length) {
      timer = window.setTimeout(() => setErasing(true), hold);
    } else if (erasing && length === 0) {
      setErasing(false);
      setIndex((current) => (current + 1) % words.length);
    } else {
      timer = window.setTimeout(() => setLength((current) => current + (erasing ? -1 : 1)), erasing ? eraseInterval : typeInterval);
    }
    return () => window.clearTimeout(timer);
  }, [start, reduceMotion, words, index, length, erasing, hold, typeInterval, eraseInterval]);

  return words[index].slice(0, length);
}
