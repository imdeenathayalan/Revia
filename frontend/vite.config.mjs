import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: "/",   // 👈 important for Netlify root deployment
  server: {
    port: 3000,
    open: true,
  },
})
