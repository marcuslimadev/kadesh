# Kadesh - Marketplace de Freelancers# Kadesh - Marketplace de Freelancers<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>



Plataforma de marketplace conectando contratantes e prestadores de serviço freelance através de sistema de leilão reverso.



## 🛠️ Stack TecnológicaPlataforma de marketplace conectando contratantes e prestadores de serviço freelance.<p align="center">



- **Frontend**: Vue 3 + Vite + Tailwind CSS<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>

- **Backend**: PHP 8.2+ Puro (sem frameworks)

- **Banco de Dados**: MySQL 8.0+## 🛠️ Stack Tecnológica<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>

- **Autenticação**: PHP Sessions (cookie-based)

- **Pagamentos**: Mercado Pago<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>

- **Deploy**: XAMPP (desenvolvimento) / cPanel (produção)

- **Frontend**: Vue 3 + Vite + Tailwind CSS<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>

## 📁 Estrutura do Projeto

- **Backend**: PHP 8.2+ Puro (sem frameworks)</p>

```

kadesh/- **Banco de Dados**: MySQL 8.0+

├── src/                   # Frontend Vue 3 (SPA)

│   ├── components/       # Componentes Vue reutilizáveis- **Autenticação**: PHP Sessions (cookie-based)## About Laravel

│   ├── views/            # Páginas/Views da aplicação

│   ├── router/           # Configuração Vue Router- **Deploy**: cPanel Git Version Control

│   └── services/         # API client (axios)

├── public/               # Assets públicos e backend PHPLaravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

│   ├── build/           # Build do Vite (gerado)

│   ├── backend.php      # API PHP principal## 📁 Estrutura do Projeto

│   ├── index.php        # Front controller

│   └── MercadoPago.php  # Integração Mercado Pago- [Simple, fast routing engine](https://laravel.com/docs/routing).

├── database/            # Migrations e seeders

├── config/              # Arquivos de configuração```- [Powerful dependency injection container](https://laravel.com/docs/container).

├── storage/             # Arquivos e logs

├── index.html           # Template HTML principalkadesh/- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.

├── vite.config.js       # Configuração Vite

├── tailwind.config.js   # Configuração Tailwind├── frontend/              # SPA Vue 3- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).

└── package.json         # Dependências Node.js

```│   ├── src/- Database agnostic [schema migrations](https://laravel.com/docs/migrations).



## 🚀 Instalação - Ambiente de Desenvolvimento (XAMPP)│   │   ├── components/   # Componentes Vue- [Robust background job processing](https://laravel.com/docs/queues).



### 1. Pré-requisitos│   │   ├── views/        # Páginas/Views- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).



- XAMPP com PHP 8.2+, MySQL 8.0+ e Apache│   │   ├── router/       # Vue Router

- Node.js 18+ e npm

- Composer (opcional, para desenvolvimento futuro)│   │   ├── services/     # API client (axios)Laravel is accessible, powerful, and provides tools required for large, robust applications.



### 2. Clone o Repositório│   │   └── assets/       # Imagens, estilos



```bash│   ├── index.html## Learning Laravel

cd c:\xampp\htdocs

git clone https://github.com/marcuslimadev/kadesh.git│   ├── vite.config.js

cd kadesh

```│   ├── tailwind.config.jsLaravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.



### 3. Configurar Banco de Dados│   └── package.json



1. Abra o phpMyAdmin: http://localhost/phpmyadmin│You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

2. Crie o banco de dados: `kadesh`

3. Configure o `.env`:├── public/               # Raiz pública (Apache)



```env│   ├── backend.php      # REST API backendIf you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

DB_HOST=localhost

DB_DATABASE=kadesh│   ├── index.php        # Front controller

DB_USERNAME=root

DB_PASSWORD=│   ├── .htaccess        # Rewrite rules## Laravel Sponsors

```

│   ├── index.html       # SPA entry point (build)

4. Execute as migrations:

│   └── assets/          # JS/CSS compiladosWe would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

```bash

php artisan migrate --seed│

```

├── .cpanel.yml          # Deploy automático cPanel### Premium Partners

### 4. Instalar Dependências Frontend

├── .env                 # Configuração local

```bash

npm install└── .env.cpanel          # Configuração produção- **[Vehikl](https://vehikl.com)**

```

```- **[Tighten Co.](https://tighten.co)**

### 5. Build do Frontend

- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**

```bash

npm run build## 🚀 Setup Local (XAMPP)- **[64 Robots](https://64robots.com)**

```

- **[Curotec](https://www.curotec.com/services/technologies/laravel)**

Os arquivos serão gerados em `public/build/`

### 1. Criar banco de dados MySQL- **[DevSquad](https://devsquad.com/hire-laravel-developers)**

### 6. Acessar a Aplicação

- **[Redberry](https://redberry.international/laravel-development)**

- **Frontend**: http://localhost/kadesh/

- **API**: http://localhost/kadesh/api/```sql- **[Active Logic](https://activelogic.com)**

- **Admin**: http://localhost/kadesh/admin

CREATE DATABASE kadesh CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

### 7. Usuários de Teste

## Contributing

```

Contratante:-- Estrutura básica (ajuste conforme necessário)

Email: contratante@teste.com

Senha: Teste@123USE kadesh;Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).



Fornecedor:

Email: fornecedor@teste.com

Senha: Teste@123CREATE TABLE users (## Code of Conduct



Admin:    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

Email: admin@teste.com

Senha: Teste@123    name VARCHAR(255) NOT NULL,In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

```

    email VARCHAR(255) UNIQUE NOT NULL,

## 🏗️ Desenvolvimento

    password VARCHAR(255) NOT NULL,## Security Vulnerabilities

### Modo de Desenvolvimento com Hot Reload

    user_type ENUM('contractor','provider') NOT NULL,

```bash

npm run dev    bio TEXT,If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

```

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

Acesse: http://localhost:5175 (Vite dev server)

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP## License

### Build de Produção

);

```bash

npm run buildThe Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

```

-- Adicionar outras tabelas: projects, bids, transactions, reviews, messages

### Estrutura de Rotas```



**Frontend (Vue Router - Hash Mode)**:### 2. Configurar ambiente

- `#/` - Home

- `#/login` - LoginCriar arquivo `.env` na raiz:

- `#/register` - Cadastro

- `#/projects` - Lista de projetos```env

- `#/projects/:id` - Detalhes do projetoDB_HOST=localhost

- `#/dashboard` - Dashboard do usuárioDB_NAME=kadesh

- `#/admin` - Painel AdminDB_USER=root

DB_PASS=

**Backend (PHP)**:```

- `/api/login` - POST - Login

- `/api/register` - POST - Cadastro### 3. Instalar dependências e buildar frontend

- `/api/user` - GET - Dados do usuário logado

- `/api/projects` - GET/POST - Projetos```bash

- `/api/projects/:id` - GET/PUT/DELETE - Projeto específicocd frontend

- `/api/bids` - GET/POST - Lancesnpm install

- `/api/transactions` - GET/POST - Transaçõesnpm run build

```

## 🔐 Autenticação

### 4. Copiar build para public/

O sistema usa **PHP Sessions** com cookies httponly para autenticação segura.

```bash

### Headers Necessários# PowerShell

Copy-Item -Recurse -Force frontend/dist/* public/

Todas as requisições à API devem incluir:

# Bash

```javascriptcp -r frontend/dist/* public/

{```

  'Content-Type': 'application/json',

  'Accept': 'application/json',### 5. Acessar aplicação

  'X-Requested-With': 'XMLHttpRequest'

}- **Local**: http://localhost/kadesh/

```- **Produção**: https://kadesh.mmbsites.com.br/



### Verificar Sessão## 🔐 Autenticação



```php### Endpoints Públicos

// backend.php verifica automaticamente- `GET /api/health` - Health check

session_start();- `POST /api/register` - Criar conta

if (!isset($_SESSION['user_id'])) {- `POST /api/login` - Login

    http_response_code(401);- `GET /api/projects` - Listar projetos

    echo json_encode(['error' => 'Não autenticado']);

    exit;### Endpoints Protegidos (requerem autenticação)

}- `GET /api/user` - Dados do usuário logado

```- `POST /api/logout` - Logout

- `POST /api/projects` - Criar projeto

## 💳 Mercado Pago- `PUT /api/projects/{id}` - Atualizar projeto

- `DELETE /api/projects/{id}` - Deletar projeto

### Configuração- `POST /api/bids` - Criar proposta

- `GET /api/transactions` - Transações

1. Obtenha suas credenciais em: https://www.mercadopago.com.br/developers- `GET /api/messages` - Mensagens

2. Configure no `.env`:

### Exemplo de uso (JavaScript)

```env

MERCADOPAGO_PUBLIC_KEY=TEST-xxxxx```javascript

MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxx// Login

```const response = await fetch('/kadesh/api/login', {

  method: 'POST',

3. Acesse o painel admin para configurar: http://localhost/kadesh/admin#/settings  headers: { 'Content-Type': 'application/json' },

  body: JSON.stringify({ email: 'user@example.com', password: '123456' }),

## 📦 Deploy para Produção (cPanel)  credentials: 'include' // IMPORTANTE: envia cookies

});

### 1. Via Git Version Control (Recomendado)

const data = await response.json();

1. Configure o repositório Git no cPanelconsole.log(data.user); // { id, name, email, type }

2. Defina o branch: `producao`

3. Configure o documento raiz: `/public`// Acessar endpoint protegido

4. Deploy automático a cada pushconst user = await fetch('/kadesh/api/user', {

  credentials: 'include' // IMPORTANTE: envia cookies

### 2. Manual via FTP}).then(r => r.json());

```

1. Faça o build local: `npm run build`

2. Envie todos os arquivos via FTP## 📦 Deploy em Produção (cPanel)

3. Configure o documento raiz para `/public`

4. Ajuste permissões: `storage/` → 755### 1. Configurar Git no cPanel



### 3. Configuração do Servidor1. Acesse **Git Version Control** no cPanel

2. Clone o repositório: `https://github.com/marcuslimadev/kadesh.git`

**Apache .htaccess** (já incluído em `/public`):3. Branch: `producao`

4. Diretório de deploy: `/home/mmbsites/public_html/kadesh`

```apache

RewriteEngine On### 2. Criar arquivo `.env.cpanel`

RewriteCond %{REQUEST_FILENAME} !-f

RewriteCond %{REQUEST_FILENAME} !-d```env

RewriteRule ^(.*)$ index.php [QSA,L]DB_HOST=localhost

```DB_NAME=mmbsites_kadesh

DB_USER=mmbsites_kadesh_user

## 🧪 TestesDB_PASS=senha_segura_aqui

```

### Executar Testes

### 3. Push para produção

```bash

php artisan test```bash

```git add .

git commit -m "Deploy"

### Smoke Tests da APIgit push origin producao

```

```bash

node scripts/smoke-api.mjsO arquivo `.cpanel.yml` automaticamente:

```- Instala dependências do frontend (`npm install`)

- Faz build do frontend (`npm run build`)

## 📝 Convenções de Código- Copia arquivos para `public_html/kadesh/`



- **PHP**: PSR-12## 🔧 Desenvolvimento

- **JavaScript/Vue**: ESLint Airbnb

- **CSS**: Tailwind utility-first### Frontend (Vue 3)

- **Commits**: Conventional Commits

```bash

## 🐛 Troubleshootingcd frontend



### Problema: Header de visitante aparece após login# Desenvolvimento (hot-reload)

npm run dev          # http://localhost:5175

**Solução**: Limpe o cache do navegador e do servidor

# Build produção

```bashnpm run build        # gera dist/

# Acesse para limpar cache do servidor

http://localhost/kadesh/clear-cache.php# Copiar para public/

Copy-Item -Recurse -Force dist/* ../public/

# No navegador: Ctrl + Shift + Delete```

```

### Backend (PHP)

### Problema: Erro 404 em rotas da SPA

O backend está em `public/backend.php` (arquivo único, sem framework).

**Solução**: Verifique se o `.htaccess` está configurado corretamente em `/public`

**Principais funções:**

### Problema: Assets não carregam (404)- `getDB()` - Conexão PDO com MySQL

- `requireAuth()` - Middleware de autenticação

**Solução**: Verifique se o `public/index.php` está mapeando corretamente `/kadesh/assets/` para `/build/assets/`- `getCurrentUser()` - Retorna dados do usuário logado

- `handleLogin()`, `handleRegister()`, etc - Handlers de rotas

### Problema: Sessão não persiste

**Debug:**

**Solução**: Verifique se as sessões estão habilitadas no `php.ini` e se o diretório `session.save_path` tem permissões corretas```php

// Adicionar temporariamente em backend.php

## 📄 Licençaerror_log("DEBUG: " . json_encode($_SESSION));

```

Este projeto é proprietário. Todos os direitos reservados.

Logs: `C:\xampp\apache\logs\error.log` (local) ou cPanel Error Log (produção)

## 👥 Autores

## 🧪 Testes

- Marcus Lima - [marcuslimadev](https://github.com/marcuslimadev)

```bash

## 🔗 Links Úteis# Health check

curl http://localhost/kadesh/api/health

- [Documentação Vue 3](https://vuejs.org/)

- [Documentação Vite](https://vitejs.dev/)# Register

- [Documentação Tailwind CSS](https://tailwindcss.com/)curl -X POST http://localhost/kadesh/api/register \

- [Documentação Mercado Pago](https://www.mercadopago.com.br/developers)  -H "Content-Type: application/json" \

  -d '{"name":"Test","email":"test@test.com","password":"123456","type":"client"}'

# Login
curl -X POST http://localhost/kadesh/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}' \
  -c cookie.txt

# User info (autenticado)
curl http://localhost/kadesh/api/user -b cookie.txt
```

## 📝 Documentação Adicional

- [CONFIGURACAO-SUBDOMINIO.md](CONFIGURACAO-SUBDOMINIO.md) - Configurar subdomínio no cPanel
- [DEPLOY-CPANEL.md](DEPLOY-CPANEL.md) - Deploy detalhado no cPanel

## 📄 Licença

Projeto proprietário - Todos os direitos reservados.

## 👨‍💻 Autor

Marcus Lima - [marcuslimadev](https://github.com/marcuslimadev)
