import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";
import { fileURLToPath } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        kalshi: fileURLToPath(new URL('./kalshi/index.html', import.meta.url)),
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
      ],
    },
  }
})
