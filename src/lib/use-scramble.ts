import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*/<>{}=";

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/** Troca cada letra por um caractere aleatório, menos as já resolvidas e os espaços. */
const scramble = (text: string, resolved: number) =>
  [...text].map((char, index) => (index < resolved || char === " " ? char : randomGlyph())).join("");

/**
 * Texto que se "monta" a partir de caracteres de terminal, da esquerda para a direita, uma vez só.
 * Com movimento reduzido devolve o texto final direto. Só o visual muda: use o texto real para leitor de tela.
 */
export function useScramble(text: string, { duration = 900, delay = 150 }: { duration?: number; delay?: number } = {}) {
  const reduceMotion = useReducedMotion();
  const [output, setOutput] = useState(() => (reduceMotion ? text : scramble(text, 0)));

  useEffect(() => {
    if (reduceMotion) {
      setOutput(text);
      return;
    }

    let frame = 0;
    let startedAt = 0;
    const tick = (now: number) => {
      startedAt ||= now + delay;
      const progress = Math.min(Math.max((now - startedAt) / duration, 0), 1);
      setOutput(scramble(text, Math.floor(progress * text.length)));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setOutput(text);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, duration, delay, reduceMotion]);

  return output;
}
