import photo from "@/assets/foto-portfolio.jpg";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { copy } from "@/data";
import { sectionNumber } from "@/lib/section-number";

export function AboutSection() {
  const { about } = copy;
  const [lead, ...rest] = about.paragraphs;

  return (
    <Section id="about">
      <SectionHeader index={sectionNumber("about")} eyebrow={about.eyebrow} title={about.title} subtitle={about.subtitle} />

      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <Reveal className="space-y-4">
          <p className="text-base leading-relaxed text-gray-700 sm:text-lg">{lead}</p>
          {rest.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-gray-600 sm:text-base">
              {paragraph}
            </p>
          ))}
          <blockquote className="border-l-2 border-link/30 pl-4 text-sm italic leading-relaxed text-gray-600 sm:text-base">
            {about.quote}
          </blockquote>
        </Reveal>

        <Reveal delay={0.15} className="flex justify-center">
          <figure className="relative">
            <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-full bg-link/10" />
            <img
              src={photo}
              alt={about.photoAlt}
              width={320}
              height={320}
              loading="lazy"
              decoding="async"
              className="relative h-72 w-72 rounded-full object-cover object-center shadow-depth-lg sm:h-80 sm:w-80"
            />
            <figcaption className="absolute -bottom-3 -right-3 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-card px-3 py-2 text-xs font-medium text-gray-600 shadow-depth-md">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-green-500" />
              {about.availability}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
