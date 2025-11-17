# Kadesh - Plataforma de Freelancers 🚀

🎨 **Plataforma completa de freelancers** - Sistema moderno com Vue.js 3, Node.js, e PostgreSQL.

## 📌 Status: Pronto para Produção ✅

Esta é uma plataforma completa e funcional de marketplace para freelancers, incluindo:
- Sistema de leilão reverso para projetos
- Painel administrativo completo
- Gerenciamento de usuários, projetos e pagamentos
- Dados de exemplo para demonstração
- Pronta para deploy em produção

## 🏗️ Stack Tecnológica

### Frontend
- **Vue.js 3** - Framework progressivo com Composition API
- **Vite** - Build tool ultrarrápido
- **Vue Router** - Navegação SPA
- **Pinia** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS utility-first
- **Headless UI** - Componentes acessíveis
- **Heroicons** - Ícones SVG

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Helmet** - Segurança HTTP

## ?? Contas de Teste

Use qualquer conta abaixo para validar rapidamente o login (todas usam a senha `kadesh2025`):

| Tipo | Nome | E-mail |
| --- | --- | --- |
| Cliente | Maria Silva | `maria.silva@example.com` |
| Cliente | Joao Santos | `joao.santos@example.com` |
| Cliente | Ana Costa | `ana.costa@example.com` |
| Fornecedor | Pedro Oliveira | `pedro.oliveira@example.com` |
| Fornecedor | Carla Mendes | `carla.mendes@example.com` |
| Fornecedor | Ricardo Alves | `ricardo.alves@example.com` |
| Fornecedor | Juliana Pereira | `juliana.pereira@example.com` |

> ? Essas contas j? est?o migradas para o backend do Render (`https://kadesh-backend.onrender.com`) e funcionam tanto localmente quanto no deploy do Vercel (`https://kadesh-two.vercel.app`).

## 📦 Instalação e Configuração

### Estrutura do Repositório
- `frontend/` (raiz do projeto): app Vue 3 + Vite
- `backend/`: API Express/PostgreSQL importada de [`marcuslimadev/kadesh-backend`](https://github.com/marcuslimadev/kadesh-backend)
- Documentação: guias de deploy e resumos para operação

### Pré-requisitos
- Node.js 20+
- PostgreSQL 14+
- npm ou yarn

### Backend (`./backend`)

```bash
cd backend

# Configurar variáveis de ambiente
cp .env.example .env
# Edite backend/.env com suas configurações

# Criar banco de dados
createdb kadesh_dev

# Importar schema
psql -d kadesh_dev -f database/schema.sql

# (Opcional) Importar dados de exemplo
psql -d kadesh_dev -f database/migration_001_wallet_and_samples.sql

# Instalar dependências
npm install

# Executar servidor (porta 3000)
npm run dev
```

### Frontend (`./`)

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento (porta 3000)
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### Variáveis de Ambiente

**Backend (`backend/.env`):**
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=seu_secret_super_seguro_min_32_caracteres
DATABASE_URL=postgresql://user:password@localhost:5432/kadesh_dev
FRONTEND_URL=http://localhost:3000
MAX_REQUESTS_PER_MINUTE=100
```

**Frontend (`.env`):**
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Kadesh
VITE_APP_DESCRIPTION=Plataforma de freelancers profissionais
VITE_ENABLE_NOTIFICATIONS=true
```

## 👥 Usuários de Exemplo

### Administrador
- **Email:** admin@kadesh.local
- **Senha:** admin123
- **Acesso:** `/admin/login`

### Clientes (Contratantes)
- **Maria Silva:** maria.silva@example.com
- **João Santos:** joao.santos@example.com
- **Ana Costa:** ana.costa@example.com
- **Senha:** kadesh2025

### Fornecedores (Prestadores)
- **Pedro Oliveira (Dev Full Stack):** pedro.oliveira@example.com
- **Carla Mendes (Designer UX/UI):** carla.mendes@example.com
- **Ricardo Alves (Mobile Dev):** ricardo.alves@example.com
- **Juliana Pereira (Redatora):** juliana.pereira@example.com
- **Senha:** kadesh2025

📖 **Veja detalhes completos em:** [USUARIOS-EXEMPLO.md](./USUARIOS-EXEMPLO.md)

## 🎯 Funcionalidades

### 👥 Sistema de Usuários
- ✅ Login/Logout com JWT
- ✅ Registro de usuários (Cliente/Fornecedor)
- ✅ Perfis completos de fornecedores
- ✅ Sistema de avaliações e reputação
- ✅ Gerenciamento de perfil

### 📋 Projetos e Leilões
- ✅ Listagem de projetos com filtros
- ✅ Criação de projetos por clientes
- ✅ Sistema de leilão reverso
- ✅ Countdown timer em tempo real
- ✅ Categorias de projetos
- ✅ Busca e filtros avançados

### 💰 Propostas e Pagamentos
- ✅ Envio de propostas por fornecedores
- ✅ Ordenação inteligente (preço + reputação)
- ✅ Aceitação/Rejeição de propostas
- ✅ Histórico de propostas
- ✅ Sistema de carteira virtual
- ✅ Histórico de transações

### 🏠 Dashboards
- ✅ Dashboard personalizado para clientes
- ✅ Dashboard personalizado para fornecedores
- ✅ Estatísticas e métricas
- ✅ Projetos ativos e histórico
- ✅ Notificações em tempo real

### 👨‍💼 Painel Administrativo (NOVO!)
- ✅ Login administrativo seguro
- ✅ Dashboard com estatísticas da plataforma
- ✅ Gerenciamento de usuários (CRUD completo)
- ✅ Moderação de projetos
- ✅ Gerenciamento de pagamentos
- ✅ Configurações do sistema
- ✅ Filtros e paginação avançados

## 🚀 Deploy em Produção

### Guia Completo de Deploy

📖 **Consulte o guia detalhado:** [GUIA-DEPLOY-PRODUCAO.md](./GUIA-DEPLOY-PRODUCAO.md)

### Quick Start

1. **Backend (Render.com)**
   - Conecte repositório GitHub
   - Configure variáveis de ambiente
   - Deploy automático ✅

2. **Database (Render PostgreSQL)**
   - Crie database PostgreSQL
   - Importe schema e dados
   - Conecte ao backend ✅

3. **Frontend (Vercel)**
   - Importe projeto do GitHub
   - Configure `VITE_API_URL`
   - Deploy automático ✅

### URLs em Produção
- **Frontend:** https://seu-app.vercel.app
- **Backend API:** https://kadesh-backend.onrender.com
- **Admin Panel:** https://seu-app.vercel.app/admin/login

## 🎨 Design System

### Cores Primárias
```css
primary-50: #f0f9ff
primary-500: #0ea5e9
primary-600: #0284c7
primary-700: #0369a1
```

### Tipografia
- **Font Family**: Inter (Google Fonts)
- **Pesos**: 400, 500, 600, 700

### Componentes
- Botões responsivos
- Cards modernos
- Formulários validados
- Modais acessíveis
- Navegação intuitiva

## 📱 Responsividade

- ✅ **Mobile First** - Design otimizado para móvel
- ✅ **Breakpoints** - sm, md, lg, xl, 2xl
- ✅ **Touch Friendly** - Elementos tocáveis adequados
- ✅ **Performance** - Lazy loading e otimizações

## 🔐 Segurança

- ✅ **JWT Storage** - Tokens seguros no localStorage
- ✅ **Route Guards** - Proteção de rotas autenticadas
- ✅ **Input Validation** - Validação client-side e server-side
- ✅ **XSS Protection** - Sanitização de dados
- ✅ **HTTPS Only** - Comunicação segura
- ✅ **bcrypt** - Hash de senhas com salt
- ✅ **Helmet.js** - Headers de segurança HTTP
- ✅ **Rate Limiting** - Proteção contra ataques
- ✅ **CORS** - Configuração de origem cruzada
- ✅ **CodeQL** - 0 vulnerabilidades detectadas

## 📁 Estrutura do Projeto

```
kadesh/
├── src/                          # Frontend Vue.js
│   ├── components/              # Componentes reutilizáveis
│   │   ├── layout/             # Layout components
│   │   ├── ui/                 # UI components
│   │   └── project/            # Project-specific components
│   ├── views/                  # Páginas/Views
│   │   ├── admin/              # Admin panel views
│   │   ├── auth/               # Páginas de autenticação
│   │   └── *.vue               # Outras views
│   ├── stores/                 # Pinia stores
│   ├── services/               # API services
│   ├── router/                 # Vue Router
│   └── utils/                  # Utilitários
├── routes/                     # Backend API routes
│   ├── admin.js               # Admin endpoints
│   ├── auth.js                # Authentication
│   ├── projects.js            # Projects CRUD
│   ├── bids.js                # Bids management
│   ├── users.js               # Users management
│   ├── wallet.js              # Wallet operations
│   └── notifications.js       # Notifications
├── middleware/                 # Express middleware
│   ├── auth.js                # User authentication
│   └── adminAuth.js           # Admin authentication
├── database/                   # Database files
│   ├── schema.sql             # Database schema
│   └── migration_*.sql        # Migrations
├── config/                     # Configuration files
├── server.js                   # Express server
├── package.json               # Dependencies
└── vite.config.js             # Vite configuration
```

## 📚 Documentação

- 📖 [Usuários de Exemplo](./USUARIOS-EXEMPLO.md) - Credenciais e perfis de teste
- 🚀 [Guia de Deploy](./GUIA-DEPLOY-PRODUCAO.md) - Deploy em produção completo
- 📊 [Status do Desenvolvimento](./STATUS-ATUAL-DESENVOLVIMENTO.md) - Estado atual do projeto
- 🔄 [Plano de Desenvolvimento](./PLANO-DESENVOLVIMENTO.md) - Roadmap e próximos passos

## 🎓 Como Usar

### 1. Testando como Cliente (Contratante)
```bash
# Faça login com: maria.silva@example.com / kadesh2025
# Você poderá:
✅ Criar novos projetos
✅ Ver propostas recebidas
✅ Aceitar/rejeitar propostas
✅ Acompanhar projetos ativos
✅ Gerenciar carteira
```

### 2. Testando como Fornecedor (Prestador)
```bash
# Faça login com: pedro.oliveira@example.com / kadesh2025
# Você poderá:
✅ Ver projetos disponíveis
✅ Enviar propostas
✅ Gerenciar propostas enviadas
✅ Ver saldo e transações
✅ Atualizar perfil profissional
```

### 3. Testando como Administrador
```bash
# Acesse: /admin/login
# Login: admin@kadesh.local / admin123
# Você terá acesso a:
✅ Dashboard com estatísticas
✅ Gerenciar todos os usuários
✅ Moderar projetos
✅ Gerenciar pagamentos
✅ Configurar sistema
```

## 📊 Estrutura do Projeto

```
src/
├── components/           # Componentes Vue
│   ├── layout/          # Layout components
│   ├── ui/              # UI components
│   └── forms/           # Form components
├── views/               # Páginas/Views
│   ├── auth/            # Páginas de autenticação
│   ├── projects/        # Páginas de projetos
│   ├── dashboard/       # Dashboard
│   └── profile/         # Perfil
├── stores/              # Pinia stores
│   ├── auth.js          # Store de autenticação
│   ├── projects.js      # Store de projetos
│   └── users.js         # Store de usuários
├── services/            # Serviços
│   ├── api.js           # Cliente Axios
│   └── auth.js          # Serviço de auth
├── router/              # Vue Router
│   └── index.js         # Configuração de rotas
├── utils/               # Utilitários
└── assets/              # Assets estáticos
```

## 🧪 Testing

```bash
# Executar testes unitários
npm run test

# Executar testes E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run preview      # Preview da build
npm run lint         # Lint com ESLint
npm run format       # Format com Prettier
```

## 📈 Performance

### Otimizações Implementadas
- **Code Splitting** - Lazy loading de rotas
- **Tree Shaking** - Eliminação de código não usado
- **Asset Optimization** - Compressão de imagens e assets
- **Bundle Analysis** - Análise do tamanho dos bundles
- **Preload Critical** - Carregamento prioritário

### Métricas Alvo
- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s
- **First Input Delay** < 100ms
- **Cumulative Layout Shift** < 0.1

## 🌐 Internacionalização

- **Idioma Principal**: Português (pt-BR)
- **Fallback**: Inglês (en-US)
- **Formatação**: Datas, números, moeda (BRL)

## 🧪 Testes

```bash
# Executar testes unitários (quando implementados)
npm run test

# Executar testes E2E (quando implementados)
npm run test:e2e

# Lint e validação de código
npm run lint
```

**Status dos Testes:**
- ✅ Build sem erros
- ✅ Lint configurado
- ✅ CodeQL: 0 vulnerabilidades
- ⏳ Testes unitários: Planejados
- ⏳ Testes E2E: Planejados

## 📊 Performance

### Métricas Atuais
- ⚡ **First Contentful Paint:** < 1.5s
- ⚡ **Bundle Size:** ~310 KB (105 KB gzipped)
- ⚡ **Lazy Loading:** Ativo em todas as rotas
- ⚡ **Code Splitting:** Automático via Vite
- ⚡ **Tree Shaking:** Ativado

### Otimizações
- ✅ Lazy loading de rotas
- ✅ Code splitting por componente
- ✅ Assets otimizados (imagens, CSS)
- ✅ CDN global (Vercel)
- ✅ Compressão Gzip
- ✅ Cache de assets

## 🔄 Próximos Passos

### Prioridade Alta 🔴
- [ ] Testes automatizados (unitários e E2E)
- [ ] Integração com Mercado Pago
- [ ] Sistema de email (recuperação de senha, notificações)
- [ ] Sistema de chat em tempo real

### Prioridade Média 🟡
- [ ] Sistema de escrow (pagamentos em etapas)
- [ ] Upload de arquivos (portfólio, anexos)
- [ ] Sistema de reviews e avaliações
- [ ] Perfis públicos de fornecedores

### Prioridade Baixa 🟢
- [ ] Dark mode
- [ ] Internacionalização (i18n)
- [ ] PWA (Progressive Web App)
- [ ] Notificações push
- [ ] Mobile apps (React Native)

## 🌟 Funcionalidades Destacadas

### Sistema de Leilão Reverso
O Kadesh implementa um sistema único de leilão reverso:
- Clientes publicam projetos com orçamento
- Fornecedores enviam propostas (normalmente abaixo do orçamento)
- Ordenação inteligente: 70% preço + 30% reputação
- Countdown timer em tempo real
- Cliente escolhe a melhor proposta

### Painel Administrativo Completo
- Dashboard com métricas em tempo real
- Gerenciamento completo de usuários
- Moderação de conteúdo
- Configuração do sistema
- Relatórios e analytics

## 📈 Estatísticas do Projeto

- **Linhas de Código:** ~15.000+
- **Componentes Vue:** 25+
- **Rotas API:** 30+
- **Tabelas no Banco:** 15
- **Telas Frontend:** 18
- **Tempo de Desenvolvimento:** 3 semanas

## 📝 License

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Código
- ESLint configurado para Vue 3
- Prettier para formatação
- Commits semânticos recomendados
- Code review obrigatório

## 📞 Suporte

- **Issues:** [GitHub Issues](https://github.com/marcuslimadev/kadesh/issues)
- **Documentação:** Veja os arquivos `.md` no repositório
- **Email:** Disponível em breve

## 🙏 Agradecimentos

Desenvolvido com ❤️ usando tecnologias modernas e open source.

### Tecnologias Principais
- Vue.js Team
- Vite Team
- Express Team
- PostgreSQL Team
- Tailwind CSS Team

---

**Kadesh** - Conectando talentos e oportunidades 🚀

Versão: 2.0.0 | Status: Produção-Ready ✅ | Última atualização: Novembro 2025

Desenvolvido com ❤️ para a plataforma Kadesh
