---
name: a11y-auditor-suite
description: Auditoria de acessibilidade do portfolio com foco em WCAG 2.1 AA - checagem automática (eslint jsx-a11y), revisão estática do código, navegação por teclado, contraste e prefers-reduced-motion. Use ao concluir uma seção ou tela, antes de fechar uma fase ou quando pedirem uma auditoria de acessibilidade.
---

# A11y Auditor Suite

Cobre WCAG 2.1 nível AA. Critérios em [wcag-2-1-aa.md](wcag-2-1-aa.md); testes de teclado e movimento em [keyboard-and-motion.md](keyboard-and-motion.md).

## Procedimento

1. **Automático.** `npm run lint` (regras `jsx-a11y` entram como erro) e `npm run check`. Zero erros é o mínimo, não a conclusão: o linter pega só uma parte do WCAG.
2. **Revisão estática.** Percorra os arquivos auditados com os critérios de `wcag-2-1-aa.md`. Use Grep para achar sinais: `onClick` em `div`/`span`, `<img` sem `alt`, `outline-none`, `tabIndex` positivo, `aria-hidden` em elemento focável, animações `repeat: Infinity`.
3. **Teclado e movimento.** Siga `keyboard-and-motion.md`.
4. **Contraste.** `node .claude/skills/a11y-auditor-suite/scripts/contrast.mjs docs/design/tokens.json` calcula a razão de cada par de tokens nos dois temas. Mínimos: 4,5:1 (texto normal), 3:1 (texto grande e componentes de UI).
5. **Relatório.** Tabela por severidade com `arquivo:linha`, critério (WCAG X.Y.Z), problema e correção. Separe "verificado" de "não verificado".

## Quem executa o quê

- **Thread principal:** pode rodar o app (`npm run dev`, porta 8080) e usar o navegador embutido para os testes de teclado e a árvore de acessibilidade.
- **Subagente `qa-a11y-auditor`:** não tem navegador. Faz os passos 1, 2 e o cálculo de contraste pelos valores dos tokens, e marca teclado e movimento em tela como **não verificados**.

## Regras

- Não afirme que passou o que não foi testado.
- Corrigir é outro passo: esta skill só audita.
