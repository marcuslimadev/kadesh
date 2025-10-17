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
  
  // Server config (NÃO USADO - acesso direto via http://localhost/kadesh/)
  // Mantido apenas para eventual desenvolvimento futuro com hot-reload
  server: {
    port: 5175,
    host: 'localhost'
  }
});
