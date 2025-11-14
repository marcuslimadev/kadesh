# Kadesh - Script de Setup dos Repositórios Git
# Execute este script para configurar os repositórios separados

param(
    [string]$GitHubUsername = "marcuslimadev"
)

Write-Host "🚀 Configurando repositórios Git para Kadesh Modern Stack" -ForegroundColor Green
Write-Host "=" * 60

# Verificar se estamos no diretório correto
if (-not (Test-Path "modern-stack")) {
    Write-Host "❌ Diretório modern-stack não encontrado!" -ForegroundColor Red
    Write-Host "Execute este script na raiz do projeto Kadesh" -ForegroundColor Yellow
    exit 1
}

# Função para executar comandos git
function Invoke-GitCommand {
    param([string]$Command, [string]$Directory)
    
    Push-Location $Directory
    try {
        Write-Host "  🔧 $Command" -ForegroundColor Cyan
        Invoke-Expression "git $Command"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "    ⚠️ Comando falhou, mas continuando..." -ForegroundColor Yellow
        }
    }
    finally {
        Pop-Location
    }
}

# 1. Configurar repositório Backend
Write-Host "`n📦 Configurando repositório BACKEND..." -ForegroundColor Blue
if (Test-Path "kadesh-backend") {
    Write-Host "  🗑️ Removendo diretório existente..." -ForegroundColor Yellow
    Remove-Item -Path "kadesh-backend" -Recurse -Force
}

# Copiar arquivos do backend
Write-Host "  📁 Copiando arquivos do backend..." -ForegroundColor Cyan
Copy-Item -Path "modern-stack/backend" -Destination "kadesh-backend" -Recurse

# Configurar git no backend
Push-Location "kadesh-backend"
try {
    Write-Host "  🔧 Inicializando repositório Git..." -ForegroundColor Cyan
    git init
    git add .
    git commit -m "Initial commit - Kadesh Backend API

Features:
* Node.js + Express server
* PostgreSQL database integration  
* JWT authentication
* REST API endpoints
* Security middleware
* Rate limiting
* Input validation

Stack:
* Node.js 18+
* Express.js
* PostgreSQL
* JWT
* Bcrypt
* Helmet

Ready for Render deployment!"

    Write-Host "  🌐 Configurando remote origin..." -ForegroundColor Cyan
    git remote add origin "https://github.com/$GitHubUsername/kadesh-backend.git"
    
    Write-Host "  📤 Criando branch main..." -ForegroundColor Cyan
    git branch -M main
    
    Write-Host "✅ Backend repository configurado!" -ForegroundColor Green
    Write-Host "   📍 Local: ./kadesh-backend/" -ForegroundColor White
    Write-Host "   🌐 Remote: https://github.com/$GitHubUsername/kadesh-backend" -ForegroundColor White
}
finally {
    Pop-Location
}

# 2. Configurar repositório Frontend  
Write-Host "`n🎨 Configurando repositório FRONTEND..." -ForegroundColor Blue
if (Test-Path "kadesh-frontend") {
    Write-Host "  🗑️ Removendo diretório existente..." -ForegroundColor Yellow
    Remove-Item -Path "kadesh-frontend" -Recurse -Force
}

# Copiar arquivos do frontend
Write-Host "  📁 Copiando arquivos do frontend..." -ForegroundColor Cyan
Copy-Item -Path "modern-stack/frontend" -Destination "kadesh-frontend" -Recurse

# Configurar git no frontend
Push-Location "kadesh-frontend"
try {
    Write-Host "  🔧 Inicializando repositório Git..." -ForegroundColor Cyan
    git init
    git add .
    git commit -m "Initial commit - Kadesh Frontend SPA

Features:
* Vue.js 3 SPA
* Modern UI with Tailwind CSS
* State management with Pinia
* Authentication system
* Project management
* Responsive design
* PWA ready

Stack:
* Vue.js 3
* Vite
* Vue Router
* Pinia
* Axios
* Tailwind CSS
* Headless UI

Ready for Vercel deployment!"

    Write-Host "  🌐 Configurando remote origin..." -ForegroundColor Cyan
    git remote add origin "https://github.com/$GitHubUsername/kadesh-frontend.git"
    
    Write-Host "  📤 Criando branch main..." -ForegroundColor Cyan
    git branch -M main
    
    Write-Host "✅ Frontend repository configurado!" -ForegroundColor Green
    Write-Host "   📍 Local: ./kadesh-frontend/" -ForegroundColor White
    Write-Host "   🌐 Remote: https://github.com/$GitHubUsername/kadesh-frontend" -ForegroundColor White
}
finally {
    Pop-Location
}

Write-Host "`n🎉 REPOSITÓRIOS CONFIGURADOS COM SUCESSO!" -ForegroundColor Green
Write-Host "=" * 60

Write-Host "`n📋 PRÓXIMOS PASSOS:" -ForegroundColor Blue
Write-Host "1. 🌐 Criar os repositórios no GitHub:" -ForegroundColor Yellow
Write-Host "   • https://github.com/new (nome: kadesh-backend)" -ForegroundColor White
Write-Host "   • https://github.com/new (nome: kadesh-frontend)" -ForegroundColor White

Write-Host "`n2. 📤 Fazer push dos repositórios:" -ForegroundColor Yellow
Write-Host "   cd kadesh-backend && git push -u origin main" -ForegroundColor White
Write-Host "   cd kadesh-frontend && git push -u origin main" -ForegroundColor White

Write-Host "`n3. 🗄️ Configurar banco PostgreSQL (já configurado!):" -ForegroundColor Yellow
Write-Host "   ✅ Database URL: postgresql://kadesh_modern_user:***@dpg-d4bgunchg0os73eum7p0-a.oregon-postgres.render.com/kadesh_modern" -ForegroundColor Green

Write-Host "`n4. 🚀 Deploy no Render (Backend):" -ForegroundColor Yellow
Write-Host "   • Conecte o repositório kadesh-backend" -ForegroundColor White
Write-Host "   • Build Command: npm install" -ForegroundColor White
Write-Host "   • Start Command: npm start" -ForegroundColor White
Write-Host "   • Configure as variáveis de ambiente do .env.example" -ForegroundColor White

Write-Host "`n5. 🌐 Deploy no Vercel (Frontend):" -ForegroundColor Yellow  
Write-Host "   • Conecte o repositório kadesh-frontend" -ForegroundColor White
Write-Host "   • Framework: Vite" -ForegroundColor White
Write-Host "   • Build Command: npm run build" -ForegroundColor White
Write-Host "   • Configure VITE_API_URL para a URL do Render" -ForegroundColor White

Write-Host "`n6. 🔄 Executar migração de dados:" -ForegroundColor Yellow
Write-Host "   • No Render, após deploy: execute o script de migração" -ForegroundColor White
Write-Host "   • Ou execute localmente: node scripts/migrate-data.js" -ForegroundColor White

Write-Host "`n✨ Sistema modernizado pronto para produção!" -ForegroundColor Green