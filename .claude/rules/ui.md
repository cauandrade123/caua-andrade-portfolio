---
paths:
  - "src/components/*.tsx"
  - "src/components/primitives/**"
  - "src/components/effects/**"
  - "src/pages/**"
  - "src/index.css"
  - "tailwind.config.ts"
---

# UI: Tailwind e tokens

- **Mobile-first.** A classe base é o mobile; `sm:`, `md:`, `lg:` só ampliam. Nunca use `max-*:` para consertar desktop.
- **Só tokens.** Cores semânticas (`bg-background`, `text-foreground`, `bg-primary`, `border-border`), `container`, escala tipográfica (`text-display-*`, `text-body-*`, `text-label`), `rounded-*` e espaçamento (`py-section`) do `tailwind.config.ts` / `src/index.css`.
- **Sem CSS inline.** Nada de `style={{}}` nem `<style>` dentro de componente. Única exceção: MotionValue do framer-motion, com `// eslint-disable-next-line no-restricted-syntax -- MotionValue`.
- **Sem valores arbitrários.** Proibido `w-[432px]`, `text-[#1a2b3c]`, `bg-[hsl(...)]`. Faltou valor? Crie o token com a skill `design-system-sync` e use o token.
- **Sem cor solta em `.tsx`.** Hex/rgb/hsl só em `src/index.css` (variáveis HSL, claro e `.dark`).
- **Condicionais com `cn()`** (`@/lib/utils`); variantes com `cva`.
- **Dark mode pelos tokens.** Eles trocam sozinhos; `dark:` só quando o token não cobre.
- **Foco visível.** Não use `outline-none` sem um `focus-visible:ring-*` equivalente.

## Certo / errado

```tsx
// certo
<div className="rounded-lg bg-card p-4 text-card-foreground md:p-6" />

// errado
<div className="rounded-[10px] bg-[#f5f6f8] p-[18px]" style={{ padding: 18 }} />
```

## Como é checado

- `style={{}}`: ESLint `no-restricted-syntax` (erro no `npm run check`; arquivos em `legacyFiles` ficam isentos).
- Valores arbitrários e cores soltas: agente `qa-a11y-auditor` (Grep).
