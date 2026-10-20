import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/DocsChat/",
  server: {
    proxy: {
      '/api': {
        target: 'https://vivek-singh75.github.io/DocsChat/',
        changeOrigin: true,
      },
    },
  },
})
