import { BrandIcon } from "@/components/primitives/BrandIcon";
import { Icon } from "@/components/primitives/Icon";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { copy, stacks } from "@/data";

/**
 * Tecnologias (crítica de design, correção 1): uma faixa por categoria, com o nome da categoria à esquerda
 * (em cima, no celular) e as tecnologias como pílulas com logo, na mesma linguagem da hero. Saíram os 15 cards
 * e o diagrama decorativo (`DataFlow`, guardado como alternativa em docs/design/alternatives.md).
 */
export function StacksSection() {
  const { stacks: texts } = copy;

  return (
    <Section id="stacks" variant="navy" width="wide">
      <SectionHeader eyebrow={texts.eyebrow} title={texts.title} />

      <dl className="divide-y divide-primary-foreground/10 border-y border-primary-foreground/10">
        {stacks.map((category, index) => (
          <Reveal key={category.id} delay={index * 0.06} className="grid gap-4 py-6 md:grid-cols-4 md:gap-8 md:py-8">
            <dt className="text-xs uppercase tracking-widest text-primary-foreground/70 md:pt-3">{category.title}</dt>
            <dd className="md:col-span-3">
              <ul className="flex flex-wrap gap-2.5">
                {category.items.map((item) => (
                  <li
                    key={item.name}
                    className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-surface-raised px-3.5 py-2 text-sm text-primary-foreground transition-colors duration-150 hover:border-primary-foreground/40"
                  >
                    {item.logo ? (
                      <BrandIcon name={item.logo} className="h-4 w-4 shrink-0 text-primary-foreground/80" />
                    ) : (
                      <Icon name={item.icon} className="h-4 w-4 shrink-0 text-glow" />
                    )}
                    <span className="font-medium">{item.name}</span>
                    {item.description ? <span className="text-primary-foreground/70">{item.description}</span> : null}
                  </li>
                ))}
              </ul>
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
