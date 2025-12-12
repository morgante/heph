import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  resolve: {
    alias: {
      '@ds/inject':  path.resolve(__dirname, "./src/design-inject"),
    },
  },
})