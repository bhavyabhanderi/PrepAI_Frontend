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
    include: ['recharts', 'decimal.js-light'],
  },
  build: {
    commonjsOptions: {
      include: [/recharts/, /decimal\.js-light/, /node_modules/],
    },
  },
  server: {
    port: 5173,
    open: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
    proxy: {
      '/api/v1': {
        target: 'https://prepai-backend-fmum.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

