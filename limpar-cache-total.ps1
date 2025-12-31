#!/usr/bin/env pwsh
# Script para LIMPAR TODO O CACHE do projeto Vue

Write-Host "`n🔥 LIMPANDO TODO O CACHE DO PROJETO`n" -ForegroundColor Yellow

# 1. Matar processos Node
Write-Host "1️⃣ Matando processos Node..." -ForegroundColor Cyan
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1
Write-Host "✅ Processos Node mortos`n" -ForegroundColor Green

# 2. Limpar cache Vite
Write-Host "2️⃣ Limpando cache Vite..." -ForegroundColor Cyan
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
Write-Host "✅ Cache Vite limpo`n" -ForegroundColor Green

# 3. Limpar dist
Write-Host "3️⃣ Limpando build anterior..." -ForegroundColor Cyan
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Write-Host "✅ Build limpa`n" -ForegroundColor Green

# 4. Limpar .cache (se existir)
Write-Host "4️⃣ Limpando .cache..." -ForegroundColor Cyan
Remove-Item -Recurse -Force .cache -ErrorAction SilentlyContinue
Write-Host "✅ .cache limpo`n" -ForegroundColor Green

# 5. Limpar node_modules (OPCIONAL - COMENTADO)
# Write-Host "5️⃣ Limpando node_modules..." -ForegroundColor Cyan
# Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
# npm install
# Write-Host "✅ node_modules reinstalado`n" -ForegroundColor Green

Write-Host "`n🎯 AGORA FAÇA ISSO NO NAVEGADOR:" -ForegroundColor Yellow
Write-Host "   1. Abra DevTools (F12)" -ForegroundColor White
Write-Host "   2. Clique com botão direito no botão Reload" -ForegroundColor White
Write-Host "   3. Selecione 'Empty Cache and Hard Reload'" -ForegroundColor White
Write-Host "   OU use Ctrl+Shift+Delete para limpar tudo" -ForegroundColor White
Write-Host "   OU abra em aba anônima: Ctrl+Shift+N (Chrome) / Ctrl+Shift+P (Firefox)`n" -ForegroundColor White

Write-Host "🚀 Iniciando servidor Vite..." -ForegroundColor Cyan
npm run dev
