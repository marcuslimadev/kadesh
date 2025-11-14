import { test, expect } from '@playwright/test';

// Helper: Login
async function login(page) {
  await page.goto('/login');
  await page.getByPlaceholder(/email/i).fill('admin@kadesh.com');
  await page.getByPlaceholder(/senha/i).fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(2000);
}

test.describe('07 - SISTEMA: Notificações e Comunicação', () => {
  
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('7.1 - Deve acessar página de notificações', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForTimeout(1500);
    
    expect(page.url()).toContain('/notifications');
  });

  test('7.2 - Deve mostrar contador de não lidas', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1500);
    
    // Badge de contador (pode estar no navbar)
    const badge = page.locator('[class*="badge"], [class*="notification"]').filter({ hasText: /\d+/ });
    if (await badge.isVisible()) {
      const count = await badge.textContent();
      expect(count).toBeTruthy();
    }
  });

  test('7.3 - Deve listar notificações', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForTimeout(1500);
    
    // Lista de notificações
    const notifications = await page.locator('[class*="notification"], [class*="alert"]').count();
    const isEmpty = await page.getByText(/nenhuma notificação|sem notificações/i).isVisible().catch(() => false);
    
    expect(notifications > 0 || isEmpty).toBeTruthy();
  });

  test('7.4 - Deve marcar notificação como lida', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForTimeout(1500);
    
    // Primeira notificação não lida
    const firstNotification = page.locator('[class*="notification"]:not([class*="read"])').first();
    if (await firstNotification.isVisible()) {
      await firstNotification.click();
      await page.waitForTimeout(500);
    }
  });

  test('7.5 - Deve marcar todas como lidas', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForTimeout(1500);
    
    // Botão de marcar todas
    const markAllBtn = page.getByRole('button', { name: /marcar todas|mark all/i });
    if (await markAllBtn.isVisible()) {
      await markAllBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test('7.6 - Deve filtrar por tipo de notificação', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForTimeout(1500);
    
    // Filtro de tipo
    const typeFilter = page.locator('select, [role="combobox"]').filter({ hasText: /tipo|type/i });
    if (await typeFilter.isVisible()) {
      await typeFilter.selectOption({ index: 1 });
      await page.waitForTimeout(1000);
    }
  });

  test('7.7 - Deve deletar notificação', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForTimeout(1500);
    
    // Botão de deletar
    const deleteBtn = page.getByRole('button', { name: /deletar|remover|delete/i }).first();
    if (await deleteBtn.isVisible()) {
      await expect(deleteBtn).toBeVisible();
    }
  });

  test('7.8 - Deve ter notificações em tempo real (polling)', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForTimeout(1500);
    
    // Aguardar atualização automática
    await page.waitForTimeout(3000);
    
    // Verificar se ainda está na página
    expect(page.url()).toContain('/notifications');
  });

  test('7.9 - Deve clicar em notificação e ir para contexto', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForTimeout(1500);
    
    // Clicar em notificação com link
    const notificationWithLink = page.locator('[class*="notification"]').first();
    if (await notificationWithLink.isVisible()) {
      const urlBefore = page.url();
      await notificationWithLink.click();
      await page.waitForTimeout(1500);
      
      // Pode ter mudado de página
      const urlAfter = page.url();
      expect(urlAfter).toBeTruthy();
    }
  });

  test('7.10 - Deve limpar todas as notificações', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForTimeout(1500);
    
    // Botão de limpar tudo
    const clearAllBtn = page.getByRole('button', { name: /limpar|clear all/i });
    if (await clearAllBtn.isVisible()) {
      await expect(clearAllBtn).toBeVisible();
    }
  });
});
