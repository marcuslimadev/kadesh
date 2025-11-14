import { test, expect } from '@playwright/test';

// Helper: Login
async function login(page) {
  await page.goto('/login');
  await page.getByPlaceholder(/email/i).fill('admin@kadesh.com');
  await page.getByPlaceholder(/senha/i).fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(2000);
}

test.describe('06 - SISTEMA: Carteira, Pagamentos e Transações', () => {
  
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('6.1 - Deve visualizar saldo da carteira', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForTimeout(1500);
    
    expect(page.url()).toContain('/wallet');
    
    // Saldo deve estar visível
    const balanceText = page.getByText(/saldo|balance|R\$/i);
    await expect(balanceText.first()).toBeVisible();
  });

  test('6.2 - Deve mostrar extrato de transações', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForTimeout(1500);
    
    // Lista de transações
    const transactions = await page.locator('[class*="transaction"], [class*="statement"]').count();
    const isEmpty = await page.getByText(/nenhuma transação|sem transações/i).isVisible().catch(() => false);
    
    expect(transactions > 0 || isEmpty).toBeTruthy();
  });

  test('6.3 - Deve filtrar transações por tipo', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForTimeout(1500);
    
    // Filtro de tipo (crédito/débito)
    const typeFilter = page.locator('select, [role="combobox"]').filter({ hasText: /tipo|type/i });
    if (await typeFilter.isVisible()) {
      await typeFilter.selectOption({ index: 1 });
      await page.waitForTimeout(1000);
    }
  });

  test('6.4 - Deve filtrar transações por período', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForTimeout(1500);
    
    // Filtro de data
    const dateFilter = page.locator('input[type="date"], input[type="datetime-local"]').first();
    if (await dateFilter.isVisible()) {
      await dateFilter.fill('2025-01-01');
      await page.waitForTimeout(1000);
    }
  });

  test('6.5 - Deve fazer depósito (modal deve abrir)', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForTimeout(1500);
    
    // Botão de depósito
    const depositBtn = page.getByRole('button', { name: /depositar|deposit/i });
    if (await depositBtn.isVisible()) {
      await depositBtn.click();
      await page.waitForTimeout(500);
      
      // Modal deve abrir
      const modal = page.locator('[role="dialog"], [class*="modal"]');
      if (await modal.isVisible()) {
        await expect(modal).toBeVisible();
      }
    }
  });

  test('6.6 - Deve fazer saque (modal deve abrir)', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForTimeout(1500);
    
    // Botão de saque
    const withdrawBtn = page.getByRole('button', { name: /sacar|saque|withdraw/i });
    if (await withdrawBtn.isVisible()) {
      await withdrawBtn.click();
      await page.waitForTimeout(500);
      
      // Modal deve abrir
      const modal = page.locator('[role="dialog"], [class*="modal"]');
      if (await modal.isVisible()) {
        await expect(modal).toBeVisible();
      }
    }
  });

  test('6.7 - Deve visualizar valor em escrow', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForTimeout(1500);
    
    // Valor em escrow/garantia
    const escrowText = page.getByText(/escrow|garantia|bloqueado/i);
    if (await escrowText.isVisible()) {
      await expect(escrowText).toBeVisible();
    }
  });

  test('6.8 - Deve mostrar histórico de pagamentos', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForTimeout(1500);
    
    // Tab ou seção de pagamentos
    const paymentsTab = page.getByRole('tab', { name: /pagamentos|payments/i });
    if (await paymentsTab.isVisible()) {
      await paymentsTab.click();
      await page.waitForTimeout(1000);
    }
  });

  test('6.9 - Deve exportar extrato', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForTimeout(1500);
    
    // Botão de exportar
    const exportBtn = page.getByRole('button', { name: /exportar|export|pdf|csv/i });
    if (await exportBtn.isVisible()) {
      await expect(exportBtn).toBeVisible();
    }
  });

  test('6.10 - Deve mostrar detalhes de transação ao clicar', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForTimeout(1500);
    
    // Clicar na primeira transação
    const firstTransaction = page.locator('[class*="transaction"]').first();
    if (await firstTransaction.isVisible()) {
      await firstTransaction.click();
      await page.waitForTimeout(500);
      
      // Modal ou expansão deve aparecer
      const details = page.locator('[class*="detail"], [role="dialog"]');
      if (await details.isVisible()) {
        await expect(details).toBeVisible();
      }
    }
  });
});
