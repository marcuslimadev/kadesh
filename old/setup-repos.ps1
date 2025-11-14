# Kadesh Repository Setup Script
param(
    [string]$GitHubUsername = "marcuslimadev"
)

Write-Host "Configurando repositorios Git para Kadesh Modern Stack" -ForegroundColor Green

# Verificar se estamos no diretorio correto
if (-not (Test-Path "modern-stack")) {
    Write-Host "Diretorio modern-stack nao encontrado!" -ForegroundColor Red
    Write-Host "Execute este script na raiz do projeto Kadesh" -ForegroundColor Yellow
    exit 1
}

# 1. Configurar repositorio Backend
Write-Host "Configurando repositorio BACKEND..." -ForegroundColor Blue
if (Test-Path "kadesh-backend") {
    Remove-Item -Path "kadesh-backend" -Recurse -Force
}

Copy-Item -Path "modern-stack/backend" -Destination "kadesh-backend" -Recurse

Push-Location "kadesh-backend"
try {
    git init
    git add .
    git commit -m "Initial commit - Kadesh Backend API"
    git remote add origin "https://github.com/$GitHubUsername/kadesh-backend.git"
    git branch -M main
    Write-Host "Backend repository configurado!" -ForegroundColor Green
}
finally {
    Pop-Location
}

# 2. Configurar repositorio Frontend  
Write-Host "Configurando repositorio FRONTEND..." -ForegroundColor Blue
if (Test-Path "kadesh-frontend") {
    Remove-Item -Path "kadesh-frontend" -Recurse -Force
}

Copy-Item -Path "modern-stack/frontend" -Destination "kadesh-frontend" -Recurse

Push-Location "kadesh-frontend"
try {
    git init
    git add .
    git commit -m "Initial commit - Kadesh Frontend SPA"
    git remote add origin "https://github.com/$GitHubUsername/kadesh-frontend.git"
    git branch -M main
    Write-Host "Frontend repository configurado!" -ForegroundColor Green
}
finally {
    Pop-Location
}

Write-Host "REPOSITORIOS CONFIGURADOS COM SUCESSO!" -ForegroundColor Green
Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Blue
Write-Host "1. Criar os repositorios no GitHub:" -ForegroundColor Yellow
Write-Host "   - https://github.com/new (nome: kadesh-backend)" -ForegroundColor White
Write-Host "   - https://github.com/new (nome: kadesh-frontend)" -ForegroundColor White
Write-Host ""
Write-Host "2. Fazer push dos repositorios:" -ForegroundColor Yellow
Write-Host "   cd kadesh-backend && git push -u origin main" -ForegroundColor White
Write-Host "   cd kadesh-frontend && git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "3. Deploy no Render (Backend):" -ForegroundColor Yellow
Write-Host "   - Conecte o repositorio kadesh-backend" -ForegroundColor White
Write-Host "   - Build Command: npm install" -ForegroundColor White
Write-Host "   - Start Command: npm start" -ForegroundColor White
Write-Host ""
Write-Host "4. Deploy no Vercel (Frontend):" -ForegroundColor Yellow  
Write-Host "   - Conecte o repositorio kadesh-frontend" -ForegroundColor White
Write-Host "   - Framework: Vite" -ForegroundColor White
Write-Host "   - Build Command: npm run build" -ForegroundColor White
Write-Host ""
Write-Host "Sistema modernizado pronto para producao!" -ForegroundColor Green