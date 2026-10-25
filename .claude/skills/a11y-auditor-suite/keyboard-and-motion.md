# Teclado e movimento

## Roteiro de teclado

Com o app em `npm run dev` (porta 8080), sem usar o mouse:

1. Recarregue a página. O **primeiro** `Tab` deve focar o skip link; `Enter` leva o foco ao `<main>`.
2. Continue com `Tab` pela página inteira. Confira:
   - a ordem de foco é a ordem visual;
   - todo elemento focável mostra um indicador de foco visível (contraste ≥ 3:1);
   - nenhum elemento interativo é pulado, e nenhum item decorativo recebe foco.
3. `Shift+Tab` percorre a mesma ordem ao contrário.
4. Links e botões ativam com `Enter`; botões também com `Espaço`.
5. Menu mobile (largura ≤ 767px): abre pelo botão, o foco vai para dentro, `Esc` fecha e o foco volta ao botão que abriu. Sem armadilha.
6. Alternador de tema: ativa com teclado e anuncia o estado (`aria-pressed` ou rótulo).
7. Âncoras de seção (`#about` etc.): o foco acompanha a rolagem e o alvo não fica escondido atrás do header fixo.

Registre cada falha como "passos para reproduzir + critério (WCAG 2.1.1, 2.4.3, 2.4.7...)".

## Movimento reduzido

Requisitos no código:

- `<MotionConfig reducedMotion="user">` na raiz do app.
- `Reveal` usa `useReducedMotion` (sem deslocamento quando reduzido).
- Animação infinita ou decorativa (blobs, ícones flutuantes, brilho) só com `motion-safe:` ou condicionada a `useReducedMotion`.
- Nenhuma informação essencial depende de animação.

Como testar:

- No Chrome: DevTools → `⋮` → More tools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce". Ou ative "Reduzir movimento" no sistema operacional.
- Com a preferência ligada, recarregue e confira: sem entrada deslizante, sem loops visíveis, conteúdo todo presente.
- Busca estática por sinais: Grep por `repeat: Infinity`, `animate-pulse`, `animate-` e `transition={{` em `src/**/*.tsx`; cada ocorrência precisa respeitar a preferência.

## Ferramentas

- Navegador embutido do app (`mcp__Claude_Browser__*`): `read_page` devolve a árvore de acessibilidade (nomes, papéis, estados); `find` localiza controles sem nome.
- `resize_window` com `colorScheme` alterna claro/escuro para o teste de contraste dos dois temas.
- O subagente `qa-a11y-auditor` não tem navegador; para ele, esses testes ficam "não verificados".
