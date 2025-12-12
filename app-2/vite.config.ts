import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error - path is a built-in Node.js module
import path from 'path'
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  resolve: {
    alias: {
      // @ts-expect-error - __dirname is available in Node.js
      '@design-system':  path.resolve(__dirname, "../heph-frontend/src/design"),
      // @ts-expect-error - __dirname is available in Node.js
      "@ds/inject": path.resolve(__dirname, "./src/design-inject"),
    },
  },
})