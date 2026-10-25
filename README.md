# Portfólio — Cauã Andrade

Site pessoal de desenvolvedor back-end. Vite 5, React 18, TypeScript (strict), Tailwind 3, shadcn/Radix e framer-motion. Deploy na Vercel.

## Como rodar

```bash
npm install
npm run dev      # http://localhost:8080
npm run check    # typecheck + lint + validate:data + deps + build
```

Rode `npm run check` antes de considerar uma mudança pronta. Etapas isoladas: `typecheck`, `lint`, `validate:data` e `deps`.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| `src/types/` | Schemas zod: o contrato dos dados |
| `src/data/` | Todo o conteúdo do site, validado com `.parse()` |
| `src/components/` | Seções da home |
| `src/components/primitives/` | `Section`, `SectionHeader`, `Reveal`, `Icon`, `SpotlightCard` |
| `src/components/effects/` | Efeitos próprios, como o `DataFlow` do hero |
| `src/components/ui/` | shadcn vendorizado (não editar) |
| `src/pages/` | Rotas: home, `/projects/:slug` e 404 |

## Onde editar o conteúdo

Textos, projetos, stack, certificações e contato ficam em `src/data/`. Para mostrar a seção de experiência, preencha `src/data/experience.ts`: ela só aparece (e entra no menu) quando houver itens. Os formatos aceitos estão em `src/types/`; `npm run validate:data` aponta o campo errado.

Os textos de `case` em `src/data/projects.ts` são rascunhos a partir das descrições; `results` está vazio até haver números reais.

## Design

Identidade azul-marinho com Roboto. Tokens de cor e raio em `docs/design/tokens.json`, sincronizados com `src/index.css` pela skill `design-system-sync`. Tema claro por padrão, com toggle para o escuro.

## Harness

`CLAUDE.md` indexa as regras (`.claude/rules/`), os agentes (`.claude/agents/`) e as skills (`.claude/skills/`). O roadmap está em `docs/harness/phases.md`.
