import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost',
          changeOrigin: true,
          rewrite: (path) => `/kadesh/public/backend.php${path}`,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Repassar todos os cookies
              if (req.headers.cookie) {
                proxyReq.setHeader('Cookie', req.headers.cookie)
              }
            })
            proxy.on('proxyRes', (proxyRes, req, res) => {
              // Repassar cookies da resposta
              const cookies = proxyRes.headers['set-cookie']
              if (cookies) {
                proxyRes.headers['set-cookie'] = cookies.map(cookie => 
                  cookie.replace(/Domain=[^;]+;?/gi, '')
                        .replace(/Path=[^;]+;?/gi, 'Path=/;')
                        .replace(/Secure;?/gi, '')
                )
              }
            })
          }
        }
      }
    },
    base: isDev ? '/' : '/kadesh/'
  }
})
