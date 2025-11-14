# Kadesh Frontend - Vue.js SPA

🎨 **Frontend moderno para a plataforma Kadesh** - Single Page Application com Vue.js 3, Vite e Tailwind CSS.

## 🏗️ Stack Tecnológica

- **Vue.js 3** - Framework progressivo
- **Vite** - Build tool ultrarrápido
- **Vue Router** - Navegação SPA
- **Pinia** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS utility-first
- **Headless UI** - Componentes acessíveis
- **Heroicons** - Ícones SVG

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/marcuslimadev/kadesh-frontend.git
cd kadesh-frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## ⚙️ Configuração

### Variáveis de Ambiente

```env
VITE_API_URL=https://kadesh-backend.onrender.com
VITE_APP_NAME=Kadesh
VITE_APP_DESCRIPTION=Plataforma de freelancers profissionais
VITE_ENABLE_NOTIFICATIONS=true
```

## 🎯 Funcionalidades

### 👥 Autenticação
- ✅ Login/Logout
- ✅ Registro de usuários
- ✅ Recuperação de senha
- ✅ Perfil de usuário
- ✅ Tipos de usuário (Cliente/Prestador)

### 📋 Projetos
- ✅ Listagem de projetos
- ✅ Criação de projetos
- ✅ Detalhes do projeto
- ✅ Edição de projetos
- ✅ Busca e filtros
- ✅ Categorias

### 💰 Propostas
- ✅ Envio de propostas
- ✅ Gestão de propostas
- ✅ Aceitação/Rejeição
- ✅ Histórico de propostas

### 🏠 Dashboard
- ✅ Dashboard do cliente
- ✅ Dashboard do prestador
- ✅ Estatísticas
- ✅ Projetos ativos
- ✅ Histórico

## 🚀 Deploy no Vercel

1. Conecte este repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático configurado!

### Configuração Vercel

O projeto já inclui `vercel.json` com:
- Redirecionamento para SPA
- Headers de segurança
- Cache otimizado para assets
- Configuração de build

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

- **JWT Storage** - Tokens seguros no localStorage
- **Route Guards** - Proteção de rotas autenticadas
- **Input Validation** - Validação client-side
- **XSS Protection** - Sanitização de dados
- **HTTPS Only** - Comunicação segura

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