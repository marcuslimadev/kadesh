/**
 * Teste E2E - Fluxo de Login e Dashboard
 * Testa o botão "Entrar", página de login e redirecionamento para dashboard
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5175';

test.describe('Fluxo de Login e Dashboard', () => {
    
    test.beforeEach(async ({ page }) => {
        // Limpar cookies e storage antes de cada teste
        await page.context().clearCookies();
        await page.goto(BASE_URL);
    });

    test('Deve ter botão "Entrar" na página inicial', async ({ page }) => {
        // Verificar se o botão Entrar existe
        const loginButton = page.locator('a[href*="login.html"]').filter({ hasText: 'Entrar' });
        await expect(loginButton).toBeVisible();
        
        // Verificar estilo do botão
        await expect(loginButton).toHaveCSS('color', 'rgb(44, 62, 80)'); // Navy color
    });

    test('Deve redirecionar para página de login ao clicar em "Entrar"', async ({ page }) => {
        // Clicar no botão Entrar
        await page.click('a[href*="login.html"]');
        
        // Verificar redirecionamento
        await expect(page).toHaveURL(/.*login\.html/);
        
        // Verificar elementos da página de login
        await expect(page.locator('h1')).toContainText('Bem-vindo de volta');
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toContainText('Entrar');
    });

    test('Deve mostrar erro com credenciais inválidas', async ({ page }) => {
        // Ir para página de login
    await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        
        // Preencher formulário com credenciais inválidas
        await page.fill('input[type="email"]', 'invalido@teste.com');
        await page.fill('input[type="password"]', 'senhaerrada');
        
        // Submeter formulário
        await page.click('button[type="submit"]');
        
        // Aguardar mensagem de erro
        await page.waitForSelector('#loginError', { state: 'visible', timeout: 5000 });
        
        // Verificar mensagem de erro
        const errorMessage = await page.locator('#loginError');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(/credenciais|inv[áa]lida|erro/i);
    });

    test('Deve fazer login com sucesso e redirecionar para dashboard', async ({ page }) => {
        // Ir para página de login
    await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        
        // Preencher formulário com credenciais válidas
        await page.fill('input[type="email"]', 'teste@kadesh.com');
        await page.fill('input[type="password"]', '123456');
        
        // Submeter formulário
        await page.click('button[type="submit"]');
        
        // Aguardar redirecionamento para dashboard
        await page.waitForURL(/.*dashboard\.html/, { timeout: 10000 });
        
        // Verificar URL do dashboard
        await expect(page).toHaveURL(/.*dashboard\.html/);
    });

    test('Dashboard deve exibir nome do usuário logado', async ({ page }) => {
        // Fazer login primeiro
    await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        await page.fill('input[type="email"]', 'teste@kadesh.com');
        await page.fill('input[type="password"]', '123456');
        await page.click('button[type="submit"]');
        
        // Aguardar dashboard carregar
        await page.waitForURL(/.*dashboard\.html/, { timeout: 10000 });
        await page.waitForLoadState('networkidle');
        
        // Verificar nome do usuário na navbar
        const userName = page.locator('#userName');
        await expect(userName).toBeVisible({ timeout: 5000 });
        
        // Verificar mensagem de boas-vindas
        const welcomeMessage = page.locator('#welcomeMessage');
        await expect(welcomeMessage).toContainText(/bem-vindo/i);
    });

    test('Dashboard deve exibir cards de estatísticas', async ({ page }) => {
        // Fazer login
    await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        await page.fill('input[type="email"]', 'teste@kadesh.com');
        await page.fill('input[type="password"]', '123456');
        await page.click('button[type="submit"]');
        
        await page.waitForURL(/.*dashboard\.html/, { timeout: 10000 });
        await page.waitForLoadState('networkidle');
        
        // Verificar cards de estatísticas
        await expect(page.locator('#myProjectsCount')).toBeVisible();
        await expect(page.locator('#activeBidsCount')).toBeVisible();
        await expect(page.locator('#wonProjectsCount')).toBeVisible();
        await expect(page.locator('#userRating')).toBeVisible();
        
        // Verificar se os valores são números
        const projectCount = await page.locator('#myProjectsCount').textContent();
        expect(projectCount).toMatch(/^\d+$/);
    });

    test('Dashboard deve ter ações rápidas funcionais', async ({ page }) => {
        // Fazer login
    await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        await page.fill('input[type="email"]', 'teste@kadesh.com');
        await page.fill('input[type="password"]', '123456');
        await page.click('button[type="submit"]');
        
        await page.waitForURL(/.*dashboard\.html/, { timeout: 10000 });
        
        // Verificar botões de ação rápida
        const createProjectBtn = page.locator('a[href*="create-project.html"]').first();
        await expect(createProjectBtn).toBeVisible();
        await expect(createProjectBtn).toContainText(/criar projeto/i);
        
        const searchAuctionsBtn = page.locator('a[href*="leiloes-original.html"]');
        await expect(searchAuctionsBtn.first()).toBeVisible();
    });

    test('Botão de logout deve funcionar', async ({ page }) => {
        // Fazer login
    await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        await page.fill('input[type="email"]', 'teste@kadesh.com');
        await page.fill('input[type="password"]', '123456');
        await page.click('button[type="submit"]');
        
        await page.waitForURL(/.*dashboard\.html/, { timeout: 10000 });
        
        // Clicar em logout
        await page.click('#logoutBtn');
        
        // Aguardar redirecionamento
        await page.waitForURL(/.*leiloes-original\.html/, { timeout: 5000 });
        
        // Verificar que foi redirecionado para home
        await expect(page).toHaveURL(/leiloes-original\.html/);
    });

    test('Toggle de senha deve mostrar/ocultar senha', async ({ page }) => {
        await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        
        const passwordInput = page.locator('#password');
        const toggleButton = page.locator('#togglePassword');
        
        // Verificar que começa como password
        await expect(passwordInput).toHaveAttribute('type', 'password');
        
        // Clicar no toggle
        await toggleButton.click();
        
        // Verificar que mudou para text
        await expect(passwordInput).toHaveAttribute('type', 'text');
        
        // Clicar novamente
        await toggleButton.click();
        
        // Verificar que voltou para password
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('Link "Criar conta gratuita" deve redirecionar para registro', async ({ page }) => {
    await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        
        // Verificar link de cadastro específico (dentro do formulário)
        const registerLink = page.locator('a[href*="register.html"]').filter({ hasText: 'Criar conta gratuita' });
        await expect(registerLink).toBeVisible();
        await expect(registerLink).toContainText(/criar conta/i);
    });

    test('Dashboard deve proteger acesso sem login', async ({ page }) => {
        // Tentar acessar dashboard sem estar logado
    await page.goto(`${BASE_URL}/jquery-frontend/dashboard.html`);
        
        // Deve ser redirecionado para login
        await page.waitForURL(/.*login\.html/, { timeout: 5000 });
        await expect(page).toHaveURL(/login\.html/);
    });

    test('Página de login deve ter design consistente', async ({ page }) => {
    await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        
        // Verificar elementos de design
        const navbar = page.locator('.kadesh-navbar');
        await expect(navbar).toBeVisible();
        
        // Verificar logo
        const logo = page.locator('img[alt="Kaddesh"]');
        await expect(logo).toBeVisible();
        
        // Verificar footer
        const footer = page.locator('.kadesh-footer');
        await expect(footer).toBeVisible();
        
        // Verificar cor de fundo do formulário
        const loginSection = page.locator('section.kadesh-section').first();
        await expect(loginSection).toBeVisible();
    });

    test('Formulário de login deve validar campos obrigatórios', async ({ page }) => {
    await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        
        // Verificar atributo required nos inputs
        const emailInput = page.locator('input[type="email"]');
        const passwordInput = page.locator('input[type="password"]');
        
        await expect(emailInput).toHaveAttribute('required', '');
        await expect(passwordInput).toHaveAttribute('required', '');
    });

    test('Dashboard deve carregar projetos do usuário', async ({ page }) => {
        // Fazer login
    await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        await page.fill('input[type="email"]', 'teste@kadesh.com');
        await page.fill('input[type="password"]', '123456');
        await page.click('button[type="submit"]');
        
        await page.waitForURL(/.*dashboard\.html/, { timeout: 10000 });
        
        // Aguardar carregamento dos projetos
        await page.waitForSelector('#loadingProjects', { state: 'hidden', timeout: 10000 });
        
        // Verificar se mostra lista de projetos OU estado vazio
        const projectsList = page.locator('#projectsList');
        const emptyProjects = page.locator('#emptyProjects');
        
        // Um dos dois deve estar visível
        const isProjectsVisible = await projectsList.isVisible();
        const isEmptyVisible = await emptyProjects.isVisible();
        
        expect(isProjectsVisible || isEmptyVisible).toBeTruthy();
    });
});

test.describe('Navegação entre páginas', () => {
    
    test('Deve conseguir voltar para home do login', async ({ page }) => {
    await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        
        // Clicar no logo para voltar
        await page.click('.kadesh-logo');
        
        // Verificar redirecionamento
        await expect(page).toHaveURL(/leiloes-original\.html/);
    });

    test('Navbar do dashboard deve ter links funcionais', async ({ page }) => {
        // Fazer login
    await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        await page.fill('input[type="email"]', 'teste@kadesh.com');
        await page.fill('input[type="password"]', '123456');
        await page.click('button[type="submit"]');
        
        await page.waitForURL(/.*dashboard\.html/, { timeout: 10000 });
        
        // Verificar links da navbar
        const navLinks = page.locator('.kadesh-nav-links a');
        const count = await navLinks.count();
        
        expect(count).toBeGreaterThan(0);
    });
});

test.describe('Responsividade', () => {
    
    test('Login deve ser responsivo em mobile', async ({ page }) => {
        // Configurar viewport mobile
        await page.setViewportSize({ width: 375, height: 667 });
        
    await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        
        // Verificar que elementos estão visíveis
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('Dashboard deve ser responsivo em tablet', async ({ page }) => {
        // Configurar viewport tablet
        await page.setViewportSize({ width: 768, height: 1024 });
        
        // Fazer login
    await page.goto(`${BASE_URL}/jquery-frontend/login.html`);
        await page.fill('input[type="email"]', 'teste@kadesh.com');
        await page.fill('input[type="password"]', '123456');
        await page.click('button[type="submit"]');
        
        await page.waitForURL(/.*dashboard\.html/, { timeout: 10000 });
        
        // Verificar cards de estatísticas
        await expect(page.locator('#myProjectsCount')).toBeVisible();
    });
});
