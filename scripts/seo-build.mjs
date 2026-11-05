// SEO depois do `vite build` (R22), sem dependência nova:
// - troca o bloco entre `<!-- seo:start -->` e `<!-- seo:end -->` do dist/index.html pelas tags da home e pelo
//   JSON-LD (WebSite + ProfilePage + Person), montados de src/data, mais a pré-carga das fontes do primeiro frame;
// - gera um HTML por case (dist/projects/<slug>.html) com as tags do case: os robôs do WhatsApp, LinkedIn e X
//   não rodam JS, e sem isso todo case compartilhado mostrava a prévia da home. Com `cleanUrls` (vercel.json), a Vercel
//   serve /projects/<slug> a partir desse arquivo, e o React assume a página;
// - gera o dist/404.html (noindex), que a Vercel serve com status 404 nas URLs que não existem;
// - põe em cada página um <noscript> com o conteúdo em HTML puro (nome, sobre, projetos, contatos), para robôs que
//   leem só o HTML (buscadores de IA, Bing em parte). Quem tem JS nunca vê esse bloco;
// - gera o sitemap.xml (com a foto, para o Google Imagens), o llms.txt (resumo para assistentes de IA) e o
//   site.webmanifest, e copia a foto para uma URL fixa (`seo.person.image`).
import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { loadData } from "./load-data.mjs";

const DIST = "dist";
const START = "<!-- seo:start -->";
const END = "<!-- seo:end -->";
const ROOT = '<div id="root"></div>';
const PHOTO = "src/assets/caua-andrade-conde.webp";
/** Fontes do primeiro frame: o nome gigante (Bricolage) e o texto (Roboto 400), só o subconjunto latin. */
const PRELOAD_FONTS = [/^bricolage-grotesque-latin-wght-normal-.+\.woff2$/, /^roboto-latin-400-normal-.+\.woff2$/];

const { seo, site, projects, stacks, certifications, copy, contactLinks } = await loadData();
const template = await readFile(`${DIST}/index.html`, "utf8");
const startAt = template.indexOf(START);
const endAt = template.indexOf(END);
if (startAt === -1 || endAt < startAt) throw new Error(`index.html sem os marcadores ${START} / ${END}`);
if (!template.includes(ROOT)) throw new Error(`index.html sem ${ROOT}`);

const assets = await readdir(`${DIST}/assets`);
const fonts = PRELOAD_FONTS.map((pattern) => {
  const file = assets.find((name) => pattern.test(name));
  if (!file) throw new Error(`seo-build: fonte para pré-carregar não encontrada (${pattern})`);
  return `/assets/${file}`;
});

const home = `${site.url}/`;
const absolute = (path) => `${site.url}${path}`;
const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** Tira o `**destaque**` dos textos (no site ele vira marca-texto). */
const plain = (text) => text.replace(/\*\*/g, "");
// `<` escapado: nenhum texto dos dados fecha o <script> do JSON-LD.
const jsonLd = (graph) => JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");

const warn = (label, text, max) => {
  if (text.length > max) console.warn(`seo-build: ${label} com ${text.length} caracteres (o Google corta em ~${max})`);
};

const { person: p } = seo;
const personId = `${home}#person`;
const websiteId = `${home}#website`;
const cases = projects.filter((project) => project.case);
const casePath = (project) => `/projects/${project.slug}`;
const email = contactLinks.find((link) => link.id === "email");

const person = {
  "@type": "Person",
  "@id": personId,
  name: p.fullName,
  alternateName: p.alternateNames,
  givenName: p.givenName,
  familyName: p.familyName,
  jobTitle: site.role,
  description: seo.home.description,
  url: home,
  image: absolute(p.image),
  ...(email ? { email: email.href } : {}),
  address: { "@type": "PostalAddress", addressLocality: p.address.locality, addressRegion: p.address.region, addressCountry: p.address.country },
  alumniOf: { "@type": "CollegeOrUniversity", name: p.education },
  worksFor: { "@type": "Organization", name: p.employer },
  hasCredential: certifications
    .filter((certification) => certification.show && certification.status === "earned")
    .map((certification) => ({
      "@type": "EducationalOccupationalCredential",
      name: `${certification.title} (${certification.credentialId})`,
      credentialCategory: "certification",
      recognizedBy: { "@type": "Organization", name: certification.issuer },
      ...(certification.credentialUrl ? { url: certification.credentialUrl } : {}),
    })),
  knowsAbout: stacks.flatMap((group) => group.items.map((item) => item.name)),
  knowsLanguage: "pt-BR",
  sameAs: [site.social.github, site.social.linkedin],
};

const website = {
  "@type": "WebSite",
  "@id": websiteId,
  url: home,
  name: p.fullName,
  alternateName: p.alternateNames,
  inLanguage: "pt-BR",
  publisher: { "@id": personId },
};

/** As tags do <head> de uma página. Os seletores batem com os do `usePageMeta`, que troca as mesmas tags no app. */
function head({ title, description, path, type, graph }) {
  warn(`título de ${path}`, title, 60);
  warn(`descrição de ${path}`, description, 160);
  const url = absolute(path);
  const image = absolute(seo.ogImage.path);
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="author" content="${escapeHtml(p.fullName)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="me" href="${site.social.github}" />`,
    `<link rel="me" href="${site.social.linkedin}" />`,
    `<link rel="manifest" href="/site.webmanifest" />`,
    ...fonts.map((font) => `<link rel="preload" href="${font}" as="font" type="font/woff2" crossorigin />`),
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${escapeHtml(p.fullName)}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="${seo.ogImage.width}" />`,
    `<meta property="og:image:height" content="${seo.ogImage.height}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(seo.ogImage.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:url" content="${url}" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(seo.ogImage.alt)}" />`,
    `<script type="application/ld+json">${jsonLd(graph)}</script>`,
  ];
  return `${START}\n    ${tags.join("\n    ")}\n    ${END}`;
}

/** Lista de contatos em HTML puro (rodapé do <noscript>). */
const contactsHtml = `<ul>${contactLinks.map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}: ${escapeHtml(link.value)}</a></li>`).join("")}</ul>`;

/** A página em HTML puro, dentro de <noscript>: só quem não roda JS lê. */
function noscript(body) {
  return `${ROOT}\n    <noscript>\n      <main>${body}<footer><h2>${escapeHtml(copy.header.contact.label)}</h2><p>${escapeHtml(`${site.role} · ${p.address.locality}, ${p.address.region}`)}</p>${contactsHtml}</footer></main>\n    </noscript>`;
}

const homeNoscript = noscript(
  [
    `<h1>${escapeHtml(p.fullName)}</h1>`,
    `<p>${escapeHtml(`${copy.hero.lead} ${copy.hero.wordsSummary}`)}</p>`,
    `<h2>${escapeHtml(copy.about.eyebrow)}</h2>`,
    ...copy.about.paragraphs.map((paragraph) => `<p>${escapeHtml(plain(paragraph))}</p>`),
    `<h2>${escapeHtml(seo.breadcrumbs.projects)}</h2>`,
    `<ul>${projects
      .map((project) => {
        const title = project.case ? `<a href="${casePath(project)}">${escapeHtml(project.title)}</a>` : escapeHtml(project.title);
        return `<li><h3>${title}</h3><p>${escapeHtml(project.metaDescription ?? project.summary)}</p></li>`;
      })
      .join("")}</ul>`,
  ].join(""),
);

const page = (meta, body) =>
  (template.slice(0, startAt) + head(meta) + template.slice(endAt + END.length)).replace(ROOT, body);

// Home: a pessoa, o site e a página de perfil.
await writeFile(
  `${DIST}/index.html`,
  page(
    {
      title: seo.home.title,
      description: seo.home.description,
      path: "/",
      type: "profile",
      graph: [
        website,
        person,
        { "@type": "ProfilePage", "@id": `${home}#profile`, url: home, name: seo.home.title, inLanguage: "pt-BR", isPartOf: { "@id": websiteId }, mainEntity: { "@id": personId } },
      ],
    },
    homeNoscript,
  ),
);

// Cases: só projetos com página (`case`). O título segue o do `ProjectCase` (`{projeto} | {nome completo}`).
await mkdir(`${DIST}/projects`, { recursive: true });
for (const project of cases) {
  const path = casePath(project);
  const url = absolute(path);
  const body = noscript(
    [
      `<p><a href="/">${escapeHtml(seo.breadcrumbs.home)}</a> › <a href="/#projects">${escapeHtml(seo.breadcrumbs.projects)}</a></p>`,
      `<h1>${escapeHtml(project.title)}</h1>`,
      `<p>${escapeHtml(project.case.overview)}</p>`,
      `<p>${escapeHtml(`${copy.projectCase.stack}: ${project.tags.join(", ")}`)}</p>`,
      `<h2>${escapeHtml(copy.projectCase.problem)}</h2><p>${escapeHtml(project.case.problem)}</p>`,
      `<h2>${escapeHtml(copy.projectCase.solution)}</h2><p>${escapeHtml(project.case.solution)}</p>`,
      ...(project.case.results.length
        ? [`<h2>${escapeHtml(copy.projectCase.results)}</h2><ul>${project.case.results.map((result) => `<li>${escapeHtml(result)}</li>`).join("")}</ul>`]
        : []),
      `<h2>${escapeHtml(copy.projectCase.moreProjects)}</h2><ul>${cases
        .filter((other) => other !== project)
        .map((other) => `<li><a href="${casePath(other)}">${escapeHtml(other.title)}</a></li>`)
        .join("")}</ul>`,
      `<p>${escapeHtml(`${p.fullName} · ${site.role}`)}</p>`,
    ].join(""),
  );
  await writeFile(
    `${DIST}${path}.html`,
    page(
      {
        title: `${project.title} | ${p.fullName}`,
        description: project.metaDescription ?? project.summary,
        path,
        type: "article",
        graph: [
          {
            "@type": "CreativeWork",
            "@id": `${url}#project`,
            url,
            name: project.title,
            description: project.summary,
            keywords: project.tags.join(", "),
            dateCreated: String(project.year),
            inLanguage: "pt-BR",
            author: { "@id": personId },
            isPartOf: { "@id": websiteId },
            ...(project.links.github ? { codeRepository: project.links.github } : {}),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: seo.breadcrumbs.home, item: home },
              { "@type": "ListItem", position: 2, name: seo.breadcrumbs.projects, item: `${home}#projects` },
              { "@type": "ListItem", position: 3, name: project.title, item: url },
            ],
          },
          person,
          website,
        ],
      },
      body,
    ),
  );
}

// 404: sem rewrite para o index.html (vercel.json), a Vercel serve este arquivo com status 404 em qualquer URL
// que não existe no dist/ (inclusive /projects/<slug> sem case). O React assume e mostra a página NotFound.
// Sem canonical e com noindex: a URL inexistente não é a home.
const notFoundTitle = `${copy.notFound.message} | ${p.fullName}`;
await writeFile(
  `${DIST}/404.html`,
  (
    template.slice(0, startAt) +
    `${START}\n    <title>${escapeHtml(notFoundTitle)}</title>\n    <meta name="robots" content="noindex, follow" />\n    ${END}` +
    template.slice(endAt + END.length)
  ).replace(ROOT, noscript(`<h1>${escapeHtml(copy.notFound.message)}</h1><p><a href="/">${escapeHtml(copy.notFound.backHome)}</a></p>`)),
);

// Sitemap: a data do build vira o `lastmod` (o site só muda quando há deploy). A foto vai junto da home.
const today = new Date().toISOString().slice(0, 10);
const entries = [
  { loc: home, changefreq: "monthly", priority: "1.0", image: absolute(p.image) },
  ...cases.map((project) => ({ loc: absolute(casePath(project)), changefreq: "yearly", priority: "0.6" })),
];
await writeFile(
  `${DIST}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    (entry) =>
      `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n${entry.image ? `    <image:image>\n      <image:loc>${entry.image}</image:loc>\n    </image:image>\n` : ""}  </url>`,
  )
  .join("\n")}
</urlset>
`,
);

// llms.txt (llmstxt.org): resumo em Markdown para ChatGPT, Perplexity e outros assistentes que citam sites.
await writeFile(
  `${DIST}/llms.txt`,
  `# ${p.fullName}

> ${seo.home.description}

${copy.about.paragraphs.map(plain).join("\n\n")}

- Também conhecido como: ${p.alternateNames.join(", ")}
- Local: ${p.address.locality}, ${p.address.region}
- Formação: ${p.education}
- Experiência: ${p.employer}
- Tecnologias: ${person.knowsAbout.join(", ")}
${person.hasCredential.map((credential) => `- Certificação: ${credential.name}`).join("\n")}

## ${seo.breadcrumbs.projects}

${cases.map((project) => `- [${project.title}](${absolute(casePath(project))}): ${project.metaDescription ?? project.summary}`).join("\n")}

## ${copy.header.contact.label}

${contactLinks.map((link) => `- [${link.label}](${link.href})`).join("\n")}
`,
);

// Manifest: nome e ícones para o Chrome (Android) e para o Google ligar o site à marca.
await writeFile(
  `${DIST}/site.webmanifest`,
  `${JSON.stringify(
    {
      name: p.fullName,
      short_name: site.name,
      description: seo.home.description,
      lang: "pt-BR",
      start_url: "/",
      display: "browser",
      theme_color: "#121214",
      background_color: "#121214",
      icons: [
        { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    null,
    2,
  )}\n`,
);

await copyFile(PHOTO, `${DIST}${p.image}`);

console.log(`seo-build: home + ${cases.length} cases + 404, sitemap com ${entries.length} URLs, llms.txt, manifest, foto em ${p.image}`);
