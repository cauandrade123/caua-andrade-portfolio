import { useScroll, useTransform } from "framer-motion";
import type { RefObject } from "react";

/**
 * Movimento das cenas em scrollytelling (case e vitrine): a janela entra inclinada em 3D e deita até ficar
 * quase de frente quando a cena encosta no topo; os selos fazem parallax ao longo do percurso.
 */
export function useSceneTilt(sceneRef: RefObject<HTMLElement>) {
  // Entrada: do topo da cena aparecer embaixo até encostar no topo, quando a janela passa a ficar presa.
  const { scrollYProgress: entry } = useScroll({ target: sceneRef, offset: ["start end", "start start"] });
  // Percurso: do primeiro ao último item passando pelo centro da tela.
  const { scrollYProgress: progress } = useScroll({ target: sceneRef, offset: ["start center", "end center"] });

  return {
    progress,
    tilt: {
      rotateX: useTransform(entry, [0, 1], [24, 0]),
      rotateY: useTransform(entry, [0, 1], [-22, -8]),
      scale: useTransform(entry, [0, 1], [0.86, 1]),
    },
    parallax: {
      near: useTransform(progress, [0, 1], [24, -24]),
      far: useTransform(progress, [0, 1], [56, -56]),
    },
  };
}
