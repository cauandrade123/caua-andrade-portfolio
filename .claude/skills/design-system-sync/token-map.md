# Mapa de tokens: Paper → código

## Formato do JSON de entrada (`tokens.json`)

O `mcp__paper__get_tokens` devolve os tokens do arquivo do Paper. Normalize-os para este formato; o script não lê o formato nativo do Paper.

```json
{
  "colors": {
    "background": { "light": "#ffffff", "dark": "#0b0f1a" },
    "primary": "#1d4ed8",
    "primaryForeground": { "light": "#ffffff", "dark": "#0b0f1a" }
  },
  "radius": "0.75rem"
}
```

- `colors.<nome>`: uma string (mesmo valor nos dois temas) ou `{ light, dark }`. Aceita `#rgb`, `#rrggbb`, `rgb(...)` e `hsl(...)`.
- Alpha é ignorado, com aviso: faça transparência na classe (`bg-primary/10`).
- O nome pode ser camelCase ou kebab-case; sai como `--kebab-case`.
- O par `x` + `xForeground` vira `{ DEFAULT, foreground }` no Tailwind (padrão shadcn).

A fonte versionada é `docs/design/tokens.json`. Exemplo menor: `.claude/skills/design-system-sync/sample-tokens.json`.

## Onde cada token vai

| Token do Paper | Arquivo | Como |
|---|---|---|
| Cor | `src/index.css` | `--nome: H S% L%;` em `:root` (claro) e `.dark`, dentro de `@layer base` |
| Cor | `tailwind.config.ts` | `theme.extend.colors` → `"hsl(var(--nome))"` (o Tailwind injeta o alpha) |
| Raio | `src/index.css` + config | `--radius`; `borderRadius` já usa `var(--radius)` |
| Família tipográfica | `package.json`, `src/main.tsx`, config | `npm i @fontsource-variable/<familia>`, `import "@fontsource-variable/<familia>"`, `fontFamily` com o nome `"<Familia> Variable"` |
| Escala tipográfica | `tailwind.config.ts` | `theme.extend.fontSize` (hoje: `display-xl/lg/md`, `body-xl/lg/md/sm`, `label`) |
| Espaçamento de seção | `tailwind.config.ts` | `theme.extend.spacing.section` |
| Sombra | `src/index.css` + config | `--shadow-*` em `:root`/`.dark` e `boxShadow` |
| Gradiente | `src/index.css` | `--gradient-*` montado com `hsl(var(--token))`, sem cor nova |

## Regras

1. Nome semântico (`primary`, `muted`, `accent`, `card`, `ring`), nunca pela cor (`blue-500`).
2. Todo token de cor existe nos dois temas (claro e `.dark`).
3. Confira o contraste ao criar o par texto/fundo: ≥ 4,5:1 para texto e ≥ 3:1 para elementos de UI.
4. As escalas legadas (`gray-*`, `blue-*` e os `--gradient-*` azuis) ficam até a última seção legada migrar; depois remova.
5. Depois de aplicar: `npm run check` e conferência visual em claro e escuro.
