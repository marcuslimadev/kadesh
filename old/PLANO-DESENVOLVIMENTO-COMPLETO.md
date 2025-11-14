# Plano de Desenvolvimento Completo - Kadesh Frontend

## Status Atual ✅
- ✅ Login e Registro funcionando
- ✅ Home page com projetos em destaque
- ✅ Menu de navegação funcional
- ✅ Sistema de autenticação JWT
- ✅ Playwright instalado e configurado
- ✅ 67 tabelas MySQL operacionais

## Páginas "Em Desenvolvimento" Identificadas

### 1. Dashboard 📊
**Arquivo**: `main-bulma.js` linha 577  
**Implementação**: `auctions-bulma.js` já tem `loadDashboardPage()`  
**Endpoints necessários**:
- `GET /api/dashboard/stats` - Estatísticas do usuário
- `GET /api/timeline/recent` - Atividade recente

### 2. Projetos 📁
**Arquivo**: `main-bulma.js` linha 569  
**Implementação**: `projects-bulma.js` já tem `loadProjectsPage()`  
**Endpoints necessários**:
- `GET /api/projects` - Listar todos ✅ (já existe)
- `GET /api/projects/my` - Meus projetos
- `GET /api/projects/:id` - Detalhes do projeto
- `POST /api/projects` - Criar projeto
- `PUT /api/projects/:id` - Editar projeto
- `DELETE /api/projects/:id` - Deletar projeto

### 3. Leilões 🎯
**Arquivo**: `main-bulma.js` linha 573  
**Implementação**: `auctions-bulma.js` já tem `loadAuctionsPage()`  
**Endpoints necessários**:
- `GET /api/auctions/active` - Leilões ativos
- `GET /api/auctions/:id` - Detalhes do leilão
- `POST /api/bids` - Criar proposta
- `GET /api/projects/:id/bids` - Propostas de um projeto

### 4. Carteira 💰
**Arquivo**: `main-bulma.js` linha 581  
**Implementação**: `wallet-bulma.js` já tem `loadWalletPage()`  
**Endpoints necessários**:
- `GET /api/wallet/details` - Detalhes da carteira
- `GET /api/wallet/balance` - Saldo ✅ (já existe)
- `GET /api/wallet/transactions` - Histórico de transações
- `POST /api/wallet/deposit` - Depositar
- `POST /api/wallet/withdraw` - Sacar

### 5. Reputação ⭐
**Arquivo**: `main-bulma.js` linha 585  
**Implementação**: `reputation-bulma.js` já tem `loadReputationPage()`  
**Endpoints necessários**:
- `GET /api/reputation/profile` - Perfil de reputação
- `GET /api/reputation/badges` - Conquistas
- `GET /api/reputation/reviews` - Avaliações
- `POST /api/reviews` - Criar avaliação

### 6. Perfil 👤
**Arquivo**: `main-bulma.js` linha 589  
**Implementação**: `reputation-bulma.js` já tem `loadProfilePage()`  
**Endpoints necessários**:
- `GET /api/profile` - Dados do perfil
- `PUT /api/profile` - Atualizar perfil
- `POST /api/profile/avatar` - Upload de foto
- `PUT /api/password` - Alterar senha

### 7. Meus Projetos 💼
**Arquivo**: `main-bulma.js` linha 593  
**Implementação**: `projects-bulma.js` já tem `loadMyProjectsPage()`  
**Endpoints necessários**:
- `GET /api/projects/my` - Meus projetos
- `GET /api/bids/my` - Minhas propostas
- `POST /api/projects/:id/accept-bid` - Aceitar proposta

---

## Prioridade de Implementação 🎯

### Fase 1: Core Features (Alta Prioridade)
1. **Backend - Projetos** 
   - Controllers/ProjectController completo
   - CRUD de projetos
   - Sistema de propostas/bids
   
2. **Backend - Leilões**
   - Sistema de leilão reverso
   - Ranking de propostas
   - Fechamento automático

3. **Frontend - Integração**
   - Remover todos "Em desenvolvimento" de `main-bulma.js`
   - Conectar com módulos `-bulma.js` correspondentes

### Fase 2: Monetização (Média Prioridade)
4. **Backend - Carteira**
   - Sistema de transações
   - Histórico de pagamentos
   
5. **Integração Mercado Pago**
   - Depósitos
   - Saques
   - Webhooks
   - Sistema de escrow

### Fase 3: Engajamento (Média Prioridade)
6. **Backend - Reputação**
   - Sistema de avaliações
   - Badges/conquistas
   - Níveis de experiência
   
7. **Backend - Dashboard**
   - Estatísticas do usuário
   - Timeline de eventos
   - Gráficos

### Fase 4: Refinamento (Baixa Prioridade)
8. **Perfil de Usuário**
   - Edição de dados
   - Upload de avatar
   - Alteração de senha

9. **Notificações em Tempo Real**
   - Sistema de notificações
   - Badge no menu
   - Pusher/WebSocket

10. **Testes E2E Completos**
    - Cobertura de 80%+
    - Todos os fluxos críticos

---

## Estrutura de Desenvolvimento

### Backend (PHP)
```
src/Backend/
├── Controllers/
│   ├── AuthController.php ✅
│   ├── ProjectController.php ⚠️ (parcial)
│   ├── BidController.php ❌
│   ├── WalletController.php ❌
│   ├── ReputationController.php ❌
│   ├── DashboardController.php ❌
│   └── ProfileController.php ❌
├── Models/
│   ├── User.php ✅
│   ├── Project.php ✅
│   ├── Bid.php ❌
│   ├── Transaction.php ❌
│   ├── Review.php ❌
│   └── Badge.php ❌
```

### Frontend (jQuery + Bulma)
```
public/jquery-frontend/assets/js/
├── config.js ✅
├── main-bulma.js ⚠️ (remover stubs)
├── auth-bulma.js ✅
├── projects-bulma.js ✅ (pronto)
├── auctions-bulma.js ✅ (pronto)
├── wallet-bulma.js ✅ (pronto)
├── reputation-bulma.js ✅ (pronto)
└── notifications-bulma.js ⚠️ (parcial)
```

---

## Próximos Passos Imediatos 🚀

1. **Remover stubs "Em desenvolvimento"** em `main-bulma.js`
2. **Criar BidController** com endpoints de propostas
3. **Criar WalletController** com transações
4. **Criar DashboardController** com estatísticas
5. **Testar cada página** conforme implementação
6. **Rodar testes E2E** e ajustar

---

## Comandos Úteis

```bash
# Rodar testes E2E
npm test

# Rodar testes em modo debug
npm run test:headed

# Ver relatório de testes
npm run test:report

# Iniciar servidor (XAMPP já roda automaticamente)
# http://localhost/kadesh
```

---

## Notas de Implementação

- ✅ **Autenticação**: Totalmente funcional com sessões PHP
- ⚠️ **API**: Usar `$_POST_JSON` global para ler JSON no backend
- ⚠️ **Frontend**: Sempre usar `JSON.stringify()` e `contentType: 'application/json'` no jQuery
- 📝 **Database**: 67 tabelas MySQL já criadas e operacionais
- 🎨 **Design**: Bulma CSS com gradientes e glassmorphism aplicados

---

**Última atualização**: 6 de novembro de 2025
