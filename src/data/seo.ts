import { seoSchema } from "@/types";

// Decidido com o usuário em 02/11/2026: as quatro grafias do nome e São Paulo (só cidade e estado).
// A lista de tecnologias do JSON-LD (`knowsAbout`) vem de `stacks.ts`; a certificação, de `certifications.ts`.
export const seo = seoSchema.parse({
  person: {
    fullName: "Cauã Andrade Condé",
    alternateNames: ["Cauã Andrade", "Caua Andrade", "Cauã Condé", "Caua Andrade Conde"],
    givenName: "Cauã",
    familyName: "Andrade Condé",
    address: { locality: "São Paulo", region: "SP", country: "BR" },
    education: "Faculdade Impacta",
    employer: "Arquivo da Propaganda",
    image: "/caua-andrade-conde.webp",
  },
  home: {
    title: "Cauã Andrade Condé · Desenvolvedor Back-end em São Paulo",
    description:
      "Cauã Andrade Condé, programador e desenvolvedor back-end em São Paulo. APIs e automações com Node.js, Python, SQL, Azure e AWS. Veja os projetos.",
  },
  ogImage: {
    path: "/preview.png",
    width: 1200,
    height: 630,
    alt: "Cauã Andrade Condé, desenvolvedor back-end",
  },
  breadcrumbs: { home: "Início", projects: "Projetos" },
});
