# 🚀 Guia de Deploy para Produção - Kadesh

Este guia explica como fazer o deploy da plataforma Kadesh em produção.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Deploy do Backend (Render)](#deploy-do-backend-render)
3. [Deploy do Frontend (Vercel)](#deploy-do-frontend-vercel)
4. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
5. [Variáveis de Ambiente](#variáveis-de-ambiente)
6. [Checklist Pré-Produção](#checklist-pré-produção)
7. [Monitoramento](#monitoramento)

---

## 🔧 Pré-requisitos

- Conta no [Render.com](https://render.com) (backend + database)
- Conta no [Vercel](https://vercel.com) (frontend)
- Repositório Git conectado (GitHub/GitLab)
- Node.js 20+ (para desenvolvimento local)
- PostgreSQL 14+ (para testes locais)

---

## 🖥️ Deploy do Backend (Render)

### Passo 1: Criar Serviço no Render

1. Acesse [dashboard.render.com](https://dashboard.render.com)
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** `kadesh-backend`
   - **Environment:** `Node`
   - **Region:** `Oregon (US West)` ou mais próximo
   - **Branch:** `main` ou `production`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free (para testes) ou Starter ($7/mês)

### Passo 2: Configurar Variáveis de Ambiente

No painel do Render, vá em **"Environment"** e adicione:

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=seu_secret_super_seguro_aqui_min_32_caracteres
DATABASE_URL=postgresql://user:password@host:port/database
FRONTEND_URL=https://seu-app.vercel.app
MAX_REQUESTS_PER_MINUTE=100
```

**⚠️ IMPORTANTE:** 
- Gere um `JWT_SECRET` forte: `openssl rand -base64 32`
- O `DATABASE_URL` será configurado após criar o banco

### Passo 3: Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o deploy automático (3-5 minutos)
3. Sua API estará em: `https://kadesh-backend.onrender.com`

---

## 💾 Configuração do Banco de Dados

### Opção 1: PostgreSQL no Render (Recomendado)

1. No dashboard do Render, clique em **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name:** `kadesh-database`
   - **Database:** `kadesh_prod`
   - **User:** `kadesh_user` (automático)
   - **Region:** Mesma do backend
   - **Plan:** Free (1GB, expira em 90 dias) ou Starter ($7/mês)

3. Clique em **"Create Database"**
4. Copie a **Internal Database URL**
5. Cole no campo `DATABASE_URL` do backend

### Passo 4: Importar Schema e Dados

Conecte ao banco via psql:

```bash
# Usar a External Database URL do Render
psql postgresql://user:password@hostname:port/database
```

Importe o schema:

```sql
-- Copie e cole o conteúdo de database/schema.sql
\i database/schema.sql

-- Importe os dados de exemplo (opcional)
\i database/migration_001_wallet_and_samples.sql
```

**⚠️ Segurança em Produção:**
```sql
-- Mude a senha do admin padrão
UPDATE admin_users 
SET password_hash = '$2a$12$NOVA_SENHA_HASHEADA' 
WHERE email = 'admin@kadesh.local';

-- Ou crie um novo admin e delete o padrão
DELETE FROM admin_users WHERE email = 'admin@kadesh.local';
```

### Opção 2: PostgreSQL Externo

Você também pode usar:
- **Supabase** (free tier generoso)
- **Railway** ($5/mês)
- **AWS RDS** (production-grade)
- **Digital Ocean** ($15/mês)

---

## 🌐 Deploy do Frontend (Vercel)

### Passo 1: Importar Projeto

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Conecte seu repositório GitHub
3. Selecione o projeto `kadesh`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Passo 2: Variáveis de Ambiente

Adicione em **"Environment Variables"**:

```bash
VITE_API_URL=https://kadesh-backend.onrender.com
VITE_APP_NAME=Kadesh
VITE_APP_DESCRIPTION=Plataforma de freelancers profissionais
VITE_ENABLE_NOTIFICATIONS=true
```

### Passo 3: Deploy

1. Clique em **"Deploy"**
2. Aguarde build (2-3 minutos)
3. Seu app estará em: `https://kadesh-xxx.vercel.app`

### Passo 4: Domínio Personalizado (Opcional)

1. No dashboard do Vercel, vá em **"Settings"** → **"Domains"**
2. Adicione seu domínio (ex: `kadesh.com.br`)
3. Configure DNS conforme instruções
4. Atualize `FRONTEND_URL` no backend

---

## 🔐 Variáveis de Ambiente Completas

### Backend (.env ou Render Environment)

```bash
# Ambiente
NODE_ENV=production

# Servidor
PORT=3000

# Segurança
JWT_SECRET=sua_chave_secreta_min_32_caracteres_aqui

# Banco de Dados
DATABASE_URL=postgresql://user:password@host:port/database

# CORS
FRONTEND_URL=https://seu-frontend.vercel.app

# Rate Limiting
MAX_REQUESTS_PER_MINUTE=100

# Logs (opcional)
LOG_LEVEL=info

# Email (para implementação futura)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=seu-email@gmail.com
# SMTP_PASS=sua-senha-app

# Mercado Pago (para implementação futura)
# MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui
# MERCADOPAGO_PUBLIC_KEY=sua_public_key
```

### Frontend (.env.production ou Vercel Environment)

```bash
VITE_API_URL=https://kadesh-backend.onrender.com
VITE_APP_NAME=Kadesh
VITE_APP_DESCRIPTION=Plataforma de freelancers profissionais
VITE_ENABLE_NOTIFICATIONS=true
```

---

## ✅ Checklist Pré-Produção

### Segurança

- [ ] `JWT_SECRET` forte e único (min 32 caracteres)
- [ ] Senha do admin alterada ou removida
- [ ] CORS configurado corretamente
- [ ] Rate limiting ativo
- [ ] HTTPS habilitado (automático no Vercel e Render)
- [ ] Variáveis sensíveis não commitadas no Git
- [ ] Helmet.js ativo (já configurado no server.js)

### Banco de Dados

- [ ] Backup configurado (Render faz backup automático)
- [ ] Schema importado com sucesso
- [ ] Índices criados (verificar com `\d+ table_name`)
- [ ] Conexão SSL ativa (Render usa SSL por padrão)
- [ ] Dados de exemplo removidos ou marcados (se em produção real)

### Performance

- [ ] Build do frontend otimizado (`npm run build` sem erros)
- [ ] Assets comprimidos (Vite faz automaticamente)
- [ ] Cache configurado (vercel.json já configurado)
- [ ] CDN ativo (Vercel usa CDN global)

### Funcionalidades

- [ ] Login/Registro funcionando
- [ ] Criação de projetos funcionando
- [ ] Envio de propostas funcionando
- [ ] Dashboard mostrando dados corretos
- [ ] Admin panel acessível
- [ ] Notificações funcionando

### Monitoramento

- [ ] Logs do backend acessíveis (Render Logs)
- [ ] Logs do frontend acessíveis (Vercel Analytics)
- [ ] Alertas configurados (opcional)
- [ ] Uptime monitoring (opcional: UptimeRobot)

---

## 📊 Monitoramento

### Logs do Backend (Render)

1. Acesse seu serviço no Render
2. Clique em **"Logs"**
3. Veja logs em tempo real
4. Use filtros para debug

### Analytics do Frontend (Vercel)

1. Acesse seu projeto no Vercel
2. Clique em **"Analytics"**
3. Veja métricas de performance
4. Monitore erros do cliente

### Ferramentas Recomendadas

- **Sentry**: Monitoramento de erros (free tier generoso)
- **LogRocket**: Replay de sessões e logs
- **UptimeRobot**: Monitoramento de uptime (free)
- **Google Analytics**: Analytics detalhado

---

## 🔄 CI/CD Automático

### Render
- Deploy automático a cada push na branch principal
- Rollback disponível no dashboard
- Preview deployments para PRs

### Vercel
- Deploy automático a cada push
- Preview deployments para cada PR
- Rollback instantâneo

---

## 🆘 Troubleshooting

### Backend não conecta ao banco

```bash
# Verifique a DATABASE_URL
echo $DATABASE_URL

# Teste conexão
psql $DATABASE_URL -c "SELECT 1"

# Verifique logs do Render
```

### Frontend não consegue fazer requests

1. Verifique CORS no backend
2. Confirme `VITE_API_URL` correto
3. Teste API diretamente: `curl https://kadesh-backend.onrender.com/health`

### Build falha no Vercel

1. Verifique Node.js version no package.json
2. Rode `npm run build` localmente
3. Veja logs detalhados no Vercel

### Admin não consegue fazer login

1. Verifique se admin existe no banco
2. Confirme `JWT_SECRET` igual no backend
3. Veja logs do backend para detalhes

---

## 📈 Escalabilidade

### Quando escalar?

- **Backend:** Quando CPU > 80% consistentemente
- **Frontend:** Vercel escala automaticamente
- **Database:** Quando uso > 80% do plano atual

### Opções de Escalabilidade

1. **Render:**
   - Upgrade para plano Starter ($7) ou Standard ($25)
   - Adicione instâncias extras (horizontal scaling)

2. **Database:**
   - Upgrade para plano maior
   - Ou migre para AWS RDS/Digital Ocean

3. **Cache:**
   - Adicione Redis (Render Redis ou Upstash)
   - Cache de queries frequentes

---

## 🎯 Métricas de Sucesso

### Performance
- **Backend:** Response time < 500ms
- **Frontend:** First Contentful Paint < 1.5s
- **Database:** Query time < 100ms

### Disponibilidade
- **Uptime:** > 99.9%
- **Error rate:** < 1%
- **Failed requests:** < 0.1%

---

## 📝 Manutenção

### Diária
- Monitorar logs de erro
- Verificar uptime

### Semanal
- Revisar analytics
- Verificar uso de recursos
- Atualizar dependências críticas

### Mensal
- Backup manual do banco
- Revisar segurança
- Atualizar documentação

---

## 🔒 Backup e Recuperação

### Backup do Banco de Dados

```bash
# Backup manual
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restaurar backup
psql $DATABASE_URL < backup-20250115.sql
```

### Backup Automático

- Render PostgreSQL faz backup diário automático
- Retenção de 7 dias no plano free
- Retenção de 30 dias nos planos pagos

---

## 🎉 Deploy Completo!

Sua aplicação está no ar! 🚀

- **Frontend:** https://seu-app.vercel.app
- **Backend API:** https://kadesh-backend.onrender.com
- **Admin Panel:** https://seu-app.vercel.app/admin/login

### Próximos Passos

1. Configure domínio personalizado
2. Implemente sistema de email
3. Integre Mercado Pago
4. Adicione monitoramento avançado
5. Configure backup automatizado

---

## 📞 Suporte

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

**Desenvolvido com ❤️ para a plataforma Kadesh**
