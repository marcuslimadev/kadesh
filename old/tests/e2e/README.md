# Testes E2E com Playwright - Kadesh

## 📋 Visão Geral

Suite completa de testes End-to-End para o frontend Kadesh usando Playwright. Cobertura de 4 áreas principais:
- **Home Page**: Carregamento, hero, estatísticas, projetos em destaque
- **Autenticação**: Login, registro, logout, proteção de rotas
- **Projetos**: Lista, detalhes, criação, filtros
- **Dashboard**: Estatísticas, navegação, performance, acessibilidade

## 🚀 Instalação

Todos os pacotes e browsers já estão instalados! ✅

- Playwright: `^1.56.1`
- Browsers: Chromium, Firefox, WebKit
- Mobile: Chrome Mobile, Safari Mobile

## 📝 Scripts Disponíveis

### Executar Testes

```bash
# Todos os testes em todos os browsers (headless)
npm test

# Modo headed (ver navegador)
npm run test:headed

# Modo UI interativo (recomendado para debug)
npm run test:ui

# Modo debug (passo a passo)
npm run test:debug
```

### Testes por Browser

```bash
# Apenas Chromium
npm run test:chromium

# Apenas Firefox
npm run test:firefox

# Apenas WebKit (Safari)
npm run test:webkit

# Apenas dispositivos móveis
npm run test:mobile
```

### Relatórios e Ferramentas

```bash
# Ver relatório HTML dos últimos testes
npm run test:report

# Code Generator (gerar testes interativamente)
npm run test:codegen
```

## 📁 Estrutura dos Testes

```
tests/e2e/
├── home.spec.js          # 10 testes - Home page
├── auth.spec.js          # 13 testes - Autenticação
├── projects.spec.js      # 15 testes - Gestão de projetos
└── dashboard.spec.js     # 18 testes - Dashboard e performance
```

**Total: 56 testes** cobrindo funcionalidades críticas

## 🧪 Cobertura de Testes

### Home Page (10 testes)
- ✅ Carregamento da página
- ✅ Hero section e título
- ✅ Cards de estatísticas (3 cards)
- ✅ Projetos em destaque
- ✅ Menu de navegação
- ✅ Navegação para login/registro
- ✅ Responsividade mobile
- ✅ Requisições API
- ✅ Carregamento de assets (CSS/JS)

### Autenticação (13 testes)
- ✅ Formulário de login
- ✅ Validação de campos
- ✅ Validação de formato de email
- ✅ Mensagens de erro
- ✅ Links para registro/recuperação
- ✅ Formulário de registro
- ✅ Validação de senha
- ✅ Seletor de tipo de usuário
- ✅ Botão de logout
- ✅ Proteção de rotas (dashboard)
- ✅ Proteção de rotas (criar projeto)

### Projetos (15 testes)
- ✅ Lista de projetos
- ✅ Informações do projeto (título, descrição, preço)
- ✅ Filtros por categoria/status
- ✅ Busca de projetos
- ✅ Navegação para detalhes
- ✅ Página de detalhes completa
- ✅ Botão de proposta (provedores)
- ✅ Formulário de criação
- ✅ Validação de campos obrigatórios
- ✅ Seleção de categoria
- ✅ Upload de arquivos
- ✅ Badge de status
- ✅ Filtro por categoria
- ✅ Responsividade mobile

### Dashboard & Performance (18 testes)
- ✅ Acesso ao dashboard
- ✅ Estatísticas do usuário
- ✅ Projetos do usuário
- ✅ Gráficos (Chart.js)
- ✅ Botão criar projeto
- ✅ Notificações recentes
- ✅ Menu de navegação
- ✅ Alternância de visualizações
- ✅ Perfil do usuário
- ✅ Ações rápidas
- ✅ SPA sem recarregar página
- ✅ Hash routing
- ✅ Botão voltar do navegador
- ✅ URLs diretas com hash
- ✅ Performance < 3 segundos
- ✅ Cache de assets
- ✅ Memory leaks
- ✅ Acessibilidade (alt, labels, keyboard)

## 🎯 Executando Testes Específicos

```bash
# Apenas testes da home
npx playwright test home.spec.js

# Apenas testes de autenticação
npx playwright test auth.spec.js

# Apenas um teste específico
npx playwright test -g "deve carregar a home page"

# Apenas testes que falham
npx playwright test --retries=0 --reporter=list
```

## 🔧 Configuração

A configuração está em `playwright.config.js`:

- **Base URL**: `http://localhost/kadesh`
- **Timeout**: 30s por teste
- **Retry**: 2x no CI
- **Trace**: Ativado em retry
- **Screenshot/Video**: Apenas em falhas
- **Workers**: Paralelo (exceto CI)

### Browsers Configurados

1. **Desktop**:
   - Chromium (Chrome/Edge)
   - Firefox
   - WebKit (Safari)

2. **Mobile**:
   - Chrome Mobile (Pixel 5)
   - Safari Mobile (iPhone 12)

## 📊 Relatórios

Após executar os testes, relatórios são gerados em:

- **HTML Report**: `playwright-report/index.html`
- **Screenshots**: `test-results/` (apenas falhas)
- **Videos**: `test-results/` (apenas falhas)
- **Traces**: `test-results/` (retry de falhas)

Visualizar relatório:
```bash
npm run test:report
```

## 🐛 Debug de Testes

### Modo UI (Recomendado)
```bash
npm run test:ui
```
Interface visual com:
- Execução passo a passo
- Inspeção de DOM
- Timeline de ações
- Console logs
- Network requests

### Modo Debug
```bash
npm run test:debug
```
Abre Playwright Inspector para debug detalhado

### Code Generator
```bash
npm run test:codegen
```
Gera testes automaticamente enquanto você navega

## 📝 Escrevendo Novos Testes

Exemplo básico:

```javascript
import { test, expect } from '@playwright/test';

test.describe('Minha Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve fazer algo', async ({ page }) => {
    await page.click('button');
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

### Boas Práticas

1. **Use seletores semânticos**:
   ```javascript
   page.locator('button:has-text("Login")')
   page.locator('[data-testid="submit"]')
   ```

2. **Aguarde elementos**:
   ```javascript
   await page.waitForSelector('.loaded');
   await expect(element).toBeVisible();
   ```

3. **Mock de autenticação**:
   ```javascript
   await context.addCookies([{
     name: 'auth_token',
     value: 'mock_token',
     domain: 'localhost',
     path: '/',
   }]);
   ```

4. **Verifique APIs**:
   ```javascript
   const response = await page.waitForResponse(
     res => res.url().includes('/api/') && res.status() === 200
   );
   ```

## 🚦 CI/CD

Os testes estão prontos para CI/CD. No GitHub Actions:

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run tests
  run: npm test
```

## 📈 Próximos Passos

Testes adicionais recomendados:

1. **Wallet/Pagamentos**: Transações, escrow, saldo
2. **Notificações**: Real-time, leitura, filtros
3. **Reputação**: Avaliações, ratings, reviews
4. **Admin**: Dashboard admin, gestão de usuários
5. **Performance**: Lighthouse CI, métricas Web Vitals
6. **Segurança**: XSS, CSRF, SQL Injection
7. **Visual Regression**: Screenshots comparativos

## 🆘 Troubleshooting

### Testes falhando
1. Verifique se XAMPP está rodando
2. Verifique se banco de dados está populado
3. Limpe cache: `npx playwright clean`
4. Rode em modo debug: `npm run test:debug`

### Performance lenta
1. Rode apenas um browser: `npm run test:chromium`
2. Desabilite paralelização: `workers: 1` no config
3. Use headless mode (padrão)

### Timeout errors
1. Aumente timeout no config
2. Verifique conexão de rede
3. Verifique se API está respondendo

## 📚 Documentação

- [Playwright Docs](https://playwright.dev)
- [API Reference](https://playwright.dev/docs/api/class-test)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

**Testes criados**: 56 testes
**Browsers**: 5 (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)
**Status**: ✅ Pronto para uso
