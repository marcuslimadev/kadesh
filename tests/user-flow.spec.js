import { test, expect } from '@playwright/test';

/**
 * Testes de fluxo completo do usuário
 * Login → Lobby → Dashboard → Criar Projeto → Comprovantes
 */

test.describe('Fluxo Completo - Contratante', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navegar para home
    await page.goto('/');
  });

  test('deve exibir home page com todas as seções', async ({ page }) => {
    // Verificar título
    await expect(page.locator('h1')).toContainText('Kaddesh');
    
    // Verificar seções principais
    await expect(page.locator('text=Lobby de Leilões Reversos')).toBeVisible();
    await expect(page.locator('text=Documentação')).toBeVisible();
    await expect(page.locator('text=Comunidade')).toBeVisible();
  });

  test('deve fazer login com sucesso', async ({ page }) => {
    // Clicar em Login
    await page.click('text=Entrar');
    
    // Preencher formulário
    await page.fill('input[type="email"]', 'cliente@teste.com');
    await page.fill('input[type="password"]', 'senha123');
    
    // Submeter
    await page.click('button[type="submit"]');
    
    // Deve redirecionar para Lobby
    await expect(page).toHaveURL(/\/lobby/);
  });

  test('fluxo completo: Login → Lobby → Dashboard → Criar Projeto', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'contratante@teste.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');
    
    // 2. Verificar Lobby
    await page.waitForURL(/\/lobby/, { timeout: 5000 });
    await expect(page.locator('h1')).toContainText('Lobby');
    await expect(page.locator('text=Filtros')).toBeVisible();
    
    // 3. Navegar para Dashboard
    await page.click('text=Dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    
    // Verificar botões de ação rápida
    await expect(page.locator('text=🎯 Lobby')).toBeVisible();
    await expect(page.locator('text=Novo Projeto')).toBeVisible();
    await expect(page.locator('text=Carteira')).toBeVisible();
    await expect(page.locator('text=Comprovantes')).toBeVisible();
    await expect(page.locator('text=Contratos')).toBeVisible();
    
    // 4. Criar Novo Projeto
    await page.click('text=Novo Projeto');
    await expect(page).toHaveURL(/\/projects\/create/);
    
    // Verificar wizard de steps
    await expect(page.locator('text=Informações Básicas')).toBeVisible();
    
    // Step 1: Básico
    await page.fill('input[id="title"]', 'Site Institucional para Empresa de Tecnologia');
    await page.selectOption('select[id="category"]', 'Desenvolvimento Web');
    await page.click('text=Próximo');
    
    // Step 2: Descrição
    await expect(page.locator('text=Descrição Detalhada')).toBeVisible();
    await page.fill('textarea[id="description"]', `
      Preciso de um site institucional moderno e responsivo para minha empresa de consultoria em tecnologia.
      
      O site deve incluir:
      - Página inicial apresentando a empresa
      - Seção de serviços com cards detalhados
      - Página sobre nós com histórico
      - Formulário de contato funcional
      - Blog integrado para artigos
      
      Design preferencial: clean, profissional, cores azul e branco.
    `);
    await page.click('text=Próximo');
    
    // Step 3: Orçamento
    await expect(page.locator('text=Orçamento e Prazo')).toBeVisible();
    await page.fill('input[id="budget"]', '5000');
    
    // Selecionar prazo (30 dias a partir de hoje)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const dateString = futureDate.toISOString().split('T')[0];
    await page.fill('input[id="deadline"]', dateString);
    
    // Selecionar prioridade Normal
    await page.click('button:has-text("Normal")');
    await page.click('text=Próximo');
    
    // Step 4: Habilidades
    await expect(page.locator('text=Habilidades Necessárias')).toBeVisible();
    
    // Adicionar habilidades sugeridas
    await page.click('button:has-text("+ HTML/CSS")');
    await page.click('button:has-text("+ JavaScript")');
    await page.click('button:has-text("+ React")');
    
    // Adicionar habilidade customizada
    await page.fill('input[placeholder*="React, Node.js"]', 'Tailwind CSS');
    await page.click('button:has-text("Adicionar")');
    
    // Submeter projeto
    await page.click('button[type="submit"]');
    
    // Aguardar toast de sucesso
    await expect(page.locator('text=criado com sucesso')).toBeVisible({ timeout: 5000 });
    
    // Deve redirecionar para detalhes do projeto
    await expect(page).toHaveURL(/\/projects\/\d+/);
  });

  test('deve acessar página de comprovantes', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'contratante@teste.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/lobby/);
    
    // Navegar para Comprovantes via NavBar
    await page.click('text=Comprovantes');
    await expect(page).toHaveURL(/\/receipts/);
    
    // Verificar abas
    await expect(page.locator('text=Contratos Finalizados')).toBeVisible();
    await expect(page.locator('text=Transações de Carteira')).toBeVisible();
  });

  test('deve navegar via menu mobile', async ({ page, viewport }) => {
    // Definir viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'contratante@teste.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/lobby/);
    
    // Abrir menu mobile
    await page.click('button[aria-label="Menu"]', { timeout: 1000 }).catch(() => {
      // Se não tiver aria-label, tentar pelo ícone hamburger
      return page.click('button svg path[d*="M4 6h16M4 12h16M4 18h16"]');
    });
    
    // Verificar links do menu
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Projetos')).toBeVisible();
    await expect(page.locator('text=Carteira')).toBeVisible();
    await expect(page.locator('text=Comprovantes')).toBeVisible();
  });
});

test.describe('Fluxo Prestador', () => {
  
  test('deve mostrar menu específico para prestador', async ({ page }) => {
    // Login como prestador
    await page.goto('/login');
    await page.fill('input[type="email"]', 'prestador@teste.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/lobby/);
    
    // Navegar para Dashboard
    await page.click('text=Dashboard');
    
    // Verificar botão específico de prestador
    await expect(page.locator('text=Minhas Propostas')).toBeVisible();
    
    // Não deve ter botão de "Novo Projeto"
    await expect(page.locator('text=Novo Projeto')).not.toBeVisible();
  });
});

test.describe('Tutorial e Documentação', () => {
  
  test('deve exibir tutorial com duas torres', async ({ page }) => {
    await page.goto('/tutorial');
    
    // Verificar título
    await expect(page.locator('h1')).toContainText('Tutorial');
    
    // Verificar torre Contratante
    await expect(page.locator('text=Torre Contratante')).toBeVisible();
    await expect(page.locator('text=Como criar um projeto')).toBeVisible();
    
    // Verificar torre Prestador
    await expect(page.locator('text=Torre Prestador')).toBeVisible();
    await expect(page.locator('text=Como enviar propostas')).toBeVisible();
  });
});
