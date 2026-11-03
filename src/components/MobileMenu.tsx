import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/primitives/Icon";
import { contactLinks, copy, nav, site } from "@/data";
import { sectionNumber } from "@/lib/section-number";
import { jumpToSection } from "@/lib/use-section-jump";
import { cn } from "@/lib/utils";

const contactButton =
  "mt-8 inline-flex h-14 items-center justify-center rounded-full bg-primary-foreground px-8 text-lg font-medium text-surface-navy transition duration-150 hover:shadow-glow-light active:scale-95";

type MobileMenuProps = {
  /** Seção ativa (para marcar em âmbar). */
  active: string;
  isHome: boolean;
  /** Botão sobre fundo grafite (hero e blocos escuros) ou claro. */
  onNavy: boolean;
};

/**
 * Menu do celular em tela cheia (R20): grafite, seções em letra grande com o número em âmbar, Contato em
 * destaque e os contatos embaixo. Radix Dialog: foco preso, `Esc`, o resto da página fica `aria-hidden` e o foco volta ao botão.
 * Ao escolher uma seção na home, o menu fecha e só então a página vai até ela (com o menu aberto a rolagem
 * fica travada) e o foco vai para o título da seção, em vez de voltar ao botão.
 */
export function MobileMenu({ active, isHome, onNavy }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pendingHash = useRef<string | null>(null);
  /** A escolha veio do teclado (Enter)? Aí o pulo vai direto, sem animar. */
  const pendingFromKeyboard = useRef(false);
  const contact = copy.header.contact;

  // Se a tela passa para tablet/desktop com o menu aberto (girar o aparelho, redimensionar), o menu some por CSS:
  // fecha o diálogo junto, senão o foco ficaria preso num elemento invisível e a rolagem travada.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const close = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  const choose = (hash: string, fromKeyboard = false) => {
    if (isHome) pendingHash.current = hash;
    pendingFromKeyboard.current = fromKeyboard;
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-lg transition-colors md:hidden",
          onNavy ? "text-primary-foreground hover:bg-primary-foreground/10" : "text-foreground hover:bg-gray-100",
        )}
        aria-label={copy.a11y.openMenu}
      >
        <Menu aria-hidden="true" size={20} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            const hash = pendingHash.current;
            pendingHash.current = null;
            if (hash && jumpToSection(hash, { fromKeyboard: pendingFromKeyboard.current })) event.preventDefault();
          }}
          className="on-navy fixed inset-0 z-50 flex flex-col overflow-y-auto bg-navy-depth text-primary-foreground animate-in fade-in-0 duration-250 motion-reduce:animate-none md:hidden"
        >
          <Dialog.Title className="sr-only">{copy.a11y.menuDialog}</Dialog.Title>

          <div className="container flex h-14 shrink-0 items-center justify-between sm:h-16">
            <span className="font-display text-xl font-semibold tracking-tight">{site.name}</span>
            <Dialog.Close
              className="flex h-11 w-11 items-center justify-center rounded-lg text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              aria-label={copy.a11y.closeMenu}
            >
              <X aria-hidden="true" size={20} />
            </Dialog.Close>
          </div>

          <nav aria-label={copy.a11y.mobileNav} className="container flex-1 py-6">
            <ul className="space-y-1">
              {nav.map((item) => {
                const id = item.href.slice(1);
                const isActive = isHome && active === id;
                const number = sectionNumber(id);
                const className = cn(
                  "flex min-h-14 items-baseline gap-4 py-2 font-display text-4xl font-medium tracking-tight transition-colors",
                  // Ativa: âmbar e sublinhada (não só a cor).
                  isActive ? "text-glow underline decoration-2 underline-offset-8" : "text-primary-foreground hover:text-glow",
                );
                const content = (
                  <>
                    {number ? (
                      <span aria-hidden="true" className="w-7 shrink-0 font-sans text-sm tabular-nums text-glow">
                        {number}
                      </span>
                    ) : (
                      <span aria-hidden="true" className="w-7 shrink-0" />
                    )}
                    {item.label}
                  </>
                );
                return (
                  <li key={item.href}>
                    {isHome ? (
                      <a
                        href={item.href}
                        aria-current={isActive ? "location" : undefined}
                        onClick={(event) => {
                          event.preventDefault();
                          choose(item.href, event.detail === 0);
                        }}
                        className={className}
                      >
                        {content}
                      </a>
                    ) : (
                      <Link to={{ pathname: "/", hash: item.href }} onClick={() => choose(item.href)} className={className}>
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Contato em destaque: botão claro, separado das seções. */}
            {isHome ? (
              <a
                href={contact.href}
                aria-current={active === contact.href.slice(1) ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  choose(contact.href, event.detail === 0);
                }}
                className={contactButton}
              >
                {contact.label}
              </a>
            ) : (
              <Link to={{ pathname: "/", hash: contact.href }} onClick={() => choose(contact.href)} className={contactButton}>
                {contact.label}
              </Link>
            )}
          </nav>

          <ul aria-label={copy.a11y.contactList} className="container flex flex-wrap gap-x-6 gap-y-3 border-t border-primary-foreground/10 py-6">
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
