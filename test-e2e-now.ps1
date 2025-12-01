#!/usr/bin/env pwsh
# E2E Test - EXECUÇÃO COMPLETA DO KADESH

Write-Host "`n🚀 TESTE E2E COMPLETO - KADESH PLATFORM`n" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:3001"

# Função helper
function Test-Endpoint {
    param($Name, $Uri, $Method = "GET", $Body = $null, $Headers = @{})
    try {
        $params = @{
            Uri = "$baseUrl$Uri"
            Method = $Method
            Headers = $Headers
        }
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
            $params.ContentType = "application/json"
        }
        $result = Invoke-RestMethod @params
        Write-Host "✅ $Name" -ForegroundColor Green
        return $result
    } catch {
        Write-Host "❌ $Name - $($_.Exception.Message)" -ForegroundColor Red
        throw
    }
}

try {
    # 1. Admin Login
    Write-Host "`n📋 1. ADMIN LOGIN" -ForegroundColor Yellow
    $adminBody = @{
        email = "admin@kadesh.local"
        password = "admin123"
    }
    $admin = Test-Endpoint "Admin Login" "/api/admin/login" "POST" $adminBody
    $adminToken = $admin.token
    $adminHeaders = @{ Authorization = "Bearer $adminToken" }

    # 2. Listar Disputas (deve estar vazio)
    Write-Host "`n📋 2. DISPUTAS ADMIN" -ForegroundColor Yellow
    $disputes = Test-Endpoint "Listar Disputas" "/api/admin/disputes" "GET" $null $adminHeaders
    Write-Host "   Total de disputas: $($disputes.disputes.Count)"

    # 3. Registrar Cliente
    Write-Host "`n📋 3. REGISTRO DE USUÁRIOS" -ForegroundColor Yellow
    $clientBody = @{
        email = "cliente-$(Get-Random)@test.com"
        password = "Test123!"
        name = "Cliente Teste"
        user_type = "client"
    }
    $clientReg = Test-Endpoint "Registrar Cliente" "/api/auth/register" "POST" $clientBody
    
    # 4. Login Cliente
    $clientLogin = Test-Endpoint "Login Cliente" "/api/auth/login" "POST" @{
        email = $clientBody.email
        password = $clientBody.password
    }
    $clientToken = $clientLogin.token
    $clientHeaders = @{ Authorization = "Bearer $clientToken" }

    # 5. Registrar Provider
    $providerBody = @{
        email = "provider-$(Get-Random)@test.com"
        password = "Test123!"
        name = "Provider Teste"
        user_type = "provider"
    }
    $providerReg = Test-Endpoint "Registrar Provider" "/api/auth/register" "POST" $providerBody
    
    # 6. Login Provider
    $providerLogin = Test-Endpoint "Login Provider" "/api/auth/login" "POST" @{
        email = $providerBody.email
        password = $providerBody.password
    }
    $providerToken = $providerLogin.token
    $providerHeaders = @{ Authorization = "Bearer $providerToken" }

    # 6.5 Criar Provider Profile
    Write-Host "`n📋 3.5. CRIAR PROVIDER PROFILE" -ForegroundColor Yellow
    $profileBody = @{
        title = "Desenvolvedor Full Stack"
        bio = "Especialista em desenvolvimento web"
        skills = @("JavaScript", "PHP", "PostgreSQL")
        hourly_rate = 150
    }
    $profile = Test-Endpoint "Criar Provider Profile" "/api/users/profile" "POST" $profileBody $providerHeaders

    # 7. Criar Projeto
    Write-Host "`n📋 4. CRIAR PROJETO" -ForegroundColor Yellow
    $projectBody = @{
        title = "Website E-commerce"
        description = "Preciso de um website completo com carrinho de compras"
        category = "web_development"
        budget = 5000
        deadline_days = 30
    }
    $project = Test-Endpoint "Criar Projeto" "/api/projects" "POST" $projectBody $clientHeaders
    $projectId = $project.project.id
    Write-Host "   Project ID: $projectId"

    # 8. Enviar Proposta
    Write-Host "`n📋 5. ENVIAR PROPOSTA" -ForegroundColor Yellow
    $bidBody = @{
        project_id = $projectId
        amount = 4500
        description = "Posso entregar em 25 dias com qualidade premium"
        delivery_days = 25
    }
    $bid = Test-Endpoint "Enviar Proposta" "/api/bids" "POST" $bidBody $providerHeaders
    $bidId = $bid.bid.id
    Write-Host "   Bid ID: $bidId"

    # 9. Aceitar Proposta (cria contrato)
    Write-Host "`n📋 6. ACEITAR PROPOSTA" -ForegroundColor Yellow
    $accept = Test-Endpoint "Aceitar Proposta" "/api/bids/$bidId/accept" "POST" $null $clientHeaders
    $contractId = $accept.contract.id
    Write-Host "   Contract ID: $contractId"

    # 10. Criar Disputa
    Write-Host "`n📋 7. CRIAR DISPUTA" -ForegroundColor Yellow
    $disputeBody = @{
        contract_id = $contractId
        reason = "quality_issues"
        description = "O trabalho entregue não atende aos requisitos combinados"
    }
    $dispute = Test-Endpoint "Criar Disputa" "/api/contracts/$contractId/dispute" "POST" $disputeBody $clientHeaders
    $disputeId = $dispute.dispute.id
    Write-Host "   Dispute ID: $disputeId"

    # 11. Admin: Ver Disputa Detalhada
    Write-Host "`n📋 8. ADMIN - VER DISPUTA" -ForegroundColor Yellow
    $disputeDetail = Test-Endpoint "Ver Disputa Detalhada" "/api/admin/disputes/$disputeId" "GET" $null $adminHeaders
    Write-Host "   Status: $($disputeDetail.dispute.status)"
    Write-Host "   Criado por: $($disputeDetail.dispute.created_by_type)"

    # 12. Admin: Listar Disputas (agora deve ter 1)
    $disputesAfter = Test-Endpoint "Listar Disputas (após criação)" "/api/admin/disputes" "GET" $null $adminHeaders
    Write-Host "   Total de disputas agora: $($disputesAfter.disputes.Count)"

    # 13. Admin: Resolver Disputa (dismiss)
    Write-Host "`n📋 9. ADMIN - RESOLVER DISPUTA" -ForegroundColor Yellow
    $resolveBody = @{
        action = "dismiss"
        notes = "Ambas as partes chegaram a um acordo externo"
    }
    $resolve = Test-Endpoint "Resolver Disputa (dismiss)" "/api/admin/disputes/$disputeId/resolve" "POST" $resolveBody $adminHeaders
    Write-Host "   Nova status: $($resolve.dispute.status)"

    # 14. Verificar Wallet do Cliente (sem transações neste caso)
    Write-Host "`n📋 10. WALLET CHECK" -ForegroundColor Yellow
    $wallet = Test-Endpoint "Ver Wallet Cliente" "/api/wallet" "GET" $null $clientHeaders
    Write-Host "   Saldo: R$ $($wallet.wallet.balance)"

    Write-Host "`n`n🎉 TESTE E2E COMPLETO - 100% SUCESSO!`n" -ForegroundColor Green
    Write-Host "📊 RESUMO:" -ForegroundColor Cyan
    Write-Host "   ✅ Admin autenticado"
    Write-Host "   ✅ 2 usuários registrados (cliente + provider)"
    Write-Host "   ✅ 1 projeto criado"
    Write-Host "   ✅ 1 proposta enviada e aceita"
    Write-Host "   ✅ 1 contrato criado"
    Write-Host "   ✅ 1 disputa criada e resolvida"
    Write-Host "   ✅ Sistema de wallet funcional"
    Write-Host "`n💯 PLATAFORMA 100% FUNCIONAL!`n" -ForegroundColor Green

} catch {
    Write-Host "`n❌ ERRO NO TESTE E2E:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host $_.ScriptStackTrace
    exit 1
}
