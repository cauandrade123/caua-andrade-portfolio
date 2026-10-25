---
name: compound-primitive-pattern
description: Padrão para criar os primitivos de composição do projeto (Section, SectionHeader, Card, Reveal, Icon) em src/components/primitives com Radix Slot, cva e framer-motion. Use ao criar ou alterar um primitivo, ou ao montar uma seção nova a partir deles.
---

# Compound Primitive Pattern

Um primitivo é um bloco de layout ou comportamento **sem conteúdo**. Seções são montadas com primitivos + dados de `@/data`. Código de referência em [templates.md](templates.md).

## Contrato

1. Uma responsabilidade por componente, um componente por arquivo, em `src/components/primitives/`.
2. Zero conteúdo: texto, ícones e links chegam por props, vindos de `@/data`.
3. Estilo só por tokens (veja `.claude/rules/ui.md`). `className` é mesclado com `cn()` e o do chamador vence.
4. Variantes com `cva` + `VariantProps`; valores padrão em `defaultVariants`.
5. Polimorfismo com `asChild` + `Slot` (`@radix-ui/react-slot`) quando a raiz puder virar `<a>`, `<button>` etc.
6. Props estendem `ComponentPropsWithoutRef<"tag">`. Sem `any`.
7. Acessibilidade embutida no primitivo, não deixada para quem usa: `Section` liga `aria-labelledby` ao heading; `Reveal` respeita `prefers-reduced-motion`; `Icon` é `aria-hidden` por padrão.
8. Exporte só componentes (e tipos). A regra `react-refresh/only-export-components` avisa se exportar constante ou função.

## Os cinco primitivos

| Primitivo | Papel |
|---|---|
| `Section` | `<section>` com `id`, `aria-labelledby="{id}-title"`, `container` e espaçamento `py-section`. |
| `SectionHeader` | Eyebrow + heading (`h1`/`h2` por prop) + subtítulo opcional; o `id` do heading é `{sectionId}-title`. |
| `Card` | Superfície com variantes (`default`, `interactive`, `ghost`) e `asChild`; partes como `CardTitle`. |
| `Reveal` | Único wrapper de animação de entrada (`whileInView`, uma vez, sem movimento se o usuário pediu menos). |
| `Icon` | Resolve `name` → ícone lucide a partir de um registro fechado. |

## Como criar ou alterar um primitivo

1. Confirme que nenhum primitivo existente resolve (Grep em `src/components/primitives/`).
2. Escreva o arquivo seguindo o contrato e o `templates.md`.
3. Se o primitivo define um vocabulário fechado (como `Icon`), faça o schema em `src/types` apontar para o mesmo conjunto: troque `iconNameSchema` por `z.enum([...])` com as chaves do registro.
4. Use-o em pelo menos uma seção real antes de dar por pronto.
5. `npm run check`.
