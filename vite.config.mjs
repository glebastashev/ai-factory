import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.SITE_BASE_PATH || "/",
  build: {
    outDir: "dist/client",
    rollupOptions: {
      input: {
        main: "index.html",
        version2: "version-2.html",
        version3: "version-3.html",
        animations: "animations.html",
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react()],
});
