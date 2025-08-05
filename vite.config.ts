import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 4000,
    // host: true,
    allowedHosts: [
      "a780-202-164-149-48.ngrok-free.app",
      "localhost",
      "integral-teaching-foxhound.ngrok-free.app",
    ],
  },
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
