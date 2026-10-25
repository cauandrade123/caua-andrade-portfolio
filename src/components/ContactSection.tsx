import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/primitives/Icon";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { SpotlightCard } from "@/components/primitives/SpotlightCard";
import { contactLinks, copy } from "@/data";
import { cn } from "@/lib/utils";
import { sectionNumber } from "@/lib/section-number";

export function ContactSection() {
  const { contact } = copy;

  return (
    <Section id="contact" variant="navy" width="narrow">
      <SectionHeader align="center" className="mb-4 md:mb-4" index={sectionNumber("contact")} eyebrow={contact.eyebrow} title={contact.title} />
      <p className="mx-auto mb-10 max-w-lg text-center text-sm text-primary-foreground/70 md:mb-12">{contact.description}</p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {contactLinks.map((link, index) => (
          <li key={link.id} className={cn(index === 0 && "sm:col-span-2")}>
            <Reveal delay={index * 0.08} className="h-full">
              <SpotlightCard tone="navy" className="h-full">
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="flex h-full items-center gap-4 rounded-2xl p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground">
                    <Icon name={link.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs uppercase tracking-wider text-primary-foreground/70">{link.label}</span>
                    <span className="block break-all text-sm font-medium text-primary-foreground sm:text-base">{link.value}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-primary-foreground/60 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                  {link.external ? <span className="sr-only">{copy.a11y.externalLink}</span> : null}
                </a>
              </SpotlightCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
