# Sessão: Setup Local Completo + Troubleshooting

## O que foi feito

### 1. PostgreSQL 18 - Setup Completo ✅
- **Database criada**: `kadesh`
- **Usuário criado**: `kadesh` / `kadesh`
- **Schema carregado**: Todas as tabelas, indexes, triggers, dados padrão
- **Admin user criado**: `admin@kadesh.local` / `admin123`
- **Permissões**: `GRANT ALL PRIVILEGES` concedido ao usuário kadesh

**Scripts criados:**
```
backend/scripts/setup-local-db.ps1      # Setup completo do banco
backend/scripts/quick-db-setup.ps1      # Versão simplificada
backend/scripts/load-schema.js          # Carrega schema.sql
```

### 2. Backend - Configuração Port 3001 ✅
- **Port alterado**: 3000 → 3001 (evitar conflito com frontend)
- **Binding explícito**: `0.0.0.0:3001` para compatibilidade Windows
- **CORS atualizado**: Adicionado `http://localhost:3001` aos origins permitidos
- **DATABASE_URL**: `postgresql://kadesh:kadesh@localhost:5432/kadesh`

**Arquivos modificados:**
```
backend/.env            # PORT=3001, DATABASE_URL local
backend/server.js       # app.listen(PORT, '0.0.0.0', ...) + CORS fix
```

### 3. Frontend - Configuração API URL ✅
- **Novo arquivo**: `.env` na raiz do projeto
- **VITE_API_URL**: `http://localhost:3001`

### 4. Documentação ✅
- **E2E-STATUS.md**: Status completo com:
  - Credenciais de acesso
  - Comandos para rodar backend/frontend
  - Checklist de implementação
  - Endpoints disponíveis

## Problema Encontrado: Port Binding no Windows ⚠️

### Sintomas
- Server inicia e mostra: "🚀 Kadesh API running on port 3001"
- PostgreSQL conecta: "✅ PostgreSQL connected successfully"
- **MAS**: Todas as requisições HTTP falham com "connection refused"
- `netstat` não mostra porta 3001 em LISTENING

### Tentativas de Solução
1. ✅ Mudança de porta 3000 → 3001
2. ✅ Binding explícito para `0.0.0.0`
3. ✅ CORS configurado corretamente
4. ✅ Processo na porta 3001 encerrado e reiniciado
5. ⚠️ Port ainda não aceita conexões

### Hipóteses
- **Windows Firewall**: Pode estar bloqueando Node.js na porta 3001
- **Antivírus**: Software de segurança pode estar interferindo
- **Node.js/Express**: Problema específico do Windows com binding
- **Processo fantasma**: Algo ainda ocupando a porta invisível ao netstat

## Como Prosseguir

### Opção 1: Tentar Port Diferente
```powershell
# Em backend/.env
PORT=8080  # Ou 3002, 5000, etc
```

### Opção 2: Binding para 127.0.0.1
```javascript
// Em backend/server.js
app.listen(PORT, '127.0.0.1', (err) => {
  // ...
});
```

### Opção 3: Verificar Firewall
```powershell
# Adicionar regra para Node.js
New-NetFirewallRule -DisplayName "Node.js Port 3001" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow
```

### Opção 4: Rodar como Administrador
```powershell
# Abrir PowerShell como Admin e rodar:
cd c:\xampp\htdocs\kadesh\backend
npm start
```

### Opção 5: Verificar Processos
```powershell
# Ver tudo na porta 3001
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess
```

## Estado Atual

### ✅ Funcionando
- PostgreSQL 18 instalado e rodando
- Database `kadesh` com schema completo
- Admin user criado
- Frontend dev server na porta 3000
- Backend **inicia** mas não **escuta** conexões

### ⚠️ Bloqueado
- Backend API não acessível (connection refused)
- Admin login endpoint unreachable
- E2E tests não podem rodar

### 📋 Próximos Passos
1. Resolver port binding (tentar opções acima)
2. Validar admin login: `POST /api/admin/login`
3. Testar admin disputes: `GET /api/admin/disputes`
4. Rodar E2E completo: register → project → bid → contract → dispute → resolve

## Comandos Úteis

### Rodar Backend (Porta 3001)
```powershell
cd c:\xampp\htdocs\kadesh\backend
npm start
```

### Rodar Frontend (Porta 3000)
```powershell
cd c:\xampp\htdocs\kadesh
npm run dev
```

### Testar Admin Login
```powershell
$body = @{
    email = "admin@kadesh.local"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/admin/login" -Method POST -Body $body -ContentType "application/json"
```

### Verificar Porta
```powershell
Get-NetTCPConnection -LocalPort 3001 -State Listen
```

### Matar Processo na Porta
```powershell
$port = 3001
$proc = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
if ($proc) {
    Stop-Process -Id $proc.OwningProcess -Force
    Write-Host "✅ Processo na porta $port encerrado"
}
```

## Referências
- **Database**: PostgreSQL 18 @ `localhost:5432`
- **Backend**: Node.js/Express @ `localhost:3001` (quando funcionar)
- **Frontend**: Vue 3/Vite @ `localhost:3000`
- **Admin**: admin@kadesh.local / admin123
- **Connection String**: `postgresql://kadesh:kadesh@localhost:5432/kadesh`
