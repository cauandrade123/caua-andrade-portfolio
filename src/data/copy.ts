import { copySchema } from "@/types";

// Textos da seção de experiência e do 404 são provisórios até o conteúdo final.
export const copy = copySchema.parse({
  a11y: {
    skipToContent: "Pular para o conteúdo",
    mainNav: "Principal",
    mobileNav: "Seções",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    toggleTheme: "Alternar tema",
    externalLink: "Abre em uma nova aba",
  },
  header: {
    contact: { label: "Contato", href: "#contact" },
  },
  hero: {
    firstName: "Cauã",
    lastName: "Andrade",
    prompt: "~/portfolio",
    command: "whoami",
    lead: "Desenvolvedor back-end. Construo",
    words: ["APIs", "automações", "sistemas"],
    wordsSummary: "APIs, automações e sistemas.",
    stack: [
      { name: "Node.js", logo: "nodedotjs" },
      { name: "JavaScript", logo: "javascript" },
      { name: "Express", logo: "express" },
      { name: "MySQL", logo: "mysql" },
      { name: "Docker", logo: "docker" },
      { name: "AWS" },
      { name: "Azure" },
    ],
    stackLabel: "Stack principal",
    timelineLabel: "Projetos por ano",
    notificationTime: "agora",
    scrollHint: "Role para ver",
    stats: {
      projects: { one: "projeto", other: "projetos" },
      technologies: { one: "tecnologia", other: "tecnologias" },
      certifications: { one: "certificação", other: "certificações" },
    },
  },
  consoleGreeting: {
    title: "Fuçando o código? Gosto disso.",
    message: "O resto está no GitHub:",
  },
  about: {
    eyebrow: "Sobre mim",
    title: "Arquitetando o futuro,",
    subtitle: "uma linha de código por vez.",
    paragraphs: [
      "Desenvolvedor de software, certificado Azure AI-900, com foco em Node.js, SQL e Cloud. Construindo sistemas escaláveis, bem estruturados e fáceis de manter. Não me interessa só fazer funcionar, me interessa fazer certo.",
      "Trabalho com tecnologias modernas como Node.js, AWS e bancos de dados SQL, sempre buscando as melhores práticas e padrões da indústria. Acredito que um bom back-end é invisível para o usuário — funciona perfeitamente, sem atritos, sem falhas.",
    ],
    quote:
      "Meu objetivo é transformar desafios técnicos complexos em soluções elegantes e eficientes que impulsionem o crescimento dos negócios.",
    availability: "Disponível para projetos",
    photoAlt: "Cauã Andrade — Desenvolvedor Back-end",
  },
  stacks: {
    eyebrow: "Tecnologias",
    title: "Stack & Ferramentas",
  },
  experience: {
    eyebrow: "Trajetória",
    title: "Experiência",
    current: "Atual",
  },
  certifications: {
    eyebrow: "Certificações",
    title: "Credenciais & Conquistas",
    labels: {
      achieved: "Obtida em",
      issuer: "Emissor",
      credential: "Credencial",
      domain: "Área",
    },
    viewCredential: "Ver credencial",
  },
  projects: {
    eyebrow: "Projetos",
    title: "Trabalhos selecionados",
    allProjects: "Ver todos no GitHub",
    viewCode: "Ver código no GitHub",
    viewProject: "Ver projeto",
    inProgress: "Em desenvolvimento",
    viewCase: "Ver case",
    deck: {
      label: "Pilha de projetos",
      previous: "Projeto anterior",
      next: "Próximo projeto",
      of: "de",
      swipeHint: "Arraste para o lado",
    },
  },
  projectCase: {
    back: "Voltar aos projetos",
    problem: "O problema",
    solution: "A solução",
    howItWorks: "Como funciona",
    stack: "Stack",
    results: "Resultados",
    next: "Próximo projeto",
  },
  contact: {
    eyebrow: "Contato",
    title: "Vamos trabalhar juntos?",
    description: "Estou aberto a novas oportunidades e projetos desafiadores. Entre em contato e vamos conversar.",
  },
  footer: {
    rights: "Todos os direitos reservados.",
    backToTop: "Voltar ao topo",
  },
  notFound: {
    title: "404",
    message: "Página não encontrada",
    backHome: "Voltar para o início",
  },
});
