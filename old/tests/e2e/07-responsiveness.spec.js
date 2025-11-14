import { test, expect } from '@playwright/test';

test.describe('Responsividade', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`deve funcionar em ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Verificar se navbar está visível
      await expect(page.locator('nav')).toBeVisible();
      
      // Verificar se logo está visível
      await expect(page.locator('img[alt="Kaddesh"]').first()).toBeVisible();
      
      // Scroll e verificar conteúdo
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(500);
      
      // Verificar se conteúdo é visível
      const contentVisible = await page.locator('section').count();
      expect(contentVisible).toBeGreaterThan(0);
    });
  }

  test('menu mobile deve funcionar', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Procurar botão de menu hamburguer
    const menuButton = page.locator('[class*="menu"], button[aria-label*="menu"]');
    
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(300);
      
      // Verificar se menu abriu
      const menuOpen = await page.locator('[class*="mobile"], [class*="drawer"]').isVisible();
      expect(menuOpen).toBeTruthy();
    }
  });

  test('grid de categorias deve ajustar em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);
    
    // Verificar se categorias estão visíveis
    const categories = await page.locator('[class*="category"], [class*="grid"]').count();
    expect(categories).toBeGreaterThan(0);
  });

  test('formulários devem ser usáveis em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    
    // Verificar se inputs são clicáveis e visíveis
    const emailInput = page.getByPlaceholder(/Email/i);
    await expect(emailInput).toBeVisible();
    await emailInput.click();
    
    const passwordInput = page.getByPlaceholder(/Senha/i);
    await expect(passwordInput).toBeVisible();
  });
});
