import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { CaseStory } from "@/components/CaseStory";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SkipLink } from "@/components/SkipLink";
import { Icon } from "@/components/primitives/Icon";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { copy, projects, site } from "@/data";
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
  const next = projects[(index + 1) % projects.length];
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
        <section
          ref={heroRef}
          id="hero"
          aria-labelledby="case-title"
          className="relative overflow-hidden bg-navy-depth pb-16 pt-32 text-primary-foreground md:pb-24 md:pt-40"
        >
          <div className="container relative">
            <div className="mx-auto max-w-4xl">
              <Link
                to={{ pathname: "/", hash: backHash }}
                onClick={goBack}
                className="group mb-8 inline-flex items-center gap-2 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform duration-250 ease-out-quint group-hover:-translate-x-1" />
                <span className="link-underline">{texts.back}</span>
              </Link>

              <Reveal className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/10 text-glow">
                  <Icon name={project.icon} className="h-7 w-7" />
                </span>
                <div>
                  <p className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-primary-foreground/70">
                    <span>{project.year}</span>
                    {project.status === "in-progress" ? (
                      <span className="rounded-full border border-primary-foreground/30 px-2 py-0.5">{projectTexts.inProgress}</span>
                    ) : null}
                  </p>
                  <h1 id="case-title" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    {project.title}
                  </h1>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-6 max-w-2xl text-base text-primary-foreground/80 md:text-lg">{project.summary}</p>
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
            </div>
          </div>
        </section>

        {project.case ? (
          <>
            <Section id="problem" width="narrow" className="py-12 md:py-16">
              <Reveal>
                <h2 id="problem-title" className="mb-4 text-xs uppercase tracking-widest text-link">
                  {texts.problem}
                </h2>
                <p className="text-lg leading-relaxed text-gray-700 md:text-xl">{project.case.problem}</p>
              </Reveal>
            </Section>

            {project.case.story ? (
              <CaseStory story={project.case.story} intro={project.case.solution} />
            ) : (
              <Section id="solution" variant="subtle" width="narrow" className="py-12 md:py-16">
                <Reveal>
                  <h2 id="solution-title" className="mb-4 text-xs uppercase tracking-widest text-link">
                    {texts.solution}
                  </h2>
                  <p className="text-lg leading-relaxed text-gray-700 md:text-xl">{project.case.solution}</p>
                </Reveal>
              </Section>
            )}

            <Section id="case-stack" width="narrow" className="py-12 md:py-16">
              <Reveal>
                <h2 id="case-stack-title" className="mb-4 text-xs uppercase tracking-widest text-link">
                  {texts.stack}
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {project.case.stack.map((tech) => (
                    <li key={tech} className="rounded-full border border-link/15 bg-link/10 px-4 py-1.5 text-sm uppercase text-gray-700">
                      {tech}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </Section>

            {project.case.results.length > 0 ? (
              <Section id="results" variant="subtle" width="narrow" className="py-12 md:py-16">
                <Reveal>
                  <h2 id="results-title" className="mb-4 text-xs uppercase tracking-widest text-link">
                    {texts.results}
                  </h2>
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

        <Section id="next" variant="navy" width="narrow" className="py-12 md:py-16">
          <Reveal>
            <h2 id="next-title" className="mb-4 text-xs uppercase tracking-widest text-primary-foreground/70">
              {texts.next}
            </h2>
            <Link
              ref={nextLinkRef}
              to={`/projects/${next.slug}`}
              onClick={goNext}
              className="group inline-flex items-center gap-3 rounded-lg text-2xl font-bold tracking-tight sm:text-3xl"
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
