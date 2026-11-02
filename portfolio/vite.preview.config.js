import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

/* 仅用于「六边形加载页」验收录制的构建配置：
   npx vite build --config vite.preview.config.js  → dist-preview/ */
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist-preview",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        preview: resolve(__dirname, "previews/hexloader.html"),
      },
    },
  },
});
