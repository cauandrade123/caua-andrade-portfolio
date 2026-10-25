---
name: motion-design
description: Regras de animação e microinteração deste portfólio - quando animar, curvas e durações do projeto, só transform/opacity, movimento reduzido, View Transitions com React Router (zoom de card para página) e orçamento de performance. Use ao criar ou mudar qualquer animação, transição de rota, hover, contagem de números ou efeito decorativo.
---

# Motion design

Movimento aqui tem três papéis: **orientar** (de onde veio, para onde vai), **confirmar** (o clique foi recebido) e **assinar** (um efeito próprio, o `DataFlow` e o zoom de card). Se uma animação não cumpre um desses papéis, ela sai.

## Regras

1. **Só `transform` e `opacity`.** Nada de animar `width`, `height`, `top`, `box-shadow` ou `filter` em loop. Sombra muda por `transition-shadow` curta, nunca animada em loop.
2. **Curvas e durações do projeto** (`tailwind.config.ts`):

   | Papel | Duração | Curva | Exemplo |
   |---|---|---|---|
   | Micro (hover, clique) | 150 ms | `ease-out` | `active:scale-95`, cor de link |
   | Estado (abrir, trocar) | 250 ms | `ease-out-quint` / `ease-in-out-quart` | menu, ícone do tema, sublinhado |
   | Zoom e entrada | 450 ms | `ease-out-quint` | card vira página, `Reveal` |

   Entradas desaceleram (`out`); trocas de estado simétricas usam `in-out`. Nada acima de 700 ms, exceto loops decorativos.
3. **Movimento reduzido é obrigatório.** `MotionConfig reducedMotion="user"` na raiz cobre o framer-motion; `Reveal` e `useCountUp` mostram o estado final direto; View Transitions não rodam; CSS usa `motion-safe:` em loops.
4. **Uma assinatura por tela.** O `DataFlow` no hero e o zoom de card são os protagonistas. O resto é calmo: nada de blobs, ícones flutuando ou gradiente infinito.
5. **Decorativo é `aria-hidden`** e não pode carregar informação.
6. **Pausa fora da tela** para qualquer loop (`useInView` + `pauseAnimations()` no SVG, ou desmontar).
7. **Números que mudam** usam `CountUp`: o visual anima, o leitor de tela recebe só o valor final.

## Padrões prontos

Código e explicação em [patterns.md](patterns.md):
- zoom de card para página (View Transitions + React Router);
- indicador que desliza entre itens (`layoutId`);
- contagem de números (`useCountUp`);
- sublinhado que cresce (`.link-underline`);
- compressão no clique e seta que avança.

## Catálogo do site

| Efeito | Onde | Arquivo |
|---|---|---|
| Terminal que digita o nome, palavra que troca, notificações no scroll, letras que se dispersam e reagrupam em "Projetos" (assinatura, R10) | Hero | `src/components/HeroSection.tsx`, `src/lib/use-typewriter.ts`, `src/lib/hero-handoff.ts` |
| Pilha deslizável de projetos (arrastar, botões, pontos) | Home, logo após a hero | `src/components/ProjectStack.tsx` |
| Fora da home (alternativas do R9): scramble, vitrine com mini-replay | — | `src/lib/use-scramble.ts`, `src/components/ProjectShowcase.tsx`, `src/lib/use-cycle.ts` |
| Fluxo de dados | Stacks (até o R8 ficava na hero) | `src/components/effects/DataFlow.tsx` |
| Zoom de card para página | Projetos → case | `src/lib/zoom-navigation.ts`, `ProjectsSection.tsx`, `ProjectCase.tsx` |
| Spotlight que segue o mouse | Cards | `src/components/primitives/SpotlightCard.tsx` |
| Indicador do menu que desliza | Header | `src/components/Header.tsx` |
| Contagem de números | Sobre | `src/lib/use-count-up.ts`, `primitives/CountUp.tsx` |
| Entrada ao rolar | Todas as seções | `src/components/primitives/Reveal.tsx` |
| Scrollytelling "Como funciona" (janela 3D presa, etapas, parallax dos selos) | Página de case | `src/components/CaseStory.tsx`, `effects/ApiWindow.tsx`, `src/lib/use-active-step.ts` |

Valores ligados à rolagem (`useScroll` + `useTransform`) **não** são desligados pelo `MotionConfig`: cheque `useReducedMotion()` e não passe o `style`. Dentro de bloco navy, o `Section` usa `overflow-clip` (e não `hidden`) para o `sticky` funcionar.

## Referências externas

Efeitos de outros projetos, com nome técnico e como fazer aqui, em [`docs/design/motion-references.md`](../../../docs/design/motion-references.md) (ex.: o scrollytelling com celular em 3D do Money Flow).

## Verificação

- `npm run check`.
- Emule `prefers-reduced-motion: reduce` (DevTools → Rendering) e confira que nada se move e nenhum conteúdo some.
- No navegador embutido, animações dependem de a janela estar visível; se `requestAnimationFrame` não disparar, verifique pelo DOM e diga o que não deu para ver.
