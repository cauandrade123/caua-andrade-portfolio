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
| `src/components/effects/` | Efeitos próprios: `ApiWindow` (janela do "Como funciona" do case) e `ShiningBadge` (selo da certificação) |
| `src/components/ui/` | shadcn vendorizado (não editar) |
| `src/pages/` | Rotas: home, `/projects/:slug` e 404 |

## Onde editar o conteúdo

Textos, projetos, stack, certificações e contato ficam em `src/data/`. Para mostrar a seção de experiência, preencha `src/data/experience.ts`: ela só aparece (e entra no menu) quando houver itens. Os formatos aceitos estão em `src/types/`; `npm run validate:data` aponta o campo errado.

Os textos de `case` em `src/data/projects.ts` são rascunhos a partir das descrições; `results` está vazio até haver números reais.

## Design

Grafite com acento âmbar, Roboto no texto e Bricolage Grotesque no nome e nos títulos. Hero, Projetos, Stacks e Contato são blocos grafite nos dois temas; os tokens se chamam `surface-navy` (grafite) e `glow` (âmbar) por compatibilidade. Os tokens de cor e raio ficam em `src/index.css` (variáveis HSL, claro e escuro) e em `tailwind.config.ts`. Tema claro por padrão, com toggle para o escuro.

A home é entendida num olhar e não mostra código: o código aparece só no "Como funciona" de cada case. Ícones e o preview de compartilhamento (`public/`) seguem a mesma identidade: "CA" branco com o ponto âmbar do "Andrade." da hero.

## Arquivos de IA

As instruções e ferramentas de IA do projeto (`CLAUDE.md`, `.claude/`, `docs/` e o grafo `graphify-out/`) ficam só na máquina local e não são versionadas (ver `.gitignore`).
