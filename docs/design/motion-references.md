# Referências de movimento

Efeitos vistos em outros projetos, com o nome técnico (para pesquisar) e como fazer nesta stack sem dependência nova. Regras gerais de movimento: skill `motion-design`.

## Money Flow Scroll (vídeo de 25/10/2026)

Fonte: gravação de tela do protótipo "Money Flow Scroll" (`C:\Users\cauag\Downloads\Video Project 2.mp4`, 2 min 26 s). Quadros salvos em [`references/money-flow-scroll/`](references/money-flow-scroll/).

O conceito que une tudo é **scrollytelling**: a rolagem conta uma história em etapas, e cada etapa muda a cena em vez de só empurrar a página para cima. Em inglês também aparece como *scroll-driven storytelling* ou *scroll-linked animation*.

| # | O que acontece no vídeo | Nome técnico | Quadro |
|---|---|---|---|
| 1 | O celular fica de lado, inclinado em 3D, com cartões (áudio, "Anotado!", saldo) soltos na frente dele em profundidades diferentes. | **3D device mockup** com *perspective tilt* (`rotateX`/`rotateY`) + **layered parallax** / *exploded view* (camadas em `translateZ`) | `01-celular-3d.jpg` |
| 2 | A seção fica parada na tela enquanto você rola; uma barra de progresso avança "00:00 você fala → 00:03 bot anota → 00:05 no painel" e o texto troca a cada passo. | **Sticky / pinned section** com **scroll scrubbing** (o progresso da rolagem dirige a animação, ida e volta) | `01-celular-3d.jpg` |
| 3 | A lista à esquerda (Gasto, Entrada, Não entendeu?) acende o item ativo e a tela do celular muda junto. | **Sticky scroll steps** (lista de passos + mídia fixa sincronizada), padrão comum em sites da Apple e da Stripe | `02-passos-fixos.jpg` |
| 4 | O dashboard entra escuro e inclinado para trás, e "deita" até ficar de frente conforme a rolagem. | **3D tilt-to-flat reveal** / *perspective scroll reveal* (na Aceternity UI se chama *Container Scroll Animation*) | `03-painel-inclinado.jpg` → `04-painel-assentado.jpg` |
| 5 | Os painéis aparecem um depois do outro. | **Staggered reveal** | `03` → `04` |
| 6 | Os valores começam em "R$ 0.000,00" e os dígitos giram até o número real. | **Number ticker** / *odometer* / *digit scramble* (parente do nosso `CountUp`) | `03` → `04` |
| 7 | A linha do gráfico se desenha, a rosca preenche e as barras crescem. | **Line draw** (`pathLength`), *donut sweep* e *bar grow* | `04-painel-assentado.jpg` |
| 8 | A transação nova entra no topo com o selo "AGORA · POR ÁUDIO". | **Highlight on enter** (item novo destacado) | `04-painel-assentado.jpg` |
| 9 | O título da seção seguinte surge com fade enquanto a anterior sai, fechando com "Próxima: sem senha de banco". | **Scroll-linked crossfade** entre capítulos | — |

### Como fazer aqui (sem dependência nova)

- **Progresso da rolagem:** `useScroll({ target: ref, offset: ["start start", "end end"] })` do framer-motion na seção alta (ex.: `h-[300vh]` vira um token de altura; nada de valor arbitrário), com o conteúdo em `sticky top-0 h-screen`.
- **Mapear progresso em movimento:** `useTransform(scrollYProgress, [0, 1], [inicio, fim])` para `rotateX`, `rotateY`, `scale`, `opacity`. Passo ativo = `useMotionValueEvent` que arredonda o progresso para o índice da etapa.
- **3D:** `perspective` no pai e `transform-style: preserve-3d` (`[transform-style:preserve-3d]` é arbitrário; crie utilitários em `index.css`), camadas com `translateZ` distintos.
- **Desenho de gráfico:** `motion.path` com `pathLength` de 0 a 1.
- **Alternativa só CSS:** `animation-timeline: view()` / `scroll()` (*CSS scroll-driven animations*). Funciona no Chrome e no Edge, ainda não em todos os navegadores; use como melhoria progressiva.
- **Bibliotecas de referência** (não instaladas): GSAP ScrollTrigger (`pin` + `scrub`) e Lenis (rolagem suave). Ficam fora pela regra de zero dependência nova.

### Cuidados

- **Movimento reduzido:** sem pin nem scrub; as etapas viram blocos empilhados normais, já no estado final.
- **Celular:** seções presas com altura de várias telas cansam no touch. Reduza o número de etapas ou desligue o pin abaixo de `md`.
- **Conteúdo não pode depender da rolagem:** todo texto das etapas fica no DOM e legível para leitor de tela; a animação só muda a apresentação.
- **Só `transform` e `opacity`** no que anima com a rolagem; nada de `filter: blur` animado.

### Onde entrou e onde poderia entrar no portfólio

- **Feito:** página de case, seção "Como funciona" (`CaseStory`). As etapas reais do repositório rolam à esquerda e uma janela de API presa em 3D troca de tela à direita (efeitos 1 a 4). As etapas ficam em `case.story` em `src/data/projects.ts`.
- Projetos: um mockup do projeto inclinado que "deita" ao entrar na tela (efeito 4).
- Sobre: a contagem de números já existe; o *digit scramble* seria uma variação dela.
