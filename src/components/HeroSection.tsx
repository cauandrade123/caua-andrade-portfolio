// As exceções de `style` abaixo são MotionValues do framer-motion, que só entram pelo prop style.
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ChevronRight } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type MutableRefObject, type RefObject } from "react";
import { ProjectDeck } from "@/components/ProjectDeck";
import { BrandIcon } from "@/components/primitives/BrandIcon";
import { Icon } from "@/components/primitives/Icon";
import { copy } from "@/data";
import { heroNameShown, heroStatic } from "@/lib/hero-handoff";
import { useRotatingWord, useTypedCount } from "@/lib/use-typewriter";
import { cn } from "@/lib/utils";

// Linha do tempo do scroll na pista da hero (0 = topo, 1 = fim). Do fim de DECK_IN até 1, a pilha fica
// parada na tela para a pessoa deslizar as cartas antes de seguir para o Sobre.
const HINT_OUT = [0, 0.04];
const COPY_OUT = [0.04, 0.16];
const SCATTER = [0.1, 0.34];
const REGROUP = [0.34, 0.58];
/** Quando os símbolos viram as letras de "Projetos". */
const SWAP_AT = 0.48;
/** Quando o logo do header assume o lugar do nome. */
const HANDOFF = [0.1, 0.16];
const DECK_IN = [0.5, 0.72];

/**
 * Mola entre o scroll e as letras: o movimento segue o dedo/roda com inércia, sem os trancos de cada evento
 * de scroll. Rígida o bastante para não "atrasar" demais quando a pessoa rola rápido.
 */
const SCROLL_SPRING = { stiffness: 170, damping: 30, mass: 0.45, restDelta: 0.0005 };

const GLYPHS = "{}<>/;=()[]#*";
const TYPE_INTERVAL = 85;
const COMMAND_DELAY = 300;
const NAME_PAUSE = 350;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
const segment = (value: number, [start, end]: number[]) => clamp01((value - start) / (end - start));
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2);

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
  /** Cursor do terminal colado nesta letra enquanto o nome é digitado. */
  caret?: "before" | "after";
  phase: "name" | "glyph" | "word";
  target?: string;
  plans: MutableRefObject<LetterPlan[]>;
  progress: MotionValue<number>;
  scrolly: boolean;
  letterRef: (node: HTMLSpanElement | null) => void;
};

function Letter({ char, index, typed, caret, phase, target, plans, progress, scrolly, letterRef }: LetterProps) {
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
    <span ref={letterRef} className="relative inline-block">
      {caret ? (
        <span
          aria-hidden="true"
          className={cn("bg-glow motion-safe:animate-caret", caret === "after" ? "terminal-caret-after" : "terminal-caret-before")}
        />
      ) : null}
      <span className="invisible">{char}</span>
      <motion.span
        className={cn("absolute left-0 top-0 origin-top-left will-change-transform", !typed && "opacity-0", phase === "glyph" && "text-glow")}
        // eslint-disable-next-line no-restricted-syntax -- MotionValue
        style={scrolly && typed ? { x, y, rotate, scale, opacity } : undefined}
      >
        {shown}
      </motion.span>
    </span>
  );
}

/**
 * Hero R11, igual no celular e no desktop. Abertura: um terminal digita `whoami` e o nome aparece letra a
 * letra; embaixo, a frase com a palavra que se reescreve, os logos da stack e a linha do tempo. Ao rolar
 * (palco preso): as letras do nome se dispersam como símbolos de código e se reagrupam em "Projetos" no
 * topo, a pilha de projetos sobe no mesmo palco e o logo do header assume. Com movimento reduzido, ou quando a
 * abertura não cabe na altura da tela, nada se move e os projetos viram uma lista na seção seguinte (`ProjectStack`).
 */
/**
 * A abertura cabe na altura da janela? Mede o conteúdo com posições sem transform (vale nos dois modos, preso ou
 * parado, então não fica alternando) e refaz ao redimensionar, ao dar zoom e quando a fonte carrega.
 */
function useCopyFitsScreen(ref: RefObject<HTMLElement>) {
  const [fits, setFits] = useState(true);

  useLayoutEffect(() => {
    const measure = () => {
      const copy = ref.current;
      const first = copy?.firstElementChild;
      const last = copy?.lastElementChild;
      if (!copy || !(first instanceof HTMLElement) || !(last instanceof HTMLElement)) return;
      const style = getComputedStyle(copy);
      const need = last.offsetTop + last.offsetHeight - first.offsetTop + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      setFits(need <= window.innerHeight);
    };
    measure();
    void document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [ref]);

  return fits;
}

export function HeroSection() {
  const { hero } = copy;
  const fullName = `${hero.firstName} ${hero.lastName}`;
  const targetWord = [...copy.projects.eyebrow];
  const reduceMotion = useReducedMotion();
  const copyRef = useRef<HTMLDivElement>(null);
  const fits = useCopyFitsScreen(copyRef);
  // O palco preso tem a altura da tela e corta o que passar dela. Se a abertura não cabe (celular baixo, texto
  // ampliado, zoom), a hero fica na versão parada, a mesma do movimento reduzido, em vez de esconder conteúdo.
  const scrolly = !reduceMotion && fits;
  useLayoutEffect(() => {
    heroStatic.set(!scrolly);
    return () => heroStatic.set(false);
  }, [scrolly]);

  // Terminal: primeiro o comando, depois o nome, depois a palavra que troca.
  const nameLetters = [...hero.firstName, ...hero.lastName];
  const commandTyped = useTypedCount(hero.command.length, { delay: COMMAND_DELAY, interval: TYPE_INTERVAL });
  const nameTyped = useTypedCount(nameLetters.length, {
    delay: COMMAND_DELAY + hero.command.length * TYPE_INTERVAL + NAME_PAUSE,
    interval: TYPE_INTERVAL,
  });
  const nameDone = nameTyped === nameLetters.length;
  // Uma volta pelas palavras e para na última ("Construo sistemas"): nada se mexe sozinho por mais de ~5 s.
  const word = useRotatingWord(hero.words, { start: nameDone, loop: false });

  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const targetRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const plans = useRef<LetterPlan[]>([]);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);
  const copyOpacity = useTransform(progress, COPY_OUT, [1, 0]);
  const copyY = useTransform(progress, COPY_OUT, [0, -24]);
  const hintOpacity = useTransform(progress, HINT_OUT, [1, 0]);
  const dotOpacity = useTransform(progress, [SCATTER[0], SCATTER[0] + 0.06], [1, 0]);
  const deckOpacity = useTransform(progress, DECK_IN, [0, 1]);
  const deckY = useTransform(progress, (value) => mix(window.innerHeight * 0.5, 0, easeOut(segment(value, DECK_IN))));

  // Rede de segurança da pilha: se nem a versão compacta (`short:`) couber na altura do palco, ela encolhe
  // até caber, presa pelo canto de cima. Sem isso, as setas ficavam cortadas embaixo em telas baixas.
  const overlayRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const deckFit = useMotionValue(1);
  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const deck = deckRef.current;
    if (!scrolly || !overlay || !deck) return;
    const fit = () => {
      const space = overlay.clientHeight - parseFloat(getComputedStyle(overlay).paddingBottom) - deck.offsetTop;
      deckFit.set(Math.min(1, space / deck.offsetHeight));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(overlay);
    observer.observe(deck);
    return () => observer.disconnect();
  }, [scrolly, deckFit]);

  const [phase, setPhase] = useState<LetterProps["phase"]>("name");
  const [deckShown, setDeckShown] = useState(false);
  useMotionValueEvent(progress, "change", (value) => {
    // Sem a animação de rolagem, o nome fica parado: nada de trocar por símbolos ou por "Projetos".
    if (!scrolly) return;
    setPhase(value < SCATTER[0] + 0.01 ? "name" : value < SWAP_AT ? "glyph" : "word");
    setDeckShown(value > DECK_IN[0]);
  });

  /** Foco entrou na pilha antes de ela aparecer (Tab): rola até o fim da pista, onde ela já está na tela. */
  const revealDeck = () => {
    const hero = heroRef.current;
    if (!hero) return;
    // Depois do tick: o navegador também rola até o elemento focado, e a rolagem dele não pode desfazer esta.
    // Decide pela posição real da página, não pelo estado da animação (que pode estar atrasado).
    window.setTimeout(() => {
      const end = hero.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
      if (window.scrollY < end - 1) window.scrollTo({ top: end });
    }, 0);
  };

  // Mede onde cada letra está e onde ela pousa em "Projetos". Refaz ao redimensionar e quando a fonte carrega.
  useLayoutEffect(() => {
    if (!scrolly) return;
    const measure = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const stageWidth = stage.clientWidth;
      const stageHeight = stage.clientHeight;

      plans.current = letterRefs.current.map((letter, index) => {
        const target = targetRefs.current[index];
        if (!letter) return { sx: 0, sy: 0, rotate: 0, dx: 0, dy: 0, scale: 1, keep: false };
        const from = offsetWithin(letter, stage);
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
  }, [scrolly, progress]);

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
      caret={
        nameDone || commandTyped < hero.command.length
          ? undefined
          : nameTyped === 0
            ? index === 0
              ? "before"
              : undefined
            : index === nameTyped - 1
              ? "after"
              : undefined
      }
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
      data-tone="navy"
      aria-labelledby="hero-title"
      className={cn("relative bg-navy-depth text-primary-foreground", scrolly && "h-hero-scroll")}
    >
      {/*
        Âncora do menu "Projetos": a última tela da pista, quando a pilha já está na tela. Fica antes do palco no
        DOM para o próximo Tab, depois de clicar em "Projetos", cair na pilha e não no Sobre.
      */}
      {scrolly ? <div id="projects" aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-screen" /> : null}
      <div ref={stageRef} className={cn("relative flex min-h-svh flex-col overflow-hidden", scrolly && "sticky top-0 h-svh")}>
        <div ref={copyRef} className="container relative z-10 flex flex-1 flex-col justify-center pb-16 pt-24 short:pb-6 short:pt-16">
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
                ) : null}
              </span>
            </span>
            <span className="sr-only">{fullName}</span>
          </h1>

          {/*
            Até o tablet: uma coluna (frase, stack, credenciais). Do `lg` em diante, duas colunas para a hero não
            ter metade da tela vazia: frase e credenciais à esquerda, stack à direita. A ordem do DOM (e do leitor de
            tela) é a mesma nos dois casos; só o grid reposiciona.
          */}
          <motion.div
            className="mt-6 lg:grid lg:grid-cols-12 lg:gap-x-12 short:mt-4"
            // eslint-disable-next-line no-restricted-syntax -- MotionValue
            style={scrolly ? { opacity: copyOpacity, y: copyY } : undefined}
          >
            <p className="font-display text-2xl font-medium leading-tight tracking-tight sm:text-3xl lg:col-span-7 lg:row-start-1">
              <span aria-hidden="true">
                {hero.lead}
                {" "}
                <span className="text-glow">{word}</span>
                {nameDone && scrolly ? caret : null}
              </span>
              <span className="sr-only">{`${hero.lead} ${hero.wordsSummary}`}</span>
            </p>

            <div className="mt-6 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:mt-0 short:mt-4">
              <p aria-hidden="true" className="mb-3 hidden text-xs uppercase tracking-widest text-primary-foreground/60 lg:block">
                {hero.stackLabel}
              </p>
              <ul aria-label={hero.stackLabel} className="flex flex-wrap gap-2">
                {hero.stack.map((tech) => (
                  <li
                    key={tech.name}
                    className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 px-3 py-1.5 text-sm text-primary-foreground/80 short:py-1"
                  >
                    {tech.logo ? (
                      <BrandIcon name={tech.logo} className="h-3.5 w-3.5" />
                    ) : tech.icon ? (
                      <Icon name={tech.icon} className="h-3.5 w-3.5" />
                    ) : null}
                    {tech.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Credenciais no lugar da antiga linha do tempo: estágio, curso e certificação dizem mais que contagem. */}
            <ul
              aria-label={hero.credentialsLabel}
              className="mt-6 flex flex-col gap-2 text-sm text-primary-foreground/80 md:flex-row md:flex-wrap md:gap-x-6 lg:col-span-7 lg:row-start-2 lg:flex-col lg:gap-y-2.5 short:mt-4"
            >
              {hero.credentials.map((credential) => (
                <li key={credential.label} className="flex items-center gap-2">
                  <Icon name={credential.icon} className="h-4 w-4 shrink-0 text-glow" />
                  {credential.label}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Fim da pista: "Projetos" no topo (formado pelas letras do nome) e a pilha subindo logo abaixo. */}
        {scrolly ? (
          <div ref={overlayRef} className="container absolute inset-x-0 bottom-0 top-0 z-20 flex flex-col pb-4 pt-20 md:pt-24 short:pt-20">
            <p aria-hidden="true" className="font-display text-5xl font-semibold tracking-tight opacity-0 md:text-6xl short:text-4xl">
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
            {/* "Projetos" visível é feito de letras `aria-hidden`; este é o título que o leitor de tela encontra. */}
            <h2 id="projects-title" className="sr-only">
              {copy.projects.eyebrow}
            </h2>
            {/*
              Sem `invisible` antes de aparecer: a pilha precisa estar na ordem de Tab e na leitura em sequência.
              Enquanto não apareceu, ela não recebe clique; se o foco entrar nela, a página rola até o fim da
              pista e a pilha sobe (a auditoria apontou que o Tab pulava os projetos).
            */}
            <motion.div
              ref={deckRef}
              onFocusCapture={revealDeck}
              className={cn("mt-6 w-full max-w-2xl md:mt-10 short:mt-3", !deckShown && "pointer-events-none")}
              // eslint-disable-next-line no-restricted-syntax -- MotionValue
              style={{ opacity: deckOpacity, y: deckY, scale: deckFit, originX: 0, originY: 0 }}
            >
              <ProjectDeck />
            </motion.div>
          </div>
        ) : null}

        <motion.p
          aria-hidden="true"
          // Só a partir do tablet: no celular rolar é o gesto natural e o aviso disputaria espaço com as credenciais.
          className="absolute bottom-6 right-6 hidden items-center gap-2 text-xs uppercase tracking-widest text-primary-foreground/70 md:flex lg:right-10"
          // eslint-disable-next-line no-restricted-syntax -- MotionValue
          style={scrolly ? { opacity: hintOpacity } : undefined}
        >
          {hero.scrollHint}
          <ArrowDown className="h-3.5 w-3.5 motion-safe:animate-hint" />
        </motion.p>
      </div>
    </section>
  );
}
