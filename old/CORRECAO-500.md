# 🚨 CORREÇÃO ERRO 500 - Deploy cPanel

## ❌ Problema Identificado

**Erro**: `500 Internal Server Error` ao acessar `https://kadesh.mmbsites.com.br/`

**Causa**: `.htaccess` configurado para subpasta `/kadesh/` mas em produção está em subdomínio (raiz).

---

## ✅ SOLUÇÃO RÁPIDA

### Via cPanel File Manager

1. **Acesse**: cPanel → File Manager
2. **Navegue**: `/home/mmbsites/kadesh/`
3. **Edite**: `.htaccess`
4. **Altere a linha 6**:

```apache
# ERRADO (localhost)
RewriteBase /kadesh/

# CORRETO (produção)
RewriteBase /
```

5. **Salve** o arquivo
6. **Teste**: `https://kadesh.mmbsites.com.br/`

---

## 🔧 CORREÇÃO COMPLETA (Detecção Automática)

### Opção 1: .htaccess Inteligente

Substitua todo conteúdo do `.htaccess` por:

```apache
Options -Indexes
DirectoryIndex index.php index.html

<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Detectar ambiente automaticamente
    # Localhost: /kadesh/
    # Produção: /
    RewriteCond %{HTTP_HOST} ^localhost$ [OR]
    RewriteCond %{HTTP_HOST} ^127\.0\.0\.1$
    RewriteBase /kadesh/
    
    RewriteCond %{HTTP_HOST} !^localhost$ [AND]
    RewriteCond %{HTTP_HOST} !^127\.0\.0\.1$
    RewriteBase /
    
    # Redirecionar tudo para public/index.php
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ public/index.php [L,QSA]
</IfModule>
```

**Problema**: Nem todos os servidores suportam `RewriteBase` condicional.

### Opção 2: .htaccess Simples (RECOMENDADO)

```apache
Options -Indexes
DirectoryIndex index.php index.html

<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Em produção, sempre use /
    RewriteBase /
    
    # Redirecionar tudo para public/index.php
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ public/index.php [L,QSA]
</IfModule>
```

**Para localhost**, mude temporariamente para:
```apache
RewriteBase /kadesh/
```

---

## 🎯 PASSO A PASSO COMPLETO

### 1. Corrigir .htaccess na Produção

**Via File Manager**:
1. cPanel → File Manager
2. `/home/mmbsites/kadesh/.htaccess`
3. Editar
4. Linha 6: `RewriteBase /` (sem `/kadesh/`)
5. Salvar

**Via Terminal SSH** (se disponível):
```bash
cd /home/mmbsites/kadesh
nano .htaccess
# Alterar linha, Ctrl+X, Y, Enter
```

### 2. Verificar public/.htaccess (se existir)

Se houver arquivo `public/.htaccess`, **DELETE** ou deixe apenas:

```apache
# public/.htaccess
<IfModule mod_rewrite.c>
    Options -Indexes
</IfModule>
```

### 3. Verificar Permissões

```bash
chmod 644 .htaccess
chmod 644 public/index.php
chmod 644 public/backend.php
chmod 755 public
```

### 4. Verificar Document Root no cPanel

1. cPanel → Domains (ou Subdomains)
2. Verificar se `kadesh.mmbsites.com.br` aponta para:
   - ✅ `/home/mmbsites/kadesh/public`
   - ❌ NÃO `/home/mmbsites/kadesh`

### 5. Testar

Acesse: `https://kadesh.mmbsites.com.br/`

**Deve carregar** a página Vue.js.

---

## 🔍 DIAGNÓSTICO ADICIONAL

Se ainda não funcionar, verifique:

### A. Logs de Erro

**cPanel → Errors** (últimas linhas):
```
Procure por:
- "Invalid command 'RewriteBase'"
- ".htaccess: Invalid command"
- "No such file or directory"
- "Permission denied"
```

### B. Verificar Módulos Apache

No terminal SSH ou via cPanel → PHP Info:
```bash
php -m | grep rewrite
```

Deve retornar: `mod_rewrite`

### C. Testar Arquivos Básicos

Crie arquivo de teste:
```php
<?php
// public/test.php
phpinfo();
```

Acesse: `https://kadesh.mmbsites.com.br/test.php`

Se carregar = problema no .htaccess  
Se não carregar = problema no document root

---

## 📝 CHECKLIST CORREÇÃO

- [ ] `.htaccess` raiz: `RewriteBase /`
- [ ] Document Root: `/home/mmbsites/kadesh/public`
- [ ] Permissões: `chmod 644 .htaccess`
- [ ] `public/index.php` existe e tem permissão 644
- [ ] `public/backend.php` existe e tem permissão 644
- [ ] `public/build/` existe e tem arquivos
- [ ] Sem erros nos logs do cPanel
- [ ] `mod_rewrite` habilitado

---

## 🆘 SE AINDA NÃO FUNCIONAR

### Solução Alternativa 1: .htaccess Absoluto

```apache
Options -Indexes
DirectoryIndex index.php index.html

<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Sem RewriteBase (usar path absoluto)
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /public/index.php [L,QSA]
</IfModule>
```

### Solução Alternativa 2: Mover Tudo para public_html

Se cPanel não suportar Document Root customizado:

1. **Mover conteúdo**:
```bash
mv /home/mmbsites/kadesh/public/* /home/mmbsites/public_html/kadesh/
mv /home/mmbsites/kadesh /home/mmbsites/kadesh_backend
```

2. **Ajustar paths** em `public_html/kadesh/backend.php`

---

## 💡 PREVENÇÃO FUTURA

### Git com Branches por Ambiente

**Branch local** (localhost):
```apache
# .htaccess
RewriteBase /kadesh/
```

**Branch producao**:
```apache
# .htaccess
RewriteBase /
```

**Fazer merge** só dos arquivos PHP/Vue, não do `.htaccess`.

---

**Criado em**: 17/10/2025  
**Prioridade**: 🚨 CRÍTICA
