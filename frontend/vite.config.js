import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5175, // porta SPA distinta da raiz
    host: 'localhost',
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // backend Laravel
        changeOrigin: true,
      }
    }
  }
});
