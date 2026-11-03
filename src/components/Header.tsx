import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { copy, nav, site } from "@/data";
import { heroNameShown, useHeroStatic } from "@/lib/hero-handoff";
import { sectionNumber } from "@/lib/section-number";
import { handleSectionClick } from "@/lib/use-section-jump";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

/** Altura do header (h-20 no desktop): quando o fim da hero passa daqui, o header ganha fundo. */
const HEADER_CLEARANCE = 80;
/** Blocos grafite (seções `navy` e o rodapé): sobre eles o header fica escuro também. */
const DARK_BLOCKS = '[data-tone="navy"]';

/** Sobre a hero: transparente. Sobre um bloco grafite: fundo grafite. No resto: fundo claro. */
type HeaderTone = "hero" | "dark" | "light";

const contactId = copy.header.contact.href.slice(1);
const watchedIds = ["hero", ...nav.map((item) => item.href.slice(1)), contactId];

/** Seção que cruza a faixa central da janela; `hero` quando nenhuma do menu está ativa. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

type NavAnchorProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  /** Âncora da home (ex.: "#about"). Fora da home vira link para "/#about". */
  href: string;
  isHome: boolean;
};

/** Link de seção. Na home, o clique usa o pulo inteligente (perto: rola; longe: vai direto). */
function NavAnchor({ href, isHome, children, onClick, ...props }: NavAnchorProps) {
  if (isHome) {
    return (
      <a
        href={href}
        onClick={(event) => {
          onClick?.(event);
          handleSectionClick(event, href);
        }}
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={{ pathname: "/", hash: href }} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}

type HeaderProps = {
  /**
   * `case` (R20): no lugar do logo e do menu de seções, "← Projetos" fixo; à direita Contato e tema; e uma
   * barra âmbar de progresso de leitura no pé do header.
   */
  variant?: "home" | "case";
  /** Só no case: hash da carta de origem (`#project-<slug>`) para o "← Projetos" voltar até ela. */
  backHash?: string;
  /** Só no case: clique no "← Projetos" (o zoom de volta do case). */
  onBack?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function Header({ variant = "home", backHash = "#projects", onBack }: HeaderProps) {
  const [tone, setTone] = useState<HeaderTone>("hero");
  const headerRef = useRef<HTMLElement>(null);
  const active = useActiveSection(watchedIds);
  const isHome = useLocation().pathname === "/";
  const isCase = variant === "case";
  const heroIsStatic = useHeroStatic();
  const logoOpacity = useTransform(heroNameShown, [0, 1], [1, 0]);
  const [logoHidden, setLogoHidden] = useState(() => heroNameShown.get() > 0.5);
  useMotionValueEvent(heroNameShown, "change", (value) => setLogoHidden(value > 0.5));
  const { scrollYProgress } = useScroll();
  // Sobre a hero e os outros blocos grafite o texto do header fica claro.
  const onNavy = tone !== "light";

  useEffect(() => {
    const handleScroll = () => {
      // Transparente durante a hero animada da home (o palco fica preso, nada rola por baixo). Nas outras páginas
      // e na hero parada, só no topo: depois o conteúdo passaria por baixo de um header sem fundo.
      const hero = isHome && !heroIsStatic ? document.getElementById("hero") : null;
      const overHero = hero ? hero.getBoundingClientRect().bottom > HEADER_CLEARANCE : window.scrollY <= 20;
      if (overHero) {
        setTone("hero");
        return;
      }
      // O bloco que passa pelo meio do header decide a cor.
      const probe = (headerRef.current?.offsetHeight ?? HEADER_CLEARANCE) / 2;
      const overDark = Array.from(document.querySelectorAll(DARK_BLOCKS)).some((block) => {
        const { top, bottom } = block.getBoundingClientRect();
        return top <= probe && bottom > probe;
      });
      setTone(overDark ? "dark" : "light");
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome, heroIsStatic]);

  const contactButton = (
    <NavAnchor
      href={copy.header.contact.href}
      isHome={isHome}
      aria-current={isHome && active === contactId ? "location" : undefined}
      className={cn(
        "relative inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-95 md:text-base lg:px-5",
        onNavy
          ? "bg-primary-foreground text-surface-navy hover:shadow-glow-light"
          : "bg-primary text-primary-foreground hover:shadow-depth-lg",
      )}
    >
      {copy.header.contact.label}
      {isHome && active === contactId ? (
        // O mesmo indicador dos itens do menu desliza até aqui, embaixo do botão.
        <motion.span
          layoutId="nav-indicator"
          aria-hidden="true"
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
          className={cn("absolute -bottom-2 inset-x-4 h-0.5", onNavy ? "bg-glow" : "bg-link")}
        />
      ) : null}
    </NavAnchor>
  );

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500",
        tone === "hero" && "border-transparent bg-transparent",
        tone === "dark" && "border-primary-foreground/10 bg-surface-navy/80 shadow-depth-sm backdrop-blur-xl",
        tone === "light" && "border-gray-200/60 bg-background/80 shadow-depth-sm backdrop-blur-xl",
      )}
    >
      {/*
        `on-navy` (anel de foco claro) só na barra: o menu do celular é um diálogo à parte, com o próprio fundo.
      */}
      <nav
        aria-label={copy.a11y.mainNav}
        className={cn("container flex h-14 items-center justify-between sm:h-16 md:h-20", onNavy && "on-navy")}
      >
        {isCase ? (
          // No case, o "voltar" fica sempre à mão: substitui o logo e leva de volta à carta de onde a pessoa veio.
          <Link
            to={{ pathname: "/", hash: backHash }}
            onClick={onBack}
            // Nome completo para leitor de tela: "Projetos" sozinho confundiria com o "Projetos" do rodapé.
            aria-label={copy.projectCase.back}
            className={cn(
              "group inline-flex min-h-11 items-center gap-2 text-sm font-medium transition-colors md:text-base",
              onNavy ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-gray-600 hover:text-foreground",
            )}
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform duration-250 ease-out-quint group-hover:-translate-x-1" />
            {copy.projectCase.backShort}
          </Link>
        ) : (
          <NavAnchor
            href="#hero"
            isHome={isHome}
            data-site-logo=""
            // Fora da ordem de Tab enquanto está invisível (o nome gigante está na tela): o foco não cai num vazio.
            tabIndex={logoHidden ? -1 : undefined}
            className={cn("font-display text-xl font-semibold tracking-tight", onNavy ? "text-primary-foreground" : "text-foreground")}
          >
            {/* Some enquanto o nome gigante da hero está na tela; o nome encolhe até aqui e o logo assume. */}
            {/* eslint-disable-next-line no-restricted-syntax -- MotionValue */}
            <motion.span style={{ opacity: logoOpacity }}>{site.name}</motion.span>
          </NavAnchor>
        )}

        {isCase ? (
          <div className="flex items-center gap-2 md:gap-6">
            {contactButton}
            <ThemeToggle onNavy={onNavy} />
          </div>
        ) : (
          <>
            <ul className="hidden items-center gap-6 md:flex lg:gap-8">
              {nav.map((item) => {
                const id = item.href.slice(1);
                const isActive = isHome && active === id;
                return (
                  <li key={item.href}>
                    <NavAnchor
                      href={item.href}
                      isHome={isHome}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "group relative inline-flex items-baseline gap-1.5 py-2 text-sm transition-colors duration-300 md:text-base",
                        onNavy
                          ? isActive
                            ? "text-primary-foreground"
                            : "text-primary-foreground/75 hover:text-primary-foreground"
                          : isActive
                            ? "text-link"
                            : "text-gray-600 hover:text-foreground",
                      )}
                    >
                      <span aria-hidden="true" className="text-xs tabular-nums">
                        {sectionNumber(id)}
                      </span>
                      {item.label}
                      {isActive ? (
                        // Um único indicador que desliza de item em item conforme a seção ativa muda.
                        <motion.span
                          layoutId="nav-indicator"
                          aria-hidden="true"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                          className={cn("absolute -bottom-0.5 left-0 h-0.5 w-full", onNavy ? "bg-glow" : "bg-link")}
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left scale-x-0 transition-transform duration-300 ease-out-quint group-hover:scale-x-100",
                            onNavy ? "bg-glow/60" : "bg-link/60",
                          )}
                        />
                      )}
                    </NavAnchor>
                  </li>
                );
              })}
              <li>{contactButton}</li>
              <li>
                <ThemeToggle onNavy={onNavy} />
              </li>
            </ul>

            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle onNavy={onNavy} />
              <MobileMenu active={active} isHome={isHome} onNavy={onNavy} />
            </div>
          </>
        )}
      </nav>

      {isCase ? (
        // Progresso de leitura do case: indica posição (não é enfeite), então fica também com movimento reduzido.
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-glow"
          // eslint-disable-next-line no-restricted-syntax -- MotionValue
          style={{ scaleX: scrollYProgress }}
        />
      ) : null}
    </header>
  );
}
