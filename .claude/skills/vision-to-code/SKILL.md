---
name: vision-to-code
description: Pipeline para transformar um design (node do Paper ou PNG/print) em componentes React + Tailwind - análise estrutural, mapeamento de tokens e primitivos, extração de texto para src/data, JSX mobile-first e verificação visual. Use quando o usuário enviar uma imagem do Paper, apontar um artboard/node ou pedir para implementar uma tela.
---

# Vision to Code

Transforma um design em código sem inventar estilo. O checklist completo, para copiar na resposta, está em [checklist.md](checklist.md).

## Fonte do design

| Fonte | Quando | Observação |
|---|---|---|
| **Node ID do Paper** (preferida) | Paper Desktop aberto | `get_jsx` + `get_computed_styles` dão valores exatos. Não estime nada de screenshot. |
| **PNG exportado** | Paper fechado, ou o usuário só tem a imagem | Valores são aproximados; avise no relatório. |
| **Imagem colada no chat** | Só na thread principal | Subagente recebe apenas texto: salve a imagem em arquivo e passe o caminho, ou passe o node ID. |

## Pipeline

1. **Análise estrutural.** Landmarks, hierarquia de headings, grid e ordem de leitura. Desenhe a árvore de componentes (qual primitivo vira cada bloco) antes de escrever JSX.
2. **Mapeamento de tokens.** Cada cor, fonte, espaço, raio e sombra do design vira um token existente. Sem equivalente? Anote como token faltante e use `design-system-sync`. Nenhum valor arbitrário.
3. **Mapeamento de primitivos.** Reaproveite `Section`, `SectionHeader`, `Card`, `Reveal`, `Icon`. Se faltar um, siga `compound-primitive-pattern`.
4. **Extração de dados.** Todo texto e lista do design vira schema (`src/types`) + dado (`src/data`). O JSX não leva texto literal.
5. **JSX mobile-first.** Comece pelo mobile (390px) e amplie com `sm:`/`md:`/`lg:`. Confira o tema escuro.
6. **Acessibilidade.** Aplique `.claude/rules/a11y-performance.md` durante a escrita, não depois.
7. **Verificação.** `npm run check`; depois compare com o screenshot do Paper (mobile e desktop, claro e escuro) e liste as diferenças.

## Regras

- Reproduza o design, não o interprete. Divergência só com motivo registrado no relatório.
- Não edite `src/components/ui/`.
- Ao terminar a migração de um arquivo legado, tire-o de `legacyFiles` em `eslint.config.js`.
