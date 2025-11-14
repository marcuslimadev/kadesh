import { test, expect } from '@playwright/test';

test.describe('02 - AUTENTICAÇÃO: Login, Registro e Sessão', () => {
  
  test('2.1 - Deve carregar página de login', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByRole('heading', { name: /login|entrar/i })).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/senha/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
  });

  test('2.2 - Deve carregar página de registro', async ({ page }) => {
    await page.goto('/register');
    
    await expect(page.getByRole('heading', { name: /cadastr|registr/i })).toBeVisible();
    await expect(page.getByPlaceholder(/nome/i)).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
  });

  test('2.3 - Deve validar campos obrigatórios no login', async ({ page }) => {
    await page.goto('/login');
    
    // Clicar sem preencher
    await page.getByRole('button', { name: /entrar/i }).click();
    
    // Validação HTML5
    const emailInput = page.getByPlaceholder(/email/i);
    const isValid = await emailInput.evaluate(el => el.validity.valid);
    expect(isValid).toBeFalsy();
  });

  test('2.4 - Deve fazer login como admin', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByPlaceholder(/email/i).fill('admin@kadesh.com');
    await page.getByPlaceholder(/senha/i).fill('admin123');
    
    // Marcar lembrar-me se existir
    const remember = page.locator('input[type="checkbox"]');
    if (await remember.isVisible()) {
      await remember.check();
    }
    
    await page.getByRole('button', { name: /entrar/i }).click();
    
    // Aguardar redirect
    await page.waitForTimeout(2000);
    
    // Verificar se saiu do /login
    expect(page.url()).not.toContain('/login');
  });

  test('2.5 - Deve persistir sessão após reload', async ({ page, context }) => {
    // Login
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('admin@kadesh.com');
    await page.getByPlaceholder(/senha/i).fill('admin123');
    
    const remember = page.locator('input[type="checkbox"]');
    if (await remember.isVisible()) {
      await remember.check();
    }
    
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForTimeout(2000);
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Não deve voltar para login
    expect(page.url()).not.toContain('/login');
  });

  test('2.6 - Deve fazer logout', async ({ page }) => {
    // Login primeiro
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('admin@kadesh.com');
    await page.getByPlaceholder(/senha/i).fill('admin123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForTimeout(2000);
    
    // Procurar botão de logout
    const logoutBtn = page.getByRole('button', { name: /sair|logout/i });
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForTimeout(1000);
      
      // Deve ir para home ou login
      const url = page.url();
      expect(url.endsWith('/') || url.includes('/login')).toBeTruthy();
    }
  });

  test('2.7 - Deve navegar entre login e registro', async ({ page }) => {
    await page.goto('/login');
    
    // Link para registro (o link tem texto "Registre-se")
    const registerLink = page.getByRole('link', { name: /cadastr|criar conta|registr/i });
    await registerLink.click();
    
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/register');
    
    // Voltar para login
    const loginLink = page.getByRole('link', { name: /entrar|login|já tem conta/i });
    await loginLink.click();
    
    await page.waitForTimeout(500);
    expect(page.url()).toContain('/login');
  });

  test('2.8 - Deve rejeitar credenciais inválidas', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByPlaceholder(/email/i).fill('invalido@test.com');
    await page.getByPlaceholder(/senha/i).fill('senhaerrada');
    
    page.once('dialog', async dialog => {
      expect(dialog.message()).toMatch(/incorret|inválid|erro/i);
      await dialog.accept();
    });
    
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForTimeout(1500);
  });

  test('2.9 - Deve proteger rota /dashboard sem login', async ({ page }) => {
    // Limpar sessão
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Tentar acessar dashboard
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    
    // Deve redirecionar
    expect(page.url()).toContain('/login');
  });

  test('2.10 - Deve proteger rota /admin sem ser admin', async ({ page }) => {
    // Limpar sessão
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Tentar acessar admin
    await page.goto('/admin/dashboard');
    await page.waitForTimeout(1000);
    
    // Deve redirecionar ou bloquear
    const url = page.url();
    expect(url.includes('/login') || !url.includes('/admin')).toBeTruthy();
  });
});
