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
      { name: "Express", icon: "Workflow" },
      { name: "Python", logo: "python" },
      { name: "FastAPI", logo: "fastapi" },
      { name: "MySQL", logo: "mysql" },
      { name: "PostgreSQL", logo: "postgresql" },
      { name: "Docker", logo: "docker" },
      { name: "AWS", logo: "aws" },
      { name: "Azure", logo: "azure" },
    ],
    stackLabel: "Stack principal",
    credentials: [
      { icon: "Briefcase", label: "Estágio em desenvolvimento no Arquivo da Propaganda" },
      { icon: "GraduationCap", label: "Ciência da Computação na Impacta" },
      { icon: "BadgeCheck", label: "Certificado Azure AI-900" },
    ],
    credentialsLabel: "Credenciais",
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
    // Fatos dados pelo usuário em 26/10/2026: começou em 2024, aos 16, com HTML; Ciência da Computação na
    // Faculdade Impacta; estagiário de desenvolvimento de software no Arquivo da Propaganda; quer se aprimorar;
    // hobby: música eletrônica. Não há motivo declarado para o back-end nem "problema favorito": não invente.
    eyebrow: "Sobre mim",
    // Título que abre a história (efeito de curiosidade); o primeiro parágrafo continua dali.
    // `**trecho**` vira marca-texto âmbar: um fato grifado por parágrafo, para o olho ter onde parar.
    title: "Tudo começou com",
    titleHighlight: "uma página em HTML.",
    paragraphs: [
      "Foi em 2024, aos 16 anos. De lá pra cá fui descendo camada por camada até chegar no **back-end**, que é onde eu me encontrei.",
      "Hoje curso Ciência da Computação na Faculdade Impacta e sou estagiário de desenvolvimento de software no **Arquivo da Propaganda**, onde aprendo na prática como software de verdade é feito.",
      "Ainda tenho muito pra aprender, e é isso que me move: quero crescer num **time que me desafie** a escrever código cada vez melhor.",
      "Fora do código, **música eletrônica** é o que me acompanha.",
    ],
    photoAlt: "Cauã Andrade",
  },
  stacks: {
    eyebrow: "Tecnologias",
    // Grill do 10/10: título com voz, ecoando o "Construo…" da hero.
    title: "Com o que eu construo",
  },
  experience: {
    eyebrow: "Trajetória",
    title: "Experiência",
    current: "Atual",
  },
  certifications: {
    eyebrow: "Certificações",
    // Grill do 10/10: factual e continua certo quando a DP-900 entrar.
    title: "Certificado pela Microsoft",
    labels: {
      achieved: "Obtida em",
      issuer: "Emissor",
      credential: "Credencial",
      exam: "Exame",
      domain: "Área",
    },
    viewCredential: "Ver credencial",
    inProgress: "Em andamento",
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
      roleDescription: "carrossel",
      slideRoleDescription: "projeto",
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
    // Escolhido pelo usuário em 27/10/2026 (troca do texto genérico apontado pela crítica de design).
    title: "Bora construir algo?",
    // Não repete o "time que me desafie" do Sobre (segunda crítica de design): aponta para o e-mail logo abaixo.
    description: "Aberto a oportunidades em back-end. O jeito mais rápido de falar comigo é por e-mail.",
    copy: {
      label: "Copiar e-mail",
      done: "Copiado!",
      failed: "Não deu para copiar. Clique no e-mail para abrir.",
    },
    // Escondido até o PDF novo chegar. O antigo (com o emprego anterior) saiu do ar e está em
    // docs/archive/curriculo-antigo-2026-10.pdf. Ponha o novo em `public/` e adicione aqui
    // `href: "/curriculo-caua-andrade.pdf"` para o botão aparecer.
    resume: {
      label: "Baixar currículo",
    },
  },
  footer: {
    copyright: "©",
    rights: "Todos os direitos reservados.",
    backToTop: "Voltar ao topo",
  },
  notFound: {
    title: "404",
    message: "Página não encontrada",
    backHome: "Voltar para o início",
  },
});
