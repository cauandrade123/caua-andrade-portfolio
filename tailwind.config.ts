import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        sm: "100%",
        md: "100%",
        lg: "1024px",
        xl: "1200px",
      },
    },
    extend: {
      // Telas baixas (notebook com a janela reduzida, celular com as barras do navegador): a pilha de projetos
      // da hero fica compacta. A partir de ~720 px de altura ela cabe inteira sem isso.
      screens: {
        short: { raw: "(max-height: 720px)" },
      },
      fontFamily: {
        sans: ["Roboto", "system-ui", "-apple-system", "sans-serif"],
        // Nome e títulos de impacto. Alternativa guardada: mono (docs/design/alternatives.md), trocando só esta linha.
        display: ["Bricolage Grotesque Variable", "Roboto", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Nome da hero. R12: teto de 8rem (128 px) e peso 600, para não dominar a tela no desktop; no celular
        // o piso de 3.75rem continua (duas linhas).
        "display-hero": ["clamp(3.75rem, 9vw, 8rem)", { lineHeight: "0.9", letterSpacing: "-0.04em", fontWeight: "600" }],
        "display-xl": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg": ["clamp(2.5rem, 6vw, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["clamp(1.75rem, 4vw, 2.5rem)", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "500" }],
        "body-xl": ["1.375rem", { lineHeight: "1.8", fontWeight: "300" }],
        "body-lg": ["1.25rem", { lineHeight: "1.75", fontWeight: "300" }],
        "body-md": ["1.125rem", { lineHeight: "1.7", fontWeight: "400" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.6", fontWeight: "400" }],
        "label": ["0.75rem", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "500" }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gray: {
          50: "hsl(var(--gray-50))",
          100: "hsl(var(--gray-100))",
          200: "hsl(var(--gray-200))",
          300: "hsl(var(--gray-300))",
          400: "hsl(var(--gray-400))",
          500: "hsl(var(--gray-500))",
          600: "hsl(var(--gray-600))",
          700: "hsl(var(--gray-700))",
          800: "hsl(var(--gray-800))",
          900: "hsl(var(--gray-900))",
        },
        blue: {
          dark: "hsl(var(--blue-dark))",
          primary: "hsl(var(--blue-primary))",
          medium: "hsl(var(--blue-medium))",
          light: "hsl(var(--blue-light))",
        },
        surface: {
          navy: "hsl(var(--surface-navy))",
          raised: "hsl(var(--surface-navy-raised))",
        },
        glow: "hsl(var(--glow))",
        link: "hsl(var(--link))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      boxShadow: {
        "depth-sm": "var(--shadow-sm)",
        "depth-md": "var(--shadow-md)",
        "depth-lg": "var(--shadow-lg)",
        "depth-xl": "var(--shadow-xl)",
        glow: "var(--shadow-glow)",
        "glow-light": "var(--shadow-glow-light)",
        photo: "var(--shadow-photo)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(220 60% 20% / 0.2)" },
          "50%": { boxShadow: "0 0 40px hsl(220 60% 20% / 0.4)" },
        },
        "shimmer": {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "blur-in": {
          from: { filter: "blur(20px)", opacity: "0" },
          to: { filter: "blur(0)", opacity: "1" },
        },
        // Cursor de terminal: aceso metade do tempo, apagado na outra metade, sem transição.
        caret: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.8s ease-out forwards",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "glow": "glow 4s ease-in-out infinite",
        "blur-in": "blur-in 0.8s ease-out forwards",
        // Animações que começam sozinhas param em até ~5 s (WCAG 2.2.2): o cursor pisca 5 vezes e fica aceso,
        // a seta de "role" pula 4 vezes, o ponto de "em andamento" pulsa 2 vezes.
        caret: "caret 1s steps(1) 5",
        hint: "bounce 1s 4",
        "pulse-few": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 2",
      },
      backgroundSize: {
        "gradient-size": "200% 200%",
      },
      zIndex: {
        skip: "100",
      },
      // Movimento (ver .claude/skills/motion-design): micro 150 ms, estado 250 ms, zoom 450 ms.
      transitionTimingFunction: {
        "out-quint": "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
      },
      transitionDuration: {
        "250": "250ms",
        "450": "450ms",
      },
      spacing: {
        "section": "clamp(5rem, 12vh, 10rem)",
      },
      // Altura de cada etapa do scrollytelling no desktop: o bastante para a janela presa trocar com calma.
      minHeight: {
        step: "70vh",
      },
      // Foto do Sobre: retrato vertical, como foto de revista (não círculo).
      aspectRatio: {
        portrait: "4 / 5",
      },
      // Pista de rolagem da hero (celular e desktop): o palco fica preso enquanto as letras do nome se dispersam,
      // se reagrupam em "Projetos" e a pilha de projetos sobe; a última tela é a pilha parada.
      height: {
        "hero-scroll": "300vh",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;