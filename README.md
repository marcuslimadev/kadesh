# Kadesh - Marketplace de Freelancers<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>



Plataforma de marketplace conectando contratantes e prestadores de serviço freelance.<p align="center">

<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>

## 🛠️ Stack Tecnológica<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>

<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>

- **Frontend**: Vue 3 + Vite + Tailwind CSS<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>

- **Backend**: PHP 8.2+ Puro (sem frameworks)</p>

- **Banco de Dados**: MySQL 8.0+

- **Autenticação**: PHP Sessions (cookie-based)## About Laravel

- **Deploy**: cPanel Git Version Control

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

## 📁 Estrutura do Projeto

- [Simple, fast routing engine](https://laravel.com/docs/routing).

```- [Powerful dependency injection container](https://laravel.com/docs/container).

kadesh/- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.

├── frontend/              # SPA Vue 3- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).

│   ├── src/- Database agnostic [schema migrations](https://laravel.com/docs/migrations).

│   │   ├── components/   # Componentes Vue- [Robust background job processing](https://laravel.com/docs/queues).

│   │   ├── views/        # Páginas/Views- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

│   │   ├── router/       # Vue Router

│   │   ├── services/     # API client (axios)Laravel is accessible, powerful, and provides tools required for large, robust applications.

│   │   └── assets/       # Imagens, estilos

│   ├── index.html## Learning Laravel

│   ├── vite.config.js

│   ├── tailwind.config.jsLaravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

│   └── package.json

│You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

├── public/               # Raiz pública (Apache)

│   ├── backend.php      # REST API backendIf you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

│   ├── index.php        # Front controller

│   ├── .htaccess        # Rewrite rules## Laravel Sponsors

│   ├── index.html       # SPA entry point (build)

│   └── assets/          # JS/CSS compiladosWe would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

│

├── .cpanel.yml          # Deploy automático cPanel### Premium Partners

├── .env                 # Configuração local

└── .env.cpanel          # Configuração produção- **[Vehikl](https://vehikl.com)**

```- **[Tighten Co.](https://tighten.co)**

- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**

## 🚀 Setup Local (XAMPP)- **[64 Robots](https://64robots.com)**

- **[Curotec](https://www.curotec.com/services/technologies/laravel)**

### 1. Criar banco de dados MySQL- **[DevSquad](https://devsquad.com/hire-laravel-developers)**

- **[Redberry](https://redberry.international/laravel-development)**

```sql- **[Active Logic](https://activelogic.com)**

CREATE DATABASE kadesh CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

## Contributing

-- Estrutura básica (ajuste conforme necessário)

USE kadesh;Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).



CREATE TABLE users (## Code of Conduct

    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

    email VARCHAR(255) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,## Security Vulnerabilities

    user_type ENUM('contractor','provider') NOT NULL,

    bio TEXT,If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP## License

);

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

-- Adicionar outras tabelas: projects, bids, transactions, reviews, messages
```

### 2. Configurar ambiente

Criar arquivo `.env` na raiz:

```env
DB_HOST=localhost
DB_NAME=kadesh
DB_USER=root
DB_PASS=
```

### 3. Instalar dependências e buildar frontend

```bash
cd frontend
npm install
npm run build
```

### 4. Copiar build para public/

```bash
# PowerShell
Copy-Item -Recurse -Force frontend/dist/* public/

# Bash
cp -r frontend/dist/* public/
```

### 5. Acessar aplicação

- **Local**: http://localhost/kadesh/
- **Produção**: https://kadesh.mmbsites.com.br/

## 🔐 Autenticação

### Endpoints Públicos
- `GET /api/health` - Health check
- `POST /api/register` - Criar conta
- `POST /api/login` - Login
- `GET /api/projects` - Listar projetos

### Endpoints Protegidos (requerem autenticação)
- `GET /api/user` - Dados do usuário logado
- `POST /api/logout` - Logout
- `POST /api/projects` - Criar projeto
- `PUT /api/projects/{id}` - Atualizar projeto
- `DELETE /api/projects/{id}` - Deletar projeto
- `POST /api/bids` - Criar proposta
- `GET /api/transactions` - Transações
- `GET /api/messages` - Mensagens

### Exemplo de uso (JavaScript)

```javascript
// Login
const response = await fetch('/kadesh/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: '123456' }),
  credentials: 'include' // IMPORTANTE: envia cookies
});

const data = await response.json();
console.log(data.user); // { id, name, email, type }

// Acessar endpoint protegido
const user = await fetch('/kadesh/api/user', {
  credentials: 'include' // IMPORTANTE: envia cookies
}).then(r => r.json());
```

## 📦 Deploy em Produção (cPanel)

### 1. Configurar Git no cPanel

1. Acesse **Git Version Control** no cPanel
2. Clone o repositório: `https://github.com/marcuslimadev/kadesh.git`
3. Branch: `producao`
4. Diretório de deploy: `/home/mmbsites/public_html/kadesh`

### 2. Criar arquivo `.env.cpanel`

```env
DB_HOST=localhost
DB_NAME=mmbsites_kadesh
DB_USER=mmbsites_kadesh_user
DB_PASS=senha_segura_aqui
```

### 3. Push para produção

```bash
git add .
git commit -m "Deploy"
git push origin producao
```

O arquivo `.cpanel.yml` automaticamente:
- Instala dependências do frontend (`npm install`)
- Faz build do frontend (`npm run build`)
- Copia arquivos para `public_html/kadesh/`

## 🔧 Desenvolvimento

### Frontend (Vue 3)

```bash
cd frontend

# Desenvolvimento (hot-reload)
npm run dev          # http://localhost:5175

# Build produção
npm run build        # gera dist/

# Copiar para public/
Copy-Item -Recurse -Force dist/* ../public/
```

### Backend (PHP)

O backend está em `public/backend.php` (arquivo único, sem framework).

**Principais funções:**
- `getDB()` - Conexão PDO com MySQL
- `requireAuth()` - Middleware de autenticação
- `getCurrentUser()` - Retorna dados do usuário logado
- `handleLogin()`, `handleRegister()`, etc - Handlers de rotas

**Debug:**
```php
// Adicionar temporariamente em backend.php
error_log("DEBUG: " . json_encode($_SESSION));
```

Logs: `C:\xampp\apache\logs\error.log` (local) ou cPanel Error Log (produção)

## 🧪 Testes

```bash
# Health check
curl http://localhost/kadesh/api/health

# Register
curl -X POST http://localhost/kadesh/api/register \
  -H "Content-Type: application/json" \
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
