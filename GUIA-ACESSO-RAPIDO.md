# 🚀 GUIA DE ACESSO - KADESH

## 📍 URL Principal
```
http://localhost/kadesh
```

## 🔑 Como Acessar

### 1. Certifique-se de que o XAMPP está rodando
- Apache: ✅ Rodando
- MySQL: ✅ Rodando

### 2. Acesse no navegador
```
http://localhost/kadesh
```

O sistema irá automaticamente redirecionar para:
```
http://localhost/kadesh/public/jquery-frontend/auctions-marketplace.html
```

---

## 📱 Páginas Disponíveis

### Sistema de Leilões (Novo)
- **Marketplace:** `http://localhost/kadesh/public/jquery-frontend/auctions-marketplace.html`
- **Detalhes do Leilão:** `http://localhost/kadesh/public/jquery-frontend/auction-detail.html?id=X`
- **Meus Lances:** `http://localhost/kadesh/public/jquery-frontend/my-bids.html`
- **Carteira:** `http://localhost/kadesh/public/jquery-frontend/wallet.html`
- **Painel Escrow:** `http://localhost/kadesh/public/jquery-frontend/escrow-panel.html?project_id=X`

### Autenticação
- **Login:** `http://localhost/kadesh/public/jquery-frontend/login.html`
- **Registro:** `http://localhost/kadesh/public/jquery-frontend/register.html`

### Dashboard
- **Dashboard:** `http://localhost/kadesh/public/jquery-frontend/dashboard.html`
- **Criar Projeto:** `http://localhost/kadesh/public/jquery-frontend/create-project.html`

---

## 🔌 API Backend

Base URL:
```
http://localhost/kadesh/public/backend.php
```

### Endpoints Principais

**Autenticação:**
- POST `/api/login`
- POST `/api/register`
- POST `/api/logout`
- GET `/api/user`

**Leilões:**
- GET `/api/auctions/active`
- GET `/api/auctions/:id`
- POST `/api/auctions`
- POST `/api/auctions/:id/end`

**Lances:**
- POST `/api/bids`
- GET `/api/bids/my`

**Carteira:**
- GET `/api/wallet/balance`
- POST `/api/wallet/deposit`
- GET `/api/wallet/statement`

**Escrow:**
- POST `/api/escrow/create`
- POST `/api/escrow/release-milestone`

**Marcos:**
- POST `/api/milestones`
- GET `/api/milestones?project_id=X`
- POST `/api/milestones/submit-evidence`

---

## 🧪 Teste Rápido

### 1. Verificar se o backend está respondendo
Abra no navegador:
```
http://localhost/kadesh/public/backend.php/api/health
```

Deve retornar:
```json
{
  "status": "ok",
  "time": "2025-11-10T...",
  "app": "kadesh-backend-php",
  "php": "8.x.x"
}
```

### 2. Fazer Login (se já tem conta)
```
http://localhost/kadesh/public/jquery-frontend/login.html
```

### 3. Ver Leilões Ativos
```
http://localhost/kadesh/public/jquery-frontend/auctions-marketplace.html
```

---

## ⚙️ Estrutura de Pastas

```
kadesh/
├── index.php                 → Redireciona para marketplace
├── .htaccess                 → Rewrite rules
├── public/
│   ├── backend.php           → API REST
│   ├── index.php             → Front controller
│   └── jquery-frontend/
│       ├── auctions-marketplace.html  ← PÁGINA INICIAL
│       ├── auction-detail.html
│       ├── my-bids.html
│       ├── wallet.html
│       ├── escrow-panel.html
│       ├── login.html
│       ├── register.html
│       ├── dashboard.html
│       ├── create-project.html
│       └── assets/
│           ├── css/
│           │   └── kadesh-theme.css
│           └── js/
│               └── kadesh-auth.js
└── src/
    └── Backend/
        └── Controllers/
            ├── UserController.php
            ├── AuctionController.php
            ├── BidController.php
            ├── WalletController.php
            ├── EscrowController.php
            ├── MilestoneController.php
            ├── DisputeController.php
            ├── NotificationController.php
            ├── TimelineController.php
            └── ReviewController.php
```

---

## 🔧 Troubleshooting

### Problema: "Not Found" ao acessar localhost/kadesh
**Solução:** Verifique se o Apache está rodando e se o .htaccess está habilitado no httpd.conf:
```apache
AllowOverride All
```

### Problema: API retorna 404
**Solução:** Verifique se o RewriteEngine está ativo no .htaccess:
```apache
RewriteEngine On
RewriteBase /kadesh/
```

### Problema: Sessão não persiste
**Solução:** Verifique as configurações de cookie no backend.php (linha 17):
```php
session_set_cookie_params(['lifetime' => 604800, ...]);
```

### Problema: CORS error no console
**Solução:** Como estamos usando same-origin (`localhost/kadesh`), não deve ter CORS. Se aparecer, verifique se está acessando via `http://localhost` (não `127.0.0.1`).

---

## 📝 Credenciais de Teste

### Criar Novo Usuário
1. Acesse: `http://localhost/kadesh/public/jquery-frontend/register.html`
2. Preencha:
   - Nome: Seu Nome
   - Email: teste@kadesh.com
   - Senha: 123456
   - Tipo: Contractor ou Provider

### Ou usar usuário existente (se já criou antes)
- Email: admin@kadesh.com
- Senha: admin123

---

## ✅ Checklist de Funcionamento

- [ ] XAMPP Apache rodando
- [ ] XAMPP MySQL rodando
- [ ] `http://localhost/kadesh` redireciona para marketplace
- [ ] Login funciona
- [ ] API `/api/health` responde
- [ ] Marketplace carrega leilões
- [ ] Consegue dar lance
- [ ] Carteira mostra saldo
- [ ] Escrow funciona

---

## 🎯 Fluxo Completo de Teste

1. **Acesse:** `http://localhost/kadesh`
2. **Faça login** (ou registre-se)
3. **Dashboard:** Veja seus projetos
4. **Criar Projeto:** Clique em "+ Publicar uma tarefa"
5. **Ver Leilões:** Navegue para "Leilões"
6. **Dar Lance:** Clique em um leilão e submeta um lance
7. **Carteira:** Deposite fundos (mock)
8. **Escrow:** Aceite uma proposta e gerencie marcos

Pronto! Sistema 100% funcional em `http://localhost/kadesh` 🚀
