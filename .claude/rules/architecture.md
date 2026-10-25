---
paths:
  - "src/components/**"
  - "src/pages/**"
  - "src/data/**"
  - "src/types/**"
---

# Arquitetura de componentes e dados

## Onde cada coisa vive

| Pasta | Papel |
|---|---|
| `src/components/ui/` | shadcn vendorizado. Não edite à mão; está isento das regras. |
| `src/components/primitives/` | Blocos de composição: `Section`, `SectionHeader`, `Card`, `Reveal`, `Icon`. |
| `src/components/*.tsx` | Seções da home (Header, Hero, About, Stacks, Experience, Certification, Projects, Contact, Footer), montadas só com primitivos e dados. |
| `src/components/effects/` | Efeitos visuais próprios (como o `DataFlow`); decorativos, `aria-hidden`, respeitam movimento reduzido. |
| `src/pages/` | Rotas. |
| `src/types/` | Schemas zod + `z.infer` (o contrato). |
| `src/data/` | Conteúdo, validado com `schema.parse(...)`. |

## Regras

- **Use primitivos.** Seção não escreve `<section>`, `<h2>` nem wrapper de animação à mão: usa `Section`, `SectionHeader` e `Reveal`.
- **Dados só em `src/data/`.** Componente importa de `@/data`; nunca declara array ou objeto de conteúdo.
- **Sem texto literal em JSX.** Todo texto, inclusive `aria-label`, `alt` e `title`, vem de `@/data` (`copy`, `site` ou as coleções). Símbolos decorativos (`→`, `©`) viram ícone.
- **Ícones por nome.** O dado guarda `icon: "Server"`; o componente renderiza com `<Icon name>`. Dados não importam React nem lucide.
- **Um componente por arquivo**, `export function Nome`, props tipadas com `type`. `default export` só em páginas.
- **Animação só por `Reveal`.** Não repita `useRef` + `useInView` em cada seção.
- **Imports com alias `@/`.**
- **Ordem ao mudar conteúdo:** schema em `src/types` → dado em `src/data` → componente.
- **Sem exceções de JSX:** a lista `legacyFiles` (`eslint.config.js`) está vazia. Arquivo novo não entra nela; precisa passar no `npm run lint`.

## Como é checado

- Texto literal em JSX: ESLint `no-restricted-syntax` (`JSXText`).
- Contratos de dados: `npm run validate:data` e `npm run typecheck`.
- O resto: agente `qa-a11y-auditor`.
