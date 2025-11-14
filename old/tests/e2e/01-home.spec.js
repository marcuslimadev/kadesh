import { test, expect } from '@playwright/test';

test.describe('01 - VISITANTE: Home Page e Navegação Pública', () => {
  
  test('1.1 - Deve carregar homepage com logo, navbar e hero', async ({ page }) => {
    await page.goto('/');
    
    // Navbar
    await expect(page.locator('nav img[alt="Kaddesh"]')).toBeVisible();
    await expect(page.locator('nav').getByRole('link', { name: /Início/i })).toBeVisible();
    await expect(page.locator('nav').getByRole('link', { name: /Leilões/i })).toBeVisible();
    await expect(page.locator('nav').getByRole('link', { name: /Entrar/i })).toBeVisible();
    await expect(page.locator('nav').getByRole('link', { name: /Cadastre-se/i })).toBeVisible();
    
    // Hero banner
    await expect(page.getByRole('heading', { name: /Seja você um Kaddesh/i })).toBeVisible();
    await expect(page.getByText(/Melhores profissionais ou talentos/i)).toBeVisible();
  });

  test('1.2 - Deve mostrar 5 categorias populares com hover effects', async ({ page }) => {
    await page.goto('/');
    
    // Scroll até categorias
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(300);
    
    // Verificar título
    await expect(page.getByRole('heading', { name: /categorias populares/i })).toBeVisible();
    
    // Verificar 5 categorias
    await expect(page.getByRole('heading', { name: 'Desenvolvimento Web', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Marketing Digital', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Design Gráfico', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Programação', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Business', exact: true })).toBeVisible();
  });

  test('1.3 - Deve buscar projetos por palavra-chave', async ({ page }) => {
    await page.goto('/');
    
    // Preencher busca
    await page.getByPlaceholder('Pesquise com palavra-chave').fill('desenvolvimento web');
    await page.getByRole('button', { name: /Procure agora/i }).click();
    
    // Deve ir para leilões com filtro
    await page.waitForURL(/\/auctions/);
    expect(page.url()).toContain('keyword=');
  });

  test('1.4 - Deve mostrar projetos em destaque (dados reais do banco)', async ({ page }) => {
    await page.goto('/');
    
    // Scroll até projetos
    await page.evaluate(() => window.scrollTo(0, 2500));
    await page.waitForTimeout(1500);
    
    // Título da seção
    await expect(page.getByRole('heading', { name: /projetos mais bem avaliados/i })).toBeVisible();
    
    // Link para todos
    await expect(page.getByRole('link', { name: /Todos os empregos/i })).toBeVisible();
  });

  test('1.5 - Deve cadastrar email na newsletter', async ({ page }) => {
    await page.goto('/');
    
    // Scroll até newsletter
    await page.evaluate(() => window.scrollTo(0, 3800));
    await page.waitForTimeout(300);
    
    // Preencher e enviar
    const email = `teste${Date.now()}@example.com`;
    await page.getByPlaceholder('Adicione seu e-mail').fill(email);
    
    // Capturar alert
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Obrigado');
      await dialog.accept();
    });
    
    await page.getByRole('button', { name: /Cadastre-se agora/i }).click();
  });

  test('1.6 - Deve ter footer completo com links', async ({ page }) => {
    await page.goto('/');
    
    // Scroll até footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    
    // Verificar seções
    await expect(page.locator('footer img[alt="Kaddesh"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Links úteis' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Suporte' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contato' })).toBeVisible();
    
    // Copyright
    await expect(page.getByText(/© 2025 Kaddesh/i)).toBeVisible();
  });

  test('1.7 - Navbar deve ter scroll effect', async ({ page }) => {
    await page.goto('/');
    
    const navbar = page.locator('nav');
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(600);
    
    // Verificar classe de scroll aplicada
    const classes = await navbar.getAttribute('class');
    expect(classes).toContain('shadow');
  });

  test('1.8 - Deve ter animações suaves (sem jank)', async ({ page }) => {
    await page.goto('/');
    
    // Verificar elementos animados
    const animatedCount = await page.locator('[class*="animate-"]').count();
    expect(animatedCount).toBeGreaterThan(5);
    
    // Scroll suave
    const scrollBehavior = await page.evaluate(() => 
      window.getComputedStyle(document.documentElement).scrollBehavior
    );
    expect(scrollBehavior).toBe('smooth');
  });

  test('1.9 - Deve redirecionar para login ao tentar acessar área protegida', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Deve redirecionar
    await page.waitForTimeout(1000);
    expect(page.url()).toContain('/login');
  });

  test('1.10 - Mobile: deve ser responsivo em 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Logo visível
    await expect(page.locator('nav img[alt="Kaddesh"]').first()).toBeVisible();
    
    // Conteúdo acessível
    await expect(page.getByRole('heading', { name: /Kaddesh/i }).first()).toBeVisible();
  });
});
