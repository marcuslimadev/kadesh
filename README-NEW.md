# Kadesh - Marketplace de Serviços

Backend: PHP puro (sem framework)
Frontend: Vue 3 + Vite

## Estrutura
- /public/backend.php - API REST
- /public/index.html - SPA Vue
- /frontend/ - Código fonte Vue

## Deploy
1. Build: cd frontend && npm run build
2. Upload: Copiar rontend/dist/* para public/
3. Configurar: .htaccess já está configurado

## Endpoints
- POST /api/register
- POST /api/login
- POST /api/logout
- GET /api/user
- GET /api/projects
- POST /api/projects
- GET /api/projects/{id}
- GET /api/projects/{id}/bids
- POST /api/bids
- POST /api/projects/{id}/confirm-winner
- GET /api/dashboard/stats
