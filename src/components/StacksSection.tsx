import { DataFlow } from "@/components/effects/DataFlow";
import { Icon } from "@/components/primitives/Icon";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { SpotlightCard } from "@/components/primitives/SpotlightCard";
import { copy, stacks } from "@/data";
import { sectionNumber } from "@/lib/section-number";

export function StacksSection() {
  const { stacks: texts } = copy;

  return (
    <Section id="stacks" variant="navy" width="wide">
      <SectionHeader index={sectionNumber("stacks")} eyebrow={texts.eyebrow} title={texts.title} />

      {/* O caminho de uma requisição pela stack (veio da hero antiga). Só no desktop: no celular os cards já bastam. */}
      <DataFlow className="mb-14 hidden md:block" />

      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {stacks.map((category, categoryIndex) => (
          <Reveal key={category.id} delay={categoryIndex * 0.08}>
            <h3 className="mb-4 text-xs uppercase tracking-widest text-primary-foreground/70">{category.title}</h3>
            <ul className="space-y-3">
              {category.items.map((item) => (
                <li key={item.name}>
                  <SpotlightCard tone="navy">
                    <div className="flex items-start gap-3 p-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 text-glow">
                        <Icon name={item.icon} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-primary-foreground">{item.name}</p>
                        <p className="mt-0.5 text-xs text-primary-foreground/70">{item.description}</p>
                      </div>
                    </div>
                  </SpotlightCard>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
