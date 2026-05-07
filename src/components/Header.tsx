import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Sobre", href: "#about" },
  { name: "Tecnologias", href: "#stacks" },
  { name: "Projetos", href: "#projects" },
];

const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string, setActiveLink?: (href: string) => void) => {
  e.preventDefault();
  const target = document.querySelector(href);
  if (target) {
    
    if (setActiveLink) {
      setActiveLink(href);
      setTimeout(() => setActiveLink(""), 600);
    }
    
    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="container flex items-center justify-between h-14 sm:h-16 md:h-20 px-4 sm:px-6 lg:px-8">
        <motion.a
          href="#"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="relative text-xl sm:text-2xl font-bold tracking-tight text-foreground"
        >
          <span className="text-gradient"></span>
          <motion.span
            className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-primary to-blue-light"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.3 }}
          />
        </motion.a>

        
        <ul className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link, index) => (
            <motion.li 
              key={link.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
            >
              <motion.a
                href={link.href}
                onClick={(e) => smoothScroll(e, link.href, setActiveLink)}
                whileTap={{ scale: 0.95 }}
                animate={activeLink === link.href ? { 
                  scale: [1, 1.1, 1],
                  color: "hsl(var(--blue-primary))"
                } : {}}
                transition={{ duration: 0.3 }}
                className="relative text-sm md:text-base lg:text-lg text-gray-500 hover:text-foreground transition-colors duration-300 group py-2"
              >
                {link.name}
                <motion.span 
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-primary to-blue-light"
                  initial={{ width: 0 }}
                  animate={activeLink === link.href ? { width: "100%" } : { width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            </motion.li>
          ))}
          <motion.li
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.a
              href="#contact"
              onClick={(e) => smoothScroll(e, "#contact", setActiveLink)}
              whileTap={{ scale: 0.95 }}
              animate={activeLink === "#contact" ? { 
                scale: [1, 1.05, 1],
              } : {}}
              className="inline-flex items-center justify-center px-4 lg:px-5 py-2 text-sm md:text-base lg:text-lg font-medium bg-gradient-to-r from-blue-primary to-blue-medium text-primary-foreground rounded-full hover:shadow-lg hover:shadow-blue-primary/25 transition-all duration-300"
            >
              Contato
            </motion.a>
          </motion.li>
        </ul>

        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-foreground rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </nav>

      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-gray-200"
          >
            <ul className="container py-4 sm:py-6 space-y-1 px-4 sm:px-6">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <motion.a
                    href={link.href}
                    onClick={(e) => {
                      smoothScroll(e, link.href, setActiveLink);
                      setIsMobileMenuOpen(false);
                    }}
                    whileTap={{ scale: 0.95, x: 5 }}
                    className="block py-3 text-base sm:text-lg text-foreground hover:text-blue-primary hover:pl-2 transition-all duration-300"
                  >
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}