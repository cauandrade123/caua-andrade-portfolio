import { useLayoutEffect, type MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import { projectTransitionName, useZoomNavigate, ZOOM_DURATION_MS } from "@/lib/zoom-navigation";

/** Id da carta de um projeto na home: o alvo do zoom de ida e de volta do case. */
export const projectCardId = (slug: string) => `project-${slug}`;

/** Clique comum (sem tecla modificadora): os outros abrem em nova aba e não devem ter zoom. */
const isPlainClick = (event: MouseEvent) => !(event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0);

/** `onClick` do "Ver case": abre a página do projeto com zoom saindo da carta. */
export function useOpenCase() {
  const zoomNavigate = useZoomNavigate();
  return (slug: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    zoomNavigate(`/projects/${slug}`, { source: document.getElementById(projectCardId(slug)), name: projectTransitionName(slug) });
  };
}

/** Slug do projeto de onde a pessoa está voltando com zoom (`/#project-<slug>` + `state.zoom`), ou null. */
export function useReturningSlug() {
  const { hash, state } = useLocation();
  return (state as { zoom?: boolean } | null)?.zoom === true && hash.startsWith("#project-") ? hash.slice("#project-".length) : null;
}

/** Zoom de volta do case: a carta do projeto recebe o nome do hero do case durante a transição. */
export function useZoomReturn(slug: string | null) {
  useLayoutEffect(() => {
    if (!slug) return;
    const card = document.getElementById(projectCardId(slug));
    if (!card) return;
    card.style.setProperty("view-transition-name", projectTransitionName(slug));
    const timeout = window.setTimeout(() => card.style.removeProperty("view-transition-name"), ZOOM_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [slug]);
}
