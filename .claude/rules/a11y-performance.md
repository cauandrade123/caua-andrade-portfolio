---
paths:
  - "src/**/*.tsx"
  - "index.html"
  - "public/**"
  - "src/assets/**"
---

# Acessibilidade e performance

## Estrutura

- Landmarks: `<header>`, `<nav aria-label>`, `<main id="main">`, `<footer>`. Cada `Section` usa `aria-labelledby` apontando para o próprio heading.
- Skip link como primeiro elemento focável, com o texto de `copy.a11y.skipToContent`.
- Um `h1` por página e níveis de heading sem pular. O `SectionHeader` recebe o nível por prop.

## Controles e foco

- `<button>` para ação, `<a>` para navegação. Nunca `div onClick`.
- Botão só com ícone leva `aria-label` (vindo de `copy`). Alternadores levam `aria-expanded` ou `aria-pressed`.
- Foco sempre visível (`focus-visible:ring-*` com o token `ring`). A ordem de Tab segue a ordem visual.
- Menu mobile fecha com `Esc` e devolve o foco ao botão que o abriu.

## Movimento

- `MotionConfig reducedMotion="user"` na raiz do app.
- Animação infinita ou decorativa só atrás de `motion-safe:` ou `useReducedMotion`.
- `Reveal` é o único wrapper de entrada.
- Curvas, durações e padrões de animação: skill `motion-design`.

## Contraste e semântica

- Texto com contraste ≥ 4,5:1 (≥ 3:1 se for grande) e componentes de UI ≥ 3:1, em claro **e** escuro. Confira ao criar cada token.
- Ícone decorativo leva `aria-hidden="true"`.
- Link externo usa `rel="noopener noreferrer"` e avisa a nova aba (`copy.a11y.externalLink` em `sr-only`).

## Assets e carregamento

- Imagens em WebP, com `width` e `height` explícitos, `alt` descritivo (decorativa = `alt=""`) e `loading="lazy"` abaixo da dobra.
- Importe imagens de `src/assets`, nunca de `public/` por caminho relativo. Alvo: ≤ 150 KB por imagem de conteúdo.
- Fontes self-hosted (`@fontsource`), `font-display: swap`, só os pesos usados.
- Cada rota define `<title>`, description e `og:image` que existe de verdade.

## Como é checado

- `eslint-plugin-jsx-a11y` (erro no `npm run check`).
- O restante: agente `qa-a11y-auditor` com a skill `a11y-auditor-suite`.
