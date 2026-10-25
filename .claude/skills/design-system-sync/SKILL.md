---
name: design-system-sync
description: Sincroniza os tokens de cor (claro/escuro) e raio de docs/design/tokens.json com src/index.css, convertendo para triplas HSL com um script, e confere contraste e sincronia. Use ao criar ou ajustar um token (superfícies navy, tema escuro) ou quando o JSON e o CSS divergirem. Aceita tokens vindos do Paper, mas não depende dele.
---

# Design System Sync

Fonte da verdade: `docs/design/tokens.json` (hoje espelha a paleta original do site; o Paper é opcional). Destino: `src/index.css` (variáveis HSL) e `tailwind.config.ts`. Este fluxo evita converter cor na mão e manter claro/escuro fora de sincronia.

## Fluxo

1. **Fonte:** edite `docs/design/tokens.json`. Se os tokens vierem do Paper, o Paper Desktop precisa estar aberto; se `mcp__paper__*` falhar, pare e avise o usuário.
2. **Ler os tokens:** `mcp__paper__get_tokens`. Normalize para o JSON descrito em [token-map.md](token-map.md) e atualize `docs/design/tokens.json`, que é a fonte versionada.
3. **Converter:**
   ```bash
   node .claude/skills/design-system-sync/scripts/tokens-to-hsl.mjs <tokens.json>
   ```
   Opções: `--format css` ou `--format tailwind`. A saída traz o bloco `:root`, o bloco `.dark` e as entradas de `theme.extend.colors`. Avisos (alpha ignorado, tema escuro ausente) saem no stderr; resolva cada um.
4. **Aplicar:**
   - `src/index.css`: atualize os blocos `:root` e `.dark` dentro de `@layer base` (crie o `.dark` se não existir).
   - `tailwind.config.ts`: acrescente ou ajuste as entradas de `theme.extend.colors`. Raio, fontes, escala tipográfica, espaçamento e sombras seguem a tabela do `token-map.md`.
5. **Validar:**
   - Contraste AA nos dois temas: `node .claude/skills/a11y-auditor-suite/scripts/contrast.mjs docs/design/tokens.json`.
   - O CSS bate com o JSON: `node .claude/skills/design-system-sync/scripts/verify-sync.mjs docs/design/tokens.json src/index.css`.
   - `npm run check`.
   - Abra a página em claro e escuro e confira.
6. **Reportar:** tokens novos, alterados e removidos, e o que ficou legado.

## Regras

- Nunca escreva hex, rgb ou hsl em `.tsx`. Cor só entra como variável em `src/index.css`.
- Não invente token que o Paper não tem. Falta algo? Pergunte ou crie no Paper primeiro.
- Remova as escalas legadas (`gray-*`, `blue-*`) somente quando nenhum arquivo de `legacyFiles` as usar mais (confira com Grep).
