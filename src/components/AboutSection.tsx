import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const highlights = [
    { number: "2+", label: "Anos de experiência" },
    { number: "3+", label: "Projetos entregues" },
    { number: "99.9%", label: "Uptime garantido" },
  ];

  return (
    <section id="about" className="py-10 sm:py-12 md:py-16 bg-gradient-to-b from-background to-gray-50">
      <div className="container px-6 sm:px-8 lg:px-12 xl:px-16">
        <div ref={ref} className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="mb-8 sm:mb-10"
          >
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs uppercase text-blue-primary mb-2 sm:mb-3 tracking-widest"
            >
              Sobre mim
            </motion.p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
              Arquitetando o futuro,<br />
              <span className="text-gray-400">uma linha de código por vez.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-3 sm:space-y-4"
            >
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Sou desenvolvedor back-end com foco em criar soluções que vão além do código. 
                Minha abordagem combina arquitetura limpa, performance otimizada e escalabilidade 
                para entregar sistemas que realmente fazem a diferença.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Trabalho com tecnologias modernas como Node.js, AWS e bancos de dados SQL, 
                sempre buscando as melhores práticas e padrões da indústria. Acredito que 
                um bom back-end é invisível para o usuário — funciona perfeitamente, 
                sem atritos, sem falhas.
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="p-3 sm:p-4 bg-gradient-to-br from-blue-primary/5 to-blue-light/5 border border-blue-primary/10 rounded-xl"
              >
                <p className="text-sm text-gray-600 italic">
                  "Meu objetivo é transformar desafios técnicos complexos em soluções elegantes 
                  e eficientes que impulsionem o crescimento dos negócios."
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-0"
            >
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
                  whileHover={{ 
                    scale: 1.02, 
                    x: 8,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  className="group flex items-baseline gap-3 sm:gap-4 py-4 sm:py-6 border-b border-gray-200 last:border-0 hover:bg-gradient-to-r hover:from-blue-primary/5 hover:to-transparent transition-all duration-500 -mx-2 sm:-mx-3 px-2 sm:px-3 rounded-lg cursor-pointer"
                >
                  <motion.span 
                    className="text-2xl sm:text-3xl md:text-4xl text-gradient font-bold"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.number}
                  </motion.span>
                  <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}