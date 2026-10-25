import { ArrowUp } from "lucide-react";
import { copy, site } from "@/data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-navy text-primary-foreground">
      <div className="container flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/10 py-6 sm:flex-row">
        <p className="text-xs text-primary-foreground/70 sm:text-sm">{`© ${year} ${site.name}. ${copy.footer.rights}`}</p>
        <a
          href="#hero"
          className="inline-flex items-center gap-2 text-xs text-primary-foreground/70 transition-colors hover:text-primary-foreground sm:text-sm"
        >
          {copy.footer.backToTop}
          <ArrowUp aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}
