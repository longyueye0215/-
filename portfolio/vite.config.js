import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('gsap')) return 'gsap'
            if (id.includes('ogl')) return 'ogl'
            if (id.includes('framer-motion')) return 'framer-motion'
            if (id.includes('react-icons')) return 'react-icons'
            if (id.includes('react') || id.includes('scheduler')) return 'react-vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
