import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Qual etapa de uma lista está na faixa central da tela (scrollytelling).
 * `register(index)` vai no `ref` de cada etapa; a ativa é a que cruza o meio da viewport.
 * `initial` serve para quem chega já no meio da lista (ex.: voltando de um case para `#project-slug`).
 */
export function useActiveStep(count: number, initial = 0) {
  const [active, setActive] = useState(initial);
  const nodes = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(nodes.current.indexOf(entry.target as HTMLElement));
        }
      },
      // Faixa de 10% no centro da tela: só uma etapa cabe nela por vez.
      { rootMargin: "-45% 0px -45% 0px" },
    );

    nodes.current.slice(0, count).forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [count]);

  const register = useCallback(
    (index: number) => (node: HTMLElement | null) => {
      nodes.current[index] = node;
    },
    [],
  );

  return { active, register };
}
