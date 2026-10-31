import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { copy, experiences } from "@/data";

const monthFormat = new Intl.DateTimeFormat("pt-BR", { month: "short", year: "numeric" });

/** Converte "AAAA-MM" em "mmm de AAAA". */
function formatMonth(value: string) {
  const [year, month] = value.split("-").map(Number);
  return monthFormat.format(new Date(year, month - 1));
}

/** Linha do tempo de experiência. Não aparece enquanto `src/data/experience.ts` estiver vazio. */
export function ExperienceSection() {
  const { experience: texts } = copy;

  if (experiences.length === 0) return null;

  return (
    <Section id="experience" width="narrow">
      <SectionHeader eyebrow={texts.eyebrow} title={texts.title} />

      <ol className="relative space-y-10 border-l border-gray-200 pl-8">
        {experiences.map((experience, index) => (
          <li key={experience.id} className="relative">
            <span aria-hidden="true" className="absolute -left-8 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full bg-link ring-4 ring-background" />
            <Reveal delay={index * 0.06} className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-gray-600">
                {`${formatMonth(experience.start)} – ${experience.end ? formatMonth(experience.end) : texts.current}`}
              </p>
              <h3 className="text-lg font-medium text-foreground md:text-xl">{experience.role}</h3>
              <p className="text-sm font-medium text-link">{experience.company}</p>
              <p className="max-w-2xl text-sm leading-relaxed text-gray-600">{experience.summary}</p>
              {experience.highlights.length > 0 ? (
                <ul className="max-w-2xl list-disc space-y-1 pl-5 text-sm text-gray-600">
                  {experience.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              ) : null}
              {experience.stack.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5 pt-1">
                  {experience.stack.map((tech) => (
                    <li key={tech} className="rounded-full border border-link/15 bg-link/10 px-3 py-1 text-xs uppercase text-gray-600">
                      {tech}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
