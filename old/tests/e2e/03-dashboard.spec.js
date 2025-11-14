import { test, expect } from '@playwright/test';

test.describe('Dashboard - Área do Usuário', () => {
  test.beforeEach(async ({ page }) => {
    // Fazer login antes de cada teste
    await page.goto('/login');
    await page.getByPlaceholder(/Email/i).fill('admin@kadesh.com');
    await page.getByPlaceholder(/Senha/i).fill('admin123');
    await page.getByRole('button', { name: /Entrar/i }).click();
    await page.waitForTimeout(2000);
  });

  test('deve acessar dashboard após login', async ({ page }) => {
    // Verificar se está no dashboard (URL pode variar)
    const url = page.url();
    expect(url.includes('/dashboard') || url.includes('/admin')).toBeTruthy();
  });

  test('deve mostrar estatísticas do usuário', async ({ page }) => {
    // Ir para dashboard de usuário normal (se admin, navegar)
    if (page.url().includes('/admin')) {
      await page.goto('/dashboard');
      await page.waitForTimeout(1000);
    }
    
    // Verificar cards de estatísticas (projetos ativos, propostas, etc)
    const hasStats = await page.locator('.card, [class*="stat"], [class*="Card"]').count();
    expect(hasStats).toBeGreaterThan(0);
  });

  test('deve acessar lista de leilões', async ({ page }) => {
    await page.goto('/auctions');
    
    await expect(page.getByRole('heading', { name: /Leilões|Marketplace/i })).toBeVisible();
  });

  test('deve acessar minhas propostas', async ({ page }) => {
    await page.goto('/my-bids');
    
    // Verificar se página carregou
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/my-bids');
  });

  test('deve acessar meus projetos', async ({ page }) => {
    await page.goto('/my-projects');
    
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/my-projects');
  });

  test('deve acessar carteira', async ({ page }) => {
    await page.goto('/wallet');
    
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/wallet');
  });

  test('deve acessar notificações', async ({ page }) => {
    await page.goto('/notifications');
    
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/notifications');
  });

  test('deve acessar criar projeto', async ({ page }) => {
    await page.goto('/create-project');
    
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/create-project');
  });
});
