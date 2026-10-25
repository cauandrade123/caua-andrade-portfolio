import { flushSync } from "react-dom";
import { useNavigate, type To } from "react-router-dom";

/** Nome compartilhado entre o card de um projeto e o hero da página dele. */
export const projectTransitionName = (slug: string) => `project-${slug}`;

/** Duração do zoom (`::view-transition-group` em src/index.css) mais uma folga. */
export const ZOOM_DURATION_MS = 600;

function canZoom() {
  return "startViewTransition" in document && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type ZoomOptions = {
  /** Elemento de origem, marcado com `name` só durante a transição. */
  source?: HTMLElement | null;
  name?: string;
  state?: unknown;
};

/**
 * Navegação com zoom: origem e destino compartilham o mesmo `view-transition-name` e o navegador
 * interpola posição e tamanho entre eles. Sem suporte à API, ou com movimento reduzido, navega direto.
 */
export function useZoomNavigate() {
  const navigate = useNavigate();

  return (to: To, { source, name, state }: ZoomOptions = {}) => {
    if (!canZoom()) {
      navigate(to, { state });
      return;
    }
    if (source && name) source.style.setProperty("view-transition-name", name);
    const transition = document.startViewTransition(() => {
      flushSync(() => navigate(to, { state }));
    });
    void transition.finished.finally(() => source?.style.removeProperty("view-transition-name"));
  };
}
