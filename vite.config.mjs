import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Asset paths must be identical in the prerendered HTML and in the client bundle.
// SSR builds turn a relative base like "./" into "/", so the configured base is passed in explicitly.
const assetBase = {
  name: "asset-base",
  config: ({ base = "/" }) => ({ define: { __ASSET_BASE__: JSON.stringify(base) } }),
};

export default defineConfig(({ isSsrBuild }) => ({
  base: process.env.SITE_BASE_PATH || "/",
  // The server bundle only renders markup at build time (see scripts/prerender.mjs).
  build: isSsrBuild
    ? { outDir: "dist/server" }
    : {
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
  plugins: [react(), assetBase],
}));
