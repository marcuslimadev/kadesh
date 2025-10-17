import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: '/kadesh/', // Base path para assets em subpasta
  
  // Server config (NÃO USADO - acesso direto via http://localhost/kadesh/)
  // Mantido apenas para eventual desenvolvimento futuro com hot-reload
  server: {
    port: 5175,
    host: 'localhost'
  }
});
