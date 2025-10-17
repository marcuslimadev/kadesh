# Script de preparação para deploy em produção (Windows PowerShell)

Write-Host "🚀 Preparando Deploy para Produção - Kadesh" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Build do frontend
Write-Host "📦 1. Fazendo build do frontend..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build do frontend!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build concluído!" -ForegroundColor Green
Write-Host ""

# 2. Verificar arquivos essenciais
Write-Host "🔍 2. Verificando arquivos essenciais..." -ForegroundColor Yellow

$files = @(
    "public\build\index.html",
    "public\index.php",
    "public\backend.php",
    ".htaccess",
    "index.php"
)

foreach ($file in $files) {
    if (!(Test-Path $file)) {
        Write-Host "❌ Arquivo não encontrado: $file" -ForegroundColor Red
        exit 1
    } else {
        Write-Host "✅ $file" -ForegroundColor Green
    }
}

Write-Host ""

# 3. Commit e push
Write-Host "📤 3. Fazendo commit e push..." -ForegroundColor Yellow
$commit_msg = Read-Host "Mensagem do commit (Enter para padrão)"

if ([string]::IsNullOrWhiteSpace($commit_msg)) {
    $commit_msg = "build: preparar para deploy em produção"
}

git add .
git commit -m $commit_msg
git push origin producao

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no push!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Push concluído!" -ForegroundColor Green
Write-Host ""

# 4. Resumo
Write-Host "🎉 PREPARAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos Passos:" -ForegroundColor Cyan
Write-Host "1. Acesse cPanel → Git Version Control"
Write-Host "2. Clique em 'Pull or Deploy' no repositório 'kadesh'"
Write-Host "3. Clique em 'Update from Remote'"
Write-Host "4. Aguarde conclusão do deploy"
Write-Host "5. Acesse: https://kadesh.mmbsites.com.br"
Write-Host ""
Write-Host "📖 Ver documentação completa: DEPLOY-PRODUCAO.md" -ForegroundColor Yellow
Write-Host ""

# Perguntar se deseja abrir cPanel
$open_cpanel = Read-Host "Deseja abrir o cPanel agora? (s/n)"
if ($open_cpanel -eq "s" -or $open_cpanel -eq "S") {
    Start-Process "https://mmbsites.com.br:2083"
}
