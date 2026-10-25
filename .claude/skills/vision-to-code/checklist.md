# Checklist Vision-to-Code

Copie, preencha e inclua no relatório.

## Entrada
- [ ] Fonte definida: node ID do Paper / PNG exportado (caminho) / imagem colada (thread principal)
- [ ] Alvo: arquivo(s) em `src/components/sections/` ou `src/pages/`
- [ ] Rules lidas: `ui.md`, `architecture.md`, `typescript.md`, `a11y-performance.md`

## 1. Estrutura
- [ ] Landmarks e ordem de leitura identificados
- [ ] Hierarquia de headings sem pular níveis (um `h1` por página)
- [ ] Árvore de componentes desenhada (bloco → primitivo)

## 2. Tokens
- [ ] Cores mapeadas para tokens semânticos (claro e escuro)
- [ ] Tipografia mapeada para a escala (`text-display-*`, `text-body-*`, `text-label`)
- [ ] Espaçamento, raio e sombra mapeados
- [ ] Tokens faltantes listados (e `design-system-sync` acionada)
- [ ] Nenhum valor arbitrário, nenhum hex em `.tsx`

## 3. Primitivos
- [ ] `Section` / `SectionHeader` / `Card` / `Reveal` / `Icon` reutilizados
- [ ] Primitivo novo (se houver) segue `compound-primitive-pattern`

## 4. Dados
- [ ] Textos e listas extraídos para `src/data` com schema em `src/types`
- [ ] `aria-label`, `alt` e `title` também vêm dos dados
- [ ] Nenhum texto literal em JSX

## 5. Código
- [ ] Mobile-first (390px) e depois `sm:`/`md:`/`lg:`
- [ ] Tema escuro conferido
- [ ] Sem `style={{}}`, sem `any`

## 6. Acessibilidade
- [ ] Controles são `button`/`a`, com nome acessível
- [ ] Foco visível e ordem de Tab coerente
- [ ] Animação via `Reveal`; movimento reduzido respeitado
- [ ] Imagens com `alt`, `width`/`height` e formato WebP

## 7. Verificação
- [ ] `npm run check` sem erros
- [ ] Comparado com o screenshot do Paper: mobile e desktop, claro e escuro
- [ ] Arquivo legado removido de `legacyFiles` (se aplicável)
- [ ] Diferenças e pendências registradas no relatório
