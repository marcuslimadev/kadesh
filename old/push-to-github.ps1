# Kadesh - Script de Push para GitHub
# Execute após criar os repositórios no GitHub

Write-Host "🚀 KADESH - Push para GitHub" -ForegroundColor Green
Write-Host "=" * 40

# Verificar se os repositórios existem
if (-not (Test-Path "kadesh-backend")) {
    Write-Host "❌ Diretório kadesh-backend não encontrado!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "kadesh-frontend")) {
    Write-Host "❌ Diretório kadesh-frontend não encontrado!" -ForegroundColor Red  
    exit 1
}

Write-Host "📤 Fazendo push do BACKEND..." -ForegroundColor Blue
Push-Location "kadesh-backend"
try {
    Write-Host "  🔧 Verificando remote..." -ForegroundColor Cyan
    git remote -v
    
    Write-Host "  📡 Fazendo push para GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Backend enviado com sucesso!" -ForegroundColor Green
        $backendSuccess = $true
    } else {
        Write-Host "  ❌ Erro no push do backend" -ForegroundColor Red
        $backendSuccess = $false
    }
} finally {
    Pop-Location
}

Write-Host "`n📤 Fazendo push do FRONTEND..." -ForegroundColor Blue
Push-Location "kadesh-frontend"
try {
    Write-Host "  🔧 Verificando remote..." -ForegroundColor Cyan
    git remote -v
    
    Write-Host "  📡 Fazendo push para GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Frontend enviado com sucesso!" -ForegroundColor Green
        $frontendSuccess = $true
    } else {
        Write-Host "  ❌ Erro no push do frontend" -ForegroundColor Red
        $frontendSuccess = $false
    }
} finally {
    Pop-Location
}

Write-Host "`n🎉 RESULTADO:" -ForegroundColor Green
Write-Host "=" * 40

if ($backendSuccess) {
    Write-Host "✅ Backend: https://github.com/marcuslimadev/kadesh-backend" -ForegroundColor Green
} else {
    Write-Host "❌ Backend: Erro no push" -ForegroundColor Red
}

if ($frontendSuccess) {
    Write-Host "✅ Frontend: https://github.com/marcuslimadev/kadesh-frontend" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend: Erro no push" -ForegroundColor Red
}

if ($backendSuccess -and $frontendSuccess) {
    Write-Host "`n🚀 PRÓXIMOS PASSOS:" -ForegroundColor Blue
    Write-Host "1. Deploy Backend no Render:" -ForegroundColor Yellow
    Write-Host "   • Conecte: https://github.com/marcuslimadev/kadesh-backend" -ForegroundColor White
    Write-Host "   • Build: npm install" -ForegroundColor White
    Write-Host "   • Start: npm start" -ForegroundColor White
    
    Write-Host "`n2. Deploy Frontend no Vercel:" -ForegroundColor Yellow
    Write-Host "   • Conecte: https://github.com/marcuslimadev/kadesh-frontend" -ForegroundColor White
    Write-Host "   • Framework: Vite" -ForegroundColor White
    Write-Host "   • Build: npm run build" -ForegroundColor White
    
    Write-Host "`n3. Configurar variáveis de ambiente:" -ForegroundColor Yellow
    Write-Host "   • Backend: DATABASE_URL, JWT_SECRET, FRONTEND_URL" -ForegroundColor White
    Write-Host "   • Frontend: VITE_API_URL" -ForegroundColor White
}