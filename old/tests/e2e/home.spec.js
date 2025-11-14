import { test, expect } from '@playwright/test';

test.describe('Kadesh - Home Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navega para a home page antes de cada teste
    await page.goto('/');
  });

  test('deve carregar a home page corretamente', async ({ page }) => {
    // Verifica se o título está correto
    await expect(page).toHaveTitle(/Kadesh/);
    
    // Verifica se o loader desaparece
    await page.waitForSelector('#pageLoader', { state: 'hidden', timeout: 5000 });
    
    // Verifica se o conteúdo principal está visível
    await expect(page.locator('#app')).toBeVisible();
  });

  test('deve exibir o hero section com título', async ({ page }) => {
    // Aguarda o carregamento do conteúdo
    await page.waitForSelector('.hero', { timeout: 10000 });
    
    // Verifica se o título principal está presente
    const heroTitle = page.locator('.hero .title');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('Kadesh');
  });

  test('deve exibir cards de estatísticas', async ({ page }) => {
    // Aguarda os cards de estatísticas
    await page.waitForSelector('.stats-cards', { timeout: 10000 });
    
    // Verifica se há pelo menos 3 cards de estatísticas
    const statsCards = page.locator('.stats-cards .card');
    await expect(statsCards).toHaveCount(3);
  });

  test('deve exibir projetos em destaque', async ({ page }) => {
    // Aguarda a seção de projetos
    await page.waitForSelector('.featured-projects', { timeout: 10000 });
    
    // Verifica se há projetos sendo exibidos
    const projectCards = page.locator('.featured-projects .project-card');
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('deve ter menu de navegação funcional', async ({ page }) => {
    // Verifica se o menu existe
    const navbar = page.locator('.navbar');
    await expect(navbar).toBeVisible();
    
    // Verifica se os links principais existem
    await expect(page.locator('a[href="#home"]')).toBeVisible();
    await expect(page.locator('a[href="#dashboard"]')).toBeVisible();
    await expect(page.locator('a[href="#projects"]')).toBeVisible();
  });

  test('deve navegar para a página de login', async ({ page }) => {
    // Clica no link de login
    await page.click('a[href="#login"]');
    
    // Aguarda a navegação
    await page.waitForURL(/.*#login/);
    
    // Verifica se o formulário de login está presente
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('deve navegar para a página de registro', async ({ page }) => {
    // Clica no link de registro
    await page.click('a[href="#register"]');
    
    // Aguarda a navegação
    await page.waitForURL(/.*#register/);
    
    // Verifica se o formulário de registro está presente
    await expect(page.locator('form')).toBeVisible();
  });

  test('deve ser responsivo em dispositivos móveis', async ({ page, viewport }) => {
    // Define viewport mobile se não estiver em projeto mobile
    if (viewport && viewport.width > 768) {
      await page.setViewportSize({ width: 375, height: 667 });
    }
    
    // Verifica se o menu hamburger está visível em mobile
    const burgerButton = page.locator('.navbar-burger');
    if (await burgerButton.isVisible()) {
      await expect(burgerButton).toBeVisible();
      
      // Clica no burger menu
      await burgerButton.click();
      
      // Verifica se o menu mobile abre
      const navbarMenu = page.locator('.navbar-menu');
      await expect(navbarMenu).toHaveClass(/is-active/);
    }
  });

  test('deve fazer requisição para API e receber dados', async ({ page }) => {
    // Intercepta requisições para a API
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/api/projects') && response.status() === 200
    );
    
    // Aguarda a resposta
    const response = await responsePromise;
    const data = await response.json();
    
    // Verifica se recebeu dados
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('deve carregar todos os assets (CSS, JS)', async ({ page }) => {
    // Monitora erros de rede
    const failedRequests = [];
    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });
    
    // Aguarda carregamento completo
    await page.waitForLoadState('networkidle');
    
    // Verifica se não houve falhas críticas
    const criticalFailures = failedRequests.filter(url => 
      url.includes('.css') || url.includes('.js') || url.includes('/api/')
    );
    
    expect(criticalFailures.length).toBe(0);
  });
});
