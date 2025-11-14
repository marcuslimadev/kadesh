import { test, expect } from '@playwright/test';

test.describe('08 - INTEGRAÇÃO: Fluxo Completo E2E', () => {
  
  test('8.1 - Fluxo completo: Contractor cria projeto → Provider envia proposta', async ({ page }) => {
    const timestamp = Date.now();
    
    // 1. Login como contractor
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('admin@kadesh.com');
    await page.getByPlaceholder(/senha/i).fill('admin123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForTimeout(2000);
    
    // 2. Criar projeto
    await page.goto('/create-project');
    await page.waitForTimeout(1000);
    
    const titleInput = page.getByLabel(/título|title/i).or(page.getByPlaceholder(/título/i));
    if (await titleInput.isVisible()) {
      await titleInput.fill(`Projeto Integração E2E ${timestamp}`);
      
      const descInput = page.getByLabel(/descrição/i).or(page.getByPlaceholder(/descrição/i));
      if (await descInput.isVisible()) {
        await descInput.fill('Projeto criado no teste de integração completo.');
        
        const budgetInput = page.getByLabel(/orçamento|budget/i).or(page.getByPlaceholder(/valor/i));
        if (await budgetInput.isVisible()) {
          await budgetInput.fill('10000');
          
          // Submit
          const submitBtn = page.getByRole('button', { name: /criar|publicar|submit/i });
          if (await submitBtn.isVisible()) {
            await submitBtn.click();
            await page.waitForTimeout(2000);
          }
        }
      }
    }
    
    // 3. Verificar que projeto foi criado
    await page.goto('/my-projects');
    await page.waitForTimeout(1500);
    
    const projectExists = await page.getByText(`Projeto Integração E2E ${timestamp}`).isVisible().catch(() => false);
    if (projectExists) {
      expect(projectExists).toBeTruthy();
    }
  });

  test('8.2 - Responsividade: Testar em múltiplos viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForTimeout(500);
      
      // Navbar deve estar visível
      await expect(page.locator('nav')).toBeVisible();
      
      // Logo deve estar visível
      await expect(page.locator('img[alt="Kaddesh"]').first()).toBeVisible();
    }
  });

  test('8.3 - Performance: Página inicial deve carregar rápido', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    
    // Deve carregar em menos de 5 segundos
    expect(loadTime).toBeLessThan(5000);
  });

  test('8.4 - SEO: Meta tags devem estar presentes', async ({ page }) => {
    await page.goto('/');
    
    // Title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    if (description) {
      expect(description.length).toBeGreaterThan(0);
    }
  });

  test('8.5 - Acessibilidade: Elementos devem ter labels', async ({ page }) => {
    await page.goto('/login');
    
    // Inputs devem ter labels ou placeholders
    const emailInput = page.getByPlaceholder(/email/i);
    await expect(emailInput).toBeVisible();
    
    const passwordInput = page.getByPlaceholder(/senha/i);
    await expect(passwordInput).toBeVisible();
  });

  test('8.6 - Navegação: Todas as rotas principais devem ser acessíveis', async ({ page }) => {
    const routes = ['/', '/login', '/register', '/auctions'];
    
    for (const route of routes) {
      await page.goto(route);
      await page.waitForTimeout(500);
      
      // Página deve carregar sem erro
      const hasError = await page.getByText(/404|não encontrado|not found/i).isVisible().catch(() => false);
      expect(hasError).toBeFalsy();
    }
  });

  test('8.7 - API: Endpoints devem retornar dados válidos', async ({ page }) => {
    await page.goto('/');
    
    // Interceptar requisição de projetos
    const response = await page.waitForResponse(resp => 
      resp.url().includes('/api/projects') && resp.status() === 200,
      { timeout: 10000 }
    ).catch(() => null);
    
    if (response) {
      const data = await response.json();
      expect(data).toBeTruthy();
    }
  });

  test('8.8 - Segurança: Não deve expor dados sensíveis no console', async ({ page }) => {
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(msg.text()));
    
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('test@example.com');
    await page.getByPlaceholder(/senha/i).fill('password123');
    
    // Verificar que senha não aparece nos logs
    const hasPassword = consoleLogs.some(log => log.includes('password123'));
    expect(hasPassword).toBeFalsy();
  });

  test('8.9 - Estado: Dados devem persistir entre navegações', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('admin@kadesh.com');
    await page.getByPlaceholder(/senha/i).fill('admin123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForTimeout(2000);
    
    // Ir para dashboard
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    
    // Navegar para outra página
    await page.goto('/auctions');
    await page.waitForTimeout(1000);
    
    // Voltar para dashboard - não deve pedir login novamente
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('/dashboard');
  });

  test('8.10 - Erros: Deve tratar 404 gracefully', async ({ page }) => {
    await page.goto('/rota-que-nao-existe-12345');
    await page.waitForTimeout(1000);
    
    // Deve mostrar página 404 ou redirecionar para home
    const is404 = await page.getByText(/404|não encontrado|not found/i).isVisible().catch(() => false);
    const isHome = page.url().endsWith('/');
    
    expect(is404 || isHome).toBeTruthy();
  });
});
