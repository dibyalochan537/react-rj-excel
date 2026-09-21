import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    copyPublicDir: false, // don't copy the playground's public/ files into dist
    lib: {
      entry: fileURLToPath(new URL("./src/lib/index.js", import.meta.url)),
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "exceljs"],
    },
  },
});