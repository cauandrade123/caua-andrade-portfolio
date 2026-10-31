import photo from "@/assets/foto-portfolio.webp";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { copy } from "@/data";

/** `**trecho**` no texto do Sobre vira marca-texto (um fato grifado por parágrafo). */
function renderMarked(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, index) =>
    index % 2 === 1 ? (
      <mark key={index} className="marker bg-transparent font-medium text-foreground">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

/**
 * Sobre (R11): editorial em 2 colunas, no fundo claro, pensado para leitura leve.
 * - O título abre a história ("Tudo começou com…") e o texto continua dali, colado nele: um bloco só.
 * - Texto a 18 px, entrelinha ~1,6, linha de ~60 caracteres; um fato grifado por parágrafo, em marca-texto.
 * - A foto tem cantos bem arredondados, sombra em camadas e uma moldura âmbar deslocada atrás, que se
 *   alinha no hover. No celular ela vem logo depois do título.
 * - Sem lista de tecnologias: a stack já aparece na hero e na seção Stacks.
 * Alternativa guardada: foto presa com o texto rolando (docs/design/alternatives.md).
 */
export function AboutSection() {
  const { about } = copy;
  const [lead, ...rest] = about.paragraphs;

  return (
    <Section id="about" width="wide">
      <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-14">
        <div className="max-w-prose md:col-span-7">
          <SectionHeader
            className="mb-5 md:mb-6"
            eyebrow={about.eyebrow}
            title={about.title}
            highlight={about.titleHighlight}
          />
          <div className="space-y-4 text-lg leading-relaxed">
            <Reveal>
              <p className="text-foreground">{renderMarked(lead)}</p>
            </Reveal>
            {rest.map((paragraph, index) => (
              <Reveal key={paragraph} delay={0.06 * (index + 1)}>
                <p className="text-gray-700">{renderMarked(paragraph)}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1} className="order-first justify-self-center md:order-none md:col-span-5">
          <div className="group relative h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72">
            {/* Moldura âmbar deslocada atrás da foto (efeito de cópia impressa); no hover, ela se alinha com a foto. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border-2 border-glow transition-transform duration-450 ease-out-quint group-hover:translate-x-0 group-hover:translate-y-0 motion-reduce:transition-none"
            />
            <img
              src={photo}
              alt={about.photoAlt}
              width={720}
              height={720}
              loading="lazy"
              decoding="async"
              className="relative h-full w-full rounded-3xl object-cover object-center shadow-photo transition-transform duration-450 ease-out-quint group-hover:-translate-y-1 motion-reduce:transition-none"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
