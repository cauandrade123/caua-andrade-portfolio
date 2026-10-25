import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { copy, site } from "@/data";
import { usePageMeta } from "@/lib/use-page-meta";

const NotFound = () => {
  const { notFound } = copy;
  usePageMeta({ title: `${notFound.message} | ${site.name}`, noindex: true });

  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center bg-navy-depth px-6 text-center text-primary-foreground">
      <h1>
        <span className="block font-display text-8xl font-bold tracking-tight text-glow sm:text-9xl">{notFound.title}</span>
        <span className="mt-4 block text-xl text-primary-foreground/80 sm:text-2xl">{notFound.message}</span>
      </h1>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-6 py-3 text-sm font-medium text-surface-navy transition duration-300 hover:shadow-glow-light active:scale-95"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        {notFound.backHome}
      </Link>
    </main>
  );
};

export default NotFound;
