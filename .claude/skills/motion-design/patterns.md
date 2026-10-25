# Padrões de movimento

## Zoom de card para página (View Transitions)

O navegador tira uma foto da tela antes e depois da troca de rota. Elementos com o mesmo `view-transition-name` nas duas fotos viram um só, que interpola posição e tamanho: o card "cresce" até virar o hero do case.

- `useZoomNavigate()` (`src/lib/zoom-navigation.ts`) marca a origem com o nome, chama `document.startViewTransition()` e, dentro dele, `flushSync(() => navigate(...))`, para o React terminar a nova tela antes da segunda foto.
- O destino tem o mesmo nome desde a montagem (o hero do case usa `projectTransitionName(slug)`).
- Nome é único por tela. Marque a origem só no clique e remova depois (`transition.finished`).
- A rolagem para o topo precisa acontecer **antes** da segunda foto: por isso o `ScrollManager` usa `useLayoutEffect`.
- Sem suporte à API, ou com movimento reduzido, navega direto.
- Ritmo em `src/index.css` (`::view-transition-group(*)`, 450 ms `out-quint`).
- Limite conhecido: o botão Voltar do navegador não passa por `startViewTransition` (o React Router atualiza a tela no `popstate`); ele volta sem zoom, preservando a posição.

## Indicador que desliza (`layoutId`)

Renderize um único `motion.span layoutId="nav-indicator"` só no item ativo. Quando o item ativo muda, o framer-motion anima o mesmo elemento de um lugar para o outro. Mola: `stiffness: 420, damping: 36`.

## Contagem de números

`useCountUp(alvo, { start })` anima de 0 ao alvo com `requestAnimationFrame` e curva `out-quint` em ~1,2 s, começando quando `start` vira verdadeiro (use `useInView`). Com movimento reduzido devolve o alvo direto. `CountUp` renderiza o número animado com `aria-hidden` e o valor final em `sr-only`.

## Sublinhado que cresce

Classe `.link-underline` (em `src/index.css`): `background-image` de 1px em `currentColor`, `background-size` de 0 a 100% no hover e no foco, 250 ms `out-quint`. Não muda layout.

## Clique e seta

- Botões e CTAs: `transition-transform duration-150 active:scale-95`.
- Seta: `transition-transform duration-250 ease-out-quint group-hover:translate-x-1`.
