---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# TypeScript

- **`strict: true`.** Não afrouxe flags em `tsconfig.app.json`.
- **Sem `any`**, nem `as any`. Use `unknown` e estreite com narrowing ou zod. `@ts-ignore` é proibido; `@ts-expect-error` só com a explicação na mesma linha.
- **Tipos de domínio vêm de `src/types`** via `z.infer`. Não reescreva à mão um tipo que já existe como schema.
- **Contrato primeiro.** Todo módulo de `src/data` exporta o resultado de `schema.parse(...)`. Dado novo exige schema novo antes.
- **Tipos importados com `import { type X }`** (o ESLint exige).
- **Sem variáveis ou parâmetros não usados.** Remova, ou prefixe com `_` quando o parâmetro for obrigatório pela assinatura.
- **Sem `enum`.** Use `z.enum`, união de literais ou `as const`.
- **Props:** `type Props = {...}`. Para variantes cva, derive com `VariantProps<typeof variants>`.
- **Sem `!` (non-null assertion)** sem um comentário explicando por que é seguro.

## Certo / errado

```ts
// certo
import { projectsSchema, type Project } from "@/types";
export const projects: Project[] = projectsSchema.parse(raw);

// errado
export const projects: any = raw;
```

## Como é checado

`npm run typecheck`, `npm run lint` (`no-explicit-any`, `no-unused-vars`, `consistent-type-imports`) e `npm run validate:data`.
