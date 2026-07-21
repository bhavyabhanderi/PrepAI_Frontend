import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['recharts', 'decimal.js'],
  },
  build: {
    commonjsOptions: {
      include: [/recharts/, /decimal\.js/, /node_modules/],
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
