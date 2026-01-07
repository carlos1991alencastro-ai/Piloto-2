
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración optimizada para despliegue en Vercel
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
