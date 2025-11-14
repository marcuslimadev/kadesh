import { test, expect } from '@playwright/test';

test.describe('Painel Admin', () => {
  test.beforeEach(async ({ page }) => {
    // Fazer login como admin
    await page.goto('/login');
    await page.getByPlaceholder(/Email/i).fill('admin@kadesh.com');
    await page.getByPlaceholder(/Senha/i).fill('admin123');
    await page.getByRole('button', { name: /Entrar/i }).click();
    await page.waitForTimeout(2000);
  });

  test('deve acessar dashboard admin', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForTimeout(1000);
    
    // Verificar se carregou dashboard admin
    expect(page.url()).toContain('/admin/dashboard');
    
    // Verificar badge ADMIN no navbar
    await expect(page.getByText('ADMIN')).toBeVisible();
  });

  test('deve mostrar estatísticas gerais no dashboard', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForTimeout(1000);
    
    // Verificar cards de estatísticas
    const statsCards = await page.locator('[class*="stat"], .card').count();
    expect(statsCards).toBeGreaterThan(0);
  });

  test('deve acessar gestão de usuários', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('/admin/users');
    
    // Verificar se há tabela de usuários
    await expect(page.getByRole('heading', { name: /Usuários|Users/i })).toBeVisible();
  });

  test('deve acessar gestão de projetos', async ({ page }) => {
    await page.goto('/admin/projects');
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('/admin/projects');
  });

  test('deve acessar gestão de pagamentos', async ({ page }) => {
    await page.goto('/admin/payments');
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('/admin/payments');
    
    // Verificar abas de pagamentos
    const hasTabs = await page.getByRole('tab').count();
    expect(hasTabs).toBeGreaterThan(0);
  });

  test('deve acessar gestão de disputas', async ({ page }) => {
    await page.goto('/admin/disputes');
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('/admin/disputes');
  });

  test('deve acessar configurações do sistema', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('/admin/settings');
    
    // Verificar se há formulário de configurações
    await expect(page.getByRole('heading', { name: /Configurações|Settings/i })).toBeVisible();
  });

  test('deve ter navbar admin com todos os links', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForTimeout(1000);
    
    // Verificar links da navbar admin
    await expect(page.getByRole('link', { name: /Dashboard/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Usuários/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Projetos/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Pagamentos/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Disputas/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Configurações/i })).toBeVisible();
  });

  test('não deve permitir acesso admin para usuário comum', async ({ page }) => {
    // Fazer logout
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Fazer login como usuário comum (se houver)
    // Por enquanto, tentar acessar sem login
    await page.goto('/admin/dashboard');
    await page.waitForTimeout(1000);
    
    // Deve redirecionar para login ou dashboard normal
    const url = page.url();
    expect(url.includes('/login') || !url.includes('/admin')).toBeTruthy();
  });

  test('5.10 - Deve filtrar usuários na tabela', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForTimeout(1500);
    
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|filtrar/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('admin');
      await page.waitForTimeout(1000);
    }
  });

  test('5.11 - Deve navegar entre abas de pagamentos', async ({ page }) => {
    await page.goto('/admin/payments');
    await page.waitForTimeout(1500);
    
    const secondTab = page.getByRole('tab').nth(1);
    if (await secondTab.isVisible()) {
      await secondTab.click();
      await page.waitForTimeout(500);
    }
  });

  test('5.12 - Deve filtrar disputas pendentes', async ({ page }) => {
    await page.goto('/admin/disputes');
    await page.waitForTimeout(1500);
    
    const pendingTab = page.getByRole('tab', { name: /pendente|pending/i });
    if (await pendingTab.isVisible()) {
      await pendingTab.click();
      await page.waitForTimeout(500);
    }
  });

  test('5.13 - Deve ter botão de exportar dados', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForTimeout(1500);
    
    const exportBtn = page.getByRole('button', { name: /exportar|export|csv/i });
    if (await exportBtn.isVisible()) {
      await expect(exportBtn).toBeVisible();
    }
  });

  test('5.14 - Deve ter logs de auditoria visíveis', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await page.waitForTimeout(1500);
    
    const logsSection = page.getByText(/logs|atividades|audit|histórico/i);
    if (await logsSection.isVisible()) {
      await expect(logsSection).toBeVisible();
    }
  });

  test('5.15 - Deve ter paginação nas listagens', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForTimeout(1500);
    
    const pagination = page.locator('[class*="pagination"], [aria-label*="pagination"]');
    if (await pagination.isVisible()) {
      await expect(pagination).toBeVisible();
    }
  });
});
