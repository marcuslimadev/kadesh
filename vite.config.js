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
      // Proxy para API - redireciona /api/* para http://localhost/kadesh/api/*
      '/api': {
        target: 'http://localhost/kadesh',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request:', req.method, req.url, '→', options.target + req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
});
