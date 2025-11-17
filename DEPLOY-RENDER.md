# Deploy rápido no Render

Este guia descreve os passos mínimos para publicar o frontend e o backend do projeto `kadesh` no Render usando o `render.yaml` já presente na raiz do repositório.

ATENÇÃO: Não comite segredos (JWT, DATABASE_URL com senha). Use o painel do Render para configurar variáveis de ambiente.

Passos rápidos

1. Conecte seu repositório do GitHub ao Render (se ainda não fez).
2. No Render, clique em "Create a new Service" e depois em "From render.yaml" (opção para importar config do repo). Escolha o repositório `marcuslimadev/kadesh` e a branch `main`.
3. O Render criará dois serviços conforme `render.yaml`:
   - `kadesh-backend` (Web Service) — root: `backend` — start: `npm start` — health: `/health`
   - `kadesh-frontend` (Static Site) — root: `/` — build: `npm install --include=dev && npm run build` — publish: `dist`

4. Vá no painel do serviço `kadesh-backend` → **Environment** → **Environment Variables** e adicione as variáveis obrigatórias (copie e cole os valores reais):

   - `DATABASE_URL` = postgresql://kadesh_user:4W4C3ckzqz6qJxPwuSAtHNCXUNz6IV9C@d4dgupkhg0os73djgjq0-a.oregon-postgres.render.com:5432/kadesh
   - `JWT_SECRET` = <GERAR_SECRET>
   - `NODE_ENV` = production
   - `PORT` = 3000
   - `FRONTEND_URLS` = https://<SEU_FRONTEND_DOMINIO>
   - `FRONTEND_URL` = https://<SEU_FRONTEND_DOMINIO>
   - `MAX_REQUESTS_PER_MINUTE` = 100
   - `MP_ACCESS_TOKEN` = token do Mercado Pago (sandbox ou produção)
   - `MP_PUBLIC_KEY` = public key do Mercado Pago (usada no frontend futuramente)
   - `MP_WEBHOOK_SECRET` = secret configurado no painel do Mercado Pago → Webhooks
   - `MP_NOTIFICATION_URL` = https://<SEU_BACKEND>/api/payments/mercadopago/webhook
   - `MP_SUCCESS_URL` = https://<SEU_FRONTEND>/wallet?payment=success
   - `MP_FAILURE_URL` = https://<SEU_FRONTEND>/wallet?payment=failure
   - `MP_PENDING_URL` = https://<SEU_FRONTEND>/wallet?payment=pending
   - `MP_MIN_DEPOSIT` = 10 (ou o mínimo desejado)

5. (Opcional) No serviço `kadesh-frontend` → **Environment** → adicione:

   - `NPM_CONFIG_PRODUCTION` = false

   Isso garante que `devDependencies` sejam instaladas durante o build (ex.: `vite`). Alternativamente, o comando `buildCommand` no `render.yaml` já usa `--include=dev`.

6. Salve as variáveis e inicie um `Manual Deploy` para cada serviço (ou espere o Auto Deploy se estiver ligado). Acompanhe os logs.

Testes pós-deploy

- Health:
```powershell
curl -i "https://<BACKEND_HOST>/health"
```

- Preflight OPTIONS (verificar CORS):
```powershell
curl -i -X OPTIONS "https://<BACKEND_HOST>/api/projects?status=open&limit=4" -H "Origin: https://<SEU_FRONTEND_DOMINIO>" -H "Access-Control-Request-Method: GET"
```

- GET simples (verificar cabeçalho CORS):
```powershell
curl -i -X GET "https://<BACKEND_HOST>/api/projects?status=open&limit=4" -H "Origin: https://<SEU_FRONTEND_DOMINIO>"
```

Problemas comuns
- Se o build do frontend falhar com `vite: not found`, confirme que `NPM_CONFIG_PRODUCTION=false` está setado ou use `npm install --include=dev` no `Build Command` (já incluído no `render.yaml`).
- Se o navegador reclamar de CORS, verifique `FRONTEND_URLS` no backend e o host usado nas requisições.

Segurança
- Não adicione `DATABASE_URL` com senha no repositório. Use o painel do Render.
- Mantenha `JWT_SECRET` forte (ex: `openssl rand -hex 32`).

Se quiser, eu posso commitar este arquivo e também atualizar o `render.yaml` (por exemplo adicionando outros serviços ou Cron jobs). Quer que eu finalize com commit e push agora? 
