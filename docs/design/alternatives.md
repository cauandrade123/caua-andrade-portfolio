# Ideias em segundo plano

Alternativas que surgiram nas sessões de grill (24 e 25/10/2026) e ficaram de lado. Nenhuma foi descartada por ser ruim: perderam para outra escolha. Cada uma diz o que é, por que ficou de fora e o que mudar no código para trocar. A escolha atual está no R9 de [`docs/harness/phases.md`](../harness/phases.md).

Legenda: **★** = o usuário pediu para guardar explicitamente; as demais são opções que ele não escolheu.

## História da hero (scrollytelling da home)

| Ideia | Como seria | Por que ficou de fora | Para trocar |
|---|---|---|---|
| **★ Uma requisição atravessando a minha stack** | Ao rolar, um clique vira requisição que passa por API → autenticação → banco → resposta, e cada etapa acende a tecnologia usada. | Perdeu para a vitrine de projetos, que prova entrega com trabalho real. | Base pronta: `src/components/effects/DataFlow.tsx` e `src/data/flow.ts`. Prender o `DataFlow` numa seção alta com `useScroll` e acender os nós por etapa. |
| **★ Minha trajetória** | Linha do tempo presa: estudo → certificação → projetos → agora. | Mais pessoal, menos técnica; o foco é "muita entrega". | Precisa dos dados de experiência (pendentes). Reaproveita `useActiveStep` e o layout do `CaseStory`. |
| Terminal que me apresenta | Um terminal "roda" comandos conforme a rolagem: `whoami`, `stack`, `projetos`, `contato`. | Não escolhida. | Reaproveita a `ApiWindow` no modo `terminal`. |

## Projetos na home

| Ideia | Como seria | Por que ficou de fora | Para trocar |
|---|---|---|---|
| **★ Hero só com destaques** | A hero mostra 2 ou 3 projetos mais fortes em sequência; a seção Projetos volta com todos em cards. | A hero virou a vitrine completa. | Recolocar `<ProjectsSection />` em `src/pages/Index.tsx` (o componente não foi apagado) e filtrar os destaques na hero. |
| Projetos sobe e vira a sequência | A hero fica só com o nome; ao rolar, entra direto a seção Projetos já presa e em 3D. | Não escolhida. | Separar o nome da vitrine em duas seções. |
| Janela com a requisição principal | Cada projeto mostra só a etapa mais forte do case (ex.: o `GET_LOCK` da Barbearia), parada. | Perdeu para o mini-replay. | Passar `steps[i]` fixo para a `ApiWindow` em vez de alternar. |
| Janela com card editorial | Título grande, ano, tags e resumo dentro da janela. Mais limpo, menos técnico. | Perdeu para o mini-replay. | Novo conteúdo de janela a partir de `projects`. |

## Primeiro frame

| Ideia | Como seria | Por que ficou de fora | Para trocar |
|---|---|---|---|
| Letras que reagem ao cursor | As letras do nome perto do mouse se afastam ou mudam de peso. | Excesso: competia com o parallax das janelas. Pede fonte variável. | Instalar a versão variável da fonte display e animar `font-variation-settings`/`transform` por letra. |
| Grade de pontos que acende | Grade discreta atrás do nome que acende em âmbar onde o cursor passa. | Excesso: seria a terceira camada atrás do nome. | Canvas ou SVG atrás do nome, mesmo padrão de cursor do `SpotlightCard`. |
| Nome grande à esquerda | Tipografia editorial à esquerda, com um visual 3D à direita. | Perdeu para o nome gigante que encolhe (mais impacto). | Layout em duas colunas na hero. |
| Frase como protagonista | O nome pequeno, como assinatura; domina uma frase do que você constrói. | A mais autêntica, mas surpreende menos. | Texto novo em `copy.hero`. |
| Nome centralizado com outro tratamento | Mantém o centro, sem gradiente nem pílula. | O problema era o estilo **e** a posição. | — |
| Status "construindo agora" | Selo "construindo agora: API Gateway" com ponto pulsando. | Não escolhido como prova. | Selo pequeno na hero ligado ao projeto `in-progress`. |
| Foto como janela flutuante | Entre as janelas dos projetos, uma é a sua foto. | Sem preferência; a hero ficou só tipográfica. | Adicionar a foto (`src/assets/foto-portfolio.jpg`) como mais uma camada. |
| Avatar pequeno no nome | Foto redonda pequena ao lado do nome, tipo assinatura. | Idem. | — |

## Cor e tema

| Ideia | Como seria | Por que ficou de fora | Para trocar |
|---|---|---|---|
| **★ Acento azul elétrico** | Azul vivo e saturado no lugar do âmbar. Mantém um fio da identidade antiga. | Âmbar escolhido como primeira opção. | Trocar só o token do acento em `src/index.css` / `docs/design/tokens.json` (skill `design-system-sync`). |
| Verde terminal | Verde de console. | Clichê de "back-end". | Idem, um token. |
| Verde-limão | O acento do Money Flow. | Ficaria com cara de "inspirado em". | Idem, um token. |
| Site todo escuro | O tema escuro vira o padrão. | Escolhido: escuro só na hero e nos blocos. | `defaultTheme` do `ThemeProvider` em `src/App.tsx`. |
| Só a hero escura | Hero grafite, blocos continuam navy. | Duas identidades no mesmo site. | — |
| Navy sóbrio | Mantém o navy, mas sem gradiente nem brilho. | O azul era o problema. | Tirar as luzes radiais de `.bg-navy-depth`. |
| Claro editorial | Hero clara, off-white, tipografia preta forte. | Não escolhida. | — |
| Tema escuro navy | O tema escuro continua azul, mesmo com os blocos em grafite. | Sem preferência; decidi por uma identidade só (escuro também grafite). | Bloco `.dark` em `src/index.css`. |
| Tirar o tema escuro | Sem toggle. | Sem preferência; o toggle continua. | — |

## Tipografia

| Ideia | Como seria | Por que ficou de fora | Para trocar |
|---|---|---|---|
| **★ Nome em mono** | Nome em fonte monoespaçada (ex.: JetBrains Mono). Cara de back-end/terminal. | Display com caráter escolhida primeiro. | Trocar o token de fonte display (`fontFamily.display` no Tailwind) e o pacote `@fontsource`. |
| Manter Roboto | Só tamanho, peso e espaçamento. | Pouca personalidade. | — |
| Serif editorial | Nome em serifa elegante (ex.: Instrument Serif). | Não escolhida. | Mesmo token de fonte display. |

## CTA, conteúdo e extras

| Ideia | Como seria | Por que ficou de fora | Para trocar |
|---|---|---|---|
| Copiar e-mail com um clique | E-mail que copia e responde "copiado!". | Sem preferência; o primeiro frame ficou sem botão. | Bom candidato para a seção Contato mesmo assim. |
| Selo "disponível para vagas" | Ponto pulsando que leva ao contato. | Idem. | — |
| Paleta de comandos (`/`) | Atalho que abre uma paleta: projetos, contato, GitHub. | Idem. | — |
| Abrir um case / falar comigo / GitHub / currículo como CTA | Botão principal no primeiro frame. | O usuário não gostou de nenhum. Currículo depende do PDF final. | — |
| Comando secreto | Digitar algo (ex.: `sudo`) dispara um terminal escondido. | Perdeu para a mensagem no console. | — |
| Escrever "júnior" | "Back-end Júnior" explícito. | Pode tirar de vagas pleno; a entrega fala por si. | `copy.hero.role`. |
| Frase no lugar do cargo | Sem cargo; uma frase do que você faz. | Não escolhida. | `copy.hero.role`. |
| Versão em inglês | PT e EN com seletor, ou EN como padrão. | Foco no Brasil por agora. | Os textos já estão em `src/data`; duplicar por idioma. |

## Rodada de 26/10/2026: home sem código

Escolhido: terminal que digita, palavras que trocam, notificações no scroll, nome que se dispersa e reagrupa em "Projetos", pilha deslizável, logos da stack e mini linha do tempo (R10 em `phases.md`). Ficaram de fora:

| Ideia | Como seria | Por que ficou de fora | Para trocar |
|---|---|---|---|
| Diagrama vivo | Ícones grandes da arquitetura de cada projeto, com um pulso âmbar percorrendo o caminho. | Não escolhida. | Base: `DataFlow` + `flow.ts`, um fluxo por projeto. |
| Notificação viva na vitrine | Cada projeto mostra uma notificação do resultado, na janela presa. | Perdeu para a pilha deslizável. As notificações foram para o scroll da hero. | Reaproveita o scrollytelling do `ProjectShowcase`. |
| Manchete do problema | Cada projeto vira uma frase grande do que resolve. | Não escolhida. | Campo de manchete em `projects.ts`. |
| Card que vira | Frente com nome e ícone; verso com 3 pontos ao tocar. | Não escolhida. | — |
| Objeto do domínio em 3D | Ícone gigante do mundo do projeto flutuando. | Não escolhida (o ícone entra pequeno nos cards da pilha). | — |
| Gravação real | Vídeo curto em loop do sistema rodando. | Não escolhida; pede gravar os sistemas. | Vídeo em `src/assets`, `<video muted loop playsinline>`. |
| Bento grid | Grade com cards de tamanhos diferentes. | Perdeu para a pilha deslizável. | — |
| Vitrine em scrollytelling com código | O que existia no R9: janela presa com mini-replay. | Código na home pede leitura. | `ProjectShowcase.tsx` (fica no código). |
| Janelas de código flutuando na hero | O que existia no R9. | Idem. | `FloatingWindow` no `HeroSection` do R9 (histórico do git). |
| Scramble do nome | O nome se monta de caracteres aleatórios. | Trocado pelo terminal que digita. | `src/lib/use-scramble.ts`. |
| Nome que encolhe até o logo | O que existia no R9 (só desktop). | Trocado por dispersar e reagrupar em "Projetos". | `src/lib/hero-handoff.ts` e o trecho de `NAME_TRAVEL` do `HeroSection` do R9. |
| Dispersar sem reagrupar | As letras se soltam e somem. | Perdeu para dispersar e reagrupar. | — |
| Pacote que desce com o scroll | Ponto âmbar que desce a tela até o primeiro projeto. | Não escolhida. | — |
| Sequência mais curta / notificações primeiro | Sem notificações, ou com elas já no primeiro frame. | A sequência completa foi aprovada. | — |
| Terminal só no celular | Desktop mantendo o scramble. | Terminal nos dois. | — |
| Frase de feito real / "Construindo agora" | Prova em uma linha, ou selo pulsante do projeto em andamento. | Ficaram logos + linha do tempo. | — |
| Números grandes contando | O que existia no R9. | O usuário não gostou; ficaram discretos. | `portfolio-stats.ts` + `CountUp`. |

## Primeira impressão (público)

Escolhido: **júnior com muita entrega**. Ficaram de fora "esse cara entende sistema", "back-end com olho de produto" e "alguém diferente". Se o foco mudar, a hero muda de tom: mais diagrama (sistema), mais acabamento visual (produto) ou mais experimental (diferente).

## Efeitos do vídeo Money Flow não usados

Detalhes em [`motion-references.md`](motion-references.md):
- **Number ticker / digit scramble:** dígitos girando até o valor. Variação do `CountUp`.
- **Line draw:** gráficos que se desenham.
- **Highlight on enter:** item novo destacado com um selo.
- **CSS scroll-driven animations:** `animation-timeline`, só como melhoria progressiva.
- **GSAP ScrollTrigger e Lenis:** ficaram fora pela regra de não ter dependência nova de animação.
