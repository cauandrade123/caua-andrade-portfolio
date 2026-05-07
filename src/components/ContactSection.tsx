import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Linkedin, Github, ArrowUpRight,  Target } from "lucide-react";

const contactLinks = [

  {
    name: "Email",
    value: "cauaandradeconde@gmail.com",
    target: "_blank",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=cauaandradeconde@gmail.com",
    icon: Mail,
  },
  {
    name: "LinkedIn",
    value: "/in/cauaandrade",
    href: "https://www.linkedin.com/in/cauaandradedev/",
    icon: Linkedin,
  },
  {
    name: "GitHub",
    value: "cauandrade123",
    href: "https://github.com/cauandrade123",
    icon: Github,
  },
];

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative py-12 sm:py-16 overflow-hidden">
     
      <div className="absolute inset-0 bg-gradient-to-br from-blue-dark via-blue-primary to-blue-medium" />
      
    
        <motion.div
        animate={{ 
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-30"
        style={{
          background: "linear-gradient(45deg, transparent 30%, hsl(220 50% 45% / 0.3) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
        }}
      />


      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 left-10 w-48 h-48 bg-blue-light/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-16 right-10 w-56 h-56 bg-blue-dark/30 rounded-full blur-3xl"
      />

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-10"
          >
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs uppercase text-blue-light/80 mb-2 sm:mb-3 tracking-widest"
            >
              Contato
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-3 sm:mb-4"
            >
              Vamos trabalhar juntos?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm text-primary-foreground/70 max-w-lg mx-auto"
            >
              Estou aberto a novas oportunidades e projetos desafiadores.
              Entre em contato e vamos conversar.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto"
          >
            {contactLinks.map((link, index) => (
              <motion.a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative p-4 bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-xl hover:bg-primary-foreground/10 hover:border-primary-foreground/20 transition-all duration-300"
              >
            
                <div className="absolute inset-0 bg-gradient-to-br from-blue-light/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
                
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="p-2 bg-primary-foreground/10 rounded-lg"
                  >
                    <link.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                  </motion.div>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground/40 group-hover:text-primary-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                  />
                </div>
                <p className="text-xs uppercase text-primary-foreground/50 mb-0.5">
                  {link.name}
                </p>
                <p className="text-sm text-primary-foreground font-medium truncate">
                  {link.value}
                </p>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}