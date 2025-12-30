# 🚀 Guia de Configuração - Variáveis de Ambiente Produção

**Gerado em**: 30/12/2025  
**Versão**: 2.0.0  
**Hosting**: Hostinger  
**Database**: MySQL 8.0+

---

## 📋 Checklist de Deploy

### Backend (Hostinger Node.js)

1. **Configurar MySQL no cPanel**:
   - Acessar cPanel → Databases → MySQL Databases
   - Criar banco: `u123456789_kadesh`
   - Criar usuário: `u123456789_kadesh`
   - Definir senha forte
   - Adicionar usuário ao banco (ALL PRIVILEGES)

2. **Copiar arquivo de produção**:
   ```bash
   cp backend/.env.production backend/.env
   ```

3. **Configurar variáveis obrigatórias**:

| Variável | Descrição | Como obter |
|----------|-----------|------------|
| `DATABASE_URL` | MySQL connection string | cPanel → MySQL Databases |
| `JWT_SECRET` | Secret para tokens (min 32 chars) | `openssl rand -base64 32` |
| `MP_ACCESS_TOKEN` | Token Mercado Pago PRODUÇÃO | https://www.mercadopago.com.br/developers |
| `MP_PUBLIC_KEY` | Chave pública Mercado Pago | https://www.mercadopago.com.br/developers |
| `FRONTEND_URL` | URL do seu domínio | https://www.seudominio.com.br |

4. **Upload via FTP/SSH**:
   - Fazer upload da pasta `backend/` para `/home/u123456789/public_html/api/`
   - Ou usar Git deploy do Hostinger
   - Instalar dependências: `npm install --production`
   - Iniciar: `npm start` ou configurar PM2

---

### Frontend (Hostinger ou separado)

1. **Build local**:
   ```bash
   npm run build
   ```

2. **Configurar variáveis**:
   - Editar `.env.production.frontend`
   - Substituir `seudominio.com.br` pelo domínio real
   - Fazer rebuild: `npm run build`

3. **Upload**:
   - FTP: Upload da pasta `dist/` para `/home/u123456789/public_html/`
   - Git: Push para repositório configurado no Hostinger

4. **Variáveis críticas**:

| Variável | Valor |
|----------|-------|
| `VITE_API_URL` | https://api.seudominio.com.br |
| `VITE_MERCADOPAGO_PUBLIC_KEY` | APP_USR-xxxxxxxx-xxxxxx-xx |
| `VITE_SOCKET_URL` | https://api.seudominio.com.br |

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

## 🌐 URLs de Produção

| Serviço | URL Exemplo |
|---------|-------------|
| **Frontend** | https://www.seudominio.com.br |
| **Backend API** | https://api.seudominio.com.br |
| **API Base** | https://api.seudominio.com.br/api |

**Nota**: Substitua `seudominio.com.br` pelo seu domínio real.

---

## ⚙️ Configurações por Ambiente

### Backend (Hostinger)

**Variáveis obrigatórias**:
- ✅ `DATABASE_URL` → MySQL do cPanel
- ✅ `JWT_SECRET` → Token authentication
- ✅ `FRONTEND_URL` → Seu domínio
- ✅ `MP_ACCESS_TOKEN` → Mercado Pago produção
- ✅ `MP_PUBLIC_KEY` → Mercado Pago produção
- ✅ `PLATFORM_FEE_PERCENT=10` → Taxa da plataforma

**Variáveis opcionais**:
- `AUCTION_CHECK_INTERVAL=60000` → Scheduler (padrão: 60s)
- `MAX_REQUESTS_PER_MINUTE=100` → Rate limiting
- `LOG_LEVEL=info` → Logging

---

### Frontend (Hostinger ou CDN)

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

### Backend (Hostinger)
```bash
# Upload via FTP ou Git
# Acessar via SSH (se disponível)
cd /home/u123456789/public_html/api
npm install --production

# Iniciar aplicação (PM2 recomendado)
pm2 start server.js --name kadesh-api
pm2 save
pm2 startup
```

### Frontend (Build e Upload)
```bash
# Build local
npm run build

# Upload via FTP
# Copiar pasta dist/ para /home/u123456789/public_html/
```

---

## 📊 Monitoramento

### Health Checks
- **Backend**: https://api.seudominio.com.br/health
- **API Status**: https://api.seudominio.com.br/api/health

### Logs
- **Hostinger cPanel**: Terminal → View Logs
- **PM2**: `pm2 logs kadesh-api`

---

## 🐛 Troubleshooting

### Backend não conecta ao MySQL
```bash
# Verificar credenciais no cPanel
# MySQL Databases → Current Databases

# Testar conexão
mysql -h localhost -u u123456789_kadesh -p -D u123456789_kadesh
```

### CORS Error no Frontend
```bash
# Verificar FRONTEND_URLS no backend/.env
# Deve incluir: https://www.seudominio.com.br
```

### Socket.io não conecta
```bash
# Verificar no frontend .env:
VITE_SOCKET_URL=https://api.seudominio.com.br

# Verificar CORS no backend server.js
SOCKET_CORS_ORIGIN=https://www.seudominio.com.br
```

### Mercado Pago webhook falha
```bash
# Verificar MP_NOTIFICATION_URL
# Deve ser: https://api.seudominio.com.br/api/payments/mercadopago/webhook

# Testar manualmente:
curl -X POST https://api.seudominio.com.br/api/payments/mercadopago/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"payment","data":{"id":"12345"}}'
```

### Node.js não inicia no Hostinger
```bash
# Verificar versão do Node
node -v  # Deve ser 18.x ou superior

# Verificar PM2
pm2 status
pm2 logs kadesh-api --lines 50
```

---

## 📝 Exemplo Completo - Backend (Hostinger)

```bash
# 1. Criar banco no cPanel MySQL Databases
# Nome: u123456789_kadesh
# Usuário: u123456789_kadesh
# Senha: SenhaForte123!@#

# 2. Editar .env
nano backend/.env

# DATABASE_URL (cPanel fornece):
DATABASE_URL=mysql://u123456789_kadesh:SenhaForte123!@#@localhost:3306/u123456789_kadesh

# JWT_SECRET gerado:
JWT_SECRET=K8j2Hf9pL3mN5qR7tV1wX4zB6cD0eG2i

# Mercado Pago PRODUÇÃO (sem TEST-):
MP_ACCESS_TOKEN=APP_USR-1234567890123456-123456-abcdef1234567890abcdef1234567890-123456789
MP_PUBLIC_KEY=APP_USR-abcd1234-5678-90ef-ghij-klmn12345678

# URLs
FRONTEND_URL=https://www.seudominio.com.br
MP_NOTIFICATION_URL=https://api.seudominio.com.br/api/payments/mercadopago/webhook
```

---

## 🎯 Pós-Deploy

1. **Testar endpoints**:
   ```bash
   # Health check
   curl https://api.seudominio.com.br/health
   
   # Login de teste
   curl -X POST https://api.seudominio.com.br/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"teste@kadesh.com","password":"senha123"}'
   ```

2. **Verificar Auction Scheduler**:
   - Logs devem mostrar: "🔄 Auction scheduler ativo"
   - A cada 60s: "🔄 Found X expired auction(s)"

3. **Testar pagamento**:
   - Fazer deposit no wallet
   - Verificar webhook do Mercado Pago
   - Confirmar saldo atualizado

4. **Criar usuário admin**:
   ```bash
   # Via SSH Hostinger
   cd /home/u123456789/public_html/api/backend
   npm run create-admin
   ```

5. **Configurar subdomínio API** (Opcional):
   - cPanel → Subdomains
   - Criar: `api.seudominio.com.br`
   - Apontar para: `/home/u123456789/public_html/api`
   - Configurar SSL (Let's Encrypt gratuito)

---

## 📞 Suporte

- **Documentação**: `/docs`
- **Endpoints**: `/docs/ENDPOINTS-NOVOS.md`
- **Issues**: https://github.com/marcuslimadev/kadesh/issues
- **Hostinger**: https://www.hostinger.com.br/tutoriais/

---

## 🔐 Checklist de Segurança Hostinger

- [ ] SSL/HTTPS ativado (cPanel → SSL/TLS)
- [ ] Firewall configurado (ModSecurity)
- [ ] Senha MySQL forte (min 16 caracteres)
- [ ] JWT_SECRET único (nunca reutilizar)
- [ ] .env adicionado ao .gitignore
- [ ] Backup automático ativado (cPanel → Backups)
- [ ] Node.js atualizado (versão LTS)
- [ ] PM2 configurado para restart automático
- [ ] Rate limiting ativado (MAX_REQUESTS_PER_MINUTE)
- [ ] Logs sendo monitorados
