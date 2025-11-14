# Acesso Simplificado - Kadesh

## ✅ Sistema Configurado

O sistema agora funciona com **same-origin** (sem necessidade de CORS ou camadas intermediárias).

## 🌐 URLs de Acesso

### Desenvolvimento Local (XAMPP)

```
http://localhost/kadesh
```

Será automaticamente redirecionado para:
```
http://localhost/kadesh/public/jquery-frontend/leiloes-original.html
```

### API Backend

```
http://localhost/kadesh/public/backend.php/api/auctions/active
```

## 🔧 Correções Aplicadas

### 1. **Roteamento da API corrigido**
- **Problema**: Path incluía `/backend.php` causando erro 404/401
- **Solução**: Adicionado regex para remover `/backend.php` do path calculado
- **Arquivo**: `public/backend.php` (linha 128)

```php
// Remover /backend.php se existir (quando acessado como backend.php/api/...)
$path = preg_replace('#^/backend\.php#', '', $path);
```

### 2. **JavaScript atualizado**
- **Problema**: Frontend esperava `response.success` e `response.data`
- **Solução**: Backend retorna `response.auctions` diretamente
- **Arquivo**: `public/jquery-frontend/leiloes-original.html` (linha 508)

```javascript
// Backend retorna { auctions: [], total: N }
if (response.auctions && response.auctions.length > 0) {
    renderAuctions(response.auctions);
}
```

### 3. **Redirecionamento simplificado**
- **Problema**: URL longa e confusa
- **Solução**: `index.php` na raiz redireciona automaticamente
- **Arquivo**: `index.php`

```php
<?php
header('Location: /kadesh/public/jquery-frontend/leiloes-original.html');
exit;
```

### 4. **Arquivos de teste removidos**
Arquivos obsoletos eliminados:
- ❌ `public/test-api.php`
- ❌ `public/test-db.php`
- ❌ `public/test-login.php`
- ❌ `public/test-login-real.php`
- ❌ `public/test-login-sim.php`
- ❌ `public/test-php.php`
- ❌ `public/test-request.php`
- ❌ `public/test-session.php`
- ❌ `public/test.html`

## 📊 Teste de Funcionalidade

### Verificar API via PowerShell:

```powershell
Invoke-WebRequest -Uri "http://localhost/kadesh/public/backend.php/api/auctions/active" | 
  Select-Object -ExpandProperty Content | 
  ConvertFrom-Json | 
  Select-Object total, @{N='auctions';E={$_.auctions.Count}}
```

**Resultado esperado:**
```
total auctions
----- --------
    4        4
```

### Verificar no navegador:

1. Abra: `http://localhost/kadesh`
2. Será redirecionado automaticamente
3. Verifique se os leilões aparecem na seção "Leilões Ativos"
4. Abra DevTools (F12) → Console
5. Não deve haver erros 401 ou 404

## 🚀 Estrutura de URLs

```
http://localhost/kadesh/
├── → index.php (redireciona)
└── public/
    ├── backend.php (API REST)
    │   └── /api/auctions/active ✅ PÚBLICO
    │   └── /api/auctions/{id} ✅ PÚBLICO
    │   └── /api/projects ✅ PÚBLICO
    │   └── /api/bids ⚠️ PROTEGIDO (requer login)
    │   └── /api/projects/my ⚠️ PROTEGIDO
    │
    └── jquery-frontend/
        ├── leiloes-original.html ⭐ PÁGINA PRINCIPAL
        └── assets/
            ├── css/kadesh-original-theme.css
            └── images/ (11 imagens profissionais)
```

## ⚙️ Configuração Same-Origin

**Vantagens:**
- ✅ Sem necessidade de configurar CORS
- ✅ Cookies de sessão funcionam automaticamente
- ✅ Sem preflight OPTIONS requests
- ✅ Performance melhorada (menos requisições)

**Como funciona:**
- Frontend: `http://localhost/kadesh/public/jquery-frontend/leiloes-original.html`
- Backend: `http://localhost/kadesh/public/backend.php/api/...`
- **Mesma origem** = Mesmo protocolo (http) + host (localhost) + porta (80)

## 🔐 Endpoints Públicos vs Protegidos

### ✅ Públicos (sem autenticação):
- `GET /api/auctions/active` - Lista leilões ativos
- `GET /api/auctions/{id}` - Detalhe de um leilão
- `GET /api/projects` - Lista todos os projetos
- `GET /api/projects/{id}` - Detalhe de um projeto
- `POST /api/register` - Cadastro de usuário
- `POST /api/login` - Login
- `GET /api/health` - Health check

### ⚠️ Protegidos (requer login):
- `POST /api/bids` - Criar lance
- `GET /api/projects/my` - Meus projetos
- `POST /api/projects` - Criar projeto
- `PUT /api/projects/{id}` - Atualizar projeto
- `DELETE /api/projects/{id}` - Deletar projeto

## 📝 Notas Importantes

1. **Não mova o `backend.php` para a raiz** - Os paths relativos dos `require_once` dependem da estrutura `public/`

2. **Cache-busting** - Imagens usam `?v=2` para forçar reload:
   ```html
   <img src="/kadesh/public/assets/images/hero-handshake.jpg?v=2">
   ```

3. **Fallbacks** - Imagens têm fallbacks em caso de erro:
   ```html
   <img src="hero-handshake.jpg" onerror="this.src='hero-business.jpg'">
   ```

## 🎨 Recursos Visuais

- **Tema**: Navy (#2c3e50) + Yellow (#f4d03f)
- **11 imagens profissionais** do Unsplash (~720 KB total)
- **Responsivo**: Mobile, Tablet, Desktop
- **9 seções completas**: Hero, Categorias, Como Funciona, Leilões, News, CTA, Stats, Newsletter, Footer

---

**Status**: ✅ FUNCIONANDO
**Última atualização**: 8 de novembro de 2025
**Branch**: feature/implementacao-migracao-old-system
