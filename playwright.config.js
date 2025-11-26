import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração de testes E2E do Playwright
 * Testa frontend Vue + backend Node.js
 */
export default defineConfig({
  testDir: './tests',
  
  // Timeout para cada teste
  timeout: 30 * 1000,
  
  // Tentativas em caso de falha
  retries: process.env.CI ? 2 : 0,
  
  // Workers paralelos
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: [
    ['html'],
    ['list']
  ],
  
  use: {
    // Base URL do frontend
    baseURL: 'http://localhost:5173',
    
    // Trace apenas em falhas
    trace: 'on-first-retry',
    
    // Screenshot apenas em falhas
    screenshot: 'only-on-failure',
    
    // Video apenas em falhas
    video: 'retain-on-failure',
  },

  // Configuração de projetos (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Web Server (frontend dev server)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
