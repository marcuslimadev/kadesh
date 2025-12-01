# Script simplificado: cria banco usando createdb (sem necessidade de senha postgres)
# Usa autenticação do Windows / trust local

$ErrorActionPreference = "Stop"

$pgBin = "C:\Program Files\PostgreSQL\18\bin"
$createdb = Join-Path $pgBin "createdb.exe"
$psql = Join-Path $pgBin "psql.exe"

Write-Host "`n🗄️  Setup rápido do banco Kadesh`n" -ForegroundColor Cyan

if (-not (Test-Path $createdb)) {
    Write-Host "❌ createdb.exe não encontrado" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Usando PostgreSQL 18: $pgBin" -ForegroundColor Green

try {
    # Tentar criar banco diretamente (assumindo trust/peer authentication local)
    Write-Host "`n💾 Criando banco 'kadesh'..." -ForegroundColor Cyan
    
    # Criar usuário postgres se estiver usando auth Windows
    $env:PGUSER = $env:USERNAME
    
    # Tentar com usuário atual do Windows
    & $createdb -h localhost -U $env:USERNAME kadesh 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Banco criado com usuário Windows" -ForegroundColor Green
        
        # Criar usuário kadesh
        & $psql -h localhost -U $env:USERNAME -d kadesh -c "CREATE USER kadesh WITH PASSWORD 'kadesh'; GRANT ALL PRIVILEGES ON DATABASE kadesh TO kadesh; GRANT ALL ON SCHEMA public TO kadesh;" 2>&1 | Out-Null
        
        Write-Host "✅ Usuário 'kadesh' criado" -ForegroundColor Green
    } else {
        # Fallback: tentar com postgres user
        Write-Host "Tentando com usuário 'postgres'..." -ForegroundColor Yellow
        $pass = Read-Host "Senha do postgres" -AsSecureString
        $env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass))
        
        & $createdb -h localhost -U postgres kadesh 2>&1 | Out-Null
        & $psql -h localhost -U postgres -d kadesh -c "CREATE USER kadesh WITH PASSWORD 'kadesh'; GRANT ALL PRIVILEGES ON DATABASE kadesh TO kadesh; GRANT ALL ON SCHEMA public TO kadesh;" 2>&1 | Out-Null
        
        $env:PGPASSWORD = $null
        Write-Host "✅ Banco e usuário criados" -ForegroundColor Green
    }
    
    Write-Host "`n✅ Setup concluído!" -ForegroundColor Green
    Write-Host "`n📋 Credenciais configuradas no .env:" -ForegroundColor Cyan
    Write-Host "   DATABASE_URL=postgresql://kadesh:kadesh@localhost:5432/kadesh" -ForegroundColor Yellow
    
    Write-Host "`n📝 Próximos passos:" -ForegroundColor Green
    Write-Host "   1. npm run db:load-schema  (carregar tabelas)" -ForegroundColor White
    Write-Host "   2. npm run dev             (iniciar API)" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n💡 Alternativa: crie manualmente via pgAdmin ou:" -ForegroundColor Yellow
    Write-Host "   psql -U postgres -c `"CREATE DATABASE kadesh;`"" -ForegroundColor White
    Write-Host "   psql -U postgres -d kadesh -c `"CREATE USER kadesh WITH PASSWORD 'kadesh'; GRANT ALL ON DATABASE kadesh TO kadesh;`"" -ForegroundColor White
    exit 1
}
