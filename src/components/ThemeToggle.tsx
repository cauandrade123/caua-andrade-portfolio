import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { copy } from "@/data";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  /** Header sobre bloco navy: usa cores claras. */
  onNavy?: boolean;
  className?: string;
};

export function ThemeToggle({ onNavy = false, className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // O tema só é conhecido no cliente; antes disso o botão renderiza no estado claro.
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={copy.a11y.toggleTheme}
      aria-pressed={isDark}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition duration-150 active:scale-95",
        onNavy ? "text-primary-foreground hover:bg-primary-foreground/10" : "text-foreground hover:bg-gray-100",
        className,
      )}
    >
      {/* O ícone gira e troca (lua ↔ sol) a cada clique. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex"
        >
          {isDark ? <Sun aria-hidden="true" className="h-4 w-4" /> : <Moon aria-hidden="true" className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
