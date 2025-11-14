# Script para deploy local do Kadesh
# Rebuild do frontend e limpeza de cache

Write-Host "🚀 Iniciando deploy local do Kadesh..." -ForegroundColor Cyan

# 1. Build do frontend
Write-Host "`n📦 Buildando frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
Set-Location ..

# 2. Copiar arquivos para root
Write-Host "`n📁 Copiando arquivos..." -ForegroundColor Yellow
Copy-Item -Recurse -Force frontend/dist/* .

# 3. Limpar arquivos antigos
Write-Host "`n🧹 Limpando arquivos antigos..." -ForegroundColor Yellow
$newestJS = Get-ChildItem -Path "assets/index-*.js" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$newestCSS = Get-ChildItem -Path "assets/index-*.css" | Sort-Object LastWriteTime -Descending | Select-Object -First 1

Get-ChildItem -Path "assets/index-*.js" | Where-Object { $_.Name -ne $newestJS.Name } | Remove-Item -Force
Get-ChildItem -Path "assets/index-*.css" | Where-Object { $_.Name -ne $newestCSS.Name } | Remove-Item -Force

Write-Host "`n✅ Deploy local concluído!" -ForegroundColor Green
Write-Host "`n📊 Arquivos ativos:" -ForegroundColor Cyan
Write-Host "   JS:  $($newestJS.Name)" -ForegroundColor White
Write-Host "   CSS: $($newestCSS.Name)" -ForegroundColor White
Write-Host "`n🌐 Acesse: http://localhost/kadesh/" -ForegroundColor Green
Write-Host "   (Pressione Ctrl+Shift+R para limpar cache do navegador)" -ForegroundColor Gray
