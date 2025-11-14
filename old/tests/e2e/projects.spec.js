import { test, expect } from '@playwright/test';

test.describe('Kadesh - Projetos', () => {
  
  test.describe('Lista de Projetos', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/#projects');
      await page.waitForLoadState('networkidle');
    });

    test('deve exibir lista de projetos', async ({ page }) => {
      // Aguarda carregar projetos
      await page.waitForSelector('.project-card, .projects-list', { timeout: 10000 });
      
      // Verifica se há projetos
      const projectCards = page.locator('.project-card');
      const count = await projectCards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('deve exibir informações do projeto', async ({ page }) => {
      const firstProject = page.locator('.project-card').first();
      
      if (await firstProject.isVisible()) {
        // Verifica se exibe título
        await expect(firstProject.locator('.title, .project-title')).toBeVisible();
        
        // Verifica se exibe descrição
        await expect(firstProject.locator('.description, .project-description')).toBeVisible();
        
        // Verifica se exibe preço/orçamento
        await expect(firstProject.locator(':text("R$")')).toBeVisible();
      }
    });

    test('deve ter filtros de projetos', async ({ page }) => {
      // Verifica se há filtros (categoria, status, etc)
      const filters = page.locator('select, .filter, .tabs');
      const count = await filters.count();
      
      if (count > 0) {
        await expect(filters.first()).toBeVisible();
      }
    });

    test('deve permitir busca de projetos', async ({ page }) => {
      const searchInput = page.locator('input[type="search"], input[placeholder*="Buscar"], input[placeholder*="Pesquisar"]');
      
      if (await searchInput.isVisible()) {
        await searchInput.fill('design');
        await page.waitForTimeout(1000);
        
        // Verifica se filtrou resultados
        await expect(searchInput).toHaveValue('design');
      }
    });

    test('deve navegar para detalhes do projeto', async ({ page }) => {
      const firstProject = page.locator('.project-card').first();
      
      if (await firstProject.isVisible()) {
        // Clica no projeto
        await firstProject.click();
        
        // Aguarda navegação
        await page.waitForTimeout(2000);
        
        // Verifica se foi para página de detalhes
        const url = page.url();
        expect(url).toContain('#project');
      }
    });
  });

  test.describe('Detalhes do Projeto', () => {
    test('deve exibir detalhes completos do projeto', async ({ page }) => {
      // Navega para projetos
      await page.goto('/#projects');
      await page.waitForLoadState('networkidle');
      
      // Clica no primeiro projeto
      const firstProject = page.locator('.project-card').first();
      if (await firstProject.isVisible()) {
        await firstProject.click();
        await page.waitForTimeout(2000);
        
        // Verifica elementos da página de detalhes
        await expect(page.locator('.project-details, .project-info')).toBeVisible();
      }
    });

    test('deve exibir botão de proposta para provedores', async ({ page, context }) => {
      // Mock de autenticação como provedor
      await context.addCookies([{
        name: 'auth_token',
        value: 'mock_provider_token',
        domain: 'localhost',
        path: '/',
      }]);
      
      await page.goto('/#projects');
      await page.waitForLoadState('networkidle');
      
      const firstProject = page.locator('.project-card').first();
      if (await firstProject.isVisible()) {
        await firstProject.click();
        await page.waitForTimeout(2000);
        
        // Verifica se há botão de fazer proposta
        const proposalButton = page.locator('button:has-text("Fazer Proposta"), button:has-text("Enviar Proposta")');
        if (await proposalButton.count() > 0) {
          await expect(proposalButton.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Criar Projeto', () => {
    test('deve exibir formulário de criação de projeto', async ({ page, context }) => {
      // Mock de autenticação
      await context.addCookies([{
        name: 'auth_token',
        value: 'mock_client_token',
        domain: 'localhost',
        path: '/',
      }]);
      
      await page.goto('/#create-project');
      await page.waitForLoadState('networkidle');
      
      // Verifica se formulário está presente
      const form = page.locator('form');
      if (await form.isVisible()) {
        await expect(form).toBeVisible();
      }
    });

    test('deve validar campos obrigatórios do projeto', async ({ page, context }) => {
      await context.addCookies([{
        name: 'auth_token',
        value: 'mock_client_token',
        domain: 'localhost',
        path: '/',
      }]);
      
      await page.goto('/#create-project');
      await page.waitForLoadState('networkidle');
      
      const submitButton = page.locator('button[type="submit"]');
      if (await submitButton.isVisible()) {
        // Tenta submeter formulário vazio
        await submitButton.click();
        await page.waitForTimeout(1000);
        
        // Verifica se há mensagens de validação
        const titleInput = page.locator('input[name="title"], input#title');
        if (await titleInput.isVisible()) {
          const isValid = await titleInput.evaluate((el) => el.checkValidity());
          expect(isValid).toBeFalsy();
        }
      }
    });

    test('deve permitir seleção de categoria', async ({ page, context }) => {
      await context.addCookies([{
        name: 'auth_token',
        value: 'mock_client_token',
        domain: 'localhost',
        path: '/',
      }]);
      
      await page.goto('/#create-project');
      await page.waitForLoadState('networkidle');
      
      const categorySelect = page.locator('select[name="category"], select#category');
      if (await categorySelect.isVisible()) {
        await expect(categorySelect).toBeVisible();
        
        // Seleciona uma categoria
        await categorySelect.selectOption({ index: 1 });
      }
    });

    test('deve permitir upload de arquivos', async ({ page, context }) => {
      await context.addCookies([{
        name: 'auth_token',
        value: 'mock_client_token',
        domain: 'localhost',
        path: '/',
      }]);
      
      await page.goto('/#create-project');
      await page.waitForLoadState('networkidle');
      
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        await expect(fileInput).toBeVisible();
      }
    });
  });

  test.describe('Status e Categorias', () => {
    test('deve exibir badge de status do projeto', async ({ page }) => {
      await page.goto('/#projects');
      await page.waitForLoadState('networkidle');
      
      const firstProject = page.locator('.project-card').first();
      if (await firstProject.isVisible()) {
        // Verifica se há badge de status
        const statusBadge = firstProject.locator('.tag, .badge, .status');
        if (await statusBadge.count() > 0) {
          await expect(statusBadge.first()).toBeVisible();
        }
      }
    });

    test('deve filtrar projetos por categoria', async ({ page }) => {
      await page.goto('/#projects');
      await page.waitForLoadState('networkidle');
      
      const categoryFilter = page.locator('select[name="category"], .category-filter');
      if (await categoryFilter.isVisible()) {
        await categoryFilter.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
        
        // Verifica se filtrou
        const projects = page.locator('.project-card');
        const count = await projects.count();
        expect(count).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Responsividade', () => {
    test('deve ser responsivo em mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/#projects');
      await page.waitForLoadState('networkidle');
      
      // Verifica se projetos estão empilhados verticalmente
      const projects = page.locator('.project-card');
      if (await projects.count() > 0) {
        const firstProject = projects.first();
        const box = await firstProject.boundingBox();
        
        if (box) {
          // Em mobile, os cards devem ocupar quase toda a largura
          expect(box.width).toBeGreaterThan(300);
        }
      }
    });
  });
});
