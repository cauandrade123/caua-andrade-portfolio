import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Rolagem e foco na troca de rota. Roda em `useLayoutEffect` para a rolagem acontecer antes da
 * segunda foto do zoom (View Transitions). Mudança de hash na mesma página fica com o navegador.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef<string | null>(null);

  useLayoutEffect(() => {
    const isFirstLoad = previousPath.current === null;
    const routeChanged = previousPath.current !== pathname;
    previousPath.current = pathname;
    if (!routeChanged) return;

    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      target.scrollIntoView({ block: hash.startsWith("#project-") ? "center" : "start", behavior: "instant" });
    } else if (navigationType !== "POP") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // Leitor de tela e teclado começam no conteúdo da nova rota (não no primeiro carregamento).
    if (!isFirstLoad && !target) document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname, hash, navigationType]);

  return null;
}
