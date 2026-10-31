import { copy } from "@/data";

/** Primeiro elemento focável da página: pula o header e vai para o `<main id="main">`. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-skip focus:rounded-full focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-depth-lg focus:outline-none focus:ring-2 focus:ring-glow"
    >
      {copy.a11y.skipToContent}
    </a>
  );
}
