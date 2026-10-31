import { ArrowUpRight } from "lucide-react";
import { ShiningBadge } from "@/components/effects/ShiningBadge";
import { Icon } from "@/components/primitives/Icon";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { SpotlightCard } from "@/components/primitives/SpotlightCard";
import { certifications, copy } from "@/data";

export function CertificationSection() {
  const { certifications: texts } = copy;

  return (
    <Section id="certifications" variant="subtle">
      <SectionHeader eyebrow={texts.eyebrow} title={texts.title} />

      <div className="space-y-6">
        {certifications.filter((certification) => certification.show).map((certification) => {
          const { badge } = certification;
          const inProgress = certification.status === "in-progress";
          // Em andamento: sem "obtida em" e o código aparece como exame, não como credencial.
          const details = [
            ...(certification.year ? [{ label: texts.labels.achieved, value: String(certification.year) }] : []),
            { label: texts.labels.issuer, value: certification.issuer },
            { label: inProgress ? texts.labels.exam : texts.labels.credential, value: certification.credentialId },
            { label: texts.labels.domain, value: certification.domain },
          ];

          return (
            <Reveal key={certification.id}>
              <SpotlightCard>
                {/* No computador (md+), as medidas originais do card: selo de 192 px, p-10 e gap-10. No celular, selo
                    menor e centralizado. */}
                <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start md:items-center md:gap-10 md:p-10">
                  {/* No celular (coluna) o selo fica centralizado no card; do tablet em diante, à esquerda do texto. */}
                  {badge ? (
                    <ShiningBadge name={badge} className="h-24 w-24 self-center sm:self-start md:h-48 md:w-48 md:self-center" />
                  ) : (
                    // Ainda sem selo (em andamento): um lugar tracejado, como "selo a conquistar".
                    <span
                      aria-hidden="true"
                      className="flex h-24 w-24 shrink-0 items-center justify-center self-center rounded-full border-2 border-dashed border-gray-300 text-gray-500 sm:self-start md:h-48 md:w-48 md:self-center"
                    >
                      <Icon name="Database" className="h-8 w-8" />
                    </span>
                  )}

                  <div className="max-w-prose space-y-4 md:max-w-none md:space-y-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold leading-tight text-foreground md:text-2xl">{certification.title}</h3>
                      {inProgress ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-link/30 px-2.5 py-0.5 text-xs font-medium text-link">
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-link motion-safe:animate-pulse-few" />
                          {texts.inProgress}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-base leading-relaxed text-gray-600">{certification.description}</p>

                    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-200 pt-4 sm:grid-cols-4 md:border-t-0 md:pt-0">
                      {details.map((detail) => (
                        <div key={detail.label}>
                          <dt className="text-xs uppercase tracking-wider text-gray-600">{detail.label}</dt>
                          <dd className="mt-1 text-sm font-medium text-foreground">{detail.value}</dd>
                        </div>
                      ))}
                    </dl>

                    {certification.credentialUrl ? (
                      <a
                        href={certification.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-link"
                      >
                        <span className="link-underline">{texts.viewCredential}</span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                        />
                        <span className="sr-only">{copy.a11y.externalLink}</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
