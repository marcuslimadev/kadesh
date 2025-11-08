import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração do Playwright para testes E2E do Kadesh
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Configuração de timeout */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
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
    /* URL base da aplicação */
    baseURL: 'http://localhost/kadesh',
    
    /* Coleta trace em caso de retry após falha */
    trace: 'on-first-retry',
    
    /* Screenshot apenas em falhas */
    screenshot: 'only-on-failure',
    
    /* Vídeo apenas em falhas */
    video: 'retain-on-failure',
    
    /* Timeout para navegação */
    navigationTimeout: 10000,
    
    /* Timeout para ações */
    actionTimeout: 5000,
  },

  /* Configuração para diferentes browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Testes Mobile */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Servidor de desenvolvimento - não usado pois o XAMPP já está rodando */
  // webServer: {
  //   command: 'php -S localhost:8000 -t public',
  //   url: 'http://localhost:8000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
