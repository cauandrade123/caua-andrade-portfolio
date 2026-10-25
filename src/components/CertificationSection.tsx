import { ArrowUpRight } from "lucide-react";
import azureBadge from "@/assets/badgee.png";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { SpotlightCard } from "@/components/primitives/SpotlightCard";
import { certifications, copy } from "@/data";
import { sectionNumber } from "@/lib/section-number";

// Selo de cada certificação, por id. O arquivo vive em src/assets, então fica aqui e não nos dados.
const badges: Record<string, string> = {
  "azure-ai-900": azureBadge,
};

export function CertificationSection() {
  const { certifications: texts } = copy;

  return (
    <Section id="certifications" variant="subtle">
      <SectionHeader index={sectionNumber("certifications")} eyebrow={texts.eyebrow} title={texts.title} />

      <div className="space-y-6">
        {certifications.map((certification) => {
          const badge = badges[certification.id];
          const details = [
            { label: texts.labels.achieved, value: String(certification.year) },
            { label: texts.labels.issuer, value: certification.issuer },
            { label: texts.labels.credential, value: certification.credentialId },
            { label: texts.labels.domain, value: certification.domain },
          ];

          return (
            <Reveal key={certification.id}>
              <SpotlightCard>
                <div className="flex flex-col gap-8 p-6 md:flex-row md:items-center md:gap-10 md:p-10">
                  {badge ? (
                    <img
                      src={badge}
                      alt=""
                      width={192}
                      height={192}
                      loading="lazy"
                      decoding="async"
                      className="h-40 w-40 shrink-0 object-contain md:h-48 md:w-48"
                    />
                  ) : null}

                  <div className="space-y-5">
                    <h3 className="text-xl font-bold text-foreground sm:text-2xl">{certification.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600 sm:text-base">{certification.description}</p>

                    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                      {details.map((detail) => (
                        <div key={detail.label}>
                          <dt className="text-xs uppercase tracking-widest text-gray-600">{detail.label}</dt>
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
