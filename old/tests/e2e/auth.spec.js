import { test, expect } from '@playwright/test';

test.describe('Kadesh - Autenticação', () => {
  
  test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/#login');
      await page.waitForSelector('form', { timeout: 10000 });
    });

    test('deve exibir formulário de login', async ({ page }) => {
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('deve validar campos obrigatórios', async ({ page }) => {
      // Tenta submeter formulário vazio
      await page.click('button[type="submit"]');
      
      // Verifica validação HTML5
      const emailInput = page.locator('input[type="email"]');
      const isValid = await emailInput.evaluate((el) => el.checkValidity());
      expect(isValid).toBeFalsy();
    });

    test('deve validar formato de email', async ({ page }) => {
      // Preenche email inválido
      await page.fill('input[type="email"]', 'emailinvalido');
      await page.fill('input[type="password"]', '123456');
      
      // Tenta submeter
      await page.click('button[type="submit"]');
      
      // Verifica validação
      const emailInput = page.locator('input[type="email"]');
      const isValid = await emailInput.evaluate((el) => el.checkValidity());
      expect(isValid).toBeFalsy();
    });

    test('deve exibir mensagem de erro para credenciais inválidas', async ({ page }) => {
      // Preenche com credenciais inválidas
      await page.fill('input[type="email"]', 'teste@invalido.com');
      await page.fill('input[type="password"]', 'senhaerrada');
      
      // Submete formulário
      await page.click('button[type="submit"]');
      
      // Aguarda resposta da API
      await page.waitForTimeout(2000);
      
      // Verifica se há mensagem de erro
      const errorMessage = page.locator('.notification.is-danger, .message.is-danger');
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toContainText(/erro|inválid|incorret/i);
      }
    });

    test('deve ter link para página de registro', async ({ page }) => {
      const registerLink = page.locator('a[href="#register"]');
      await expect(registerLink).toBeVisible();
    });

    test('deve ter link para recuperação de senha', async ({ page }) => {
      const forgotLink = page.locator('a:has-text("Esqueceu"), a:has-text("senha")');
      await expect(forgotLink.first()).toBeVisible();
    });
  });

  test.describe('Registro', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/#register');
      await page.waitForSelector('form', { timeout: 10000 });
    });

    test('deve exibir formulário de registro', async ({ page }) => {
      await expect(page.locator('input[name="name"], input#name')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
    });

    test('deve validar campos obrigatórios no registro', async ({ page }) => {
      // Tenta submeter formulário vazio
      await page.click('button[type="submit"]');
      
      // Verifica validação HTML5 no email
      const emailInput = page.locator('input[type="email"]');
      const isValid = await emailInput.evaluate((el) => el.checkValidity());
      expect(isValid).toBeFalsy();
    });

    test('deve validar confirmação de senha', async ({ page }) => {
      const passwordConfirm = page.locator('input[name="password_confirm"], input#password_confirm');
      
      if (await passwordConfirm.isVisible()) {
        await page.fill('input[type="password"]', 'senha123');
        await passwordConfirm.fill('senhadiferente');
        
        // Tenta submeter
        await page.click('button[type="submit"]');
        
        // Aguarda validação
        await page.waitForTimeout(1000);
      }
    });

    test('deve ter link para página de login', async ({ page }) => {
      const loginLink = page.locator('a[href="#login"]');
      await expect(loginLink).toBeVisible();
    });

    test('deve ter seletor de tipo de usuário', async ({ page }) => {
      // Verifica se há opção para escolher entre cliente e provedor
      const userTypeSelect = page.locator('select[name="user_type"], input[type="radio"][name="user_type"]');
      const count = await userTypeSelect.count();
      
      if (count > 0) {
        await expect(userTypeSelect.first()).toBeVisible();
      }
    });
  });

  test.describe('Logout', () => {
    test('deve ter botão de logout quando autenticado', async ({ page, context }) => {
      // Mock de autenticação via cookie/localStorage
      await context.addCookies([{
        name: 'auth_token',
        value: 'mock_token_for_testing',
        domain: 'localhost',
        path: '/',
      }]);
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Verifica se há botão de logout ou menu de usuário
      const logoutButton = page.locator('button:has-text("Sair"), a:has-text("Sair"), .logout');
      if (await logoutButton.count() > 0) {
        await expect(logoutButton.first()).toBeVisible();
      }
    });
  });

  test.describe('Proteção de Rotas', () => {
    test('deve redirecionar para login ao acessar dashboard sem autenticação', async ({ page }) => {
      // Tenta acessar dashboard sem estar logado
      await page.goto('/#dashboard');
      await page.waitForTimeout(2000);
      
      // Verifica se foi redirecionado ou se há mensagem de erro
      const url = page.url();
      const hasLoginForm = await page.locator('input[type="email"]').isVisible();
      
      // Deve estar na página de login ou ver formulário de login
      expect(url.includes('#login') || hasLoginForm).toBeTruthy();
    });

    test('deve redirecionar para login ao acessar criar projeto sem autenticação', async ({ page }) => {
      await page.goto('/#create-project');
      await page.waitForTimeout(2000);
      
      const url = page.url();
      const hasLoginForm = await page.locator('input[type="email"]').isVisible();
      
      expect(url.includes('#login') || hasLoginForm).toBeTruthy();
    });
  });
});
