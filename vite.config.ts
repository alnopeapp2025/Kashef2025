import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Kashef2025/', // Base path for GitHub Pages
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
