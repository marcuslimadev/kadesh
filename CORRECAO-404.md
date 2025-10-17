# 🔧 Correção: Erro 404 ao Carregar Aplicação

## ❌ Problema Identificado

**Erro**: `GET http://localhost/src/main.js net::ERR_ABORTED 404 (Not Found)`

### Causa Raiz

O Apache estava servindo o arquivo `index.html` **da raiz** do projeto em vez do `index.html` do **build compilado** (`public/build/index.html`).

#### Sequência do Problema:

1. **index.html na raiz** existe com referência a `/src/main.js` (arquivo de desenvolvimento)
2. Apache serve `index.html` da raiz diretamente
3. Navegador tenta carregar `/src/main.js` 
4. Arquivo `/src/main.js` não existe no servidor (só existe no ambiente de desenvolvimento)
5. **Erro 404**

---

## ✅ Solução Implementada

### 1. Remover `index.html` da Raiz
```bash
Remove-Item "index.html" -Force
```

**Motivo**: O `index.html` da raiz não deve existir em produção. Apenas o arquivo compilado em `public/build/index.html` deve ser servido.

---

### 2. Criar `index.php` na Raiz
**Arquivo**: `/index.php`

```php
<?php
// Redirecionar tudo para public/index.php
require __DIR__ . '/public/index.php';
```

**Função**: 
- Apache procura `index.php` primeiro (DirectoryIndex)
- `index.php` da raiz chama `public/index.php`
- `public/index.php` serve o `public/build/index.html` correto

---

### 3. Atualizar `.htaccess`
**Arquivo**: `/.htaccess`

```apache
Options -Indexes
DirectoryIndex index.php index.html

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /kadesh/
    
    # Redirecionar tudo para public/index.php
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ public/index.php [L,QSA]
</IfModule>
```

**Mudanças**:
- `Options -Indexes`: Desabilita listagem de diretórios
- `DirectoryIndex index.php index.html`: Prioriza `index.php`
- Rewrite aponta para `public/index.php`

---

## 🔄 Fluxo Correto Agora

### Requisição: `http://localhost/kadesh/`

```
1. Apache recebe requisição → /kadesh/
2. Apache procura DirectoryIndex
3. Encontra /kadesh/index.php (raiz)
4. index.php executa require '/public/index.php'
5. public/index.php analisa a rota
6. Não é /api, não é /assets → SPA fallback
7. Serve public/build/index.html
8. HTML contém: <script src="/kadesh/assets/index-BaheMnOT.js">
9. Navegador carrega JS compilado
10. ✅ Aplicação funciona!
```

---

## 📁 Estrutura de Arquivos Correta

### Produção (XAMPP):
```
kadesh/
├── .htaccess              ← Apache config
├── index.php              ← Redireciona para public/
├── public/
│   ├── index.php         ← Front controller (roteia)
│   ├── backend.php       ← API
│   └── build/            ← Build do Vite
│       ├── index.html    ← HTML compilado (CORRETO)
│       └── assets/
│           ├── index-xxx.js
│           └── index-xxx.css
└── src/                   ← Código fonte (NÃO ACESSÍVEL)
    └── main.js           ← Apenas desenvolvimento
```

### ⚠️ Arquivos que NÃO devem existir na raiz:
- ❌ `index.html` (causa conflito)
- ❌ Qualquer HTML que aponte para `/src/`

---

## 🧪 Validação

### Teste 1: Verificar HTML Servido
```bash
curl http://localhost/kadesh/ | Select-String "crossorigin"
```

**Resultado Esperado**:
```html
<script type="module" crossorigin src="/kadesh/assets/index-BaheMnOT.js"></script>
```

✅ **Correto**: Aponta para `/kadesh/assets/` (build compilado)  
❌ **Errado**: Aponta para `/src/main.js` (código fonte)

---

### Teste 2: Verificar Assets
```bash
curl -I http://localhost/kadesh/assets/index-BaheMnOT.js
```

**Resultado Esperado**:
```
HTTP/1.1 200 OK
Content-Type: application/javascript
```

---

### Teste 3: Verificar API
```bash
curl http://localhost/kadesh/api/projects
```

**Resultado Esperado**:
```json
[{"id":1,"title":"...",...}]
```

---

## 🎯 Por que Funcionou?

### Antes:
```
Navegador pede: /kadesh/
Apache serve: /kadesh/index.html (raiz - ERRADO)
HTML contém: <script src="/src/main.js">
Navegador pede: /kadesh/src/main.js
Apache: 404 (arquivo não existe)
```

### Depois:
```
Navegador pede: /kadesh/
Apache encontra: /kadesh/index.php (raiz)
index.php chama: /public/index.php
public/index.php serve: /public/build/index.html
HTML contém: <script src="/kadesh/assets/index-BaheMnOT.js">
Navegador pede: /kadesh/assets/index-BaheMnOT.js
public/index.php serve: /public/build/assets/index-BaheMnOT.js
✅ Aplicação carrega!
```

---

## 📝 Notas Importantes

### Build vs Desenvolvimento

**Desenvolvimento (Vite Dev Server)**:
- Roda: `npm run dev`
- Acesso: `http://localhost:5175`
- Serve arquivos de `src/` diretamente
- Hot reload automático

**Produção (XAMPP)**:
- Build: `npm run build`
- Acesso: `http://localhost/kadesh/`
- Serve arquivos de `public/build/`
- Sem hot reload (precisa rebuild)

### Workflow Correto

1. **Desenvolvimento**:
   ```bash
   npm run dev
   # Editar arquivos em src/
   # Ver mudanças em http://localhost:5175
   ```

2. **Testar em Produção**:
   ```bash
   npm run build
   # Acessar http://localhost/kadesh/
   ```

3. **Deploy para cPanel**:
   ```bash
   git add .
   git commit -m "feature: novo painel admin"
   git push origin producao
   # cPanel Git Version Control faz deploy automático
   ```

---

## 🔧 Troubleshooting Futuro

### Se aparecer erro 404 novamente:

1. **Verificar se existe `index.html` na raiz**:
   ```bash
   ls index.html
   # Se existir, deletar!
   ```

2. **Verificar se `index.php` existe na raiz**:
   ```bash
   cat index.php
   # Deve conter: require __DIR__ . '/public/index.php';
   ```

3. **Verificar build atualizado**:
   ```bash
   ls public/build/assets/
   # Deve ter arquivos JS e CSS recentes
   ```

4. **Rebuild se necessário**:
   ```bash
   npm run build
   ```

---

**Status**: ✅ **Corrigido e Funcionando**  
**Data**: 17 de outubro de 2025  
**Aplicação**: http://localhost/kadesh/  
**Admin**: http://localhost/kadesh/admin/dashboard
