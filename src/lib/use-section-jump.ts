import type { MouseEvent } from "react";

/** A partir dessa distância (em telas), o pulo é direto: rolar suave atravessaria a animação da hero. */
const FAR_JUMP_SCREENS = 1;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Foca o título da seção (`#<id>-title`) sem rolar, para teclado e leitor de tela continuarem dali. */
export function focusSectionTitle(id: string) {
  const title = document.getElementById(`${id}-title`);
  if (!title) return;
  if (!title.hasAttribute("tabindex")) {
    title.setAttribute("tabindex", "-1");
    title.addEventListener("blur", () => title.removeAttribute("tabindex"), { once: true });
  }
  title.focus({ preventScroll: true });
}

/**
 * Leva até uma seção da home (R20). Perto (até ~1 tela): rola suave. Longe: vai direto, com um crossfade
 * (View Transitions) quando o navegador tem e não há pedido de movimento reduzido. Depois atualiza o hash e
 * foca o título da seção. Devolve `false` se a seção não existe na página atual.
 */
export function jumpToSection(hash: string, { fromKeyboard = false }: { fromKeyboard?: boolean } = {}) {
  const id = hash.replace(/^#/, "");
  const target = document.getElementById(id);
  if (!target) return false;

  const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
  const far = Math.abs(top - window.scrollY) > window.innerHeight * FAR_JUMP_SCREENS;
  // Ação feita pelo teclado não anima: quem tabula quer chegar, não assistir (vale como movimento reduzido).
  const reduce = prefersReducedMotion() || fromKeyboard;

  if (far || reduce) {
    const go = () => window.scrollTo({ top, behavior: "instant" });
    if (far && !reduce && "startViewTransition" in document) document.startViewTransition(go);
    else go();
  } else {
    window.scrollTo({ top, behavior: "smooth" });
  }

  window.history.replaceState(window.history.state, "", `#${id}`);
  focusSectionTitle(id);
  return true;
}

/** `onClick` para links de seção (`href="#id"`): clique comum vira `jumpToSection`; com tecla modificadora, segue o link. */
export function handleSectionClick(event: MouseEvent<HTMLAnchorElement>, hash: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  // `detail === 0`: o clique veio do teclado (Enter num link), não do mouse ou do toque.
  if (jumpToSection(hash, { fromKeyboard: event.detail === 0 })) event.preventDefault();
}
