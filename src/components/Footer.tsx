import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@/components/primitives/Icon";
import { contactLinks, copy, nav, seo, site } from "@/data";
import { sectionNumber } from "@/lib/section-number";
import { handleSectionClick, jumpToSection } from "@/lib/use-section-jump";

const sectionLink = "inline-flex min-h-11 items-baseline gap-2 text-base text-primary-foreground/80 transition-colors hover:text-primary-foreground";

/**
 * Rodapé como mapa do site (R20): o nome, as seções (com os números do menu) e os contatos. Na home, os links
 * de seção usam o pulo inteligente; fora dela, voltam para a seção da home.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const isHome = useLocation().pathname === "/";
  const sections = [...nav, copy.header.contact];

  return (
    <footer data-tone="navy" className="bg-surface-navy text-primary-foreground">
      <div className="container grid gap-10 border-t border-primary-foreground/10 py-12 md:grid-cols-12 md:gap-8 md:py-16">
        <div className="md:col-span-5">
          <p className="font-display text-2xl font-semibold tracking-tight">
            {site.name}
            <span aria-hidden="true" className="ml-1 inline-block h-2 w-2 rounded-full bg-glow" />
          </p>
          {/* A cidade em texto visível confirma o endereço do JSON-LD (R22). */}
          <p className="mt-2 text-sm text-primary-foreground/70">{`${site.role} · ${seo.person.address.locality}, ${seo.person.address.region}`}</p>
        </div>

        <nav aria-label={copy.a11y.footerNav} className="md:col-span-4">
          <ul className="grid grid-cols-2 gap-x-6 md:grid-cols-1">
            {sections.map((item) => {
              const number = sectionNumber(item.href.slice(1));
              const content = (
                <>
                  {number ? (
                    <span aria-hidden="true" className="text-xs tabular-nums text-glow">
                      {number}
                    </span>
                  ) : null}
                  {item.label}
                </>
              );
              return (
                <li key={item.href}>
                  {isHome ? (
                    <a href={item.href} onClick={(event) => handleSectionClick(event, item.href)} className={sectionLink}>
                      {content}
                    </a>
                  ) : (
                    <Link to={{ pathname: "/", hash: item.href }} className={sectionLink}>
                      {content}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <ul aria-label={copy.a11y.contactList} className="md:col-span-3">
          {contactLinks.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="inline-flex min-h-11 items-center gap-2 text-base text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <Icon name={link.icon} className="h-4 w-4" />
                {link.label}
                {link.external ? <ArrowUpRight aria-hidden="true" className="h-4 w-4" /> : null}
                {link.external ? <span className="sr-only">{copy.a11y.externalLink}</span> : null}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="container flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/10 py-6 sm:flex-row">
        <p className="text-xs text-primary-foreground/70 sm:text-sm">{`${copy.footer.copyright} ${year} ${seo.person.fullName}. ${copy.footer.rights}`}</p>
        {isHome ? (
          <a
            href="#hero"
            onClick={(event) => handleSectionClick(event, "#hero")}
            className="inline-flex min-h-11 items-center gap-2 text-xs text-primary-foreground/70 transition-colors hover:text-primary-foreground sm:text-sm"
          >
            {copy.footer.backToTop}
            <ArrowUp aria-hidden="true" className="h-4 w-4" />
          </a>
        ) : (
          <button
            type="button"
            onClick={(event) => jumpToSection("#hero", { fromKeyboard: event.detail === 0 }) || window.scrollTo({ top: 0 })}
            className="inline-flex min-h-11 items-center gap-2 text-xs text-primary-foreground/70 transition-colors hover:text-primary-foreground sm:text-sm"
          >
            {copy.footer.backToTop}
            <ArrowUp aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>
    </footer>
  );
}
