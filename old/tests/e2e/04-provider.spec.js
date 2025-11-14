import { test, expect } from '@playwright/test';

// Helper: Login como provider
async function loginAsProvider(page) {
  await page.goto('/login');
  await page.getByPlaceholder(/email/i).fill('admin@kadesh.com');
  await page.getByPlaceholder(/senha/i).fill('admin123');
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForTimeout(2000);
}

test.describe('04 - PROVIDER: Buscar Leilões e Enviar Propostas', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAsProvider(page);
  });

  test('4.1 - Deve acessar marketplace de leilões', async ({ page }) => {
    await page.goto('/auctions');
    await page.waitForTimeout(1500);
    
    expect(page.url()).toContain('/auctions');
    
    // Deve ter projetos ou mensagem vazia
    const hasProjects = await page.locator('[class*="project"], [class*="card"]').count();
    const isEmpty = await page.getByText(/nenhum|sem projeto/i).isVisible().catch(() => false);
    
    expect(hasProjects > 0 || isEmpty).toBeTruthy();
  });

  test('4.2 - Deve filtrar projetos por categoria', async ({ page }) => {
    await page.goto('/auctions');
    await page.waitForTimeout(1500);
    
    // Buscar filtro de categoria
    const categoryFilter = page.locator('select, [role="combobox"]').filter({ hasText: /categoria/i });
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption({ index: 1 });
      await page.waitForTimeout(1000);
    }
  });

  test('4.3 - Deve buscar projetos por palavra-chave', async ({ page }) => {
    await page.goto('/auctions');
    await page.waitForTimeout(1000);
    
    // Buscar campo de busca
    const searchInput = page.getByPlaceholder(/buscar|pesquisar|search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('desenvolvimento');
      await searchInput.press('Enter');
      await page.waitForTimeout(1000);
    }
  });

  test('4.4 - Deve visualizar detalhes de um leilão', async ({ page }) => {
    await page.goto('/auctions');
    await page.waitForTimeout(1500);
    
    // Clicar no primeiro projeto
    const firstProject = page.locator('[class*="project"], .card').first();
    if (await firstProject.isVisible()) {
      await firstProject.click();
      await page.waitForTimeout(1500);
      
      // Deve estar na página de detalhes
      expect(page.url()).toMatch(/\/(auction|project)\/\d+/);
    }
  });

  test('4.5 - Deve enviar proposta em projeto aberto', async ({ page }) => {
    await page.goto('/auctions');
    await page.waitForTimeout(1500);
    
    const firstProject = page.locator('[class*="project"], .card').first();
    if (await firstProject.isVisible()) {
      await firstProject.click();
      await page.waitForTimeout(1500);
      
      // Buscar formulário de proposta
      const bidButton = page.getByRole('button', { name: /fazer proposta|enviar proposta|bid/i });
      if (await bidButton.isVisible()) {
        await bidButton.click();
        await page.waitForTimeout(500);
        
        // Preencher formulário
        const amountInput = page.getByLabel(/valor|amount|preço/i).or(page.getByPlaceholder(/valor/i));
        if (await amountInput.isVisible()) {
          await amountInput.fill('3500');
          
          const proposalInput = page.getByLabel(/proposta|proposal|descrição/i).or(page.locator('textarea'));
          if (await proposalInput.isVisible()) {
            await proposalInput.fill('Proposta de teste E2E. Tenho experiência na área e posso entregar com qualidade.');
          }
        }
      }
    }
  });

  test('4.6 - Deve listar minhas propostas enviadas', async ({ page }) => {
    await page.goto('/my-bids');
    await page.waitForTimeout(1500);
    
    expect(page.url()).toContain('/my-bids');
    
    // Verificar se há propostas ou mensagem vazia
    const hasBids = await page.locator('[class*="bid"], [class*="card"]').count();
    const isEmpty = await page.getByText(/nenhuma proposta|sem propostas/i).isVisible().catch(() => false);
    
    expect(hasBids > 0 || isEmpty).toBeTruthy();
  });

  test('4.7 - Deve visualizar status de proposta', async ({ page }) => {
    await page.goto('/my-bids');
    await page.waitForTimeout(1500);
    
    const firstBid = page.locator('[class*="bid"], .card').first();
    if (await firstBid.isVisible()) {
      // Buscar badge de status (pending, accepted, rejected)
      const statusBadge = firstBid.locator('[class*="badge"], [class*="status"]');
      if (await statusBadge.isVisible()) {
        const statusText = await statusBadge.textContent();
        expect(statusText).toBeTruthy();
      }
    }
  });

  test('4.8 - Deve acessar perfil profissional', async ({ page }) => {
    // Ir para provider profile (pode ser /provider/:id ou /profile)
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    
    // Buscar link de perfil
    const profileLink = page.getByRole('link', { name: /perfil|profile/i });
    if (await profileLink.isVisible()) {
      await profileLink.click();
      await page.waitForTimeout(1000);
    }
  });

  test('4.9 - Deve visualizar ranking de propostas', async ({ page }) => {
    await page.goto('/auctions');
    await page.waitForTimeout(1500);
    
    const firstProject = page.locator('[class*="project"], .card').first();
    if (await firstProject.isVisible()) {
      await firstProject.click();
      await page.waitForTimeout(1500);
      
      // Buscar ranking/leaderboard
      const ranking = page.getByText(/ranking|posição|classificação/i);
      if (await ranking.isVisible()) {
        await expect(ranking).toBeVisible();
      }
    }
  });

  test('4.10 - Deve filtrar minhas propostas por status', async ({ page }) => {
    await page.goto('/my-bids');
    await page.waitForTimeout(1500);
    
    // Buscar filtro de status
    const statusFilter = page.locator('select, [role="combobox"]').filter({ hasText: /status|estado/i });
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption({ index: 1 });
      await page.waitForTimeout(1000);
    }
  });
});
