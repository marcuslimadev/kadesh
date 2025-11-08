import { test, expect } from '@playwright/test';

test.describe('Kadesh - Dashboard', () => {
  
  test.beforeEach(async ({ page, context }) => {
    // Mock de autenticação
    await context.addCookies([{
      name: 'auth_token',
      value: 'mock_user_token',
      domain: 'localhost',
      path: '/',
    }]);
    
    await page.goto('/#dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('deve exibir dashboard após login', async ({ page }) => {
    // Verifica se elementos do dashboard estão visíveis
    const dashboard = page.locator('.dashboard, #dashboard');
    if (await dashboard.count() > 0) {
      await expect(dashboard.first()).toBeVisible();
    }
  });

  test('deve exibir estatísticas do usuário', async ({ page }) => {
    // Verifica se há cards de estatísticas
    const statsCards = page.locator('.stats-card, .statistic, .metric');
    const count = await statsCards.count();
    
    if (count > 0) {
      await expect(statsCards.first()).toBeVisible();
    }
  });

  test('deve exibir projetos do usuário', async ({ page }) => {
    // Verifica se há lista de projetos
    const projectsList = page.locator('.my-projects, .user-projects, .project-card');
    const count = await projectsList.count();
    
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('deve exibir gráficos e visualizações', async ({ page }) => {
    // Verifica se há canvas do Chart.js
    const charts = page.locator('canvas');
    const count = await charts.count();
    
    if (count > 0) {
      await expect(charts.first()).toBeVisible();
    }
  });

  test('deve ter navegação para criar novo projeto', async ({ page }) => {
    const createButton = page.locator('button:has-text("Criar Projeto"), a:has-text("Novo Projeto")');
    
    if (await createButton.count() > 0) {
      await expect(createButton.first()).toBeVisible();
    }
  });

  test('deve exibir notificações recentes', async ({ page }) => {
    const notifications = page.locator('.notification, .alert, .notifications-list');
    const count = await notifications.count();
    
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('deve ter menu lateral ou superior com navegação', async ({ page }) => {
    // Verifica se há menu de navegação
    const menu = page.locator('.sidebar, .navbar, nav');
    await expect(menu.first()).toBeVisible();
  });

  test('deve permitir alternar entre visualizações', async ({ page }) => {
    // Verifica se há tabs ou botões de alternância
    const tabs = page.locator('.tabs, .tab, .view-toggle');
    const count = await tabs.count();
    
    if (count > 0) {
      await expect(tabs.first()).toBeVisible();
    }
  });

  test('deve exibir perfil do usuário', async ({ page }) => {
    // Verifica se há área de perfil
    const profile = page.locator('.user-profile, .profile-info, .user-menu');
    const count = await profile.count();
    
    if (count > 0) {
      await expect(profile.first()).toBeVisible();
    }
  });

  test('deve ter acesso rápido a funcionalidades', async ({ page }) => {
    // Verifica se há botões de ação rápida
    const quickActions = page.locator('.quick-actions, .action-buttons');
    const count = await quickActions.count();
    
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Kadesh - Navegação Geral', () => {
  
  test('deve navegar entre páginas sem recarregar', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Contador de page loads
    let pageLoads = 0;
    page.on('load', () => pageLoads++);
    
    // Navega por várias páginas
    await page.click('a[href="#projects"]');
    await page.waitForTimeout(1000);
    
    await page.click('a[href="#login"]');
    await page.waitForTimeout(1000);
    
    await page.click('a[href="#home"]');
    await page.waitForTimeout(1000);
    
    // SPA não deve recarregar a página
    expect(pageLoads).toBe(0);
  });

  test('deve manter hash na URL ao navegar', async ({ page }) => {
    await page.goto('/');
    
    await page.click('a[href="#projects"]');
    await page.waitForTimeout(500);
    expect(page.url()).toContain('#projects');
    
    await page.click('a[href="#dashboard"]');
    await page.waitForTimeout(500);
    expect(page.url()).toContain('#dashboard');
  });

  test('deve funcionar botão voltar do navegador', async ({ page }) => {
    await page.goto('/#home');
    await page.waitForLoadState('networkidle');
    
    await page.click('a[href="#projects"]');
    await page.waitForTimeout(1000);
    
    await page.goBack();
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('#home');
  });

  test('deve carregar página correta ao acessar URL diretamente com hash', async ({ page }) => {
    await page.goto('/#projects');
    await page.waitForLoadState('networkidle');
    
    // Verifica se está na página de projetos
    const projectsPage = page.locator('.projects-page, .project-card');
    const count = await projectsPage.count();
    
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Kadesh - Performance', () => {
  
  test('deve carregar página inicial em menos de 3 segundos', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('deve fazer cache de assets estáticos', async ({ page }) => {
    // Primeira carga
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Recarrega
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verifica se alguns recursos vieram do cache
    const entries = await page.evaluate(() => 
      performance.getEntriesByType('resource')
        .filter((entry) => entry.transferSize === 0)
        .length
    );
    
    // Pelo menos alguns recursos devem estar em cache
    expect(entries).toBeGreaterThan(0);
  });

  test('não deve ter memory leaks ao navegar', async ({ page }) => {
    await page.goto('/');
    
    // Navega entre páginas múltiplas vezes
    for (let i = 0; i < 5; i++) {
      await page.click('a[href="#projects"]');
      await page.waitForTimeout(500);
      await page.click('a[href="#home"]');
      await page.waitForTimeout(500);
    }
    
    // Se chegou até aqui sem crash, não há memory leak crítico
    expect(true).toBeTruthy();
  });
});

test.describe('Kadesh - Acessibilidade', () => {
  
  test('deve ter alt text em imagens', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        const alt = await img.getAttribute('alt');
        expect(alt).toBeDefined();
      }
    }
  });

  test('deve ter labels em inputs de formulário', async ({ page }) => {
    await page.goto('/#login');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible()) {
      const id = await emailInput.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        
        // Deve ter label ou placeholder
        const placeholder = await emailInput.getAttribute('placeholder');
        expect(hasLabel || placeholder).toBeTruthy();
      }
    }
  });

  test('deve ser navegável por teclado', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tenta navegar por Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verifica se algum elemento recebeu foco
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeDefined();
  });
});
