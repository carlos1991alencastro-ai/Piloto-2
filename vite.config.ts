
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración optimizada para despliegue en Vercel/Netlify
export default defineConfig({
  plugins: [react()],
  base: './',
})
