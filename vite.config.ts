import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Kashef2025/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
