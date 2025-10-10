# Kadesh SPA (Frontend)

## Desenvolvimento
Backend Laravel: http://localhost:8000  
SPA Vue: http://localhost:5174

### Rodar
```bash
# terminal 1 - backend
php artisan serve --host=localhost --port=8000

# terminal 2 - frontend
cd frontend
npm run dev
```

### Build Produção
```bash
cd frontend
npm run build
```
Saída em `frontend/dist`.

### Autenticação
Fluxo simples via token Bearer retornado pelos endpoints `/api/register` ou `/api/login`.
Token é salvo em `localStorage.token` e injetado em Axios (`Authorization: Bearer <token>`). Ao deslogar é removido.

### Ajustar CORS / Sanctum (se usar cookies)
Nesse setup usamos apenas Bearer Token, então não chamamos `/sanctum/csrf-cookie`.

### Estrutura
```
frontend/
  src/
    views/ (páginas)
    router/ (rotas + guardas)
    services/api.js (axios)
    App.vue / main.js
```

### Scripts de Teste (Smoke)
Executar teste rápido público:
```bash
node frontend/scripts/smoke-api.mjs
```

### Próximos Melhoramentos
- Toasts globais
- Paginação de projetos
- Exibir vencedor quando definido
- Upload de anexos (integrar com backend)
- Cache de usuário em store (Pinia) se necessário

---
Documentação gerada automaticamente.
