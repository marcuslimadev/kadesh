# Script de Deploy para Produção - cPanel
# Troca .htaccess e faz push

Write-Host "🚀 Deploy Kadesh - Preparação para cPanel`n" -ForegroundColor Cyan

# 1. Compilar build
Write-Host "📦 1. Compilando build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao compilar build" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build compilado!" -ForegroundColor Green

# 2. Trocar .htaccess
Write-Host "`n🔧 2. Trocando .htaccess para produção..." -ForegroundColor Yellow
Copy-Item .htaccess.production .htaccess -Force
Write-Host "✅ .htaccess configurado (RewriteBase /)" -ForegroundColor Green

# 3. Git add e commit
Write-Host "`n📤 3. Fazendo commit..." -ForegroundColor Yellow
git add .
git commit -m "build: deploy para produção cPanel"

# 4. Push
Write-Host "`n🚢 4. Enviando para GitHub..." -ForegroundColor Yellow
git push origin producao

Write-Host "`n✅ DEPLOY CONCLUÍDO!" -ForegroundColor Green
Write-Host "`nAgora no cPanel:" -ForegroundColor Cyan
Write-Host "  1. Git Version Control → Update from Remote" -ForegroundColor White
Write-Host "  2. Ou aguardar webhook automático" -ForegroundColor White
Write-Host "`n🌐 https://kadesh.mmbsites.com.br" -ForegroundColor Yellow

# 5. Restaurar .htaccess local
Write-Host "`n🔄 Restaurando .htaccess local..." -ForegroundColor Yellow
Copy-Item .htaccess.local .htaccess -Force
Write-Host "✅ .htaccess restaurado para desenvolvimento" -ForegroundColor Green
