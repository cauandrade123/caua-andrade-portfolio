# Portfolio — Cauã Andrade (redesign)

Vite 5 + React 18 + TypeScript (strict) + Tailwind 3 + shadcn/Radix + framer-motion. Deploy na Vercel. Conteúdo em pt-BR.
Refinamento do design existente na branch `redesign` (sem redesign do zero). Roadmap e progresso: `docs/harness/phases.md`.

## Comandos

- `npm run dev` (porta 8080) · `npm run build`
- `npm run check` = typecheck + lint + validate:data + deps + build. **Rode antes de dar uma tarefa por concluída.**
- Etapas isoladas: `npm run typecheck`, `lint`, `validate:data`, `deps`.

## Mapa do código

- `src/types/`: schemas zod, que são o contrato dos dados (tipos via `z.infer`).
- `src/data/`: todo o conteúdo, validado com `.parse()`.
- `src/components/primitives/`: `Section`, `SectionHeader`, `Reveal`, `Icon`, `SpotlightCard`.
- `src/components/effects/`: efeitos visuais próprios (`DataFlow`, `ApiWindow`).
- `src/components/*.tsx`: seções da home (Header, Hero, ProjectStack, About, Stacks, Experience, Certification, Contact, Footer) e o `CaseStory` da página de case. `ProjectsSection` e `ProjectShowcase` estão fora da home, guardadas como alternativas.
- **Home sem código (R10):** código só aparece no "Como funciona" do case; a home precisa ser entendida num olhar.
- `src/components/ui/`: shadcn vendorizado. Não edite.
- `src/pages/`: rotas.

## Regras (`.claude/rules/`, carregam sozinhas ao tocar nos arquivos)

`ui.md` · `architecture.md` · `typescript.md` · `a11y-performance.md`

Inegociável: só tokens do Tailwind, sem `style={{}}`, sem valores arbitrários, sem texto literal em JSX, sem `any`, conteúdo em `src/data`.

## Agentes (`.claude/agents/`)

- `paper-transpiler`: design do Paper → React + Tailwind. Dormente: o Paper está fora desta etapa.
- `data-refactorer`: conteúdo hardcoded → `src/data` + schema.
- `qa-a11y-auditor`: auditoria somente leitura (check, regras, a11y, Vercel).

## Skills (`.claude/skills/`)

`design-system-sync` · `compound-primitive-pattern` · `vision-to-code` · `a11y-auditor-suite` · `motion-design`

## Convenções

- **Regras de JSX:** valem em todo `src/` (exceto `ui/`). A lista `legacyFiles` (`eslint.config.js`) está vazia; não adicione arquivos a ela.
- **Tema:** claro por padrão, com toggle (`next-themes`). Hero, Projetos, Stacks e Contato são blocos grafite com acento âmbar nos dois temas. Os tokens se chamam `surface-navy` e `glow` por compatibilidade.
- **Alternativas:** ideias que ficaram de lado nos grills estão em `docs/design/alternatives.md`. Atualize o arquivo a cada nova rodada.
- **Paper:** o Paper Desktop precisa estar aberto para usar `mcp__paper__*`. Subagentes recebem só texto: passe node ID ou caminho de PNG.
- **Design (R9):** grafite + laranja/âmbar, Roboto no texto e Bricolage Grotesque (`font-display`) no nome e nos títulos de impacto. Cores em `docs/design/tokens.json`. O arquivo do Paper ("Portfolio Redesign") guarda direções rejeitadas.
- **Git:** commit e push só quando o usuário pedir.
