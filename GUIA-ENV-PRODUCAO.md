# 🚀 Guia de Configuração - Variáveis de Ambiente Produção

**Gerado em**: 30/12/2025  
**Versão**: 2.0.0

---

## 📋 Checklist de Deploy

### Backend (Render)

1. **Copiar arquivo de produção**:
   ```bash
   cp backend/.env.production backend/.env
   ```

2. **Configurar variáveis obrigatórias**:

| Variável | Descrição | Como obter |
|----------|-----------|------------|
| `DATABASE_URL` | MySQL connection string | Render Dashboard → Database → Connection String |
| `JWT_SECRET` | Secret para tokens (min 32 chars) | `openssl rand -base64 32` |
| `MP_ACCESS_TOKEN` | Token Mercado Pago PRODUÇÃO | https://www.mercadopago.com.br/developers |
| `MP_PUBLIC_KEY` | Chave pública Mercado Pago | https://www.mercadopago.com.br/developers |
| `FRONTEND_URL` | URL do frontend Vercel | https://kadesh-two.vercel.app |

3. **Adicionar variáveis no Render**:
   - Dashboard → Web Service → Environment
   - Copiar TODAS as variáveis do `.env.production`
   - Clicar em "Save Changes"

---

### Frontend (Vercel)

1. **Renomear arquivo**:
   ```bash
   cp .env.production.frontend .env.production
   ```

2. **Configurar no Vercel**:
   - Dashboard → Settings → Environment Variables
   - Adicionar cada variável `VITE_*`
   - Marcar opção "Production"

3. **Variáveis críticas**:

| Variável | Valor |
|----------|-------|
| `VITE_API_URL` | https://kadesh-2.onrender.com |
| `VITE_MERCADOPAGO_PUBLIC_KEY` | APP_USR-xxxxxxxx-xxxxxx-xx |
| `VITE_SOCKET_URL` | https://kadesh-2.onrender.com |

---

## 🔐 Segurança - Variáveis Sensíveis

### Nunca commitar no Git:
```bash
# Adicionar ao .gitignore (já configurado)
.env
.env.local
.env.production
backend/.env
backend/.env.production
```

### Gerar secrets fortes:
```bash
# JWT_SECRET (min 32 caracteres)
openssl rand -base64 32

# MP_WEBHOOK_SECRET
openssl rand -hex 32
```

---

## 🌐 URLs de Produção Atual

| Serviço | URL |
|---------|-----|
| **Frontend** | https://kadesh-two.vercel.app |
| **Backend** | https://kadesh-2.onrender.com |
| **API Base** | https://kadesh-2.onrender.com/api |

---

## ⚙️ Configurações por Ambiente

### Backend (Render)

**Variáveis obrigatórias**:
- ✅ `DATABASE_URL` → MySQL connection
- ✅ `JWT_SECRET` → Token authentication
- ✅ `FRONTEND_URL` → CORS whitelist
- ✅ `MP_ACCESS_TOKEN` → Mercado Pago produção
- ✅ `MP_PUBLIC_KEY` → Mercado Pago produção
- ✅ `PLATFORM_FEE_PERCENT=10` → Taxa da plataforma

**Variáveis opcionais**:
- `AUCTION_CHECK_INTERVAL=60000` → Scheduler (padrão: 60s)
- `MAX_REQUESTS_PER_MINUTE=100` → Rate limiting
- `LOG_LEVEL=info` → Logging

---

### Frontend (Vercel)

**Variáveis obrigatórias**:
- ✅ `VITE_API_URL` → Backend URL
- ✅ `VITE_MERCADOPAGO_PUBLIC_KEY` → Pagamentos

**Variáveis recomendadas**:
- `VITE_ENABLE_NOTIFICATIONS=true`
- `VITE_ENABLE_REVIEWS=true`
- `VITE_ENABLE_WALLET=true`
- `VITE_AUCTION_REFRESH_INTERVAL=60000`

---

## 🔧 Comandos de Deploy

### Backend (Render - Automático)
```bash
# Push para branch main
git add .
git commit -m "Deploy: Atualizar env vars"
git push origin main

# Render detecta e faz deploy automático
```

### Frontend (Vercel - Automático)
```bash
# Push para branch main
git push origin main

# Vercel faz build e deploy automático
# Build command: npm run build
# Output directory: dist
```

---

## 📊 Monitoramento

### Health Checks
- **Backend**: https://kadesh-2.onrender.com/health
- **API Status**: https://kadesh-2.onrender.com/api/health

### Logs
- **Render**: Dashboard → Logs → Filtrar por erro
- **Vercel**: Dashboard → Deployments → Logs

---

## 🐛 Troubleshooting

### Backend não conecta ao MySQL
```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão
mysql -h SEU_HOST -u USUARIO -p -D kadesh
```

### CORS Error no Frontend
```bash
# Verificar FRONTEND_URLS no backend
# Deve incluir: https://kadesh-two.vercel.app
```

### Socket.io não conecta
```bash
# Verificar no frontend:
VITE_SOCKET_URL=https://kadesh-2.onrender.com

# Verificar CORS no backend server.js
SOCKET_CORS_ORIGIN=https://kadesh-two.vercel.app
```

### Mercado Pago webhook falha
```bash
# Verificar MP_NOTIFICATION_URL
# Deve ser: https://kadesh-2.onrender.com/api/payments/mercadopago/webhook

# Testar manualmente:
curl -X POST https://kadesh-2.onrender.com/api/payments/mercadopago/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"payment","data":{"id":"12345"}}'
```

---

## 📝 Exemplo Completo - Backend

```bash
# Copiar template
cp backend/.env.production backend/.env

# Editar variáveis
nano backend/.env

# Exemplo de DATABASE_URL no Render:
DATABASE_URL=mysql://kadesh_user:SENHA_FORTE@dpg-abc123xyz.oregon-postgres.render.com:3306/kadesh_db

# JWT_SECRET gerado:
JWT_SECRET=K8j2Hf9pL3mN5qR7tV1wX4zB6cD0eG2i

# Mercado Pago PRODUÇÃO (sem TEST-):
MP_ACCESS_TOKEN=APP_USR-1234567890123456-123456-abcdef1234567890abcdef1234567890-123456789
MP_PUBLIC_KEY=APP_USR-abcd1234-5678-90ef-ghij-klmn12345678

# URLs
FRONTEND_URL=https://kadesh-two.vercel.app
MP_NOTIFICATION_URL=https://kadesh-2.onrender.com/api/payments/mercadopago/webhook
```

---

## 🎯 Pós-Deploy

1. **Testar endpoints**:
   ```bash
   # Health check
   curl https://kadesh-2.onrender.com/health
   
   # Login de teste
   curl -X POST https://kadesh-2.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"teste@kadesh.com","password":"senha123"}'
   ```

2. **Verificar Auction Scheduler**:
   - Logs do Render devem mostrar: "🔄 Auction scheduler ativo"
   - A cada 60s: "🔄 Found X expired auction(s)"

3. **Testar pagamento**:
   - Fazer deposit no wallet
   - Verificar webhook do Mercado Pago
   - Confirmar saldo atualizado

4. **Criar usuário admin**:
   ```bash
   # No Render Shell
   cd backend
   npm run create-admin
   ```

---

## 📞 Suporte

- **Documentação**: `/docs`
- **Endpoints**: `/docs/ENDPOINTS-NOVOS.md`
- **Issues**: https://github.com/marcuslimadev/kadesh/issues
