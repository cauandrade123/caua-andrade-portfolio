# Critérios WCAG 2.1 AA relevantes para o portfolio

Nível entre parênteses. Lista focada em site estático de página única com navegação, imagens, animação e links externos.

## Perceptível

| Critério | O que verificar |
|---|---|
| 1.1.1 Conteúdo não textual (A) | Toda `img` com `alt` descritivo; decorativa com `alt=""`; ícone decorativo com `aria-hidden`. |
| 1.3.1 Informação e relações (A) | Headings, listas, landmarks e `aria-labelledby` expressam a estrutura visual. |
| 1.3.2 Sequência significativa (A) | A ordem do DOM é a ordem de leitura. |
| 1.3.4 Orientação (AA) | Nada trava em retrato ou paisagem. |
| 1.4.1 Uso de cor (A) | Links e estados não dependem só da cor. |
| 1.4.3 Contraste mínimo (AA) | Texto ≥ 4,5:1; texto grande (≥ 24px, ou ≥ 18,66px em negrito) ≥ 3:1. Nos dois temas. |
| 1.4.4 Redimensionar texto (AA) | Funciona com zoom de 200% sem perder conteúdo. |
| 1.4.5 Imagens de texto (AA) | Texto é texto, não imagem. |
| 1.4.10 Reflow (AA) | Sem rolagem horizontal em 320px de largura. |
| 1.4.11 Contraste de não texto (AA) | Bordas de controles, foco e ícones informativos ≥ 3:1. |
| 1.4.12 Espaçamento de texto (AA) | Conteúdo não quebra ao aumentar espaçamento de linha, letra e parágrafo. |
| 1.4.13 Conteúdo em hover/foco (AA) | Tooltips e popovers: dispensáveis, pairáveis e persistentes. |

## Operável

| Critério | O que verificar |
|---|---|
| 2.1.1 Teclado (A) | Tudo que se faz com mouse se faz com teclado. |
| 2.1.2 Sem armadilha de teclado (A) | O foco entra e sai de menu, modal e sheet. |
| 2.1.4 Atalhos de tecla (A) | Sem atalho de uma tecla sem como desligar. |
| 2.2.2 Pausar, parar, ocultar (A) | Animação em loop com mais de 5 s precisa poder ser pausada ou ser mínima/decorativa; respeite `prefers-reduced-motion`. |
| 2.3.1 Três flashes (A) | Nada pisca mais de 3 vezes por segundo. |
| 2.4.1 Ignorar blocos (A) | Skip link para `#main`. |
| 2.4.2 Página com título (A) | Cada rota tem `<title>` próprio. |
| 2.4.3 Ordem do foco (A) | Tab segue a ordem visual. |
| 2.4.4 Finalidade do link (A) | O texto do link (ou seu `aria-label`) diz para onde vai. |
| 2.4.6 Cabeçalhos e rótulos (AA) | Headings e rótulos descrevem o conteúdo. |
| 2.4.7 Foco visível (AA) | Todo elemento focável mostra o foco. |

## Compreensível

| Critério | O que verificar |
|---|---|
| 3.1.1 Idioma da página (A) | `<html lang="pt-BR">`. |
| 3.2.3 Navegação consistente (AA) | O menu mantém ordem e rótulos entre rotas. |

## Robusto

| Critério | O que verificar |
|---|---|
| 2.5.3 Rótulo no nome (A) | O nome acessível contém o texto visível do controle. |
| 4.1.2 Nome, função, valor (A) | Controles têm nome; estado em `aria-expanded`/`aria-pressed`; elemento nativo antes de ARIA. |
| 4.1.3 Mensagens de status (AA) | Toasts e avisos dinâmicos usam `role="status"` ou `aria-live`. |
