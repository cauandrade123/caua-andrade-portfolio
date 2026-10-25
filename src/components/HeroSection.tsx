// As exceções de `style` abaixo são MotionValues do framer-motion, que só entram pelo prop style.
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ChevronRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type MutableRefObject } from "react";
import { BrandIcon } from "@/components/primitives/BrandIcon";
import { Icon } from "@/components/primitives/Icon";
import { copy, projects } from "@/data";
import { heroNameShown } from "@/lib/hero-handoff";
import { pluralLabel } from "@/lib/portfolio-stats";
import { useMediaQuery } from "@/lib/use-media-query";
import { useRotatingWord, useTypedCount } from "@/lib/use-typewriter";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

// Linha do tempo do scroll na pista da hero (0 = topo, 1 = fim).
const HINT_OUT = [0, 0.04];
/** Celular: o bloco do nome desce para abrir espaço às notificações no topo. */
const BLOCK_SHIFT = [0.03, 0.3];
/** Ponto em que cada notificação entra (uma por projeto, na ordem dos dados). */
const NOTIFY_AT = [0.06, 0.14, 0.22, 0.3];
const NOTIFY_IN = 0.06;
const NOTIFY_OUT = [0.44, 0.52];
const COPY_OUT = [0.4, 0.48];
const SCATTER = [0.5, 0.66];
const REGROUP = [0.66, 0.84];
/** Quando os símbolos viram as letras de "Projetos". */
const SWAP_AT = 0.76;
/** Quando o logo do header assume o lugar do nome. */
const HANDOFF = [0.5, 0.56];

const GLYPHS = "{}<>/;=()[]#*";
const TYPE_INTERVAL = 85;
const COMMAND_DELAY = 300;
const NAME_PAUSE = 350;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const segment = (value: number, [start, end]: number[]) => clamp01((value - start) / (end - start));
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);
const easeInOut = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2);

/** Trajeto de cada letra do nome: para onde voa (s*), onde pousa em "Projetos" (d*) e em que escala. */
type LetterPlan = { sx: number; sy: number; rotate: number; dx: number; dy: number; scale: number; keep: boolean };

/** Soma os offsets de `element` até `ancestor` (ignora transforms, ao contrário de getBoundingClientRect). */
function offsetWithin(element: HTMLElement, ancestor: HTMLElement) {
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = element;
  while (node && node !== ancestor) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { left, top };
}

type LetterProps = {
  char: string;
  index: number;
  typed: boolean;
  phase: "name" | "glyph" | "word";
  target?: string;
  plans: MutableRefObject<LetterPlan[]>;
  progress: MotionValue<number>;
  scrolly: boolean;
  letterRef: (node: HTMLSpanElement | null) => void;
};

function Letter({ char, index, typed, phase, target, plans, progress, scrolly, letterRef }: LetterProps) {
  const at = (value: number) => {
    const plan = plans.current[index];
    if (!plan) return { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };
    const out = easeOut(segment(value, SCATTER));
    const back = easeInOut(segment(value, REGROUP));
    return {
      x: mix(mix(0, plan.sx, out), plan.dx, back),
      y: mix(mix(0, plan.sy, out), plan.dy, back),
      rotate: mix(mix(0, plan.rotate, out), 0, back),
      scale: mix(1, plan.scale, back),
      opacity: plan.keep ? 1 : 1 - back,
    };
  };
  const x = useTransform(progress, (value) => at(value).x);
  const y = useTransform(progress, (value) => at(value).y);
  const rotate = useTransform(progress, (value) => at(value).rotate);
  const scale = useTransform(progress, (value) => at(value).scale);
  const opacity = useTransform(progress, (value) => at(value).opacity);

  const shown = phase === "name" ? char : phase === "word" && target ? target : GLYPHS[index % GLYPHS.length];

  // O espaço da letra é sempre o do caractere original (invisível); o caractere que muda (nome → símbolo →
  // "Projetos") vai por cima. Assim a troca não empurra as letras vizinhas e as medidas continuam valendo.
  return (
    <span ref={letterRef} className={cn("relative inline-block", !typed && "opacity-0")}>
      <span className="invisible">{char}</span>
      <motion.span
        className={cn("absolute left-0 top-0 origin-top-left", phase === "glyph" && "text-glow")}
        // eslint-disable-next-line no-restricted-syntax -- MotionValue
        style={scrolly && typed ? { x, y, rotate, scale, opacity } : undefined}
      >
        {shown}
      </motion.span>
    </span>
  );
}

type NotificationProps = { project: Project; index: number; progress: MotionValue<number> };

function Notification({ project, index, progress }: NotificationProps) {
  const start = NOTIFY_AT[Math.min(index, NOTIFY_AT.length - 1)];
  const opacity = useTransform(progress, [start, start + NOTIFY_IN, NOTIFY_OUT[0], NOTIFY_OUT[1]], [0, 1, 1, 0]);
  const y = useTransform(progress, [start, start + NOTIFY_IN], [-18, 0]);
  const scale = useTransform(progress, [start, start + NOTIFY_IN], [0.94, 1]);

  return (
    <motion.li
      className="flex items-center gap-3 rounded-2xl border border-primary-foreground/10 bg-surface-raised p-3 shadow-depth-xl"
      // eslint-disable-next-line no-restricted-syntax -- MotionValue
      style={{ opacity, y, scale }}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-glow text-surface-navy">
        <Icon name={project.icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline justify-between gap-3 text-sm font-medium">
          <span className="truncate">{project.notification.title}</span>
          <span className="shrink-0 text-xs font-normal text-primary-foreground/70">{copy.hero.notificationTime}</span>
        </p>
        <p className="truncate text-xs text-primary-foreground/70">{project.notification.detail}</p>
      </div>
    </motion.li>
  );
}

// Anos dos projetos, com quantos saíram em cada um (mini linha do tempo).
const timeline = [...new Set(projects.map((project) => project.year))]
  .sort((a, b) => a - b)
  .map((year) => ({ year, count: projects.filter((project) => project.year === year).length }));

/**
 * Hero R10, igual no celular e no desktop. Abertura: um terminal digita `whoami` e o nome aparece letra a
 * letra; embaixo, a frase com a palavra que se reescreve, os logos da stack e a linha do tempo. Ao rolar
 * (palco preso): as notificações dos sistemas empilham, as letras do nome se dispersam como símbolos de
 * código e se reagrupam em "Projetos", e o logo do header assume. Com movimento reduzido, nada se move.
 */
export function HeroSection() {
  const { hero } = copy;
  const fullName = `${hero.firstName} ${hero.lastName}`;
  const targetWord = [...copy.projects.eyebrow];
  const reduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const scrolly = !reduceMotion;

  // Terminal: primeiro o comando, depois o nome, depois a palavra que troca.
  const nameLetters = [...hero.firstName, ...hero.lastName];
  const commandTyped = useTypedCount(hero.command.length, { delay: COMMAND_DELAY, interval: TYPE_INTERVAL });
  const nameTyped = useTypedCount(nameLetters.length, {
    delay: COMMAND_DELAY + hero.command.length * TYPE_INTERVAL + NAME_PAUSE,
    interval: TYPE_INTERVAL,
  });
  const nameDone = nameTyped === nameLetters.length;
  const word = useRotatingWord(hero.words, { start: nameDone });

  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const targetRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const plans = useRef<LetterPlan[]>([]);
  const shift = useRef(0);

  const { scrollYProgress: progress } = useScroll({ target: heroRef, offset: ["start start", "end end"] });
  const blockY = useTransform(progress, (value) => mix(0, shift.current, easeInOut(segment(value, BLOCK_SHIFT))));
  const copyOpacity = useTransform(progress, COPY_OUT, [1, 0]);
  const hintOpacity = useTransform(progress, HINT_OUT, [1, 0]);
  const dotOpacity = useTransform(progress, SCATTER, [1, 0]);

  const [phase, setPhase] = useState<LetterProps["phase"]>("name");
  useMotionValueEvent(progress, "change", (value) => {
    setPhase(value < SCATTER[0] + 0.01 ? "name" : value < SWAP_AT ? "glyph" : "word");
  });

  // Mede onde cada letra está e onde ela pousa em "Projetos". Refaz ao redimensionar e quando a fonte carrega.
  useLayoutEffect(() => {
    if (!scrolly) return;
    const measure = () => {
      const stage = stageRef.current;
      const content = contentRef.current;
      if (!stage || !content) return;
      const stageWidth = stage.clientWidth;
      const stageHeight = stage.clientHeight;
      const contentBottom = offsetWithin(content, stage).top + content.offsetHeight;
      shift.current = isDesktop ? 0 : Math.max(0, stageHeight - contentBottom - 32);

      plans.current = letterRefs.current.map((letter, index) => {
        const target = targetRefs.current[index];
        if (!letter) return { sx: 0, sy: 0, rotate: 0, dx: 0, dy: 0, scale: 1, keep: false };
        const from = offsetWithin(letter, stage);
        from.top += shift.current;
        const angle = index * 2.399;
        const plan = {
          sx: Math.cos(angle) * stageWidth * 0.3,
          sy: Math.sin(angle) * stageHeight * 0.22,
          rotate: ((index * 47) % 70) - 35,
        };
        if (!target) return { ...plan, dx: plan.sx, dy: plan.sy, scale: 1, keep: false };
        const to = offsetWithin(target, stage);
        const scale = parseFloat(getComputedStyle(target).fontSize) / parseFloat(getComputedStyle(letter).fontSize);
        return {
          ...plan,
          dx: to.left - from.left,
          dy: to.top + (target.offsetHeight - letter.offsetHeight * scale) / 2 - from.top,
          scale,
          keep: true,
        };
      });
      progress.set(progress.get());
    };
    measure();
    void document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [scrolly, isDesktop, progress]);

  // O logo do header some enquanto o nome está na tela e volta quando as letras se dispersam.
  useEffect(() => {
    if (!scrolly) {
      heroNameShown.set(0);
      return;
    }
    const sync = (value: number) => heroNameShown.set(1 - segment(value, HANDOFF));
    sync(progress.get());
    const unsubscribe = progress.on("change", sync);
    return () => {
      unsubscribe();
      heroNameShown.set(0);
    };
  }, [scrolly, progress]);

  const caret = <span aria-hidden="true" className="terminal-caret ml-1 inline-block bg-glow motion-safe:animate-caret" />;
  const renderLetter = (char: string, index: number) => (
    <Letter
      key={index}
      char={char}
      index={index}
      typed={index < nameTyped}
      phase={phase}
      target={targetWord[index]}
      plans={plans}
      progress={progress}
      scrolly={scrolly}
      letterRef={(node) => {
        letterRefs.current[index] = node;
      }}
    />
  );

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-labelledby="hero-title"
      className={cn("relative bg-navy-depth text-primary-foreground", scrolly && "h-hero-scroll")}
    >
      <div ref={stageRef} className={cn("relative flex min-h-svh flex-col overflow-hidden", scrolly && "sticky top-0 h-svh")}>
        {scrolly ? (
          <div aria-hidden="true" className="container absolute inset-x-0 top-20 z-20 md:top-28">
            <ul className="ml-auto flex w-full max-w-sm flex-col gap-3">
              {projects.map((project, index) => (
                <Notification key={project.slug} project={project} index={index} progress={progress} />
              ))}
            </ul>
          </div>
        ) : null}

        <motion.div
          className="container relative z-10 flex flex-1 flex-col justify-center pb-16 pt-24"
          // eslint-disable-next-line no-restricted-syntax -- MotionValue
          style={scrolly ? { y: blockY } : undefined}
        >
          <div ref={contentRef}>
            <motion.p
              aria-hidden="true"
              className="flex items-center gap-1.5 font-mono text-sm text-primary-foreground/70"
              // eslint-disable-next-line no-restricted-syntax -- MotionValue
              style={scrolly ? { opacity: copyOpacity } : undefined}
            >
              <span className="text-glow">{hero.prompt}</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>{hero.command.slice(0, commandTyped)}</span>
              {commandTyped < hero.command.length ? caret : null}
            </motion.p>

            <h1 id="hero-title" className="mt-3 font-display text-display-hero">
              <span aria-hidden="true">
                <span className="block sm:inline">{[...hero.firstName].map((char, index) => renderLetter(char, index))}</span>
                {" "}
                <span className="block sm:inline">
                  {[...hero.lastName].map((char, index) => renderLetter(char, hero.firstName.length + index))}
                  {nameDone ? (
                    <motion.span
                      className="ml-2 inline-block size-3 rounded-full bg-glow sm:size-5 lg:size-7"
                      // eslint-disable-next-line no-restricted-syntax -- MotionValue
                      style={scrolly ? { opacity: dotOpacity } : undefined}
                    />
                  ) : commandTyped === hero.command.length ? (
                    caret
                  ) : null}
                </span>
              </span>
              <span className="sr-only">{fullName}</span>
            </h1>

            <motion.div
              className="mt-6"
              // eslint-disable-next-line no-restricted-syntax -- MotionValue
              style={scrolly ? { opacity: copyOpacity } : undefined}
            >
              <p className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                <span aria-hidden="true">
                  {hero.lead}
                  {" "}
                  <span className="text-glow">{word}</span>
                  {nameDone && scrolly ? caret : null}
                </span>
                <span className="sr-only">{`${hero.lead} ${hero.wordsSummary}`}</span>
              </p>

              <ul aria-label={hero.stackLabel} className="mt-6 flex flex-wrap gap-2">
                {hero.stack.map((tech) => (
                  <li
                    key={tech.name}
                    className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 px-3 py-1.5 font-mono text-xs text-primary-foreground/80"
                  >
                    {tech.logo ? <BrandIcon name={tech.logo} className="h-3.5 w-3.5" /> : null}
                    {tech.name}
                  </li>
                ))}
              </ul>

              {/* Ano em cima, contagem embaixo: cabe numa linha só mesmo em 320 px. */}
              <ol aria-label={hero.timelineLabel} className="mt-6 flex items-center gap-3 font-mono text-xs text-primary-foreground/70">
                {timeline.map((entry, index) => (
                  <li key={entry.year} className="flex items-center gap-3">
                    {index > 0 ? <span aria-hidden="true" className="h-px w-5 bg-primary-foreground/25 sm:w-10" /> : null}
                    <span className="flex flex-col">
                      <span className="text-sm text-primary-foreground">{entry.year}</span>
                      <span>{`${entry.count} ${pluralLabel(entry.count, hero.stats.projects)}`}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>
        </motion.div>

        {/* Onde as letras pousam: "Projetos" invisível, só para medir. Fica no rodapé do palco, logo acima da vitrine. */}
        {scrolly ? (
          <div aria-hidden="true" className="container pointer-events-none absolute inset-x-0 bottom-8 md:bottom-12">
            <p className="font-display text-6xl font-bold tracking-tight opacity-0 md:text-8xl">
              {targetWord.map((char, index) => (
                <span
                  key={index}
                  ref={(node) => {
                    targetRefs.current[index] = node;
                  }}
                  className="inline-block"
                >
                  {char}
                </span>
              ))}
            </p>
          </div>
        ) : null}

        <motion.p
          aria-hidden="true"
          className="absolute bottom-6 right-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-foreground/70 lg:right-10"
          // eslint-disable-next-line no-restricted-syntax -- MotionValue
          style={scrolly ? { opacity: hintOpacity } : undefined}
        >
          {hero.scrollHint}
          <ArrowDown className="h-3.5 w-3.5 motion-safe:animate-bounce" />
        </motion.p>
      </div>
    </section>
  );
}
