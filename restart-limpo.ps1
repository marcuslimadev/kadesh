# 🔥 LIMPAR TUDO E REINICIAR

Write-Host "🔥 MATANDO PROCESSOS E LIMPANDO TUDO..." -ForegroundColor Red

# 1. Matar TODOS os processos Node
Write-Host "`n1️⃣ Matando processos Node..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1
Write-Host "✅ Processos mortos" -ForegroundColor Green

# 2. Limpar cache Vite
Write-Host "`n2️⃣ Limpando cache Vite..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
Write-Host "✅ Cache Vite limpo" -ForegroundColor Green

# 3. Limpar dist
Write-Host "`n3️⃣ Limpando dist..." -ForegroundColor Yellow
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Write-Host "✅ Dist limpo" -ForegroundColor Green

# 4. Limpar .vite
Write-Host "`n4️⃣ Limpando .vite..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .vite -ErrorAction SilentlyContinue
Write-Host "✅ .vite limpo" -ForegroundColor Green

# 5. Limpar cache temporário
Write-Host "`n5️⃣ Limpando cache temporário..." -ForegroundColor Yellow
$env:TEMP = [System.IO.Path]::GetTempPath()
Remove-Item -Recurse -Force "$env:TEMP\vite-*" -ErrorAction SilentlyContinue
Write-Host "✅ Cache temporário limpo" -ForegroundColor Green

Write-Host "`n`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎯 AGORA FAÇA ISSO NO NAVEGADOR:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Acesse: http://localhost:3000/limpar-storage.html" -ForegroundColor White
Write-Host "2. Clique em 'LIMPAR TUDO AGORA'" -ForegroundColor White
Write-Host "3. Aguarde o redirect automático" -ForegroundColor White
Write-Host ""
Write-Host "OU use aba anônima: Ctrl+Shift+N" -ForegroundColor White
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Write-Host "`n🚀 Iniciando servidor Vite..." -ForegroundColor Green
npm run dev
