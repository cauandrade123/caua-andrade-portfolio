import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/**
 * Pacotes de terceiros em arquivos próprios (R22): mudam pouco, então o navegador reaproveita do cache entre
 * deploys e baixa em paralelo com o código do site. Medido em 02/11/2026: React ~46 kB e framer-motion ~44 kB
 * (gzip), de ~170 kB no total.
 */
const vendorChunks: Record<string, RegExp> = {
  react: /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|@remix-run)[\\/]/,
  motion: /[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
};

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          return Object.keys(vendorChunks).find((name) => vendorChunks[name].test(id));
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
