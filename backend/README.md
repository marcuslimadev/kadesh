# Kadesh Backend - Node.js API

🚀 **Backend moderno para a plataforma Kadesh** - API RESTful com Node.js, Express e PostgreSQL.

## 🏗️ Stack Tecnológica

- **Node.js 18+** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação stateless
- **Bcrypt** - Hash de senhas
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/marcuslimadev/kadesh-backend.git
cd kadesh-backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute em desenvolvimento
npm run dev

# Execute em produção
npm start
```

## ⚙️ Configuração

### Variáveis de Ambiente

```env
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
JWT_SECRET=your_super_secure_jwt_secret_here
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Banco de Dados

Execute o schema SQL para criar as tabelas:

```bash
psql $DATABASE_URL -f database/schema.sql
```

## 🛠️ API Endpoints

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token
- `POST /api/auth/logout` - Logout

### Projetos
- `GET /api/projects` - Listar projetos
- `GET /api/projects/:id` - Detalhes do projeto
- `POST /api/projects` - Criar projeto
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto

### Propostas
- `GET /api/bids/project/:projectId` - Propostas do projeto
- `POST /api/bids` - Criar proposta
- `PUT /api/bids/:id` - Atualizar proposta
- `DELETE /api/bids/:id` - Retirar proposta
- `POST /api/bids/:id/accept` - Aceitar proposta

### Usuários
- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/:id/public` - Perfil público
- `GET /api/users/providers/search` - Buscar prestadores

## 🚀 Deploy no Render

1. Conecte este repositório ao Render
2. Configure as variáveis de ambiente
3. Adicione um PostgreSQL database
4. Deploy automático configurado!

## 🔐 Segurança

- **JWT Authentication** com tokens seguros
- **Rate Limiting** para prevenir abuso
- **CORS** configurado adequadamente
- **Helmet.js** para headers de segurança
- **Input validation** em todas as rotas
- **SQL injection** prevention
- **Password hashing** com bcrypt

## 📊 Estrutura do Projeto

```
├── config/
│   └── database.js          # Configuração PostgreSQL
├── middleware/
│   └── auth.js              # Middleware JWT
├── routes/
│   ├── auth.js              # Rotas de autenticação
│   ├── projects.js          # Rotas de projetos
│   ├── bids.js              # Rotas de propostas
│   └── users.js             # Rotas de usuários
├── utils/
│   └── validators.js        # Validadores
├── database/
│   └── schema.sql           # Schema PostgreSQL
├── scripts/
│   └── migrate-data.js      # Script de migração
├── server.js                # Servidor principal
└── package.json
```

## 🧪 Testing

```bash
# Executar testes
npm test

# Executar com coverage
npm run test:coverage
```

## 📝 License

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato através do GitHub Issues ou email.

---

Desenvolvido com ❤️ para a plataforma Kadesh
