# 🔐 CONTROLE DE ACESSO POR TIPO DE USUÁRIO

## 🎯 Mudanças Implementadas

Sistema agora diferencia corretamente contratantes de fornecedores, com controle de acesso baseado em tipo de usuário.

---

## 📋 Regras de Acesso

### 👔 Contratante (contractor)

**Pode:**
- ✅ Ver lista de projetos
- ✅ **Criar novos projetos**
- ✅ Ver detalhes de projetos
- ✅ Aceitar lances em seus projetos
- ✅ Fazer pagamentos
- ✅ Avaliar fornecedores

**Não pode:**
- ❌ Enviar lances em projetos
- ❌ Acessar área de fornecedor (perfil/portfólio)

### ⚡ Fornecedor (provider)

**Pode:**
- ✅ Ver lista de projetos
- ✅ Ver detalhes de projetos
- ✅ **Enviar lances/propostas**
- ✅ **Editar perfil de fornecedor**
- ✅ **Gerenciar portfólio**

**Não pode:**
- ❌ Criar novos projetos
- ❌ Aceitar lances
- ❌ Fazer pagamentos como contratante

### 🔄 Ambos (both)

Tem acesso completo a todas as funcionalidades de contratante E fornecedor.

---

## 🛡️ Proteções Implementadas

### 1. Frontend (App.vue)

**Botão "+ Projeto" visível apenas para contratantes:**

```vue
<!-- ANTES: Botão visível para todos -->
<router-link to="/projects/create">+ Projeto</router-link>

<!-- AGORA: Botão condicional -->
<router-link v-if="user.user_type === 'contractor' || user.user_type === 'both'" 
             to="/projects/create">
  + Projeto
</router-link>
```

### 2. Router Guards (router/index.js)

**Proteção de rotas por tipo de usuário:**

```javascript
// Rotas de Contratante
{
  path: '/projects/create',
  meta: { requiresAuth: true, requiresContractor: true }
}

// Rotas de Fornecedor
{
  path: '/provider/profile',
  meta: { requiresAuth: true, requiresProvider: true }
}
```

**Navigation Guard:**

```javascript
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresContractor) {
    if (user.user_type !== 'contractor' && user.user_type !== 'both') {
      alert('❌ Apenas contratantes podem criar projetos!')
      next('/projects')
      return
    }
  }
  
  if (to.meta.requiresProvider) {
    if (user.user_type !== 'provider' && user.user_type !== 'both') {
      alert('❌ Apenas fornecedores têm acesso a esta área!')
      next('/projects')
      return
    }
  }
})
```

### 3. Backend (backend.php)

**Endpoint `/api/user` melhorado:**

```php
function handleGetUser() {
    // Retorna 401 se não autenticado
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Não autenticado', 'user' => null]);
        return;
    }
    
    $user = getCurrentUser();
    echo json_encode(['user' => $user]);
}
```

**Sessão PHP configurada corretamente:**

```php
session_set_cookie_params([
    'lifetime' => 0,              // Sessão expira ao fechar navegador
    'path' => '/kadesh/',
    'secure' => $isProduction,
    'httponly' => true,           // Previne acesso via JavaScript
    'samesite' => 'Lax'          // Permite envio em navegação normal
]);
```

### 4. API Service (api.js)

**Configuração para preservar sessão:**

```javascript
const api = axios.create({
  baseURL,
  withCredentials: true, // ✅ IMPORTANTE: Habilita envio de cookies/sessão
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});
```

---

## 🧪 Como Testar

### Opção 1: Página de Teste de Sessão

```
Abrir: http://localhost/kadesh/test-session.html

1. Clicar "Login (Contratante)"
2. Verificar se sessão persiste
3. Fazer logout
4. Clicar "Login (Fornecedor)"
5. Tentar acessar /projects/create (deve ser bloqueado)
```

### Opção 2: Teste Manual no Sistema

#### Teste como Contratante

```
1. Login:
   Email: contratante@teste.com
   Senha: Teste@123

2. Verificar:
   ✅ Botão "+ Projeto" visível no header
   ✅ Pode acessar /projects/create
   ❌ Não pode enviar lances

3. Criar um projeto
4. Fazer logout
```

#### Teste como Fornecedor

```
1. Login:
   Email: fornecedor@teste.com
   Senha: Teste@123

2. Verificar:
   ❌ Botão "+ Projeto" NÃO aparece
   ✅ Links "Perfil" e "Portfólio" aparecem
   ✅ Pode enviar lances em projetos

3. Tentar acessar manualmente: /projects/create
   Resultado esperado: Alert + redirect para /projects

4. Acessar /provider/profile
   Resultado esperado: Sucesso
```

---

## 📊 Usuários de Teste Criados

| Nome | Email | Senha | Tipo | ID |
|------|-------|-------|------|-----|
| João Contratante | contratante@teste.com | Teste@123 | contractor | 17 |
| Maria Fornecedora | fornecedor@teste.com | Teste@123 | provider | 18 |
| Admin Teste | admin@teste.com | Teste@123 | admin | 2 |

---

## 🔍 Fluxo de Autenticação

```
1. Usuário faz login → POST /api/login
   ↓
2. Backend verifica credenciais
   ↓
3. Backend cria sessão PHP: $_SESSION['user_id'] = X
   ↓
4. Backend retorna cookie PHPSESSID
   ↓
5. Frontend armazena cookie (automático)
   ↓
6. Próximas requisições incluem cookie automaticamente
   (graças a withCredentials: true)
   ↓
7. Backend lê sessão e identifica usuário
   ↓
8. Router Guards verificam tipo de usuário
   ↓
9. Acesso permitido ou negado
```

---

## ⚠️ Pontos Importantes

### Sessão PHP

- ✅ Cookie PHPSESSID é enviado automaticamente
- ✅ Sessão persiste entre páginas
- ✅ Expira ao fechar navegador (lifetime: 0)
- ✅ HttpOnly: Não acessível via JavaScript (segurança)

### Navigation Guards

- ✅ Verificação no cliente (UX imediata)
- ✅ Alert amigável quando bloqueado
- ✅ Redirect automático para rota permitida

### Backend Security

- ✅ Todas as rotas protegidas verificam sessão
- ✅ Retorna 401 se não autenticado
- ✅ SQL Injection protegido (prepared statements)
- ✅ Password hash com bcrypt

---

## 📝 Checklist de Validação

### Frontend
- [x] Botão "+ Projeto" só aparece para contratantes
- [x] Links de fornecedor só aparecem para providers
- [x] Router guards bloqueiam acesso indevido
- [x] Alert amigável quando bloqueado
- [x] Sessão preservada após refresh

### Backend
- [x] Endpoint /api/user retorna 401 se não logado
- [x] Sessão PHP configurada corretamente
- [x] Cookie PHPSESSID funciona
- [x] withCredentials: true no axios

### Usuários de Teste
- [x] Contratante criado
- [x] Fornecedor criado
- [x] Admin criado
- [x] Senhas com hash correto

---

## 🚀 Próximos Passos

1. ✅ Sistema funcionando localmente
2. ⏳ Testar em produção (HTTPS)
3. ⏳ Ajustar cookie params para produção
4. ⏳ Implementar refresh token (opcional)
5. ⏳ Adicionar log de acessos (auditoria)

---

## 🎉 Status Atual

**SISTEMA 100% FUNCIONAL!**

- ✅ Controle de acesso por tipo de usuário
- ✅ Sessão PHP preservada
- ✅ Router guards funcionando
- ✅ UI adaptada por tipo de usuário
- ✅ Backend protegido
- ✅ Testes criados

**Teste agora:**
1. http://localhost/kadesh/test-session.html (teste de sessão)
2. http://localhost/kadesh/login (teste visual)
