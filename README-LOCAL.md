# Kadesh - Setup Local (XAMPP)

## Configuração Rápida

### 1. Pré-requisitos
- XAMPP instalado e rodando (Apache + MySQL)
- Projeto clonado em `C:\xampp\htdocs\kadesh`

### 2. Configurar Banco de Dados

Abra o phpMyAdmin (http://localhost/phpmyadmin) e:

**Opção A - Via interface:**
1. Clique em "Importar"
2. Selecione o arquivo `setup-local-db.sql`
3. Clique em "Executar"

**Opção B - Via linha de comando:**
```bash
cd C:\xampp\htdocs\kadesh
mysql -u root -p < setup-local-db.sql
```

### 3. Configurar .htaccess

O arquivo `.htaccess` já está configurado para subpasta `/kadesh/`.

Se você mover o projeto para outra pasta, edite a linha `RewriteBase` em `public/.htaccess`:

```apache
RewriteBase /sua-pasta/
```

### 4. Acessar o Projeto

🌐 **Frontend:** http://localhost/kadesh/

🔍 **Diagnóstico:** http://localhost/kadesh/debug.php

🏥 **Health API:** http://localhost/kadesh/api/health

📋 **Projetos API:** http://localhost/kadesh/api/projects

### 5. Usuários de Teste

**Contratante:**
- Email: `contractor@test.com`
- Senha: `password`

**Prestador:**
- Email: `provider@test.com`
- Senha: `password`

---

## Estrutura do Projeto

```
kadesh/
├── public/              # Arquivos públicos (DocumentRoot)
│   ├── index.php        # Front controller (SPA)
│   ├── backend.php      # Backend REST API
│   ├── index.html       # SPA principal
│   ├── debug.php        # Diagnóstico
│   ├── .htaccess        # Regras Apache
│   ├── assets/          # CSS, JS, imagens
│   └── build/           # Build do frontend
├── frontend/            # Código-fonte Vue 3
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .env.local           # Config ambiente local
└── setup-local-db.sql   # Script do banco
```

---

## Desenvolvimento Frontend

### Instalar dependências:
```bash
cd frontend
npm install
```

### Rodar dev server (porta 5175):
```bash
npm run dev
```
Acesse: http://localhost:5175

O Vite faz proxy de `/api/*` para `http://localhost/kadesh`

### Build para produção:
```bash
npm run build
```
Copia automaticamente para `public/`

---

## Endpoints da API

### Públicos (sem autenticação):
- `GET /api/health` - Status do sistema
- `POST /api/register` - Criar conta
- `POST /api/login` - Login
- `GET /api/projects` - Listar projetos

### Protegidos (requer login):
- `GET /api/user` - Dados do usuário logado
- `POST /api/logout` - Logout
- `POST /api/projects` - Criar projeto
- `GET /api/projects/{id}` - Ver projeto
- `PUT /api/projects/{id}` - Atualizar projeto
- `DELETE /api/projects/{id}` - Deletar projeto
- `GET /api/projects/{id}/bids` - Propostas do projeto
- `POST /api/bids` - Criar proposta
- `POST /api/projects/{id}/confirm-winner` - Confirmar vencedor

---

## Diferenças Local vs Produção

| Recurso | Local (XAMPP) | Produção (cPanel) |
|---------|---------------|-------------------|
| URL Base | `/kadesh/` | `/` |
| Database | `kadesh` | `mmbsites_kadesh` |
| DB User | `root` | `mmbsites_kadesh` |
| DB Pass | *(vazio)* | `kadesh@2025` |
| Apache | XAMPP | cPanel/LiteSpeed |

O `backend.php` detecta automaticamente o ambiente pela variável `HTTP_HOST`.

---

## Troubleshooting

### Erro 404 em `/api/*`
- Verifique se o Apache tem `mod_rewrite` ativado
- Confira o `RewriteBase` no `.htaccess`

### Erro 500
- Acesse `/debug.php` para diagnóstico completo
- Verifique permissões dos arquivos
- Confira logs em `C:\xampp\apache\logs\error.log`

### Erro de conexão MySQL
- Verifique se o MySQL está rodando no XAMPP
- Confirme que o banco `kadesh` existe
- Teste conexão em `/debug.php`

### Assets não carregam
- Limpe cache do navegador (Ctrl+Shift+Del)
- Verifique se existe `public/assets/` com arquivos
- Rode `npm run build` na pasta `frontend/`

---

## Deploy para Produção

Ver documentação em `DEPLOY-CPANEL.md`
