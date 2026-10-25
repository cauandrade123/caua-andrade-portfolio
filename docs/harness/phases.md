# Roadmap: refinar o portfólio existente

Marque as caixas conforme avançar. O índice do harness está em `CLAUDE.md`.

## Direção

O redesign do zero foi abandonado (as 3 direções do Paper foram rejeitadas). O trabalho agora é **polir o site que existe**: mesma identidade azul-marinho, Roboto e ordem das seções, com mais **profundidade** e um **efeito próprio** (fluxo de dados no hero). Queixa original: "cara de IA, muito branco, sem profundidade, sem efeitos originais".

## Harness (infraestrutura, pronto)

- [x] **H1** baseline executável: branch `redesign`, `npm run check`.
- [x] **H2** contratos de dados (zod) e config estrita (`strict`, ESLint, `legacyFiles`).
- [x] **H3** rules, `CLAUDE.md` e este roadmap.
- [x] **H4** agentes `paper-transpiler` (dormente), `data-refactorer`, `qa-a11y-auditor`.
- [x] **H5** skills `design-system-sync`, `compound-primitive-pattern`, `vision-to-code` (dormente), `a11y-auditor-suite`.
- [x] Extras no `check`: `eslint-plugin-jsx-a11y`, `depcheck`, 31 dependências sem uso removidas.

## Refinamento

- [x] **R0 Baseline original.** Tokens da Fase 2 (Editorial) revertidos: Roboto, azul-marinho e raio de 1rem de volta. Mantidos só `content` globs, import ESM de `tailwindcss-animate` e o anel de foco navy. `docs/design/tokens.json` agora espelha a paleta original.
- [x] **R1 Correções funcionais e a11y base:** logo com texto, Contato no menu mobile, `mailto:`, rótulo do LinkedIn, links mortos removidos, `scroll-padding-top`, Certificação no menu, `MotionConfig`, skip link, `<main id>`, `aria-expanded` e `Esc`.
- [x] **R2 Contraste:** cinzas claros e eyebrow do Contato corrigidos; `contrast.mjs` mede o legado nos dois temas.
- [x] **R3 Profundidade, primitivos e dados:** superfícies navy, grão, luz, elevação; `Section`, `SectionHeader`, `Reveal`, `Icon`, `SpotlightCard`.
- [x] **R4 Hero com DataFlow:** diagrama SVG de requisição com pacotes animados e reação ao cursor; hero navy. Saíram blobs, ícones flutuantes e gradiente infinito.
- [x] **R5 Reescrita das seções** sobre primitivos e dados: Header (scroll-spy numerado), About (foto de 544 KB para 67 KB), Stacks, Certificação (em Tailwind), Projetos, Contato e Footer. `legacyFiles` ficou vazia.
- [x] **R6 Experiência, cases e rotas:** seção de experiência (oculta até haver dados), `/projects/:slug` com 4 cases rascunhados, 404 em português, rewrite de SPA na Vercel, `sitemap.xml`, `preview.png` (antes inexistente), `apple-touch-icon`, `theme-color`.
- [x] **R7 Tema escuro** com `next-themes` (abre no claro, escolha salva), `.dark` navy, escala `gray-*` invertida, token `link`.
- [ ] **R8 QA final:** `qa-a11y-auditor` rodou; falta tratar os achados. Dados de experiência, revisão dos textos de case e currículo seguem pendentes com o usuário.
- [x] **R8.1 Movimento:** zoom de card para página (View Transitions), microinterações e skill `motion-design`.
- [x] **R8.2 Scrollytelling nos cases:** seção "Como funciona" (`CaseStory` + `ApiWindow`) com etapas tiradas dos repositórios. Aprovado pelo usuário em 25/10/2026.
- [x] **R9 Hero vitrine** (decidido no grill de 25/10/2026, implementado no mesmo dia):
  - **Paleta e fonte:** grafite + âmbar em todo o site (claro e escuro), e fonte display.
  - **Abertura** (`HeroSection`): nome com scramble, janelas flutuantes, nome que encolhe até o header, números e stack.
  - **Vitrine** (`ProjectShowcase`): mini-replay e zoom saindo da janela. "Projetos" virou a seção 01 e a `ProjectsSection` saiu da home.
  - **Outros:** DataFlow foi para a seção Stacks; mensagem no console.
  - **Pendente:** conferir com movimento reduzido.
- [x] **R10 Home sem código, mobile-first** (grill e crítica de design de 26/10/2026; implementado no mesmo dia em `HeroSection`, `ProjectStack`, `BrandIcon` e `use-typewriter`. Falta conferir com movimento reduzido e o arrasto com o dedo num celular de verdade). Motivo: código pede leitura, e a home precisa ser entendida num olhar. O código fica só no "Como funciona" do case. No celular, o primeiro frame tinha ~45% de vazio.
  - **Abertura (celular e desktop):**
    1. Terminal que digita `> whoami`, e o nome aparece letra a letra. Substitui o scramble.
    2. Embaixo, "Eu construo **APIs / automações / sistemas**", com a última palavra trocando sozinha.
    3. Prova: logos da stack (pacote `simple-icons`) e uma mini linha do tempo com os anos dos projetos. Os números de contagem ficaram discretos e podem sair.
  - **Primeiro scroll:**
    1. As notificações dos sistemas empilham na tela ("201 Created", "Nota cadastrada", "Consulta confirmada").
    2. As letras do nome se dispersam como símbolos de código e se reagrupam formando o título "Projetos" da vitrine.
    3. O logo do header assume.
  - **Saem da hero:** as janelas de código flutuantes do desktop.
  - **Vitrine:** pilha deslizável de cards, sem código. No celular, desliza com o dedo; no desktop, com arrastar, botões e teclado. Cada card tem o ícone do domínio, o título, uma frase, as tags e "Ver case". O zoom para o case sai do card.
  - **Acessibilidade:** botões de anterior/próximo e teclado na pilha; com movimento reduzido, o nome aparece pronto, sem dispersar, e a pilha vira uma lista.
  - **Já feito:** números da hero menores, numa linha só.
  - **Primeiro frame:** só o nome, gigante, em fonte display com caráter (Bricolage Grotesque; Roboto continua no texto corrido). O nome se monta com scramble de caracteres ao abrir (menos de 1 s, uma vez).
  - **Em volta do nome:** as janelas dos projetos flutuam em 3D e seguem o mouse (parallax).
  - **Primeiro scroll:** o nome encolhe até virar o logo do header; entram os números contando (projetos, tecnologias, certificação) e a stack em linha.
  - **Vitrine:** as janelas se organizam e os projetos passam em sequência, presos, no formato do `CaseStory`. A janela de cada um faz um mini-replay das etapas do case enquanto ele está em foco; clicar leva ao case com o zoom. O API Gateway, sem `story`, mostra uma janela estática marcada "em desenvolvimento".
  - **Seção Projetos sai da home** (o componente fica no código para voltar).
  - **Cor:** hero, Stacks e Contato (+ Footer) passam de navy para grafite neutro com acento laranja/âmbar. O acento é um token só. O resto do site continua claro.
  - **DataFlow** sai da hero e vai para a seção Stacks, recolorido em âmbar.
  - **Celular:** nome grande, nada preso, projetos empilhados com a janela plana. Movimento reduzido: sem scramble, sem parallax, sem replay.
  - **Texto:** a palavra "júnior" não aparece; o cargo segue "Desenvolvedor Back-end". Só português por agora.
  - **CTA:** nenhum botão no primeiro frame, só um indicador de rolar; o "Contato" do header continua visível.
  - **Foto:** só no Sobre. **Tema escuro:** também grafite + âmbar (uma identidade só).
  - **Easter egg:** mensagem no console do navegador, com o GitHub.
  - Todas as alternativas que ficaram de lado: [`docs/design/alternatives.md`](../design/alternatives.md).

## Migração do legado

Arquivos em `legacyFiles` (`eslint.config.js`). A lista só deve encolher.

| Arquivo | Passo |
|---|---|
| `Header.tsx` | R5 |
| `HeroSection.tsx` | R4 |
| `AboutSection.tsx` | R5 |
| `StacksSection.tsx` | R5 |
| `CertificationSection.tsx` | R5 |
| `ProjectsSection.tsx` | R5 |
| `ContactSection.tsx` e `Footer.tsx` | R5 |
| `pages/NotFound.tsx` | R6 |

## Decisões

- Intensidade: polimento; refresh moderado só se o polimento não bastar.
- Profundidade: claro com blocos escuros (Hero, Stacks, Contato + Footer). Até R8 eram navy; no R9 viram grafite + âmbar.
- Efeito de assinatura: até R8, fluxo de dados no hero; no R9, nome gigante + vitrine de projetos em scrollytelling (sem biblioteca de animação nova).
- Público-alvo da primeira impressão (R9): "júnior com muita entrega". A prova (números, stack) vem no primeiro scroll, não no primeiro frame.
- Alternativas guardadas para trocar depois, se o usuário pedir (lista completa, com o que mudar no código, em `docs/design/alternatives.md`):
  - **Hero:** história "uma requisição atravessando a minha stack" (base: `DataFlow`) ou "minha trajetória" (linha do tempo presa), no lugar da vitrine de projetos. Ou "hero só com destaques", com a seção Projetos de volta.
  - **Acento:** azul elétrico no lugar do âmbar.
  - **Fonte do nome:** mono (ex.: JetBrains Mono) no lugar da display.
  - **Efeitos descartados para o primeiro frame** (por excesso): letras que reagem ao cursor (pede fonte variável) e grade de pontos que acende.
- Tema padrão: claro, com toggle.
- Currículo: botão não restaurado até existir um PDF final (o de `public/` tem 4,7 KB).
- API Gateway aparece como "em desenvolvimento", sem promessa de números.
- Experiência: o usuário envia os dados reais.
- Paper: arquivo "Portfolio Redesign" (id `01M5NKHKY9STCZXZY9VGFM8EFC`) guardado, com as direções A, B e C rejeitadas.
