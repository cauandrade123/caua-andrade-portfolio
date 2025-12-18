import { motion } from "framer-motion";
import { Code2, Server, Database, Download } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-background to-gray-100" />
      
      {/* Floating gradient orbs */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-32 w-72 h-72 bg-gradient-to-br from-blue-primary/20 to-blue-light/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 -right-32 w-72 h-72 bg-gradient-to-br from-blue-medium/20 to-blue-dark/10 rounded-full blur-3xl"
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container relative z-10 pt-12 sm:pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Floating icons - hidden on very small screens */}
          <div className="absolute inset-0 pointer-events-none hidden sm:block">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-16 left-4 sm:left-10 md:left-20 p-2.5 sm:p-3 bg-gradient-to-br from-blue-primary to-blue-medium rounded-lg sm:rounded-xl shadow-lg"
            >
              <Code2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary-foreground" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-32 right-4 sm:right-10 md:right-20 p-2.5 sm:p-3 bg-gradient-to-br from-blue-medium to-blue-light rounded-lg sm:rounded-xl shadow-lg"
            >
              <Server className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary-foreground" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-32 left-8 sm:left-16 md:left-32 p-2.5 sm:p-3 bg-gradient-to-br from-blue-dark to-blue-primary rounded-lg sm:rounded-xl shadow-lg"
            >
              <Database className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary-foreground" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 sm:mb-6 bg-gradient-to-r from-blue-primary/10 to-blue-light/10 border border-blue-primary/20 rounded-full"
          >
            <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-primary to-blue-light rounded-full animate-pulse" />
            <span className="text-xs uppercase text-gray-600 tracking-widest">
              Back-end Developer
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6"
          >
            <span>Cauã </span>
            <span className="text-gradient">Andrade</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm sm:text-base md:text-lg text-gray-500 max-w-xl mx-auto mb-6 sm:mb-8 text-balance px-4"
          >
            Focado em soluções escaláveis e bem arquitetadas.
            <br className="hidden sm:block" />
            Construindo sistemas robustos que impulsionam negócios.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 px-4"
          >
            <a
              href="#projects"
              className="group relative inline-flex items-center justify-center w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium overflow-hidden rounded-full transition-all duration-500"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-dark via-blue-primary to-blue-medium bg-gradient-size animate-gradient-shift" />
              <span className="relative flex items-center text-primary-foreground">
                Ver projetos
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </a>

            <a
              href="/cv.pdf"
              download
              className="group inline-flex items-center justify-center w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-foreground border border-gray-300 rounded-full hover:border-blue-primary/50 hover:bg-blue-primary/5 transition-all duration-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CV
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center justify-center w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-foreground border border-gray-300 rounded-full hover:border-blue-primary/50 hover:bg-blue-primary/5 transition-all duration-300"
            >
              Entrar em contato
            </a>
          </motion.div>
        </div>

      </div>
    </section>
  );
}