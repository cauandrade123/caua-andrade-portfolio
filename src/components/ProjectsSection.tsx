import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Building2, FileSpreadsheet, Server, Scissors, Cloud} from "lucide-react";

const projects = [
  {
    title: "Sistema de Gerenciamento de Clínica Médica",
    description:
      "Sistema completo para gestão de clínicas médicas com agendamento de consultas, prontuário eletrônico, gestão de pacientes e relatórios financeiros. Integração com sistemas de pagamento e notificações automatizadas.",
    tags: ["Node.js", "MySQL", "AWS", "REST API"],
    year: "2024",
    icon: Building2,
    github: "https://github.com/cauandrade123/doctors-health-api",
    gradient: "from-blue-dark to-blue-primary",

  },
  {
    title: "Automação de Planilhas Excel",
    description:
      "Sistema de automação e validação de dados em planilhas Excel, desenvolvido para otimizar processos manuais de cadastro, com foco em redução de erros, padronização de informações e ganho de produtividade.",
    tags: ["Node.js", "Excel", "Electron", "Puppeteer"],
    year: "2025",
    icon: FileSpreadsheet,
    github: "https://github.com/thiago-vieira2/electron-automation",
    gradient: "from-blue-primary to-blue-medium",
  },
  {
    title: "API Gateway Escalável",
    description:
      "Sistema de gateway de API com rate limiting, autenticação JWT e balanceamento de carga. Suporta milhares de requisições por minuto com alta disponibilidade.",
    tags: ["Node.js", "Docker", "AWS"],
    year: "2026",
    icon: Cloud,
    github: "", //colocar link do repositorio quando projeto estiver finalizado
    gradient: "from-blue-medium to-blue-light",
  },
  {
    title: "Sistema para Barbearias",
    description:
      "Sistema completo de gestão para barbearias com agendamento online, painel administrativo, controle de clientes e serviços. Desenvolvido em Node.js com MySQL, autenticação JWT e controle de acesso baseado em roles (RBAC).",
    tags: ["Node.js", "MySQL", "JWT", "RBAC", "REST API", "Docker", "AWS"],
    year: "2026",
    icon: Scissors,
    github: "https://github.com/cauandrade123/backend-barbershop",
    gradient: "from-blue-medium to-blue-light"


  }

];

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-10 sm:py-12 md:py-16 bg-gradient-to-b from-gray-50 to-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-8 sm:mb-10"
          >
            <div>
              <p className="text-xs uppercase text-blue-primary mb-2 sm:mb-3 tracking-widest">
                Projetos
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                Trabalhos selecionados
              </h2>
            </div>
            <motion.a
              whileHover={{ x: 5 }}
              href="https://github.com/cauandrade123"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-primary transition-colors"
            >
              <Github size={14} className="sm:w-4 sm:h-4" />
              Ver todos no GitHub
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </motion.a>
          </motion.div>

          <div className="space-y-4 sm:space-y-6">
            {projects.map((project, index) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden h-full"
              >
                {/* Gradient border effect */}
                <div
                  className="absolute
                    inset-0
                    translate-x-6
                    translate-y-4
                    bg-gradient-to-r
                    from-blue-primary/20
                    via-blue-medium/20
                    to-blue-light/20
                    rounded-2xl
                    opacity-0
                    group-hover:opacity-100
                    transition-all
                    duration-500
                    -z-10
                    blur-xl
                  "
                />

                
                <div className="relative p-4 sm:p-5 md:p-6 bg-card border border-gray-200 rounded-xl sm:rounded-2xl group-hover:border-blue-primary/30 transition-all duration-500 shadow-[2px_2px_8px_0px_rgba(0,0,0,0.06)] group-hover:shadow-[4px_4px_12px_0px_rgba(0,0,0,0.1)] min-h-[180px] flex flex-col">
                  <div className="flex flex-col md:flex-row md:items-start gap-3 sm:gap-4 flex-1">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className={`p-2.5 sm:p-3 bg-gradient-to-br ${project.gradient} rounded-lg sm:rounded-xl shadow-md shrink-0 w-fit`}
                    >
                      <project.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                    </motion.div>

                    <div className="flex-1 space-y-2 sm:space-y-3 flex flex-col">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h3 className="text-base sm:text-lg md:text-xl font-medium text-foreground group-hover:text-blue-primary transition-colors">
                          {project.title}
                        </h3>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {project.year}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 max-w-2xl leading-relaxed flex-1">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1 mt-auto">
                        {project.tags.map((tag) => (
                          <motion.span
                            key={tag}
                            whileHover={{ scale: 1.05 }}
                            className="px-2 sm:px-3 py-1 text-xs uppercase bg-gradient-to-r from-blue-primary/5 to-blue-light/5 text-gray-600 border border-blue-primary/10 rounded-full"
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 mt-2 md:mt-0">
                      {project.github && (
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-blue-primary hover:text-primary-foreground transition-all duration-300"
                          aria-label="Ver código no GitHub"
                          title="View Source Code"
                        >
                          <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </motion.a>
                      )}

                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        href="#"
                        className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-blue-primary hover:text-primary-foreground transition-all duration-300"
                        aria-label="Ver projeto"
                      >
                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </motion.a>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}