import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import imagem from "../../public/foto_portfolio.jpg"

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            {/* Texto */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-3 sm:space-y-4"
            >
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Desenvolvedor de software, certificado Azure AI-900, com foco em Node.js, SQL e Cloud. Construindo sistemas escaláveis, bem estruturados e fáceis de manter. Não me interessa só fazer funcionar, me interessa fazer certo.
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

            {/* Foto de perfil */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center -mt-[5px]"
            >
              <div className="relative">
                <motion.div
                  whileHover={{
                    scale: 1.02,
                    x: 8,
                    boxShadow: "22px 28px 60px rgba(0,0,0,0.22)"
                  }}
                  initial={{ boxShadow: "12px 20px 40px rgba(0,0,0,0.18)" }}
                  transition={{ type: "spring", stiffness: 180, damping: 28 }}
                  className="relative overflow-hidden rounded-full w-72 h-72 sm:w-80 sm:h-80 bg-gray-100"
                >
                  <img
                    src={imagem}
                    alt="Cauã Andrade — Desenvolvedor Back-end"
                    className="w-full h-full object-cover object-center"
                  />
                </motion.div>

                {/* Badge flutuante */}
                <motion.div
                  initial={{ opacity: 0, x: 20, y: 10 }}
                  animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="absolute -bottom-3 -right-3 bg-white border border-gray-100 shadow-lg rounded-xl px-3 py-2 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-gray-600">Disponível para projetos</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}