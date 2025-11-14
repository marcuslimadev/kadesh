# 🚀 Deploy para Produção - cPanel

## 📋 Pré-requisitos

- ✅ Acesso ao cPanel (https://seu-dominio.com:2083)
- ✅ Git instalado no cPanel (verificar em "Git Version Control")
- ✅ PHP 8.1+ instalado
- ✅ MySQL/MariaDB disponível
- ✅ Composer instalado (ou acesso via terminal)
- ✅ Node.js instalado (para build do frontend)

---

## 🎯 PASSO 1: Preparar Ambiente Local

### 1.1. Build do Frontend

```bash
cd c:\xampp\htdocs\kadesh
npm run build
```

**Resultado**: Arquivos compilados em `public/build/`

### 1.2. Verificar Arquivos Importantes

Certifique-se que existem:
- ✅ `public/build/index.html`
- ✅ `public/build/assets/*.js`
- ✅ `public/build/assets/*.css`
- ✅ `public/index.php`
- ✅ `public/backend.php`
- ✅ `.htaccess` (raiz)
- ✅ `index.php` (raiz)

### 1.3. Preparar .gitignore para Produção

**⚠️ IMPORTANTE**: Por padrão, `public/build/` está no `.gitignore`. Precisamos **INCLUIR** esses arquivos no Git para o cPanel.

**Opção 1 - Incluir build no Git (Recomendado para cPanel)**:

Edite `.gitignore` e **comente** ou **remova** a linha:
```
# public/build/
```

Ou adicione exceção:
```gitignore
# Não ignorar build em produção
!public/build/
!public/build/**/*
```

**Opção 2 - Force add (Alternativa)**:
```bash
git add -f public/build/
```

### 1.4. Commit e Push com Build

```bash
# Garantir que build está incluído
git add public/build/
git add .

# Verificar o que será commitado
git status

# Commit
git commit -m "build: adicionar arquivos compilados para produção cPanel"

# Push
git push origin producao
```

**✅ Verifique no GitHub**: A pasta `public/build/` deve estar visível no repositório.

### 1.5. Trocar .htaccess para Produção

**⚠️ CRÍTICO**: O `.htaccess` local usa `/kadesh/` mas produção precisa de `/`.

```bash
# Copiar versão de produção
copy .htaccess.production .htaccess

# Verificar mudança
type .htaccess

# Commit
git add .htaccess
git commit -m "fix: ajustar RewriteBase para produção (raiz)"
git push origin producao
```

**Para voltar ao desenvolvimento local**:
```bash
copy .htaccess.local .htaccess
```

---

## 🎯 PASSO 2: Configurar cPanel

### 2.1. Criar Banco de Dados MySQL

1. Acesse **cPanel → MySQL Databases**
2. Crie novo banco: `mmbsites_kadesh`
3. Crie usuário: `mmbsites_kadesh`
4. Senha forte (anote!)
5. Adicione usuário ao banco (ALL PRIVILEGES)

**Anote as credenciais**:
```
Host: localhost (ou 127.0.0.1)
Database: mmbsites_kadesh
User: mmbsites_kadesh
Password: [SUA_SENHA_AQUI]
```

### 2.2. Importar Estrutura do Banco

1. Acesse **cPanel → phpMyAdmin**
2. Selecione banco `mmbsites_kadesh`
3. Clique em **"Import"**
4. Faça upload do arquivo `database/kadesh-production.sql` (criar abaixo)
5. Clique em **"Go"**

---

## 🎯 PASSO 3: Exportar Estrutura Local

### 3.1. Criar Dump do Banco Local

No seu PC, execute:

```bash
cd c:\xampp\mysql\bin
.\mysqldump.exe -u root kadesh > c:\xampp\htdocs\kadesh\database\kadesh-production.sql
```

### 3.2. Limpar Dados de Teste (Opcional)

Edite `kadesh-production.sql` e remova:
- Linhas de `INSERT INTO users` (mantenha apenas estrutura)
- Linhas de `INSERT INTO projects`
- Linhas de `INSERT INTO bids`
- **MANTENHA**: `system_settings` (configurações)

Ou crie apenas estrutura:

```bash
.\mysqldump.exe -u root --no-data kadesh > c:\xampp\htdocs\kadesh\database\kadesh-structure.sql
```

E depois:

```bash
.\mysqldump.exe -u root --no-create-info kadesh system_settings > c:\xampp\htdocs\kadesh\database\kadesh-settings.sql
```

**Combine os dois arquivos** ou importe separadamente.

---

## 🎯 PASSO 4: Deploy via Git (cPanel)

### 4.1. Configurar Git Version Control

1. Acesse **cPanel → Git Version Control**
2. Clique em **"Create"**
3. Preencha:
   - **Clone URL**: `https://github.com/marcuslimadev/kadesh.git`
   - **Repository Path**: `/home/mmbsites/kadesh`
   - **Repository Name**: `kadesh`
   - **Branch**: `producao`
4. Clique em **"Create"**

### 4.2. Aguardar Clone

O cPanel vai clonar o repositório. Isso pode levar alguns minutos.

### 4.3. Configurar Deploy Automático (Opcional)

1. Em **Git Version Control**, clique no repositório
2. Copie o **Deploy URL** (webhook)
3. Vá em **GitHub → Settings → Webhooks**
4. Adicione novo webhook:
   - Payload URL: [URL copiada do cPanel]
   - Content type: `application/json`
   - Events: `Just the push event`
5. Salve

**Agora todo `git push` vai fazer deploy automático!**

---

## 🎯 PASSO 5: Configurar Domínio/Subdomínio

### 5.1. Criar Subdomínio (se necessário)

1. **cPanel → Subdomains**
2. Criar: `kadesh.mmbsites.com.br`
3. Document Root: `/home/mmbsites/kadesh/public`
4. Criar

### 5.2. OU Configurar Domínio Principal

Se for domínio principal:
1. **cPanel → Domains**
2. Selecionar domínio
3. Document Root: `/home/mmbsites/kadesh/public`

---

## 🎯 PASSO 6: Ajustar Permissões

### 6.1. Via Terminal SSH (Recomendado)

```bash
cd /home/mmbsites/kadesh
chmod -R 755 .
chmod -R 775 storage
chmod -R 775 public/build
chmod 644 .htaccess
chmod 644 index.php
chmod 644 public/index.php
chmod 644 public/backend.php
```

### 6.2. Via File Manager (Alternativa)

1. **cPanel → File Manager**
2. Navegue até `/home/mmbsites/kadesh`
3. Selecione pastas `storage` e `public/build`
4. Clique em **"Permissions"**
5. Marque: `775` (rwx rwx r-x)

---

## 🎯 PASSO 7: Configurar Banco de Dados

### 7.1. Atualizar backend.php

O arquivo `public/backend.php` já está configurado para detectar ambiente:

```php
// Linhas 38-64
$isLocal = ($_SERVER['HTTP_HOST'] ?? '') === 'localhost';

if ($isLocal) {
    // Local
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=kadesh', 'root', '');
} else {
    // Produção
    $pdo = new PDO(
        'mysql:host=127.0.0.1;dbname=mmbsites_kadesh',
        'mmbsites_kadesh',
        'kadesh@2025'  // ⚠️ TROCAR PELA SENHA REAL
    );
}
```

**⚠️ IMPORTANTE**: Se a senha não for `kadesh@2025`, edite o arquivo via **File Manager** ou **Git**.

### 7.2. Criar Usuário Admin

Via **phpMyAdmin**, execute:

```sql
INSERT INTO users (name, email, password, user_type, created_at, updated_at) 
VALUES (
    'Administrador',
    'admin@mmbsites.com.br',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',  -- senha: password
    'admin',
    NOW(),
    NOW()
);
```

**Depois altere a senha via "Esqueci minha senha"** ou crie um script:

```php
<?php
// Arquivo temporário: public/create-admin.php
require '../vendor/autoload.php';
$pdo = new PDO('mysql:host=127.0.0.1;dbname=mmbsites_kadesh', 'mmbsites_kadesh', 'SUA_SENHA');

$email = 'admin@mmbsites.com.br';
$password = 'SuaSenhaSegura@123';
$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $pdo->prepare("INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)");
$stmt->execute(['Administrador', $email, $hash, 'admin']);

echo "✅ Admin criado: $email / $password";
// ⚠️ DELETE ESTE ARQUIVO DEPOIS!
```

Acesse: `https://kadesh.mmbsites.com.br/create-admin.php`

**⚠️ APAGUE O ARQUIVO DEPOIS!**

---

## 🎯 PASSO 8: Configurar .htaccess

### 8.1. Verificar .htaccess na Raiz

Arquivo: `/home/mmbsites/kadesh/.htaccess`

```apache
Options -Indexes
DirectoryIndex index.php index.html

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # Redirecionar para public/index.php
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ public/index.php [L,QSA]
</IfModule>
```

### 8.2. Verificar public/index.php

Arquivo: `/home/mmbsites/kadesh/public/index.php`

Deve ter o código de roteamento correto. Verifique se existe.

---

## 🎯 PASSO 9: Configurar Chaves Mercado Pago

### 9.1. Obter Credenciais

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Crie aplicação (ou use existente)
3. Copie:
   - **Public Key TEST**: `TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - **Access Token TEST**: `TEST-xxxxxxxxxxxx-xxxxxxxxxxxx`
   - **Public Key PROD**: `APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - **Access Token PROD**: `APP_USR-xxxxxxxxxxxx-xxxxxxxxxxxx`

### 9.2. Configurar no Admin

1. Acesse: `https://kadesh.mmbsites.com.br/admin/settings`
2. Faça login com admin
3. Preencha campos do Mercado Pago
4. Ambiente: **PROD** (Produção)
5. Salvar Alterações

---

## 🎯 PASSO 10: Testar Deploy

### 10.1. Checklist de Testes

- [ ] Acesso ao site: `https://kadesh.mmbsites.com.br`
- [ ] Página inicial carrega
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Criar projeto funciona
- [ ] Ver projetos funciona
- [ ] Admin acessa: `/admin/dashboard`
- [ ] Admin vê configurações: `/admin/settings`
- [ ] Assets carregam (CSS, JS, imagens)

### 10.2. Verificar Logs de Erro

**cPanel → Errors**

Verifique se há erros PHP. Se houver:
- Verifique permissões
- Verifique conexão com banco
- Verifique paths dos arquivos

---

## 🎯 PASSO 11: Configurações de Produção

### 11.1. Segurança

1. **Remover arquivos de desenvolvimento**:
```bash
rm -rf node_modules
rm -rf frontend
rm -f *.php  # scripts temporários (check-admin.php, etc.)
```

2. **Configurar HTTPS** (se não estiver):
   - cPanel → SSL/TLS
   - Let's Encrypt (grátis)
   - Forçar HTTPS

3. **Configurar cabeçalhos de segurança** (adicionar em `.htaccess`):
```apache
# Segurança
Header set X-Frame-Options "SAMEORIGIN"
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"
```

### 11.2. Performance

1. **Habilitar compressão GZIP** (adicionar em `.htaccess`):
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

2. **Cache de assets** (adicionar em `.htaccess`):
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 11.3. Backups

1. **cPanel → Backups**
2. Configurar backup automático diário
3. Incluir banco de dados
4. Baixar backup inicial

---

## 🎯 PASSO 12: Monitoramento

### 12.1. Logs de Acesso

- **cPanel → Raw Access**
- Ver acessos em tempo real

### 12.2. Logs de Erro

- **cPanel → Errors**
- Verificar erros PHP

### 12.3. Status do Servidor

- **cPanel → CPU and Concurrent Connection Usage**
- Monitorar uso de recursos

---

## 🔄 PASSO 13: Deploy de Atualizações

### Método 1: Git (Automático)

```bash
# No seu PC
git add .
git commit -m "feat: nova funcionalidade"
git push origin producao
```

**Se webhook configurado**: Deploy automático no cPanel!

### Método 2: Git (Manual)

1. **cPanel → Git Version Control**
2. Clique no repositório
3. Clique em **"Pull or Deploy"**
4. Clique em **"Update from Remote"**

### Método 3: FTP (Não Recomendado)

Use apenas para emergências. Prefira Git.

---

## 🆘 TROUBLESHOOTING

### Erro: "500 Internal Server Error"

**Solução**:
1. Verificar logs: cPanel → Errors
2. Verificar `.htaccess` (sintaxe)
3. Verificar permissões (755/644)
4. Verificar PHP version (8.1+)

### Erro: "Database connection failed"

**Solução**:
1. Verificar credenciais em `backend.php`
2. Verificar se banco existe
3. Verificar se usuário tem permissões
4. Testar conexão via phpMyAdmin

### Assets não carregam (404)

**Solução**:
1. Verificar se `public/build/` existe
2. Verificar permissões (755)
3. Verificar `.htaccess`
4. Limpar cache do navegador (Ctrl+F5)

### "Cannot write to directory"

**Solução**:
```bash
chmod -R 775 storage
chmod -R 775 public/build
chown -R usuario:usuario storage
```

### Deploy não acontece automaticamente

**Solução**:
1. Verificar webhook no GitHub
2. Verificar se cPanel recebeu notificação
3. Fazer pull manual se necessário

---

## 📝 CHECKLIST FINAL

Antes de considerar deploy concluído:

- [ ] Site acessível via HTTPS
- [ ] Banco de dados funcionando
- [ ] Admin pode fazer login
- [ ] Admin pode acessar configurações
- [ ] Mercado Pago configurado (chaves PROD)
- [ ] Usuários podem se registrar
- [ ] Usuários podem fazer login
- [ ] Projetos podem ser criados
- [ ] Propostas podem ser feitas
- [ ] CSS/JS carregando corretamente
- [ ] Imagens carregando
- [ ] Sem erros no console (F12)
- [ ] Sem erros nos logs do cPanel
- [ ] Backup configurado
- [ ] Certificado SSL ativo
- [ ] Webhook Git funcionando (opcional)

---

## 🎉 DEPLOY CONCLUÍDO!

**URLs Importantes**:
- 🌐 Site: `https://kadesh.mmbsites.com.br`
- 🛡️ Admin: `https://kadesh.mmbsites.com.br/admin/dashboard`
- ⚙️ Config: `https://kadesh.mmbsites.com.br/admin/settings`
- 📊 cPanel: `https://mmbsites.com.br:2083`

**Credenciais Anotadas**:
- ✅ Email Admin: `admin@mmbsites.com.br`
- ✅ Senha Admin: `[ANOTAR AQUI]`
- ✅ Banco MySQL: `mmbsites_kadesh`
- ✅ Usuário MySQL: `mmbsites_kadesh`
- ✅ Senha MySQL: `[ANOTAR AQUI]`

---

**Documentação criada em**: 17/10/2025  
**Última atualização**: 17/10/2025  
**Versão**: 1.0
