// vite.config.js
import { defineConfig } from "file:///C:/xampp/htdocs/kadesh/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/xampp/htdocs/kadesh/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\xampp\\htdocs\\kadesh";
var vite_config_default = defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false
  },
  server: {
    port: 3e3,
    host: true,
    // DESABILITAR CACHE COMPLETAMENTE
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: true
    },
    // Headers para prevenir cache
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0"
    },
    proxy: {
      "/api": {
        target: "http://localhost/kadesh",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            if (req.headers?.authorization) {
              proxyReq.setHeader("authorization", req.headers.authorization);
              proxyReq.setHeader("Authorization", req.headers.authorization);
            }
          });
        }
      }
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    minify: "terser",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ["vue", "vue-router", "pinia"],
          ui: ["@headlessui/vue", "@heroicons/vue"],
          utils: ["axios", "@vueuse/core", "date-fns"]
        }
      }
    }
  },
  optimizeDeps: {
    include: ["vue", "vue-router", "pinia", "axios"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxca2FkZXNoXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxca2FkZXNoXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi94YW1wcC9odGRvY3Mva2FkZXNoL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbdnVlKCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICB9LFxuICB9LFxuICBkZWZpbmU6IHtcbiAgICBfX1ZVRV9PUFRJT05TX0FQSV9fOiB0cnVlLFxuICAgIF9fVlVFX1BST0RfREVWVE9PTFNfXzogZmFsc2UsXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgaG9zdDogdHJ1ZSxcbiAgICAvLyBERVNBQklMSVRBUiBDQUNIRSBDT01QTEVUQU1FTlRFXG4gICAgaG1yOiB7XG4gICAgICBvdmVybGF5OiB0cnVlXG4gICAgfSxcbiAgICB3YXRjaDoge1xuICAgICAgdXNlUG9sbGluZzogdHJ1ZVxuICAgIH0sXG4gICAgLy8gSGVhZGVycyBwYXJhIHByZXZlbmlyIGNhY2hlXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0NhY2hlLUNvbnRyb2wnOiAnbm8tc3RvcmUsIG5vLWNhY2hlLCBtdXN0LXJldmFsaWRhdGUsIHByb3h5LXJldmFsaWRhdGUnLFxuICAgICAgJ1ByYWdtYSc6ICduby1jYWNoZScsXG4gICAgICAnRXhwaXJlcyc6ICcwJ1xuICAgIH0sXG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0L2thZGVzaCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgsXG4gICAgICAgIGNvbmZpZ3VyZTogKHByb3h5KSA9PiB7XG4gICAgICAgICAgcHJveHkub24oJ3Byb3h5UmVxJywgKHByb3h5UmVxLCByZXEpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXEuaGVhZGVycz8uYXV0aG9yaXphdGlvbikge1xuICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ2F1dGhvcml6YXRpb24nLCByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uKVxuICAgICAgICAgICAgICBwcm94eVJlcS5zZXRIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBvdXREaXI6ICdkaXN0JyxcbiAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgc291cmNlbWFwOiBmYWxzZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdnVlOiBbJ3Z1ZScsICd2dWUtcm91dGVyJywgJ3BpbmlhJ10sXG4gICAgICAgICAgdWk6IFsnQGhlYWRsZXNzdWkvdnVlJywgJ0BoZXJvaWNvbnMvdnVlJ10sXG4gICAgICAgICAgdXRpbHM6IFsnYXhpb3MnLCAnQHZ1ZXVzZS9jb3JlJywgJ2RhdGUtZm5zJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWyd2dWUnLCAndnVlLXJvdXRlcicsICdwaW5pYScsICdheGlvcyddXG4gIH1cbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0UCxTQUFTLG9CQUFvQjtBQUN6UixPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlO0FBRnhCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxJQUFJLENBQUM7QUFBQSxFQUNmLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixxQkFBcUI7QUFBQSxJQUNyQix1QkFBdUI7QUFBQSxFQUN6QjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFFTixLQUFLO0FBQUEsTUFDSCxTQUFTO0FBQUEsSUFDWDtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLElBQ2Q7QUFBQTtBQUFBLElBRUEsU0FBUztBQUFBLE1BQ1AsaUJBQWlCO0FBQUEsTUFDakIsVUFBVTtBQUFBLE1BQ1YsV0FBVztBQUFBLElBQ2I7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFFBQVE7QUFBQSxRQUNSLFNBQVMsQ0FBQyxTQUFTO0FBQUEsUUFDbkIsV0FBVyxDQUFDLFVBQVU7QUFDcEIsZ0JBQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxRQUFRO0FBQ3RDLGdCQUFJLElBQUksU0FBUyxlQUFlO0FBQzlCLHVCQUFTLFVBQVUsaUJBQWlCLElBQUksUUFBUSxhQUFhO0FBQzdELHVCQUFTLFVBQVUsaUJBQWlCLElBQUksUUFBUSxhQUFhO0FBQUEsWUFDL0Q7QUFBQSxVQUNGLENBQUM7QUFBQSxRQUNIO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixLQUFLLENBQUMsT0FBTyxjQUFjLE9BQU87QUFBQSxVQUNsQyxJQUFJLENBQUMsbUJBQW1CLGdCQUFnQjtBQUFBLFVBQ3hDLE9BQU8sQ0FBQyxTQUFTLGdCQUFnQixVQUFVO0FBQUEsUUFDN0M7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxPQUFPLGNBQWMsU0FBUyxPQUFPO0FBQUEsRUFDakQ7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
