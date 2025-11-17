# 🚀 KADESH - Guia Completo de Deploy

## 📋 REPOSITÓRIOS GITHUB

### 1. Criar Repositórios Manualmente
1. **Backend**: https://github.com/new
   - Nome: `kadesh-backend`
   - Descrição: `Kadesh Backend - Node.js API with Express, PostgreSQL, JWT authentication`
   - Público ✅
   - NÃO inicializar com README

2. **Frontend**: https://github.com/new
   - Nome: `kadesh-frontend`
   - Descrição: `Kadesh Frontend - Vue.js SPA with Tailwind CSS and modern UI`
   - Público ✅
   - NÃO inicializar com README

### 2. Fazer Push (após criar repos)
```powershell
# Execute este script:
.\push-to-github.ps1
```

## 🗄️ BANCO DE DADOS POSTGRESQL

**URL de Conexão:**
```
postgresql://kadesh_modern_user:OVMLWkBDzhsHoptphh0bmekmDCFJBs7q@dpg-d4bgunchg0os73eum7p0-a.oregon-postgres.render.com/kadesh_modern
```

**Configuração:**
- Host: `dpg-d4bgunchg0os73eum7p0-a.oregon-postgres.render.com`
- Database: `kadesh_modern`
- User: `kadesh_modern_user`
- Password: `OVMLWkBDzhsHoptphh0bmekmDCFJBs7q`
- SSL: Habilitado

**Schema:** Será executado automaticamente no primeiro deploy do backend.

## 🚀 DEPLOY NO RENDER (Backend)

### 1. Acessar Render
- URL: https://render.com
- Login com GitHub

### 2. Criar Web Service
- **New** → **Web Service**
- **Connect** repository: `marcuslimadev/kadesh-backend`

### 3. Configurações
- **Name**: `kadesh-backend`
- **Branch**: `main`
- **Root Directory**: (deixar vazio)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Environment Variables
```
DATABASE_URL = postgresql://kadesh_modern_user:OVMLWkBDzhsHoptphh0bmekmDCFJBs7q@dpg-d4bgunchg0os73eum7p0-a.oregon-postgres.render.com/kadesh_modern

JWT_SECRET = kadesh_super_secret_jwt_key_2025_modern_stack

NODE_ENV = production

FRONTEND_URL = https://kadesh-frontend.vercel.app

PORT = 10000

MAX_REQUESTS_PER_MINUTE = 100
```

### 5. Deploy
- Clicar **Create Web Service**
- Aguardar deploy (3-5 minutos)
- URL final: `https://kadesh-2.onrender.com`

## 🌐 DEPLOY NO VERCEL (Frontend)

### 1. Acessar Vercel
- URL: https://vercel.com
- Login com GitHub

### 2. Novo Projeto
- **Add New** → **Project**
- **Import** repository: `marcuslimadev/kadesh-frontend`

### 3. Configurações
- **Project Name**: `kadesh-frontend`
- **Framework Preset**: `Vite`
- **Root Directory**: (deixar vazio)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 4. Environment Variables
```
VITE_API_URL = https://kadesh-2.onrender.com

VITE_APP_NAME = Kadesh

VITE_APP_DESCRIPTION = Plataforma de freelancers profissionais

VITE_ENABLE_NOTIFICATIONS = true

VITE_DEBUG_MODE = false
```

### 5. Deploy
- Clicar **Deploy**
- Aguardar build (2-3 minutos)
- URL final: `https://kadesh-frontend.vercel.app`

## 📊 VALIDAÇÃO DO DEPLOY

### 1. Backend (API)
Testar endpoints:
```bash
# Health check
curl https://kadesh-2.onrender.com/health

# Resposta esperada:
{
  "status": "ok",
  "timestamp": "2025-11-14T...",
  "environment": "production",
  "version": "1.0.0"
}
```

### 2. Frontend (SPA)
- Acessar: `https://kadesh-frontend.vercel.app`
- Testar login/registro
- Verificar console do browser (F12)

### 3. Database
O schema será criado automaticamente na primeira conexão do backend.

## 🔄 MIGRAÇÃO DE DADOS (Opcional)

Se precisar migrar dados do sistema antigo:

```bash
# No backend deployado, executar:
node scripts/migrate-data.js
```

## 📱 URLs FINAIS

- **🎨 Frontend**: https://kadesh-frontend.vercel.app
- **🚀 Backend**: https://kadesh-2.onrender.com
- **🗄️ Database**: Render PostgreSQL (interno)
- **📊 API Docs**: https://kadesh-2.onrender.com/health

## 🎉 SISTEMA COMPLETO

Stack moderna implantada:
- ✅ Node.js backend no Render
- ✅ Vue.js frontend no Vercel
- ✅ PostgreSQL database
- ✅ JWT authentication
- ✅ APIs RESTful completas
- ✅ UI responsiva moderna
- ✅ SSL/HTTPS automático
- ✅ Auto-deploy configurado

**🚀 KADESH MODERNIZADO E PRONTO PARA PRODUÇÃO! 🚀**