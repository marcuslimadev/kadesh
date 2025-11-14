# 🧪 Relatório Playwright – 11/11/2025

**Execução:** `$env:PLAYWRIGHT_BASE_URL="http://localhost:5175/kadesh"; npx playwright test --reporter=line`  
**Browser:** Chromium (desktop)  
**Resultado:** 9 aprovados • 267 falhas • 4 testes ignorados  
**Duração:** ~12 minutos

> Todos os cenários falharam logo na primeira navegação. As falhas são estruturais (ambiente indisponível) e não necessariamente defeitos de código da aplicação. Abaixo está o diagnóstico para desbloquear uma execução confiável.

---

## 🔴 Principais problemas detectados

- **Servidor Vite indisponível durante os testes**  
  - Todas as specs que fazem `page.goto('/')`, `page.goto('/login')`, etc. retornaram `net::ERR_CONNECTION_REFUSED` (`tests/e2e/01-home.spec.js`, `02-auth.spec.js`, `03-contractor.spec.js`, `04-provider.spec.js`, `05-admin.spec.js`, `06-wallet.spec.js`, `07-notifications.spec.js`, `07-responsiveness.spec.js`, `08-integration.spec.js`, `auth.spec.js`, `dashboard.spec.js`, `home.spec.js`, `login-dashboard.spec.js`, `projects.spec.js`).  
  - Evidência: `Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:5175/#projects` (`tests/e2e/projects.spec.js:218`).  
  - Causa raiz: o comando `npm run dev` foi encerrado quando o runner iniciou; sem Vite rodando não há front-end para abrir.

- **Base URL aponta para subcaminho `/kadesh`, mas os testes usam caminhos absolutos iniciando em `/`**  
  - `playwright.config.js` agora aceita `PLAYWRIGHT_BASE_URL`. O valor usado (`http://localhost:5175/kadesh`) combinado com `page.goto('/...')` gera navegações para `http://localhost:5175/...` (sem `/kadesh`).  
  - Resultado: mesmo com Vite ativo, a navegação cairia fora do bundle. Exemplos em `tests/e2e/01-home.spec.js` (linha 6) e `tests/e2e/03-contractor.spec.js` (linha 20).

- **Páginas estáticas `public/jquery-frontend/**` não são servidas pelo Vite**  
  - Specs `theme.spec.js` e `auctions.spec.js` tentam abrir `http://localhost:5175/public/jquery-frontend/*.html` e também recebem `ERR_CONNECTION_REFUSED`.  
  - Esses arquivos ficam disponíveis apenas via Apache/PHP (`http://localhost/kadesh/public/...`). Enquanto o ambiente do Playwright usar o Vite dev server, esses cenários continuarão falhando.

- **APIs PHP não estavam disponíveis durante o teste**  
  - As specs `api-backend.spec.js` e `api-backend-old.spec.js` dependem do backend em `http://localhost/kadesh/public/backend.php`.  
  - Sem Apache/PHP ativos, todas as requisições falham com `ERR_CONNECTION_REFUSED` ou timeout.

---

## 🔍 Visão por especificação

| Spec | Escopo | Falha observada | Ação imediata |
|------|--------|-----------------|---------------|
| `tests/e2e/01-home.spec.js` a `08-integration.spec.js` | Fluxos SPA Vue | Navegação inicial falha (`ERR_CONNECTION_REFUSED`) | Garantir Vite ativo e baseURL apontando para `/kadesh` corretamente |
| `tests/e2e/06-wallet.spec.js`, `07-notifications.spec.js`, `03-dashboard.spec.js`, `dashboard.spec.js`, `login-dashboard.spec.js` | Áreas autenticadas | Mesmo erro logo em `/login` ou `/dashboard` | Idem acima + garantir seeds/dados |
| `tests/e2e/projects.spec.js` | Listagens e criação | Navegação para `/#projects` usada sem `/kadesh` | Ajustar baseURL ou rotas dos testes |
| `tests/e2e/theme.spec.js`, `auctions.spec.js` | Templates estáticos jQuery | `page.goto('/public/jquery-frontend/...')` indisponível | Servir via Apache (`http://localhost/kadesh/public/...`) ou mover assets para Vite |
| `tests/e2e/api-backend*.spec.js` | REST API PHP | Requisições `fetch` falham imediatamente | Subir backend PHP antes do suite |

---

## ✅ Passos recomendados para a próxima execução

1. **Subir o frontend e mantê-lo ativo**  
   - Rodar `npm run dev -- --host localhost --port 5175 --strictPort` em um terminal separado e deixá-lo aberto.  
   - Alternativa: ativar `webServer` no `playwright.config.js` para que o Playwright automatize esse passo.

2. **Executar o backend PHP/Apache**  
   - Garantir que o Apache do XAMPP está ativo servindo `http://localhost/kadesh`.  
   - Se usar PHP embutido: `php -S localhost:8000 -t public` e ajustar os testes/Proxy conforme necessário.

3. **Revisar navegações com `/kadesh`**  
   - Opções: (a) definir `PLAYWRIGHT_BASE_URL="http://localhost:5175"` e alterar chamadas para `page.goto('/kadesh/...')`; ou (b) manter `PLAYWRIGHT_BASE_URL="http://localhost:5175/kadesh"` e trocar as navegações para relativas (`page.goto('./')`, `page.goto('./#projects')`).

4. **Servir os arquivos `public/jquery-frontend`**  
   - Ajustar Playwright para usar `http://localhost/kadesh` quando o cenário for legacy (usar `page.goto('http://localhost/kadesh/public/...')`) ou hospedar esses HTML dentro do bundle Vite.

5. **Retestar após estabilizar o ambiente**  
   - Com frontend + backend ativos e caminhos corrigidos, rodar `npx playwright test --reporter=list`.  
   - Em caso de novas falhas, coletar traces (`npx playwright test --trace on`).

---

## ℹ️ Observações adicionais

- O arquivo `TESTE-E2E-RELATORIO.md` contém um relatório anterior com sucesso total (66/66). Ele não reflete o estado atual e pode confundir a equipe. Considere atualizá-lo ou arquivá-lo.
- `playwright.config.js` foi atualizado para permitir o override via variável `PLAYWRIGHT_BASE_URL`. Use essa flexibilidade para alinhar ambiente frontend/backend antes da próxima bateria.

---

**Responsável:** GitHub Copilot (execução automatizada)  
**Data/Hora:** 11/11/2025  
**Próximo passo sugerido:** estabilizar servidores locais e repetir o suite para identificar falhas funcionais reais depois que o ambiente estiver operacional.