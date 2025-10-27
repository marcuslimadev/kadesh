import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/kadesh/', // Base path para assets em subpasta
  
  build: {
    outDir: 'public/build', // Output direto para public/build
    emptyOutDir: true,
  },
  
  publicDir: false, // Desabilita cópia de pasta public (evita conflito)
  
  // Server config para desenvolvimento
  server: {
    port: 5175,
    host: 'localhost',
    proxy: {
      // Proxy para API - redireciona /api/* para http://localhost/kadesh/public/index.php/api/*
      '/api': {
        target: 'http://localhost/kadesh/public',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => `/index.php${path}`
      }
    }
  }
});
