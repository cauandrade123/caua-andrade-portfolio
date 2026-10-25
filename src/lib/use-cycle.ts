import { useEffect, useState } from "react";

type CycleOptions = {
  /** Só avança enquanto for verdadeiro (ex.: na tela e sem movimento reduzido). */
  running: boolean;
  /** Tempo em cada item, em ms. */
  interval?: number;
  /** Quando muda, o ciclo recomeça do primeiro item (ex.: troca de projeto). */
  resetKey?: string;
};

/** Índice que avança sozinho em loop: o "mini-replay" das etapas de um case na vitrine. */
export function useCycle(length: number, { running, interval = 1800, resetKey }: CycleOptions) {
  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [resetKey]);

  useEffect(() => {
    if (!running || length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % length), interval);
    return () => window.clearInterval(timer);
  }, [running, length, interval, resetKey]);

  return Math.min(index, length - 1);
}
