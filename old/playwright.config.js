import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E do Kadesh
 * @see https://playwright.dev/docs/test-configuration
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173'

export default defineConfig({
  testDir: './tests/e2e',
  
  /* Configuração de timeout */
  timeout: 60 * 1000,
  expect: {
    timeout: 10000
  },
  
  /* Executa testes em paralelo */
  fullyParallel: true,
  
  /* Falha no CI se você deixou test.only no código */
  forbidOnly: !!process.env.CI,
  
  /* Retry em caso de falha no CI */
  retries: process.env.CI ? 2 : 0,
  
  /* Número de workers paralelos */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter HTML para visualizar resultados */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  
  /* Configuração global para todos os testes */
  use: {
    /* URL base da aplicação - permite override via PLAYWRIGHT_BASE_URL */
    baseURL,
    
    /* Coleta trace em caso de retry após falha */
    trace: 'on-first-retry',
    
    /* Screenshot apenas em falhas */
    screenshot: 'only-on-failure',
    
    /* Vídeo apenas em falhas */
    video: 'retain-on-failure',
    
    /* Timeout para navegação */
    navigationTimeout: 30000,
    
    /* Timeout para ações */
    actionTimeout: 15000,
  },

  /* Configuração para diferentes browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Inicia servidor Vite automaticamente */
  webServer: {
    command: 'npm run dev -- --port 5173',
    url: 'http://localhost:5173/',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
