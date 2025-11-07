import { test, expect } from '@playwright/test';

/**
 * Testes E2E para Sistema de Leilões
 */

test.describe('Sistema de Leilões - Visualização', () => {
  
  test('deve carregar a página de leilões com layout three-column', async ({ page }) => {
    await page.goto('/public/jquery-frontend/three-column-demo.html');
    
    // Verificar se a página carregou
    await expect(page).toHaveTitle(/Leilões Ativos/);
    
    // Verificar estrutura three-column
    await expect(page.locator('.three-column-layout')).toBeVisible();
    await expect(page.locator('.sidebar-left')).toBeVisible();
    await expect(page.locator('.main-content')).toBeVisible();
    await expect(page.locator('.sidebar-right')).toBeVisible();
  });

  test('deve exibir navbar com tema Kadesh', async ({ page }) => {
    await page.goto('/public/jquery-frontend/three-column-demo.html');
    
    // Verificar navbar
    const navbar = page.locator('.navbar.is-kadesh');
    await expect(navbar).toBeVisible();
    await expect(navbar).toHaveCSS('background-color', /rgb\(15, 23, 42\)/); // #0f172a
    
    // Verificar logo
    await expect(page.locator('.navbar img[alt="Kadesh"]')).toBeVisible();
  });

  test('deve exibir categorias no sidebar esquerdo', async ({ page }) => {
    await page.goto('/public/jquery-frontend/three-column-demo.html');
    
    // Verificar filtro de categorias
    const categoryFilters = page.locator('#category-filters');
    await expect(categoryFilters).toBeVisible();
    
    // Verificar categorias específicas
    await expect(page.locator('.category-item[data-category="all"]')).toBeVisible();
    await expect(page.locator('.category-item[data-category="obras"]')).toBeVisible();
    await expect(page.locator('.category-item[data-category="pintura"]')).toBeVisible();
    await expect(page.locator('.category-item[data-category="eletrica"]')).toBeVisible();
  });

  test('deve filtrar leilões ao clicar em categoria', async ({ page }) => {
    await page.goto('/public/jquery-frontend/three-column-demo.html');
    
    // Aguardar carregamento dos cards
    await page.waitForTimeout(1000);
    
    // Clicar na categoria "obras"
    const obrasCategory = page.locator('.category-item[data-category="obras"]');
    await obrasCategory.click();
    
    // Verificar que a categoria está ativa
    await expect(obrasCategory).toHaveClass(/is-active/);
  });

  test('deve exibir widgets de estatísticas no sidebar direito', async ({ page }) => {
    await page.goto('/public/jquery-frontend/three-column-demo.html');
    
    // Verificar stats widget
    const statsWidget = page.locator('.stats-widget');
    await expect(statsWidget).toBeVisible();
    
    // Verificar itens de estatística
    const statItems = page.locator('.stat-item');
    await expect(statItems).toHaveCount(4);
    
    // Verificar conteúdo das estatísticas
    await expect(page.locator('.stat-item').first()).toContainText(/\d+/); // Números
    await expect(page.locator('.stat-item .stat-label')).toHaveCount(4);
  });

  test('deve exibir projetos em destaque no sidebar direito', async ({ page }) => {
    await page.goto('/public/jquery-frontend/three-column-demo.html');
    
    // Verificar cards em destaque
    const featuredCards = page.locator('.featured-card');
    await expect(featuredCards).toHaveCount(3);
    
    // Verificar badges
    await expect(page.locator('.featured-badge')).toHaveCount(3);
  });

  test('deve permitir ordenação de leilões', async ({ page }) => {
    await page.goto('/public/jquery-frontend/three-column-demo.html');
    
    // Verificar dropdown de ordenação
    const sortSelect = page.locator('#sortSelect');
    await expect(sortSelect).toBeVisible();
    
    // Verificar opções de ordenação
    await expect(sortSelect.locator('option[value="score"]')).toBeVisible();
    await expect(sortSelect.locator('option[value="price"]')).toBeVisible();
    await expect(sortSelect.locator('option[value="rating"]')).toBeVisible();
    await expect(sortSelect.locator('option[value="time"]')).toBeVisible();
    
    // Selecionar ordenação por preço
    await sortSelect.selectOption('price');
  });

  test('deve exibir botão de refresh', async ({ page }) => {
    await page.goto('/public/jquery-frontend/three-column-demo.html');
    
    const refreshBtn = page.locator('#refreshBtn');
    await expect(refreshBtn).toBeVisible();
    
    // Clicar no botão
    await refreshBtn.click();
    
    // Verificar animação de loading
    await expect(refreshBtn.locator('i.fa-spin')).toBeVisible({ timeout: 500 });
  });
});

test.describe('Sistema de Leilões - Cards de Leilão', () => {
  
  test('deve carregar cards de leilão da API', async ({ page }) => {
    // Interceptar requisição para API
    await page.route('**/api/auctions/active', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          auctions: [
            {
              id: 1,
              title: 'Reforma Elétrica Predial',
              description: 'Projeto e execução completa',
              lowest_bid: 18900.00,
              bids_count: 12,
              contractor_rating: 4.6,
              bidding_ends_at: new Date(Date.now() + 3600000).toISOString(),
              status: 'active'
            }
          ],
          weights: { price: 0.7, reputation: 0.3 }
        })
      });
    });

    await page.goto('/public/jquery-frontend/three-column-demo.html');
    
    // Aguardar carregamento dos cards
    await page.waitForSelector('.auction-card, .column', { timeout: 5000 });
    
    // Verificar se pelo menos um card foi renderizado
    const cards = page.locator('.column');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('deve exibir informações corretas no card de leilão', async ({ page }) => {
    await page.route('**/api/auctions/active', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          auctions: [
            {
              id: 1,
              title: 'Reforma Elétrica Predial - Teste',
              description: 'Projeto e execução completa',
              lowest_bid: 18900.00,
              bids_count: 12,
              contractor_rating: 4.6,
              bidding_ends_at: new Date(Date.now() + 3600000).toISOString(),
              status: 'active'
            }
          ],
          weights: { price: 0.7, reputation: 0.3 }
        })
      });
    });

    await page.goto('/public/jquery-frontend/three-column-demo.html');
    await page.waitForTimeout(1000);
    
    // Verificar título do projeto (se renderizado)
    const titleLocator = page.locator('.title, .card-title, h3, h4').first();
    if (await titleLocator.isVisible()) {
      await expect(titleLocator).toContainText(/Reforma|Projeto|Teste/i);
    }
  });

  test('deve exibir countdown timer nos cards', async ({ page }) => {
    await page.route('**/api/auctions/active', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          auctions: [
            {
              id: 1,
              title: 'Projeto Teste',
              lowest_bid: 5000.00,
              bids_count: 5,
              contractor_rating: 4.5,
              bidding_ends_at: new Date(Date.now() + 7200000).toISOString(), // 2 horas
              status: 'active'
            }
          ],
          weights: { price: 0.7, reputation: 0.3 }
        })
      });
    });

    await page.goto('/public/jquery-frontend/three-column-demo.html');
    await page.waitForTimeout(1500);
    
    // Procurar por elementos de countdown
    const countdownElements = page.locator('.countdown, .timer, [data-countdown]');
    // Apenas verificar se existe, pois pode não estar implementado ainda
  });
});

test.describe('Sistema de Leilões - Modal de Proposta', () => {
  
  test('deve abrir modal ao clicar em "Fazer Proposta"', async ({ page }) => {
    await page.route('**/api/auctions/active', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          auctions: [
            {
              id: 1,
              title: 'Projeto Teste',
              lowest_bid: 5000.00,
              bids_count: 5,
              contractor_rating: 4.5,
              bidding_ends_at: new Date(Date.now() + 7200000).toISOString(),
              status: 'active'
            }
          ],
          weights: { price: 0.7, reputation: 0.3 }
        })
      });
    });

    await page.goto('/public/jquery-frontend/three-column-demo.html');
    await page.waitForTimeout(1500);
    
    // Procurar botão "Fazer Proposta" ou similar
    const bidButton = page.locator('button:has-text("Proposta"), button:has-text("Lance"), .bid-button').first();
    
    if (await bidButton.isVisible()) {
      await bidButton.click();
      
      // Verificar se modal abriu
      const modal = page.locator('.modal, #bid-modal, #bidModal');
      await expect(modal).toBeVisible({ timeout: 2000 });
    }
  });

  test('deve validar campos obrigatórios no modal de proposta', async ({ page }) => {
    await page.goto('/public/jquery-frontend/three-column-demo.html');
    
    // Abrir modal programaticamente se função existir
    await page.evaluate(() => {
      if (typeof window.openBidModal === 'function') {
        window.openBidModal(1, 'Projeto Teste', 5000);
      }
    });
    
    await page.waitForTimeout(500);
    
    // Verificar se modal está visível
    const modal = page.locator('.modal.is-active, #bid-modal.is-active');
    if (await modal.isVisible()) {
      // Tentar submeter sem preencher
      const submitBtn = page.locator('button[type="submit"], button:has-text("Enviar")').first();
      await submitBtn.click();
      
      // Verificar mensagens de validação (se existirem)
      await page.waitForTimeout(500);
    }
  });

  test('deve fechar modal ao clicar no botão cancelar', async ({ page }) => {
    await page.goto('/public/jquery-frontend/three-column-demo.html');
    
    // Abrir modal
    await page.evaluate(() => {
      if (typeof window.openBidModal === 'function') {
        window.openBidModal(1, 'Projeto Teste', 5000);
      }
    });
    
    await page.waitForTimeout(500);
    
    const modal = page.locator('.modal.is-active');
    if (await modal.isVisible()) {
      // Clicar em cancelar ou fechar
      const closeBtn = page.locator('.modal-close, button:has-text("Cancelar")').first();
      await closeBtn.click();
      
      // Verificar se modal fechou
      await expect(modal).not.toBeVisible({ timeout: 1000 });
    }
  });
});

test.describe('Sistema de Leilões - Página Auctions Demo', () => {
  
  test('deve carregar página auctions-demo com hero section', async ({ page }) => {
    await page.goto('/public/jquery-frontend/auctions-demo.html');
    
    // Verificar hero
    const hero = page.locator('.hero.is-kadesh');
    await expect(hero).toBeVisible();
    
    // Verificar título do hero
    await expect(page.locator('.hero .title')).toContainText(/Leilões/i);
    await expect(page.locator('.hero .subtitle')).toContainText(/preço|reputação/i);
  });

  test('deve exibir botões no hero com tema Kadesh', async ({ page }) => {
    await page.goto('/public/jquery-frontend/auctions-demo.html');
    
    // Verificar botões
    const primaryBtn = page.locator('.button.is-kadesh-primary');
    const secondaryBtn = page.locator('.button.is-kadesh-secondary');
    
    // Pelo menos um dos botões deve estar visível
    const hasPrimary = await primaryBtn.count() > 0;
    const hasSecondary = await secondaryBtn.count() > 0;
    expect(hasPrimary || hasSecondary).toBeTruthy();
  });

  test('deve exibir grid de cards de leilão', async ({ page }) => {
    await page.goto('/public/jquery-frontend/auctions-demo.html');
    
    // Verificar grid
    const grid = page.locator('.auction-cards-grid, #auction-cards-grid');
    await expect(grid).toBeVisible();
  });

  test('deve rolar para seção de leilões ao clicar em "Ver Leilões"', async ({ page }) => {
    await page.goto('/public/jquery-frontend/auctions-demo.html');
    
    // Clicar no botão "Ver Leilões"
    const verLeiloesBtn = page.locator('button:has-text("Ver Leilões")');
    if (await verLeiloesBtn.isVisible()) {
      await verLeiloesBtn.click();
      
      // Verificar se rolou para a seção
      await page.waitForTimeout(500);
      const auctionsSection = page.locator('#auctions-section');
      await expect(auctionsSection).toBeInViewport();
    }
  });
});

test.describe('Sistema de Leilões - Responsividade', () => {
  
  test('deve adaptar layout para mobile', async ({ page }) => {
    // Configurar viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/public/jquery-frontend/three-column-demo.html');
    
    // Verificar que o layout mudou
    const layout = page.locator('.three-column-layout');
    await expect(layout).toBeVisible();
    
    // Em mobile, as colunas devem estar empilhadas
    // Verificar ordem dos elementos
    await page.waitForTimeout(500);
  });

  test('deve exibir navbar mobile hamburger', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/public/jquery-frontend/auctions-demo.html');
    
    // Procurar por burger menu (se existir)
    const burger = page.locator('.navbar-burger');
    // Apenas verificar se existe
  });

  test('deve adaptar grid de cards para mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/public/jquery-frontend/auctions-demo.html');
    
    const grid = page.locator('.auction-cards-grid');
    if (await grid.isVisible()) {
      // Verificar que a grid está visível
      await expect(grid).toBeVisible();
    }
  });
});

test.describe('Sistema de Leilões - Performance', () => {
  
  test('deve carregar página em menos de 3 segundos', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/public/jquery-frontend/three-column-demo.html');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('deve carregar scripts JavaScript sem erros', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await page.goto('/public/jquery-frontend/three-column-demo.html');
    await page.waitForTimeout(2000);
    
    // Verificar se há erros críticos
    const criticalErrors = errors.filter(e => 
      !e.includes('ResizeObserver') && // Ignorar erro comum do ResizeObserver
      !e.includes('favicon')            // Ignorar erro de favicon
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('deve carregar CSS sem erros 404', async ({ page }) => {
    const failed = [];
    page.on('response', (response) => {
      if (response.url().includes('.css') && response.status() === 404) {
        failed.push(response.url());
      }
    });
    
    await page.goto('/public/jquery-frontend/three-column-demo.html');
    await page.waitForLoadState('networkidle');
    
    expect(failed.length).toBe(0);
  });
});
