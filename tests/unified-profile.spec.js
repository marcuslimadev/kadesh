import { test, expect } from '@playwright/test';

/**
 * Teste do Sistema de Perfil Unificado
 * Valida o switch "Ver como" e o cadastro unificado
 */

test.describe('Sistema de Perfil Unificado', () => {
  
  // Gerar email único para cada execução do teste
  const timestamp = Date.now();
  const testUser = {
    name: 'Teste Unificado',
    email: `teste.unificado.${timestamp}@kadesh.com`,
    password: 'Senha@123456'
  };

  test('1. Cadastro não deve ter seleção de tipo de usuário', async ({ page }) => {
    await page.goto('/register');
    
    // Deve ter info box explicando o novo sistema
    const infoBox = page.locator('.bg-blue-50', { hasText: 'Você pode alternar' });
    await expect(infoBox).toBeVisible();
    
    // Não deve ter grid com botões de tipo (classe específica do layout antigo)
    const tipoGrid = page.locator('.grid.grid-cols-2.gap-3 button', { hasText: 'Contratante' }).first();
    await expect(tipoGrid).not.toBeVisible();
    
    // Deve ter todos os campos básicos
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
  });

  test('2. Deve criar usuário unificado com sucesso', async ({ page }) => {
    await page.goto('/register');
    
    // Preencher formulário
    await page.fill('#name', testUser.name);
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.fill('#confirmPassword', testUser.password);
    
    // Aceitar termos
    await page.check('input[type="checkbox"]');
    
    // Submeter
    await page.click('button[type="submit"]');
    
    // Deve redirecionar para /lobby
    await page.waitForURL('**/lobby', { timeout: 10000 });
    expect(page.url()).toContain('/lobby');
  });

  test('3. Switch "Ver como" deve aparecer no NavBar após login', async ({ page }) => {
    // Fazer login com usuário de teste
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Aguardar redirecionamento
    await page.waitForURL('**/lobby', { timeout: 10000 });
    
    // Verificar se switch está visível (versão desktop OU mobile)
    const switchDesktop = page.locator('.view-mode-switch .hidden.md\\:flex');
    const switchMobile = page.locator('.view-mode-switch .md\\:hidden');
    
    const hasSwitchDesktop = await switchDesktop.count() > 0;
    const hasSwitchMobile = await switchMobile.count() > 0;
    
    expect(hasSwitchDesktop || hasSwitchMobile).toBeTruthy();
  });

  test('4. Deve alternar entre perfis Contratante e Prestador', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/lobby', { timeout: 10000 });
    
    // Aguardar switch aparecer
    await page.waitForTimeout(1000);
    
    // Verificar estado inicial (deve ser Contratante por padrão)
    const menuProjetos = page.locator('text=Projetos').first();
    const menuPropostas = page.locator('text=Minhas Propostas').first();
    
    // Estado inicial: Contratante (menu Projetos visível)
    const isContractorInitially = await menuProjetos.isVisible().catch(() => false);
    
    if (isContractorInitially) {
      // Clicar em Prestador
      await page.click('text=Prestador');
      await page.waitForTimeout(500);
      
      // Menu deve mudar para Propostas
      await expect(menuPropostas).toBeVisible({ timeout: 3000 });
      
      // Voltar para Contratante
      await page.click('text=Contratante');
      await page.waitForTimeout(500);
      
      // Menu deve voltar para Projetos
      await expect(menuProjetos).toBeVisible({ timeout: 3000 });
    } else {
      // Se começou como Prestador, fazer o inverso
      await page.click('text=Contratante');
      await page.waitForTimeout(500);
      await expect(menuProjetos).toBeVisible({ timeout: 3000 });
      
      await page.click('text=Prestador');
      await page.waitForTimeout(500);
      await expect(menuPropostas).toBeVisible({ timeout: 3000 });
    }
  });

  test('5. Dashboard deve ter botões contextuais por perfil', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/lobby', { timeout: 10000 });
    
    // Ir para dashboard
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    
    // Modo Contratante: deve ter botão "Novo Projeto"
    await page.click('text=Contratante');
    await page.waitForTimeout(500);
    
    const novoProjeto = page.locator('text=Novo Projeto');
    await expect(novoProjeto).toBeVisible({ timeout: 3000 });
    
    // Modo Prestador: deve ter "Minhas Propostas"
    await page.click('text=Prestador');
    await page.waitForTimeout(500);
    
    const minhasPropostas = page.locator('text=Minhas Propostas');
    await expect(minhasPropostas).toBeVisible({ timeout: 3000 });
  });

  test('6. Persistência: modo deve ser mantido após logout/login', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/lobby', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // Alternar para Prestador
    await page.click('text=Prestador');
    await page.waitForTimeout(500);
    
    // Verificar que mudou
    const minhasPropostas = page.locator('text=Minhas Propostas');
    await expect(minhasPropostas).toBeVisible({ timeout: 3000 });
    
    // Fazer logout (clicar no menu de usuário e depois em Sair)
    const userMenuButton = page.locator('button', { hasText: /Sair|Settings/ }).first();
    if (await userMenuButton.count() > 0) {
      await userMenuButton.click();
      await page.waitForTimeout(300);
      
      const sairButton = page.locator('button', { hasText: 'Sair' });
      if (await sairButton.count() > 0) {
        await sairButton.click();
        await page.waitForTimeout(500);
      }
    }
    
    // Login novamente
    await page.goto('/login');
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/lobby', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // Deve manter modo Prestador (localStorage)
    await expect(minhasPropostas).toBeVisible({ timeout: 3000 });
  });

  test('7. Tutorial deve explicar sistema de perfil unificado', async ({ page }) => {
    await page.goto('/tutorial');
    
    // Deve mencionar "Ver como" (usar first para evitar strict mode)
    const verComoText = page.locator('text=Ver como').first();
    await expect(verComoText).toBeVisible();
    
    // Deve mencionar alternância ou perfil unificado
    const unificadoSection = page.locator('text=alternar').first();
    await expect(unificadoSection).toBeVisible();
    
    // Deve ter seção explicando os dois modos
    const contratanteMode = page.locator('text=Contratante').first();
    const prestadorMode = page.locator('text=Prestador').first();
    
    await expect(contratanteMode).toBeVisible();
    await expect(prestadorMode).toBeVisible();
  });

});
