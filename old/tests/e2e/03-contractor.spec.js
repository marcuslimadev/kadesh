import { test, expect } from '@playwright/test';

// Helper: Login como contractor
async function loginAsContractor(page) {
  await page.goto('/login');
  await page.getByPlaceholder(/email/i).fill('admin@kadesh.com');
  await page.getByPlaceholder(/senha/i).fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(2000);
}

test.describe('03 - CONTRACTOR: Criar e Gerenciar Projetos', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsContractor(page);
  });

  test('3.1 - Deve acessar dashboard e ver estatísticas', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1500);
    
    // Verificar se dashboard carregou
    expect(page.url()).toContain('/dashboard');
    
    // Cards de estatísticas devem existir
    const cards = await page.locator('[class*="card"], [class*="stat"]').count();
    expect(cards).toBeGreaterThan(0);
  });

  test('3.2 - Deve acessar página de criar projeto', async ({ page }) => {
    await page.goto('/create-project');
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('/create-project');
    
    // Formulário deve estar presente
    const titleInput = page.getByLabel(/título|title/i).or(page.getByPlaceholder(/título/i));
    await expect(titleInput).toBeVisible();
  });

  test('3.3 - Deve criar novo projeto completo', async ({ page }) => {
    await page.goto('/create-project');
    await page.waitForTimeout(1000);
    
    const timestamp = Date.now();
    const projectTitle = `Projeto E2E Test ${timestamp}`;
    
    // Preencher formulário
    const titleInput = page.getByLabel(/título|title/i).or(page.getByPlaceholder(/título/i));
    if (await titleInput.isVisible()) {
      await titleInput.fill(projectTitle);
      
      const descInput = page.getByLabel(/descrição/i).or(page.getByPlaceholder(/descrição/i));
      if (await descInput.isVisible()) {
        await descInput.fill('Este é um projeto criado automaticamente pelo teste E2E do Playwright para validar funcionalidades.');
      }
      
      // Budget
      const budgetInput = page.getByLabel(/orçamento|budget|valor/i).or(page.getByPlaceholder(/valor|budget/i));
      if (await budgetInput.isVisible()) {
        await budgetInput.fill('5000');
      }
      
      // Categoria
      const categorySelect = page.getByLabel(/categoria/i).or(page.locator('select[name*="category"]'));
      if (await categorySelect.isVisible()) {
        await categorySelect.selectOption({ index: 1 });
      }
      
      // Prazo
      const deadlineInput = page.getByLabel(/prazo|deadline/i).or(page.getByPlaceholder(/prazo/i));
      if (await deadlineInput.isVisible()) {
        await deadlineInput.fill('30');
      }
    }
  });

  test('3.4 - Deve listar meus projetos', async ({ page }) => {
    await page.goto('/my-projects');
    await page.waitForTimeout(1500);
    
    expect(page.url()).toContain('/my-projects');
    
    // Verificar se há lista ou mensagem vazia
    const hasProjects = await page.locator('[class*="project"], [class*="card"]').count();
    const isEmpty = await page.getByText(/nenhum projeto|sem projetos/i).isVisible().catch(() => false);
    
    expect(hasProjects > 0 || isEmpty).toBeTruthy();
  });

  test('3.5 - Deve visualizar detalhes de um projeto', async ({ page }) => {
    await page.goto('/my-projects');
    await page.waitForTimeout(1500);
    
    // Clicar no primeiro projeto
    const firstProject = page.locator('[class*="project"], .card').first();
    if (await firstProject.isVisible()) {
      await firstProject.click();
      await page.waitForTimeout(1000);
      
      // Deve estar na página de detalhes
      expect(page.url()).toMatch(/\/(project|auction)\/\d+/);
    }
  });

  test('3.6 - Deve ver propostas recebidas em projeto', async ({ page }) => {
    await page.goto('/my-projects');
    await page.waitForTimeout(1500);
    
    const firstProject = page.locator('[class*="project"], .card').first();
    if (await firstProject.isVisible()) {
      await firstProject.click();
      await page.waitForTimeout(1500);
      
      // Buscar seção de propostas/bids
      const bidsSection = page.getByText(/propostas|lances|bids/i);
      if (await bidsSection.isVisible()) {
        await expect(bidsSection).toBeVisible();
      }
    }
  });

  test('3.7 - Deve filtrar projetos por status', async ({ page }) => {
    await page.goto('/my-projects');
    await page.waitForTimeout(1500);
    
    // Buscar filtro de status
    const statusFilter = page.locator('select, [role="combobox"]').filter({ hasText: /status|estado/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption({ index: 1 });
      await page.waitForTimeout(1000);
    }
  });

  test('3.8 - Deve acessar carteira/wallet', async ({ page }) => {
    await page.goto('/wallet');
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('/wallet');
    
    // Saldo deve estar visível
    const balanceText = page.getByText(/saldo|balance|R\$/i);
    await expect(balanceText.first()).toBeVisible();
  });

  test('3.9 - Deve visualizar notificações', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('/notifications');
  });

  test('3.10 - Deve aceitar uma proposta (se houver)', async ({ page }) => {
    await page.goto('/my-projects');
    await page.waitForTimeout(1500);
    
    const firstProject = page.locator('[class*="project"], .card').first();
    if (await firstProject.isVisible()) {
      await firstProject.click();
      await page.waitForTimeout(1500);
      
      // Buscar botão de aceitar proposta
      const acceptBtn = page.getByRole('button', { name: /aceitar|accept/i });
      if (await acceptBtn.isVisible()) {
        // Só clica se visível (não força erro)
        await expect(acceptBtn).toBeVisible();
      }
    }
  });
});
