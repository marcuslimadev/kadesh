# 🐳 Docker Setup - Kaddesh

Este projeto está configurado para rodar completamente em Docker com:
- **Frontend**: Nginx servindo build de produção (porta 80)
- **Backend**: Node.js API (porta 3001)
- **Database**: PostgreSQL 16 (porta 5432)

## 🚀 Como usar

### 1. Configurar variáveis de ambiente

```bash
# Copiar arquivo de exemplo
cp .env.docker .env

# Editar .env com suas credenciais
# IMPORTANTE: Mudar JWT_SECRET e DB_PASSWORD em produção!
```

### 2. Construir e iniciar containers

```bash
# Construir e iniciar todos os serviços
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 3. Acessar aplicação

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

### 4. Gerenciar containers

```bash
# Parar serviços
docker-compose stop

# Iniciar serviços parados
docker-compose start

# Reiniciar serviços
docker-compose restart

# Parar e remover containers
docker-compose down

# Remover containers E volumes (CUIDADO: apaga banco de dados!)
docker-compose down -v
```

## 🔧 Comandos úteis

### Backend

```bash
# Executar comandos no backend
docker-compose exec backend npm run db:load-schema
docker-compose exec backend node scripts/migrate-data.js

# Shell no container backend
docker-compose exec backend sh
```

### Database

```bash
# Conectar ao PostgreSQL
docker-compose exec postgres psql -U postgres -d kadesh

# Backup do banco
docker-compose exec postgres pg_dump -U postgres kadesh > backup.sql

# Restaurar backup
cat backup.sql | docker-compose exec -T postgres psql -U postgres kadesh
```

### Frontend

```bash
# Rebuild apenas frontend
docker-compose up -d --build frontend

# Ver configuração Nginx
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf
```

## 📊 Monitoramento

### Health Checks

```bash
# Status dos containers
docker-compose ps

# Health check do backend
curl http://localhost:3001/

# Health check do frontend
curl http://localhost/
```

### Logs

```bash
# Todos os logs
docker-compose logs

# Últimas 100 linhas
docker-compose logs --tail=100

# Seguir logs em tempo real
docker-compose logs -f --tail=50
```

## 🛠️ Desenvolvimento

Para desenvolvimento local com hot-reload:

```bash
# Parar containers de produção
docker-compose down

# Usar docker-compose.dev.yml (se existir)
# Ou rodar normalmente sem Docker:
npm run dev              # Frontend
cd backend && npm run dev # Backend
```

## 🔒 Segurança

**IMPORTANTE antes de deploy em produção:**

1. ✅ Mudar `JWT_SECRET` para valor aleatório forte (min 32 caracteres)
2. ✅ Mudar `DB_PASSWORD` para senha forte
3. ✅ Configurar `FRONTEND_URLS` com domínios reais
4. ✅ Usar HTTPS em produção
5. ✅ Revisar permissões de acesso ao banco

## 📦 Volumes

- `postgres_data`: Dados persistentes do PostgreSQL
- Backend: `./backend` montado em `/app` (desenvolvimento)
- Frontend: Build estático servido pelo Nginx

## 🌐 Networks

- `kadesh-network`: Bridge network para comunicação entre containers

## ⚙️ Configurações

### Portas expostas
- **80**: Frontend (Nginx)
- **3001**: Backend API
- **5432**: PostgreSQL

### Variáveis de ambiente necessárias

Ver arquivo `.env.docker` para lista completa.

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs de erro
docker-compose logs backend

# Verificar health check
docker inspect kadesh-backend | grep Health -A 10
```

### Banco de dados não conecta

```bash
# Verificar se PostgreSQL está rodando
docker-compose ps postgres

# Ver logs do Postgres
docker-compose logs postgres

# Testar conexão
docker-compose exec postgres pg_isready -U postgres
```

### Frontend retorna 404

```bash
# Verificar build
docker-compose exec frontend ls -la /usr/share/nginx/html

# Verificar configuração Nginx
docker-compose exec frontend nginx -t
```

### Reset completo

```bash
# Parar tudo, remover containers e volumes
docker-compose down -v

# Limpar imagens antigas
docker image prune -a

# Rebuild do zero
docker-compose up -d --build
```

## 📝 Notas

- O schema SQL é automaticamente aplicado na primeira inicialização do PostgreSQL
- Backend aguarda PostgreSQL estar pronto (healthcheck)
- Nginx faz proxy de `/api/*` para o backend
- Hot-reload não funciona em modo produção (use desenvolvimento local)

---

**Status**: ✅ Pronto para rodar com `docker-compose up -d --build`
