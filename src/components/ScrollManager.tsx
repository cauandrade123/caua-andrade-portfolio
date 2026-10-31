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

    const element = hash ? document.getElementById(hash.slice(1)) : null;
    // A carta de projeto que fica dentro do palco preso da hero não tem posição própria na página: quem volta
    // de um case vai para o fim da pista (`#projects`), onde a pilha está na tela. Fora dela, a carta é centralizada.
    const insideHero = hash.startsWith("#project-") && element?.closest("#hero");
    const target = insideHero ? document.getElementById("projects") : element;
    if (target) {
      target.scrollIntoView({ block: hash.startsWith("#project-") && !insideHero ? "center" : "start", behavior: "instant" });
    } else if (navigationType !== "POP") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }

    // Leitor de tela e teclado começam no conteúdo da nova rota (não no primeiro carregamento). Quem volta de um
    // case cai no "Ver case" da carta de onde saiu, para não perder o ponto de partida.
    if (isFirstLoad) return;
    const caseLink = hash.startsWith("#project-") ? element?.querySelector<HTMLElement>('a[href^="/projects/"]') : null;
    if (caseLink) caseLink.focus({ preventScroll: true });
    else if (!target) document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname, hash, navigationType]);

  return null;
}
