/// <reference types="node" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: { port: 3002 },
  resolve: {
    alias: {
      "@shared": resolve(__dirname, "../../packages/shared"),
    },
  },
});
