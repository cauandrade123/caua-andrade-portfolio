import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ApiWindow } from "@/components/effects/ApiWindow";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { copy } from "@/data";
import { useActiveStep } from "@/lib/use-active-step";
import { useSceneTilt } from "@/lib/use-scene-tilt";
import { cn } from "@/lib/utils";
import type { CaseStory as CaseStoryData } from "@/types";

type CaseStoryProps = {
  story: CaseStoryData;
  /** Texto da solução, que abre a seção. */
  intro: string;
};

const stepNumber = (index: number) => String(index + 1).padStart(2, "0");

/**
 * "Como funciona" do case, em scrollytelling: as etapas rolam à esquerda e a janela fica presa à direita,
 * trocando de tela conforme a etapa no centro. A janela entra inclinada em 3D e deita até ficar quase de frente.
 * No celular e com movimento reduzido não há 3D nem nada preso: cada etapa leva a própria janela, plana.
 */
export function CaseStory({ story, intro }: CaseStoryProps) {
  const { steps } = story;
  const { active, register } = useActiveStep(steps.length);
  const reduceMotion = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const { progress, tilt, parallax } = useSceneTilt(sceneRef);

  const current = steps[active] ?? steps[0];

  return (
    <Section id="how-it-works" variant="navy" width="wide">
      <SectionHeader eyebrow={copy.projectCase.howItWorks} title={story.title} className="mb-6 md:mb-8" />
      <Reveal>
        <p className="mb-12 max-w-2xl text-base leading-relaxed text-primary-foreground/80 md:mb-0 md:text-lg">{intro}</p>
      </Reveal>

      <div ref={sceneRef} className="md:grid md:grid-cols-2 md:gap-12 lg:gap-20">
        <ol className="space-y-14 md:space-y-0">
          {steps.map((step, index) => (
            // A última etapa ocupa a tela toda: assim ela chega ao centro com a janela ainda presa.
            <li key={step.id} ref={register(index)} className="md:flex md:min-h-step md:items-center md:last:min-h-screen">
              <div className="w-full">
                <div
                  className={cn(
                    "border-l-2 border-primary-foreground/15 pl-5 transition duration-250 ease-out-quint",
                    index === active ? "md:border-glow" : "md:opacity-70",
                  )}
                >
                  <span aria-hidden="true" className="font-mono text-xs text-glow">
                    {stepNumber(index)}
                  </span>
                  <h3 className="mt-2 text-lg font-bold sm:text-xl">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80 sm:text-base">{step.body}</p>
                </div>
                <ApiWindow story={story} step={step} className="mt-6 md:hidden" />
              </div>
            </li>
          ))}
        </ol>

        <div className="hidden md:block">
          <div className="perspective-story sticky top-0 flex h-screen flex-col justify-center gap-8">
            <div aria-hidden="true" className="flex items-center gap-4 font-mono text-xs text-primary-foreground/70">
              <span className="tabular-nums">{`${stepNumber(active)} / ${stepNumber(steps.length - 1)}`}</span>
              <span className="h-px flex-1 bg-primary-foreground/15">
                {/* eslint-disable-next-line no-restricted-syntax -- MotionValue */}
                <motion.span className="block h-full origin-left bg-glow" style={{ scaleX: reduceMotion ? 1 : progress }} />
              </span>
            </div>

            {/* eslint-disable-next-line no-restricted-syntax -- MotionValue */}
            <motion.div className="preserve-3d" style={reduceMotion ? undefined : tilt}>
              <ApiWindow story={story} step={current} parallax={reduceMotion ? undefined : parallax} />
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}
