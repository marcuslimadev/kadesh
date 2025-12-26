# Script para criar administrador em produção
# Uso: .\create-admin-production.ps1

Write-Host "`n🔐 Criando Administrador em PRODUÇÃO" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

# Credenciais do novo admin
$AdminEmail = "kaddesh@kaddesh.com"
$AdminPassword = "Teste@123"

Write-Host "📧 Email: $AdminEmail" -ForegroundColor Yellow
Write-Host "🔑 Senha: $AdminPassword`n" -ForegroundColor Yellow

# Solicitar DATABASE_URL
Write-Host "⚠️  ATENÇÃO: Você precisa da DATABASE_URL de produção!" -ForegroundColor Red
Write-Host "   Obtenha em: https://dashboard.render.com -> Database -> Connection String`n" -ForegroundColor Gray

$DatabaseUrl = Read-Host "Cole a DATABASE_URL de produção aqui"

if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) {
    Write-Host "`n❌ DATABASE_URL não fornecida. Abortando." -ForegroundColor Red
    exit 1
}

Write-Host "`n🔄 Executando script..." -ForegroundColor Cyan

# Navegar para o diretório de scripts
Set-Location -Path "$PSScriptRoot"

# Executar o script Node.js
$env:DATABASE_URL = $DatabaseUrl
node create-admin-production.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ SUCESSO! Administrador criado em produção!" -ForegroundColor Green
    Write-Host "`n🌐 Acesse: https://kadesh-two.vercel.app/admin/login" -ForegroundColor Cyan
    Write-Host "   Email: $AdminEmail" -ForegroundColor White
    Write-Host "   Senha: $AdminPassword`n" -ForegroundColor White
} else {
    Write-Host "`n❌ Erro ao criar administrador. Verifique os logs acima." -ForegroundColor Red
}
