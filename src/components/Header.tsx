import { AnimatePresence, motion, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { copy, nav, site } from "@/data";
import { heroNameShown } from "@/lib/hero-handoff";
import { cn } from "@/lib/utils";
import { sectionNumber } from "@/lib/section-number";
import { ThemeToggle } from "./ThemeToggle";

/** Altura do header (h-20 no desktop): quando o fim da hero passa daqui, o header ganha fundo. */
const HEADER_CLEARANCE = 80;

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

function NavAnchor({ href, isHome, children, ...props }: NavAnchorProps) {
  if (isHome) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link to={{ pathname: "/", hash: href }} {...props}>
      {children}
    </Link>
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(watchedIds);
  const isHome = useLocation().pathname === "/";
  const logoOpacity = useTransform(heroNameShown, [0, 1], [1, 0]);
  // Enquanto o header está sobre a hero (bloco escuro) ele fica transparente e claro; depois ganha fundo.
  const onNavy = !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById("hero");
      setIsScrolled(hero ? hero.getBoundingClientRect().bottom <= HEADER_CLEARANCE : window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  const links = [...nav, copy.header.contact];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        isScrolled ? "border-b border-gray-200/60 bg-background/80 shadow-depth-sm backdrop-blur-xl" : "on-navy bg-transparent",
      )}
    >
      <nav aria-label={copy.a11y.mainNav} className="container flex h-14 items-center justify-between sm:h-16 md:h-20">
        <NavAnchor
          href="#hero"
          isHome={isHome}
          data-site-logo=""
          className={cn("font-display text-xl font-bold tracking-tight sm:text-2xl", onNavy ? "text-primary-foreground" : "text-foreground")}
        >
          {/* Some enquanto o nome gigante da hero está na tela; o nome encolhe até aqui e o logo assume. */}
          {/* eslint-disable-next-line no-restricted-syntax -- MotionValue */}
          <motion.span style={{ opacity: logoOpacity }}>{site.name}</motion.span>
        </NavAnchor>

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
          <li>
            <NavAnchor
              href={copy.header.contact.href}
              isHome={isHome}
              className={cn(
                "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-95 md:text-base lg:px-5",
                onNavy
                  ? "bg-primary-foreground text-surface-navy hover:shadow-glow-light"
                  : "bg-primary text-primary-foreground hover:shadow-depth-lg",
              )}
            >
              {copy.header.contact.label}
            </NavAnchor>
          </li>
          <li>
            <ThemeToggle onNavy={onNavy} />
          </li>
        </ul>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle onNavy={onNavy} />
          <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className={cn(
            "rounded-lg p-2 transition-colors md:hidden",
            onNavy ? "text-primary-foreground hover:bg-primary-foreground/10" : "text-foreground hover:bg-gray-100",
          )}
          aria-label={isMenuOpen ? copy.a11y.closeMenu : copy.a11y.openMenu}
          aria-expanded={isMenuOpen}
          aria-controls="menu-mobile"
        >
          {isMenuOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            id="menu-mobile"
            aria-label={copy.a11y.mobileNav}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-gray-200 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <ul className="container space-y-1 py-4">
              {links.map((item) => {
                const id = item.href.slice(1);
                const number = sectionNumber(id);
                const isActive = isHome && active === id;
                return (
                  <li key={item.href}>
                    <NavAnchor
                      href={item.href}
                      isHome={isHome}
                      onClick={() => setIsMenuOpen(false)}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "flex items-baseline gap-3 py-3 text-base transition-colors sm:text-lg",
                        isActive ? "text-link" : "text-foreground hover:text-link",
                      )}
                    >
                      {number ? (
                        <span aria-hidden="true" className="text-xs tabular-nums text-gray-500">
                          {number}
                        </span>
                      ) : null}
                      {item.label}
                    </NavAnchor>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
