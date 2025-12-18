import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { 
  Server, 
  Database, 
  Cloud, 
  Code2, 
  GitBranch, 
  Container,
  Workflow,
  Shield
} from "lucide-react";

const stacks = [
  {
    category: "Back-end",
    items: [
      { name: "Node.js", icon: Server, description: "Runtime JavaScript" },
      { name: "JavaScript", icon: Code2, description: "Linguagem principal" },
      { name: "Express", icon: Workflow, description: "Web framework" },
    ],
  },
  {
    category: "Cloud & Infra",
    items: [
      { name: "AWS", icon: Cloud, description: "Lambda, EC2, S3, RDS" },
      { name: "Docker", icon: Container, description: "Containerização" },
      { name: "CI/CD", icon: GitBranch, description: "GitHub Actions" },
    ],
  },
  {
    category: "Database",
    items: [
      { name: "MySQL", icon: Database, description: "Relational DB" },
      { name: "SQL Server", icon: Database, description: "Microsoft DB" },
      { name: "Redis", icon: Database, description: "Cache & Sessions" },
    ],
  },
  {
    category: "Práticas",
    items: [
      { name: "Clean Code", icon: Shield, description: "Código limpo" },
      { name: "REST API", icon: Workflow, description: "API Design" },
      { name: "Git", icon: GitBranch, description: "Versionamento" },
    ],
  },
];

function StackCard({ item, index }: { item: typeof stacks[0]["items"][0], index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.02 : 1,
          y: isHovered ? -4 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative p-4 rounded-2xl backdrop-blur-xl bg-background/60 border border-gray-200/50 hover:border-blue-primary/30 transition-all duration-500 cursor-pointer overflow-hidden"
      >
        {/* Glassmorphism glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at 50% 50%, hsl(var(--blue-primary) / 0.08), transparent 70%)",
          }}
        />
        
        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, hsl(var(--blue-light) / 0.1), transparent, hsl(var(--blue-primary) / 0.1))",
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <motion.div 
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative"
          >
            {/* Icon glow */}
            <motion.div
              animate={{ opacity: isHovered ? 0.6 : 0 }}
              className="absolute inset-0 blur-xl bg-blue-primary/40 rounded-full"
            />
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-gray-100/80 to-gray-50/50 group-hover:from-blue-primary/10 group-hover:to-blue-light/5 border border-gray-200/50 group-hover:border-blue-primary/20 transition-all duration-500">
              <Icon 
                size={18} 
                className="text-gray-600 group-hover:text-blue-primary transition-colors duration-300" 
                strokeWidth={1.5}
              />
            </div>
          </motion.div>
          
          <div className="flex-1">
            <motion.p 
              className="text-sm font-medium text-foreground mb-0.5"
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {item.name}
            </motion.p>
            <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
              {item.description}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function StacksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stacks" className="py-10 sm:py-12 md:py-16 relative overflow-hidden">
      {/* Clean gradient background with light gray tones */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100/80 via-gray-50/60 to-background" />

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-8 sm:mb-10 md:mb-14"
          >
            <motion.p 
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={isInView ? { opacity: 1, filter: "blur(0)" } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs uppercase text-blue-primary mb-2 sm:mb-3 tracking-widest"
            >
              Tecnologias
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={isInView ? { opacity: 1, filter: "blur(0)" } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-foreground tracking-tight"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              Stack & Ferramentas
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stacks.map((stack, stackIndex) => (
              <motion.div
                key={stack.category}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.7, 
                  delay: stackIndex * 0.15,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                className="space-y-2 sm:space-y-3"
              >
                {/* Category header with glassmorphism */}
                <div className="relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "100%" } : {}}
                    transition={{ duration: 0.8, delay: 0.5 + stackIndex * 0.1 }}
                    className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-blue-primary/30 via-blue-light/20 to-transparent"
                  />
                  <h3 className="text-xs uppercase text-gray-500 tracking-widest pb-3">
                    {stack.category}
                  </h3>
                </div>
                
                {/* Stack items */}
                <div className="space-y-2">
                  {stack.items.map((item, itemIndex) => (
                    <StackCard 
                      key={item.name} 
                      item={item} 
                      index={stackIndex * 3 + itemIndex} 
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
