# Script de Deploy Automatizado - Kadesh
# Execute este script para preparar a versão de produção

Write-Host "🚀 DEPLOY KADESH - Preparando versão de produção..." -ForegroundColor Green

# 1. Limpar e recriar pasta de produção
Write-Host "📁 Limpando pasta de produção..." -ForegroundColor Yellow
if (Test-Path "producao") {
    Remove-Item -Path "producao" -Recurse -Force
}
New-Item -ItemType Directory -Path "producao" -Force | Out-Null

# 2. Fazer build do Vue.js
Write-Host "⚙️ Fazendo build do Vue.js..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build do Vue.js!" -ForegroundColor Red
    exit 1
}

# 3. Copiar arquivos do build
Write-Host "📋 Copiando arquivos do build..." -ForegroundColor Yellow
Copy-Item -Path "dist\*" -Destination "producao\" -Recurse -Force

# 4. Criar estruturas necessárias
Write-Host "📂 Criando estruturas de pastas..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "producao\api" -Force | Out-Null
New-Item -ItemType Directory -Path "producao\config" -Force | Out-Null

# 5. Copiar backend otimizado (se existir)
if (Test-Path "producao\api\index.php") {
    Write-Host "✅ Backend já existe na pasta de produção" -ForegroundColor Green
} else {
    Write-Host "⚠️ Backend não encontrado - verifique se foi criado" -ForegroundColor Yellow
}

# 6. Verificar arquivos essenciais
Write-Host "🔍 Verificando arquivos essenciais..." -ForegroundColor Yellow

$arquivosEssenciais = @(
    "producao\index.html",
    "producao\.htaccess",
    "producao\api\index.php",
    "producao\config\database.php",
    "producao\database.sql",
    "producao\MANUAL-DEPLOY.md"
)

$arquivosFaltando = @()
foreach ($arquivo in $arquivosEssenciais) {
    if (!(Test-Path $arquivo)) {
        $arquivosFaltando += $arquivo
    }
}

if ($arquivosFaltando.Count -gt 0) {
    Write-Host "❌ Arquivos faltando:" -ForegroundColor Red
    foreach ($arquivo in $arquivosFaltando) {
        Write-Host "   - $arquivo" -ForegroundColor Red
    }
    Write-Host "Execute novamente o processo de criação dos arquivos." -ForegroundColor Yellow
} else {
    Write-Host "✅ Todos os arquivos essenciais estão presentes!" -ForegroundColor Green
}

# 7. Exibir estrutura final
Write-Host "📋 Estrutura da pasta de produção:" -ForegroundColor Cyan
Get-ChildItem -Path "producao" -Recurse | Format-Table Name, Length, LastWriteTime

# 8. Instruções finais
Write-Host ""
Write-Host "🎉 DEPLOY PREPARADO COM SUCESSO!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Edite producao\config\database.php com seus dados reais do banco"
Write-Host "2. Faça upload da pasta 'producao' via FTP para seu cPanel"
Write-Host "3. Importe o arquivo database.sql no phpMyAdmin"
Write-Host "4. Teste o site: https://seu-dominio.com/"
Write-Host ""
Write-Host "📖 Consulte o arquivo MANUAL-DEPLOY.md para instruções detalhadas" -ForegroundColor Yellow

# 9. Comprimir para facilitar upload
Write-Host "📦 Criando arquivo ZIP para upload..." -ForegroundColor Yellow
if (Get-Command Compress-Archive -ErrorAction SilentlyContinue) {
    Compress-Archive -Path "producao\*" -DestinationPath "kadesh-producao.zip" -Force
    Write-Host "✅ Arquivo kadesh-producao.zip criado!" -ForegroundColor Green
    Write-Host "   Você pode usar este ZIP para upload mais rápido via cPanel" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🚀 Deploy preparado! Boa sorte com a publicação!" -ForegroundColor Green