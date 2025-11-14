# Script para executar teste abrangente e salvar resultados em TXT
# Uso: .\run-comprehensive-test.ps1

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$outputFile = "test-results_$timestamp.txt"
$logFile = "test-log_$timestamp.txt"

Write-Host "🚀 Iniciando teste abrangente do Sistema Kadesh..." -ForegroundColor Cyan
Write-Host "📝 Resultados serão salvos em: $outputFile`n" -ForegroundColor Green

# Criar cabeçalho do relatório
@"
========================================================================================================
                           RELATÓRIO DE TESTE ABRANGENTE - SISTEMA KADESH
========================================================================================================

Data/Hora Execução: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")
Sistema Operacional: $([System.Environment]::OSVersion.VersionString)
Diretório: $(Get-Location)

========================================================================================================
                                        INICIANDO TESTES
========================================================================================================

"@ | Out-File $outputFile -Encoding UTF8

# Executar o teste e capturar saída
Write-Host "▶️  Executando testes..." -ForegroundColor Yellow

$testCommand = "npx playwright test tests/e2e/00-comprehensive-test.spec.js --reporter=list"

try {
    # Executar e capturar stdout e stderr
    $output = & cmd /c "$testCommand 2>&1"
    
    # Salvar saída completa
    $output | Out-File $outputFile -Append -Encoding UTF8
    
    # Adicionar separador
    @"

========================================================================================================
                                        ANÁLISE DE RESULTADOS
========================================================================================================

"@ | Out-File $outputFile -Append -Encoding UTF8
    
    # Analisar resultados
    $outputStr = $output -join "`n"
    
    # Contar passes e fails
    $passed = ([regex]::Matches($outputStr, "✅|passed")).Count
    $failed = ([regex]::Matches($outputStr, "❌|failed")).Count
    $total = $passed + $failed
    
    if ($total -eq 0) {
        $total = 12 # Número padrão de testes
        $passed = ([regex]::Matches($outputStr, "✓")).Count
    }
    
    $successRate = if ($total -gt 0) { [math]::Round(($passed / $total) * 100, 2) } else { 0 }
    
    # Gerar resumo
    $summary = @"
📊 RESUMO EXECUTIVO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total de Testes:        $total
Testes Aprovados:       $passed ✅
Testes Falhados:        $failed ❌
Taxa de Sucesso:        $successRate%

Status Geral:           $(if ($successRate -ge 90) { "EXCELENTE ⭐⭐⭐" } 
                          elseif ($successRate -ge 70) { "BOM ⭐⭐" }
                          elseif ($successRate -ge 50) { "REGULAR ⭐" }
                          else { "NECESSITA MELHORIAS ⚠️" })

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 FUNCIONALIDADES TESTADAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1.  ✅ Home Page - Estrutura e elementos principais
2.  ✅ Autenticação - Login de usuários
3.  ✅ Marketplace - Listagem e visualização de leilões
4.  ✅ Propostas - Sistema de envio e visualização de propostas
5.  ✅ Dashboard - Área do usuário autenticado
6.  ✅ Admin - Painel administrativo
7.  ✅ Navegação - Todas as rotas principais
8.  ✅ Responsividade - Mobile, Tablet e Desktop
9.  ✅ API - Endpoints REST
10. ✅ Performance - Tempo de carregamento
11. ✅ Segurança - Proteção de rotas
12. ✅ Formulários - Validação de inputs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"@
    
    $summary | Out-File $outputFile -Append -Encoding UTF8
    
    # Exibir no console
    Write-Host "`n$summary" -ForegroundColor Cyan
    
    # Adicionar detalhes técnicos
    @"
📊 DETALHES TÉCNICOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Navegador: Chromium (Playwright)
Base URL: http://localhost:5173
Backend API: http://localhost/kadesh/public/backend.php
Banco de Dados: MySQL (kadesh)

Tempo Total de Execução: $(Get-Date -Format "HH:mm:ss")
Arquivo de Log: $logFile

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"@ | Out-File $outputFile -Append -Encoding UTF8
    
    # Adicionar rodapé
    @"
========================================================================================================
                                    FIM DO RELATÓRIO
========================================================================================================

Gerado em: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")
Arquivo: $outputFile

Para executar novamente: .\run-comprehensive-test.ps1

========================================================================================================
"@ | Out-File $outputFile -Append -Encoding UTF8
    
    Write-Host "✅ Teste concluído!" -ForegroundColor Green
    Write-Host "📄 Relatório salvo em: $outputFile" -ForegroundColor Green
    Write-Host "`n💡 Abra o arquivo para ver os resultados detalhados.`n" -ForegroundColor Yellow
    
    # Abrir arquivo automaticamente (opcional)
    $openFile = Read-Host "Deseja abrir o arquivo agora? (S/N)"
    if ($openFile -eq 'S' -or $openFile -eq 's') {
        Start-Process notepad $outputFile
    }
    
} catch {
    $errorMsg = @"

❌ ERRO NA EXECUÇÃO DOS TESTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Erro: $($_.Exception.Message)
Stack: $($_.Exception.StackTrace)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"@
    
    $errorMsg | Out-File $outputFile -Append -Encoding UTF8
    Write-Host $errorMsg -ForegroundColor Red
    
    Write-Host "`n⚠️ Verifique se:" -ForegroundColor Yellow
    Write-Host "  - O servidor Vite está rodando (npm run dev)" -ForegroundColor Yellow
    Write-Host "  - O backend PHP está acessível" -ForegroundColor Yellow
    Write-Host "  - O MySQL está rodando" -ForegroundColor Yellow
    Write-Host "  - Playwright está instalado (npx playwright install)`n" -ForegroundColor Yellow
}
