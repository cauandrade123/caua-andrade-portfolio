import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/** Mesma curva do token `out-quint`: desacelera forte no fim. */
const easeOutQuint = (progress: number) => 1 - Math.pow(1 - progress, 5);

type CountUpOptions = {
  /** Começa a contar quando vira verdadeiro (ex.: ao entrar na tela). */
  start?: boolean;
  duration?: number;
};

/** Conta de 0 até `target` com requestAnimationFrame. Com movimento reduzido, devolve o valor final direto. */
export function useCountUp(target: number, { start = true, duration = 1200 }: CountUpOptions = {}) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(reduceMotion ? target : 0);

  useEffect(() => {
    if (reduceMotion) {
      setValue(target);
      return;
    }
    if (!start) return;

    let frame = 0;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      setValue(Math.round(target * easeOutQuint(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, start, duration, reduceMotion]);

  return value;
}
