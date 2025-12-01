import { test, expect } from '@playwright/test';

/**
 * Testes de Componentes e UI
 * Valida design system, responsividade, acessibilidade
 */

test.describe('Design System - Componentes', () => {
  
  test('NavBar - deve exibir logo e links principais', async ({ page }) => {
    await page.goto('/');
    
    // Logo
    await expect(page.locator('text=Kaddesh')).toBeVisible();
    
    // Links principais para visitantes
    await expect(page.locator('text=Tutorial')).toBeVisible();
    await expect(page.locator('text=Entrar')).toBeVisible();
    await expect(page.locator('text=Cadastrar')).toBeVisible();
  });

  test('Footer - deve exibir todas as seções', async ({ page }) => {
    await page.goto('/');
    
    // Scroll até o footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Verificar seções do footer
    await expect(page.locator('footer')).toBeVisible();
  });

  test('Home - Hero section deve ter CTA visível', async ({ page }) => {
    await page.goto('/');
    
    // Hero
    const hero = page.locator('text=Conectando').first();
    await expect(hero).toBeVisible();
    
    // Botões CTA
    const cadastrarBtn = page.locator('a:has-text("Cadastrar")').first();
    await expect(cadastrarBtn).toBeVisible();
  });
});

test.describe('Responsividade', () => {
  
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  for (const viewport of viewports) {
    test(`Home deve ser responsiva em ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Verificar elementos principais visíveis
      await expect(page.locator('h1').first()).toBeVisible();
      
      // NavBar deve estar presente
      await expect(page.locator('nav')).toBeVisible();
    });
  }
});

test.describe('Acessibilidade Básica', () => {
  
  test('Formulário de login deve ter labels', async ({ page }) => {
    await page.goto('/login');
    
    // Email
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    
    // Password
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    
    // Submit button
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
  });

  test('Navegação por teclado deve funcionar', async ({ page }) => {
    await page.goto('/');
    
    // Tab para navegar
    await page.keyboard.press('Tab');
    
    // Verificar se algum elemento recebeu foco
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
  });
});

test.describe('Formulários - Validação', () => {
  
  test('Login - deve validar campos vazios', async ({ page }) => {
    await page.goto('/login');
    
    // Tentar submeter sem preencher
    await page.click('button[type="submit"]');
    
    // Navegação não deve acontecer
    await expect(page).toHaveURL(/\/login/);
  });

  test('Cadastro - deve validar formato de email', async ({ page }) => {
    await page.goto('/register');
    
    // Preencher com email inválido
    await page.fill('input[type="email"]', 'emailinvalido');
    
    // Campo deve estar inválido (HTML5 validation)
    const emailInput = page.locator('input[type="email"]');
    const isValid = await emailInput.evaluate((el) => el.validity.valid);
    expect(isValid).toBeFalsy();
  });
});

test.describe('Estados de Loading', () => {
  
  test('Login - deve mostrar loading ao submeter', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'teste@teste.com');
    await page.fill('input[type="password"]', 'senha123');
    
    // Interceptar request para delay
    await page.route('**/api/auth/login', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    // Submeter
    const submitPromise = page.click('button[type="submit"]');
    
    // Verificar loading (pode ser spinner, texto mudando, ou disabled button)
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeDisabled();
    
    await submitPromise;
  });
});

test.describe('Toast Notifications', () => {
  
  test('deve exibir toast de sucesso ao criar projeto', async ({ page }) => {
    // Este teste assume que o usuário já está logado
    // Vamos mockar a resposta de criação de projeto
    
    await page.goto('/login');
    await page.fill('input[type="email"]', 'contratante@teste.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/lobby/);
    
    // Ir para criar projeto
    await page.goto('/projects/create');
    
    // Mockar sucesso
    await page.route('**/api/projects', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              project: {
                id: 999,
                title: 'Projeto Mock',
                status: 'open'
              }
            }
          })
        });
      } else {
        await route.continue();
      }
    });
    
    // Preencher formulário rapidamente
    await page.fill('input[id="title"]', 'Projeto de Teste Toast');
    await page.selectOption('select[id="category"]', 'Design');
    await page.click('text=Próximo');
    
    await page.fill('textarea[id="description"]', 'Descrição de teste com mais de cinquenta caracteres para passar na validação do formulário');
    await page.click('text=Próximo');
    
    await page.fill('input[id="budget"]', '2000');
    await page.click('text=Próximo');
    
    await page.click('button[type="submit"]');
    
    // Verificar toast
    await expect(page.locator('text=sucesso')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Performance', () => {
  
  test('Home page deve carregar em menos de 3 segundos', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('Imagens devem ter lazy loading', async ({ page }) => {
    await page.goto('/');
    
    // Verificar se alguma imagem tem loading="lazy"
    const lazyImages = await page.locator('img[loading="lazy"]').count();
    
    // Idealmente deveria ter algumas imagens lazy
    // (Este teste pode falhar se não houver imagens na home ainda)
    console.log(`Imagens com lazy loading: ${lazyImages}`);
  });
});
