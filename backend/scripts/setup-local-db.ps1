# Script para criar e configurar banco Kadesh no PostgreSQL local
# Uso: .\setup-local-db.ps1

$ErrorActionPreference = "Stop"

$pgBin = "C:\Program Files\PostgreSQL\18\bin"
$psql = Join-Path $pgBin "psql.exe"
$pgCtl = Join-Path $pgBin "pg_ctl.exe"

Write-Host "`n🗄️  Setup do banco Kadesh - PostgreSQL 18`n" -ForegroundColor Cyan

# Verificar se psql existe
if (-not (Test-Path $psql)) {
    Write-Host "❌ psql.exe não encontrado em: $psql" -ForegroundColor Red
    Write-Host "Ajuste o caminho no script ou instale PostgreSQL." -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 PostgreSQL encontrado: $pgBin" -ForegroundColor Green

# Solicitar senha do usuário postgres
$postgresPassword = Read-Host "Digite a senha do usuário 'postgres' (padrão da instalação)" -AsSecureString
$PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($postgresPassword))

# Configurar variável de ambiente para senha
$env:PGPASSWORD = $PGPASSWORD

Write-Host "`n🔧 Criando banco 'kadesh' e usuário 'kadesh'...`n" -ForegroundColor Yellow

try {
    # Testar conexão primeiro
    Write-Host "🔍 Testando conexão com PostgreSQL..." -ForegroundColor Cyan
    $testResult = & $psql -U postgres -h localhost -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n❌ Não foi possível conectar ao PostgreSQL com o usuário 'postgres'" -ForegroundColor Red
        Write-Host "Erro: $testResult" -ForegroundColor Yellow
        Write-Host "`n💡 Dicas:" -ForegroundColor Cyan
        Write-Host "   - Verifique se a senha do postgres está correta" -ForegroundColor White
        Write-Host "   - Verifique o arquivo pg_hba.conf para permitir autenticação md5/scram-sha-256" -ForegroundColor White
        Write-Host "   - Localização típica: C:\Program Files\PostgreSQL\18\data\pg_hba.conf" -ForegroundColor White
        exit 1
    }
    Write-Host "✅ Conexão bem-sucedida!" -ForegroundColor Green
    
    # Criar usuário kadesh se não existir
    Write-Host "👤 Criando usuário 'kadesh'..." -ForegroundColor Cyan
    $createUserSQL = "DO `$`$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'kadesh') THEN CREATE USER kadesh WITH PASSWORD 'kadesh'; END IF; END `$`$;"
    & $psql -U postgres -h localhost -c $createUserSQL 2>&1 | Out-Null
    
    # Criar banco kadesh se não existir
    Write-Host "💾 Criando banco 'kadesh'..." -ForegroundColor Cyan
    & $psql -U postgres -h localhost -lqt 2>&1 | Select-String -Pattern "kadesh" -Quiet
    if (-not $?) {
        & $psql -U postgres -h localhost -c "CREATE DATABASE kadesh OWNER kadesh;" 2>&1 | Out-Null
    }
    
    # Garantir permissões
    Write-Host "🔐 Configurando permissões..." -ForegroundColor Cyan
    & $psql -U postgres -h localhost -d kadesh -c "GRANT ALL PRIVILEGES ON DATABASE kadesh TO kadesh;" 2>&1 | Out-Null
    & $psql -U postgres -h localhost -d kadesh -c "GRANT ALL ON SCHEMA public TO kadesh;" 2>&1 | Out-Null
    
    Write-Host "`n✅ Banco 'kadesh' criado com sucesso!" -ForegroundColor Green
    Write-Host "`n📋 Credenciais:" -ForegroundColor Cyan
    Write-Host "   Host:     localhost" -ForegroundColor White
    Write-Host "   Port:     5432" -ForegroundColor White
    Write-Host "   Database: kadesh" -ForegroundColor White
    Write-Host "   User:     kadesh" -ForegroundColor White
    Write-Host "   Password: kadesh" -ForegroundColor White
    
    Write-Host "`n🔗 String de conexão:" -ForegroundColor Cyan
    Write-Host "   postgresql://kadesh:kadesh@localhost:5432/kadesh" -ForegroundColor Yellow
    
    Write-Host "`n📝 Próximos passos:" -ForegroundColor Green
    Write-Host "   1. O arquivo .env já está configurado com essas credenciais" -ForegroundColor White
    Write-Host "   2. Execute: cd backend && npm run db:load-schema" -ForegroundColor White
    Write-Host "   3. Execute: npm run dev" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ Erro ao configurar banco:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
} finally {
    # Limpar senha da memória
    $env:PGPASSWORD = $null
}
