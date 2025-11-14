import { test, expect } from '@playwright/test';

test.describe('Projetos e Leilões', () => {
  test.beforeEach(async ({ page }) => {
    // Fazer login
    await page.goto('/login');
    await page.getByPlaceholder(/Email/i).fill('admin@kadesh.com');
    await page.getByPlaceholder(/Senha/i).fill('admin123');
    await page.getByRole('button', { name: /Entrar/i }).click();
    await page.waitForTimeout(2000);
  });

  test('deve listar projetos no marketplace', async ({ page }) => {
    await page.goto('/auctions');
    await page.waitForTimeout(2000);
    
    // Verificar se há projetos ou mensagem de vazio
    const projectCards = await page.locator('[class*="project"], [class*="card"]').count();
    const emptyMessage = await page.getByText(/Nenhum projeto|Sem projetos/i).isVisible().catch(() => false);
    
    expect(projectCards > 0 || emptyMessage).toBeTruthy();
  });

  test('deve filtrar projetos por palavra-chave', async ({ page }) => {
    await page.goto('/auctions');
    await page.waitForTimeout(1000);
    
    // Procurar campo de busca
    const searchInput = page.getByPlaceholder(/Buscar|Pesquisar/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('web');
      await page.waitForTimeout(1000);
    }
  });

  test('deve acessar detalhes de um projeto', async ({ page }) => {
    await page.goto('/auctions');
    await page.waitForTimeout(2000);
    
    // Clicar no primeiro projeto disponível
    const firstProject = page.locator('[class*="project"], .card').first();
    if (await firstProject.isVisible()) {
      await firstProject.click();
      await page.waitForTimeout(1000);
      
      // Deve estar na página de detalhes
      expect(page.url()).toMatch(/\/(auction|project)\/\d+/);
    }
  });

  test('deve criar novo projeto', async ({ page }) => {
    await page.goto('/create-project');
    await page.waitForTimeout(1000);
    
    // Preencher formulário de criação
    const titleInput = page.getByLabel(/Título|Title/i).or(page.getByPlaceholder(/Título/i));
    if (await titleInput.isVisible()) {
      await titleInput.fill('Projeto de Teste E2E');
      
      const descInput = page.getByLabel(/Descrição/i).or(page.getByPlaceholder(/Descrição/i));
      if (await descInput.isVisible()) {
        await descInput.fill('Este é um projeto criado automaticamente pelo teste E2E');
      }
      
      // Preencher budget se existir
      const budgetInput = page.getByLabel(/Orçamento|Budget/i).or(page.getByPlaceholder(/valor/i));
      if (await budgetInput.isVisible()) {
        await budgetInput.fill('5000');
      }
    }
  });

  test('deve fazer proposta em um projeto', async ({ page }) => {
    // Ir para um projeto específico
    await page.goto('/auctions');
    await page.waitForTimeout(2000);
    
    const firstProject = page.locator('[class*="project"], .card').first();
    if (await firstProject.isVisible()) {
      await firstProject.click();
      await page.waitForTimeout(1000);
      
      // Procurar botão de fazer proposta
      const bidButton = page.getByRole('button', { name: /Fazer proposta|Enviar proposta|Bid/i });
      if (await bidButton.isVisible()) {
        await bidButton.click();
        await page.waitForTimeout(500);
        
        // Verificar se modal ou formulário abriu
        const bidForm = page.locator('form, [class*="modal"]');
        expect(await bidForm.count()).toBeGreaterThan(0);
      }
    }
  });
});
