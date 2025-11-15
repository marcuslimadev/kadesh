# 🚀 Guia Rápido de Deploy - Kadesh Platform

Este guia fornece instruções passo a passo para fazer o deploy da plataforma Kadesh em produção.

---

## 📋 Pré-requisitos

- Conta no [Render](https://render.com) (backend + database)
- Conta no [Vercel](https://vercel.com) (frontend)
- Repositório GitHub com o código
- Conta Mercado Pago (opcional, para pagamentos)

---

## 🗄️ Parte 1: Banco de Dados PostgreSQL (Render)

### 1.1 Criar Database no Render

1. Acesse https://dashboard.render.com
2. Clique em **"New +"** → **"PostgreSQL"**
3. Configurações:
   - **Name**: `kadesh-db`
   - **Database**: `kadesh`
   - **User**: `kadesh_user`
   - **Region**: escolha a mais próxima (ex: Oregon, USA)
   - **PostgreSQL Version**: 16
   - **Plan**: Free (para começar)
4. Clique em **"Create Database"**
5. Aguarde a criação (1-2 minutos)

### 1.2 Obter Connection String

1. No dashboard do database, copie:
   - **Internal Database URL** (para usar com backend no Render)
   - **External Database URL** (para acesso externo)
2. Salve essas URLs (você precisará delas)

### 1.3 Importar Schema

**Opção A: Via psql (recomendado)**
```bash
# Instale psql se não tiver
# No Ubuntu/Debian:
sudo apt-get install postgresql-client

# Importe o schema
psql <EXTERNAL_DATABASE_URL> -f database/schema.sql
```

**Opção B: Via interface web do Render**
1. No dashboard do database, clique em **"Connect"** → **"PSQL Command"**
2. Cole o conteúdo de `database/schema.sql`
3. Execute

### 1.4 Verificar Instalação
```bash
# Conecte ao banco
psql <EXTERNAL_DATABASE_URL>

# Verifique as tabelas
\dt

# Deve listar: users, projects, bids, etc.
```

---

## 🔧 Parte 2: Backend API (Render)

### 2.1 Criar Web Service

1. No Render, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub
3. Configurações:
   - **Name**: `kadesh-api`
   - **Region**: mesma do database
   - **Branch**: `main` (ou a branch de produção)
   - **Root Directory**: deixe vazio
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (para começar)

### 2.2 Configurar Variáveis de Ambiente

No dashboard do web service, vá em **"Environment"** e adicione:

```env
# Database (obrigatório)
DATABASE_URL=<INTERNAL_DATABASE_URL_DO_PASSO_1.2>

# JWT (obrigatório - gere uma chave segura)
JWT_SECRET=<GERE_UMA_CHAVE_ALEATORIA_SEGURA>
JWT_EXPIRES_IN=7d

# Server (obrigatório)
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://kadesh-frontend.vercel.app

# Rate Limiting
MAX_REQUESTS_PER_MINUTE=100

# Email (opcional - para depois)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@kadesh.com

# Mercado Pago (opcional - para depois)
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_PUBLIC_KEY=
```

**Como gerar JWT_SECRET:**
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64

# Ou use um gerador online: https://randomkeygen.com/
```

### 2.3 Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o deploy (3-5 minutos)
3. Quando finalizar, você terá uma URL tipo: `https://kadesh-api.onrender.com`

### 2.4 Testar API

```bash
# Health check
curl https://kadesh-api.onrender.com/health

# Deve retornar:
{
  "status": "ok",
  "timestamp": "2025-11-15T...",
  "environment": "production",
  "version": "1.0.0"
}
```

---

## 🎨 Parte 3: Frontend (Vercel)

### 3.1 Preparar Repositório

1. Certifique-se que o código está no GitHub
2. Verifique que `vercel.json` existe na raiz
3. Confirme que `.env.production.frontend` existe (mas não commite)

### 3.2 Deploy no Vercel

**Opção A: Via Dashboard (recomendado para primeira vez)**

1. Acesse https://vercel.com
2. Clique em **"Add New..."** → **"Project"**
3. Importe seu repositório do GitHub
4. Configurações:
   - **Framework Preset**: Vite
   - **Root Directory**: deixe vazio
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Clique em **"Deploy"**

**Opção B: Via CLI**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd /caminho/para/kadesh
vercel --prod
```

### 3.3 Configurar Variáveis de Ambiente

No dashboard do Vercel, vá em **"Settings"** → **"Environment Variables"**:

```env
# API (obrigatório)
VITE_API_URL=https://kadesh-api.onrender.com

# App
VITE_APP_NAME=Kadesh
VITE_APP_DESCRIPTION=Plataforma de freelancers profissionais
VITE_APP_VERSION=2.0.0

# Features
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG_MODE=false

# File Upload
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx

# Mercado Pago (opcional)
VITE_MERCADOPAGO_PUBLIC_KEY=

# Google OAuth (opcional)
VITE_GOOGLE_CLIENT_ID=
```

### 3.4 Re-deploy com Variáveis

Após adicionar as variáveis:
1. Vá em **"Deployments"**
2. Clique em **"..."** no último deploy
3. Selecione **"Redeploy"**
4. Aguarde (1-2 minutos)

### 3.5 Verificar Deploy

1. Acesse a URL fornecida (ex: `https://kadesh-seven.vercel.app`)
2. Deve ver a landing page
3. Teste login/registro
4. Verifique console do navegador (F12) para erros

---

## 🔗 Parte 4: Conectar Frontend com Backend

### 4.1 Atualizar CORS no Backend

Se tiver problemas de CORS, adicione no Render (backend):

```env
FRONTEND_URL=https://seu-dominio.vercel.app
```

E verifique que `server.js` tem:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 4.2 Testar Integração

1. Acesse o frontend
2. Tente registrar um novo usuário
3. Faça login
4. Crie um projeto
5. Verifique que aparece na listagem

---

## ✅ Checklist de Verificação

### Backend
- [ ] Database criado e schema importado
- [ ] Web service deployado
- [ ] `/health` endpoint responde
- [ ] Variáveis de ambiente configuradas
- [ ] PostgreSQL conectado (check logs)

### Frontend
- [ ] Deploy bem-sucedido
- [ ] Site carrega sem erros
- [ ] API_URL aponta para backend correto
- [ ] Console sem erros CORS
- [ ] Pode fazer login/registro

### Integração
- [ ] Registro de usuário funciona
- [ ] Login funciona e persiste
- [ ] Criar projeto funciona
- [ ] Listar projetos funciona
- [ ] Ver detalhes de projeto funciona

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch" ou CORS

**Causa**: Frontend não consegue acessar backend

**Solução**:
1. Verifique `FRONTEND_URL` no backend (Render)
2. Verifique `VITE_API_URL` no frontend (Vercel)
3. Re-deploy ambos após mudanças

### Erro: "Database connection failed"

**Causa**: Backend não consegue conectar ao PostgreSQL

**Solução**:
1. Verifique `DATABASE_URL` no backend
2. Certifique que usou **Internal Database URL**
3. Verifique que database está na mesma região

### Build falha com "out of memory"

**Causa**: Build precisa de mais memória

**Solução Vercel**:
- Faça upgrade para plano Pro, ou
- Reduza bundle size (code splitting)

**Solução Render**:
- Upgrade para plano pago, ou
- Adicione no `package.json`:
```json
"scripts": {
  "build": "NODE_OPTIONS='--max-old-space-size=1024' vite build"
}
```

### Rotas do frontend retornam 404

**Causa**: SPA precisa de configuração especial

**Solução**: Certifique que `vercel.json` tem:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 📊 Monitoramento

### Logs do Backend (Render)
1. Dashboard → Web Service → **"Logs"**
2. Veja erros em tempo real
3. Filtre por erro: use busca

### Logs do Frontend (Vercel)
1. Dashboard → Project → **"Deployments"**
2. Clique no deployment → **"Logs"**
3. Build logs e runtime logs separados

### Analytics (opcional)
- Google Analytics
- Vercel Analytics (plano Pro)
- Render Metrics

---

## 💰 Custos Estimados

### Tier Gratuito
- **Render Database**: Free (até 1GB, expires after 90 days)
- **Render Web Service**: Free (750h/mês, suspende após inatividade)
- **Vercel**: Free (100GB bandwidth, unlimited deployments)
- **Total**: R$ 0/mês

### Produção Básica
- **Render Database**: $7/mês (Starter)
- **Render Web Service**: $7/mês (Starter)
- **Vercel**: $20/mês (Pro)
- **Total**: ~R$ 170/mês (≈ $34)

### Produção Escalável
- **Render Database**: $15/mês (Standard)
- **Render Web Service**: $25/mês (Standard)
- **Vercel**: $20/mês (Pro)
- **Total**: ~R$ 300/mês (≈ $60)

---

## 🎯 Próximos Passos Após Deploy

1. **Configurar domínio customizado** (opcional)
   - Compre domínio (ex: kadesh.com.br)
   - Configure DNS no Vercel
   - Adicione SSL (automático)

2. **Configurar Mercado Pago**
   - Crie conta business
   - Obtenha credenciais
   - Teste sandbox primeiro
   - Ative produção

3. **Adicionar analytics**
   - Google Analytics
   - Hotjar (heatmaps)
   - Sentry (error tracking)

4. **Backup do banco**
   - Configure backups automáticos
   - Teste restore

5. **CI/CD**
   - Configure GitHub Actions
   - Testes automáticos
   - Deploy automático

---

## 📞 Suporte

- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **PostgreSQL**: https://www.postgresql.org/docs/

---

## ✨ Conclusão

Seguindo este guia, você terá:
- ✅ Backend rodando no Render
- ✅ Frontend no Vercel
- ✅ Database PostgreSQL configurado
- ✅ Integração completa funcionando
- ✅ Deploy automático configurado

**Tempo estimado**: 30-45 minutos

**Boa sorte com o deploy! 🚀**

---

**Última atualização**: 15 de Novembro de 2025  
**Versão**: 1.0.0
