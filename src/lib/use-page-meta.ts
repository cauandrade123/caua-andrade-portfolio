import { useEffect } from "react";
import { site } from "@/data";

type PageMeta = {
  title: string;
  description?: string;
  /** Caminho da rota (ex.: "/projects/api-gateway"); vira canonical e og:url. */
  path?: string;
  noindex?: boolean;
};

/** Troca um atributo de uma tag do `<head>` e devolve a função que restaura o valor anterior. */
function swap(selector: string, attribute: string, value: string) {
  const element = document.head.querySelector(selector);
  if (!element) return () => undefined;
  const previous = element.getAttribute(attribute);
  element.setAttribute(attribute, value);
  return () => {
    if (previous === null) element.removeAttribute(attribute);
    else element.setAttribute(attribute, previous);
  };
}

/**
 * Metadados da rota (título, descrição, canonical, Open Graph e Twitter), restaurados ao sair.
 * A home usa os valores do `index.html`; `null` não altera nada.
 */
export function usePageMeta(meta: PageMeta | null) {
  const title = meta?.title;
  const description = meta?.description;
  const path = meta?.path;
  const noindex = meta?.noindex ?? false;

  useEffect(() => {
    if (!title) return;
    const previousTitle = document.title;
    document.title = title;

    const restores = [swap('meta[property="og:title"]', "content", title), swap('meta[name="twitter:title"]', "content", title)];
    if (description) {
      restores.push(
        swap('meta[name="description"]', "content", description),
        swap('meta[property="og:description"]', "content", description),
        swap('meta[name="twitter:description"]', "content", description),
      );
    }
    if (path) {
      const url = `${site.url}${path}`;
      restores.push(
        swap('link[rel="canonical"]', "href", url),
        swap('meta[property="og:url"]', "content", url),
        swap('meta[name="twitter:url"]', "content", url),
      );
    }
    if (noindex) restores.push(swap('meta[name="robots"]', "content", "noindex, follow"));

    return () => {
      document.title = previousTitle;
      restores.forEach((restore) => restore());
    };
  }, [title, description, path, noindex]);
}
