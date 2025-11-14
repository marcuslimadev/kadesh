# 📁 Nova Estrutura do Projeto Kadesh

## ✅ Mudanças Realizadas

A pasta `frontend/` foi **completamente eliminada**! Agora tudo funciona **direto na raiz** do projeto.

### Antes (estrutura antiga):
```
kadesh/
├── frontend/              ❌ REMOVIDO
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── public/
    └── backend.php
```

### Agora (estrutura limpa):
```
kadesh/
├── src/                   ✅ Código Vue 3 (movido da frontend/src/)
│   ├── components/
│   ├── views/
│   ├── router/
│   └── services/
├── public/                ✅ Backend PHP e build
│   ├── build/            (gerado pelo npm run build)
│   ├── backend.php
│   ├── index.php
│   └── MercadoPago.php
├── index.html             ✅ Template principal (raiz)
├── package.json           ✅ Dependências (raiz)
├── vite.config.js         ✅ Configuração Vite (raiz)
└── tailwind.config.js     ✅ Configuração Tailwind (raiz)
```

## 🚀 Comandos Atualizados

### Desenvolvimento Local (XAMPP)

```bash
# 1. Instalar dependências
npm install

# 2. Build do frontend
npm run build

# 3. Acessar aplicação
http://localhost/kadesh/
```

### Estrutura de Deploy

- **Frontend Build**: `npm run build` → Gera arquivos em `public/build/`
- **Backend API**: `public/backend.php` → Roteado via `public/index.php`
- **Front Controller**: `public/index.php` → Roteia tudo
- **Assets**: Servidos de `public/build/assets/`

## 📝 Arquivos Removidos

### Arquivos Duplicados Eliminados:
- ❌ `/frontend/*` - Pasta inteira removida
- ❌ `/index.php` - Duplicado (já existe em public/)
- ❌ `/index.html` da raiz após build (agora só em public/build/)
- ❌ `/favicon.ico` - Duplicado
- ❌ `/robots.txt` - Duplicado
- ❌ `/backend-admin.php` - Consolidado no backend.php
- ❌ `/backend-provider.php` - Consolidado no backend.php
- ❌ `/backend-reviews.php` - Consolidado no backend.php

### Documentações Antigas Removidas:
- ❌ `/LIMPEZA.md`
- ❌ `/HEADER-CORRIGIDO.md`
- ❌ `/PROJECTSHOW-REDESIGN.md`
- ❌ `/REDESIGN-COMPLETO.md`
- ❌ `/TRADUCOES-COMPLETAS.md`
- ❌ `/LOGIN-UNIFICADO.md`

### Arquivos de Teste Removidos:
- ❌ `test-login-unificado.html`
- ❌ `test-password.php`
- ❌ `test-session.html`
- ❌ `create-admin-correct.sql`
- ❌ `create-admin-teste.sql`
- ❌ `create-test-users.sql`
- ❌ `fix-admin-password.sql`

## 🔧 Configurações Atualizadas

### vite.config.js
```javascript
export default defineConfig({
  plugins: [vue()],
  base: '/kadesh/',
  
  build: {
    outDir: 'public/build',  // ✅ Output direto para public/build
    emptyOutDir: true,
  },
  
  publicDir: false,  // ✅ Evita conflito com pasta public/
})
```

### .htaccess (raiz)
```apache
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /kadesh/

# Redirecionar tudo para public/index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ public/index.php [L,QSA]
</IfModule>
```

### public/index.php (Roteamento)
```php
// 1) API → backend.php
if (preg_match('#^/api(/|$)#', $path)) {
    require __DIR__ . '/backend.php';
    exit;
}

// 2) Assets → public/build/assets/
if (preg_match('#^/assets/(.+)$#', $path)) {
    $assetFile = __DIR__ . '/build/assets/' . $matches[1];
    // ... serve arquivo
}

// 3) Fallback → public/build/index.html
readfile(__DIR__ . '/build/index.html');
```

## 🧪 Validação

### API está funcionando:
```bash
curl http://localhost/kadesh/api/projects
# ✅ Retorna JSON com lista de projetos
```

### Frontend está servindo:
```bash
curl -I http://localhost/kadesh/
# ✅ Status 200 OK
# ✅ Content-Type: text/html;charset=UTF-8
```

### Assets estão carregando:
```bash
curl -I http://localhost/kadesh/assets/index-TyCqv0k5.js
# ✅ Status 200 OK
# ✅ Content-Type: application/javascript
```

## 📊 Benefícios da Nova Estrutura

1. **✅ Simplicidade**: Sem pasta `frontend/` duplicada
2. **✅ Menos Confusão**: Tudo na raiz, fácil de navegar
3. **✅ Build Direto**: `npm run build` vai direto para `public/build/`
4. **✅ Sem Cópias**: Não precisa mais de `xcopy dist public/build`
5. **✅ Manutenção Fácil**: Menos arquivos, menos complexidade
6. **✅ Deploy Limpo**: Estrutura pronta para produção

## 🔄 Workflow Atualizado

### 1. Desenvolvimento:
```bash
# Editar arquivos em /src/
code src/App.vue

# Build
npm run build

# Testar
http://localhost/kadesh/
```

### 2. Produção (cPanel):
```bash
# Push para branch producao
git add .
git commit -m "feat: nova estrutura sem pasta frontend"
git push origin producao

# cPanel Git Version Control faz deploy automático
```

## 🎯 Próximos Passos

1. ✅ **Testar Login**: http://localhost/kadesh/#/login
2. ✅ **Testar Projetos**: http://localhost/kadesh/#/projects
3. ✅ **Testar Admin**: http://localhost/kadesh/admin
4. ✅ **Fazer Commit**: Salvar mudanças no Git
5. ✅ **Deploy Produção**: Push para branch `producao`

---

**Data da Migração**: 17 de outubro de 2025
**Status**: ✅ Concluído com sucesso
