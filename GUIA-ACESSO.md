# 🚀 KADESH - GUIA COMPLETO DE ACESSO

## 📍 URL de Acesso Correta

### ✅ XAMPP (Desenvolvimento Local)
```
http://localhost/kadesh/
```

### ❌ NÃO USE ESTAS URLS:
- ~~http://localhost:5175/kadesh/~~ (Vite dev server - NÃO É USADO)
- ~~http://localhost:5174/kadesh/~~ (Porta antiga)
- ~~npm run dev~~ (NÃO É NECESSÁRIO)

---

## 🎯 Como Funciona

### Stack Real do Projeto

```
XAMPP Apache
    ↓
http://localhost/kadesh/
    ↓
public/index.php (PHP Puro)
    ↓
Carrega: public/build/assets/*.js (Vue 3 já compilado)
    ↓
SPA funciona com router client-side
```

### NÃO É Laravel
- ❌ Não usa `php artisan`
- ❌ Não usa Composer para rodar
- ❌ Não usa npm run dev
- ✅ É PHP puro com Vue compilado

### NÃO É Vite Dev Server
- ❌ Não roda npm run dev
- ❌ Não usa porta 5175
- ✅ Usa arquivos já compilados em `public/build/`

---

## 🧪 Como Testar o Sistema

### 1. Tela Inicial (Visitantes)
```
URL: http://localhost/kadesh/
O que ver: Header com "Entrar" e "Registrar"
```

### 2. Lista de Projetos
```
URL: http://localhost/kadesh/#/projects
O que ver: Cards bonitos com gradientes e animações
```

### 3. Detalhe de Projeto
```
URL: http://localhost/kadesh/#/projects/7
O que ver: Design premium com cards 3D coloridos
```

### 4. Login
```
URL: http://localhost/kadesh/#/login
Credenciais:
- Admin: admin@teste.com / Teste@123
- Contratante: contratante@teste.com / Teste@123
- Fornecedor: fornecedor@teste.com / Teste@123
```

### 5. Dashboard Admin
```
URL: http://localhost/kadesh/#/admin/dashboard
Login como: admin@teste.com / Teste@123
O que ver: KPI cards 3D animados com estatísticas
```

---

## 🛠️ Estrutura Técnica

### Backend (PHP Puro)
```
backend.php          → API REST completa
backend-admin.php    → Rotas admin
backend-provider.php → Rotas fornecedor
backend-reviews.php  → Sistema de avaliações
```

**Acesso:** `http://localhost/kadesh/api/*`

### Frontend (Vue 3 SPA)
```
frontend/src/        → Código fonte Vue
public/build/        → Arquivos compilados
public/index.php     → Entry point
```

**Roteamento:** Hash-based (#/projects, #/login, etc.)

### Banco de Dados (MySQL)
```
Database: kadesh
Tabelas:
- users (contratantes + fornecedores + admins)
- projects
- bids
- transactions
- reviews
- messages
- admin_users
- settings
```

---

## 📂 Arquivos Importantes

### Rotas Frontend
```
frontend/src/router/index.js
- Define todas as rotas (#/projects, #/login, etc.)
- Guards de autenticação
- Verificação de tipo de usuário
```

### Configuração API
```
frontend/src/services/api.js
- baseURL: '/kadesh/' ou produção
- withCredentials: true (para sessões)
```

### Entry Point
```
public/index.php
- Carrega Vue app de public/build/
- Redireciona tudo para index.html
```

---

## 🔧 Desenvolvimento

### Quando Editar Frontend

1. **Edite os arquivos:**
   ```
   frontend/src/views/*.vue
   frontend/src/components/*.vue
   frontend/src/router/index.js
   ```

2. **Compile:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Resultado:**
   ```
   Gera arquivos em: public/build/
   ```

4. **Acesse:**
   ```
   http://localhost/kadesh/
   (Usa os arquivos compilados)
   ```

### Quando Editar Backend

1. **Edite:**
   ```
   backend.php
   backend-*.php
   ```

2. **Acesse:**
   ```
   http://localhost/kadesh/
   (Mudanças já funcionam imediatamente)
   ```

---

## 🎨 Telas Redesenhadas

### Projects.vue (Lista)
```
URL: http://localhost/kadesh/#/projects
Design:
- Hero section animado
- Cards 3D com hover effects
- Gradientes vibrantes
- Info cards coloridos
```

### ProjectShow.vue (Detalhe)
```
URL: http://localhost/kadesh/#/projects/ID
Design:
- Barra gradiente no topo
- Cards de info 3D coloridos
- Propostas com header colorido
- Formulário premium
```

### AdminDashboard.vue
```
URL: http://localhost/kadesh/#/admin/dashboard
Design:
- Header moderno com gradiente
- KPI cards 3D animados
- Hover effects premium
```

---

## ✅ Checklist de Funcionamento

### Sistema Funcionando Quando:
- ✅ XAMPP Apache rodando
- ✅ MySQL rodando
- ✅ Banco `kadesh` existe
- ✅ Arquivos em `public/build/` existem
- ✅ Acessa `http://localhost/kadesh/`
- ✅ Vê tela inicial com Vue carregado

### Problemas Comuns:

#### "Página em branco"
```
Solução:
1. Verificar console do navegador
2. Verificar se public/build/ tem arquivos
3. cd frontend && npm run build
```

#### "API não responde"
```
Solução:
1. Verificar se Apache está rodando
2. Verificar se MySQL está rodando
3. Testar: http://localhost/kadesh/api/health
```

#### "Sessão não persiste"
```
Solução:
1. Verificar cookies no navegador
2. Limpar cookies
3. Fazer login novamente
```

---

## 🎯 URLs de Teste Rápido

### Públicas (sem login)
```
http://localhost/kadesh/                    → Home
http://localhost/kadesh/#/projects          → Lista de projetos
http://localhost/kadesh/#/projects/7        → Detalhe
http://localhost/kadesh/#/login             → Login
http://localhost/kadesh/#/register          → Registro
```

### Autenticadas (precisa login)
```
http://localhost/kadesh/#/projects/create   → Criar projeto (contractor)
http://localhost/kadesh/#/provider/profile  → Perfil fornecedor
http://localhost/kadesh/#/admin/dashboard   → Dashboard admin
http://localhost/kadesh/#/admin/settings    → Configurações admin
```

### API (backend)
```
http://localhost/kadesh/api/health          → Status
http://localhost/kadesh/api/projects        → Lista projetos
http://localhost/kadesh/api/user            → Usuário atual
http://localhost/kadesh/api/login           → Fazer login
```

---

## 📊 Status do Sistema

| Módulo | Status | URL |
|--------|--------|-----|
| Home | ✅ | http://localhost/kadesh/ |
| Projetos | ✅ | http://localhost/kadesh/#/projects |
| Detalhe | ✅ | http://localhost/kadesh/#/projects/7 |
| Login | ✅ | http://localhost/kadesh/#/login |
| Admin | ✅ | http://localhost/kadesh/#/admin/dashboard |
| API | ✅ | http://localhost/kadesh/api/* |

---

## 🎉 Resumo

**URL ÚNICA DO SISTEMA:**
```
http://localhost/kadesh/
```

**NÃO precisa:**
- ❌ npm run dev
- ❌ php artisan serve
- ❌ Vite dev server
- ❌ Porta 5175

**SÓ precisa:**
- ✅ XAMPP rodando
- ✅ Acessar http://localhost/kadesh/
- ✅ Pronto!

**FIM! 🚀**
