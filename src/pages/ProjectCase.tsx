import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { CaseStory } from "@/components/CaseStory";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SkipLink } from "@/components/SkipLink";
import { BrandIcon } from "@/components/primitives/BrandIcon";
import { Icon } from "@/components/primitives/Icon";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { copy, projects, site } from "@/data";
import { findStackItem } from "@/lib/stack-lookup";
import { usePageMeta } from "@/lib/use-page-meta";
import { projectTransitionName, useZoomNavigate } from "@/lib/zoom-navigation";
import NotFound from "./NotFound";

/** Clique comum (sem tecla modificadora): os outros abrem em nova aba e não devem ter zoom. */
const isPlainClick = (event: MouseEvent) => !(event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0);

const ProjectCase = () => {
  const { slug } = useParams();
  const index = projects.findIndex((candidate) => candidate.slug === slug);
  const project = projects[index];
  const heroRef = useRef<HTMLElement>(null);
  const nextLinkRef = useRef<HTMLAnchorElement>(null);
  const zoomNavigate = useZoomNavigate();

  usePageMeta(project ? { title: `${project.title} | ${site.name}`, description: project.summary, path: `/projects/${project.slug}` } : null);

  // O hero carrega o mesmo nome do card de origem: é nele que o zoom termina (e de onde o zoom-out parte).
  useLayoutEffect(() => {
    if (project) heroRef.current?.style.setProperty("view-transition-name", projectTransitionName(project.slug));
  }, [project]);

  if (!project) return <NotFound />;

  const { projectCase: texts, projects: projectTexts } = copy;
  // "Próximo projeto" só passa pelos que têm case (o API Gateway, em desenvolvimento, não tem).
  const withCase = projects.filter((candidate) => candidate.case);
  const next = withCase[(withCase.indexOf(project) + 1) % withCase.length];
  const backHash = `#project-${project.slug}`;

  const goBack = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    zoomNavigate({ pathname: "/", hash: backHash }, { state: { zoom: true } });
  };

  const goNext = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(event)) return;
    event.preventDefault();
    zoomNavigate(`/projects/${next.slug}`, { source: nextLinkRef.current, name: projectTransitionName(next.slug) });
  };

  return (
    <div className="min-h-screen bg-background">
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1}>
        {/* Mesma largura (`wide`) de todas as seções do case: uma margem esquerda só, do topo ao "Próximo projeto". */}
        <Section ref={heroRef} id="hero" variant="navy" width="wide" className="pb-16 pt-24 md:pb-24 md:pt-40">
              <Link
                to={{ pathname: "/", hash: backHash }}
                onClick={goBack}
                className="group mb-6 inline-flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground md:mb-8"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform duration-250 ease-out-quint group-hover:-translate-x-1" />
                <span className="link-underline">{texts.back}</span>
              </Link>

              {/* Ícone na linha do ano, não ao lado do título: assim o título começa na mesma margem do resto da página. */}
              <Reveal>
                <p className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-primary-foreground/70">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/10 text-glow">
                    <Icon name={project.icon} className="h-5 w-5" />
                  </span>
                  <span>{project.year}</span>
                  {project.status === "in-progress" ? (
                    <span className="rounded-full border border-primary-foreground/30 px-2 py-0.5">{projectTexts.inProgress}</span>
                  ) : null}
                </p>
                {/* O maior título da página (40 a 64 px), acima dos 36/48 px dos títulos de seção. */}
                <h1 id="hero-title" className="mt-4 max-w-4xl text-balance font-display text-display-lg font-medium tracking-tight">
                  {project.title}
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                {/* O que o projeto é (`case.overview`); o desafio fica só no Problema, logo abaixo. Sem case, a frase do card. */}
                <p className="mt-6 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">{project.case?.overview ?? project.pitch}</p>
                {/* A stack mora no topo, nas mesmas pílulas da seção Stacks (antes era uma seção só para ela). */}
                <ul aria-label={texts.stack} className="mt-6 flex flex-wrap gap-2.5">
                  {project.tags.map((tech) => {
                    const item = findStackItem(tech);
                    return (
                      <li
                        key={tech}
                        className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-surface-raised px-3.5 py-2 text-sm font-medium text-primary-foreground"
                      >
                        {/* Logo e ícone na mesma cor: em âmbar, RBAC e REST API pareciam destacados sem motivo. */}
                        {item?.logo ? (
                          <BrandIcon name={item.logo} className="h-4 w-4 shrink-0 text-primary-foreground/80" />
                        ) : item ? (
                          <Icon name={item.icon} className="h-4 w-4 shrink-0 text-primary-foreground/80" />
                        ) : null}
                        {tech}
                      </li>
                    );
                  })}
                </ul>
                {project.links.github ? (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-6 py-3 text-sm font-medium text-surface-navy transition duration-150 hover:shadow-glow-light active:scale-95"
                  >
                    <Icon name="Github" className="h-4 w-4" />
                    {projectTexts.viewCode}
                    <span className="sr-only">{copy.a11y.externalLink}</span>
                  </a>
                ) : null}
              </Reveal>
        </Section>

        {project.case ? (
          <>
            {/* O problema é o próprio título: uma frase com o desafio de engenharia, no padrão rótulo + título da home. */}
            <Section id="problem" width="wide" className="py-12 md:py-16">
              <Reveal>
                <SectionHeader className="mb-0 max-w-3xl md:mb-0" eyebrow={texts.problem} title={project.case.problem} />
              </Reveal>
            </Section>

            {project.case.story ? (
              <CaseStory story={project.case.story} intro={project.case.solution} />
            ) : (
              <Section id="solution" variant="subtle" width="wide" className="py-12 md:py-16">
                <Reveal className="max-w-3xl">
                  <SectionHeader className="mb-4 md:mb-6" title={texts.solution} />
                  <p className="text-lg leading-relaxed text-gray-700 md:text-xl">{project.case.solution}</p>
                </Reveal>
              </Section>
            )}

            {project.case.results.length > 0 ? (
              <Section id="results" variant="subtle" width="wide" className="py-12 md:py-16">
                <Reveal className="max-w-3xl">
                  <SectionHeader className="mb-4 md:mb-6" title={texts.results} />
                  <ul className="list-disc space-y-2 pl-5 text-lg text-gray-700">
                    {project.case.results.map((result) => (
                      <li key={result}>{result}</li>
                    ))}
                  </ul>
                </Reveal>
              </Section>
            ) : null}
          </>
        ) : null}

        <Section id="next" variant="navy" width="wide" className="py-12 md:py-16">
          <Reveal>
            <h2 id="next-title" className="mb-4 text-xs uppercase tracking-widest text-primary-foreground/70">
              {texts.next}
            </h2>
            <Link
              ref={nextLinkRef}
              to={`/projects/${next.slug}`}
              onClick={goNext}
              className="group inline-flex items-center gap-3 rounded-lg font-display text-3xl font-medium tracking-tight md:text-4xl"
            >
              <span className="link-underline">{next.title}</span>
              <ArrowRight
                aria-hidden="true"
                className="h-6 w-6 shrink-0 transition-transform duration-250 ease-out-quint group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectCase;
