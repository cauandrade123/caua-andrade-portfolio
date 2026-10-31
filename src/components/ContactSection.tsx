import { ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/primitives/Icon";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { contactLinks, copy } from "@/data";

type CopyState = "idle" | "done" | "failed";

/** Quanto tempo o "Copiado!" fica na tela antes de o botão voltar ao normal. */
const COPY_FEEDBACK_MS = 2000;

/**
 * Contato (crítica de design, correção 2): o e-mail é o protagonista, grande, com botão de copiar; LinkedIn e
 * GitHub ficam como links secundários. Alinhado à esquerda, como as outras seções.
 */
export function ContactSection() {
  const { contact } = copy;
  const [email, ...others] = contactLinks;
  const [copyState, setCopyState] = useState<CopyState>("idle");

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), COPY_FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email.value);
      setCopyState("done");
    } catch {
      setCopyState("failed");
    }
  };

  return (
    <Section id="contact" variant="navy" width="narrow">
      <SectionHeader className="mb-4 md:mb-4" eyebrow={contact.eyebrow} title={contact.title} />
      <p className="mb-10 max-w-lg text-base text-primary-foreground/70 md:mb-12">{contact.description}</p>

      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <a
            href={email.href}
            className="font-display text-xl font-medium tracking-tight text-primary-foreground transition-colors duration-150 hover:text-glow sm:text-3xl md:text-4xl"
          >
            <span className="link-underline">{email.value}</span>
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full border border-primary-foreground/20 px-4 text-sm font-medium text-primary-foreground transition duration-150 hover:border-primary-foreground/50 active:scale-95 sm:self-auto"
          >
            {copyState === "done" ? <Check aria-hidden="true" className="h-4 w-4 text-glow" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
            {copyState === "done" ? contact.copy.done : contact.copy.label}
          </button>
          {contact.resume.href ? (
            <a
              href={contact.resume.href}
              download
              className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-full bg-primary-foreground px-4 text-sm font-medium text-surface-navy transition duration-150 hover:shadow-glow-light active:scale-95 sm:self-auto"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              {contact.resume.label}
            </a>
          ) : null}
        </div>
        {/* Erro visível só quando acontece; o leitor de tela também ouve a confirmação. */}
        <p aria-live="polite" className="mt-3 min-h-5 text-sm text-primary-foreground/70">
          {copyState === "failed" ? contact.copy.failed : null}
          {copyState === "done" ? <span className="sr-only">{contact.copy.done}</span> : null}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-primary-foreground/10 pt-6">
          {others.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="group inline-flex items-center gap-2 text-base text-primary-foreground/80 transition-colors duration-150 hover:text-primary-foreground"
              >
                <Icon name={link.icon} className="h-4 w-4" />
                <span className="link-underline">{link.label}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-250 ease-out-quint group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
                {link.external ? <span className="sr-only">{copy.a11y.externalLink}</span> : null}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
