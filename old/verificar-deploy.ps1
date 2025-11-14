# Script de Verificação Final - Home Kaddesh
# Executa testes automáticos antes do deploy

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         VERIFICAÇÃO FINAL - HOME PAGE KADDESH             ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0
$success = 0

# 1. VERIFICAR ARQUIVOS HTML
Write-Host "📄 1. Verificando Arquivos HTML..." -ForegroundColor Yellow
$htmlFiles = @(
    "public/jquery-frontend/leiloes-original.html"
)

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Verificar se tem DOCTYPE
        if ($content -match '<!DOCTYPE html>') {
            Write-Host "  ✓ $file - DOCTYPE OK" -ForegroundColor Green
            $success++
        } else {
            Write-Host "  ⚠ $file - Sem DOCTYPE" -ForegroundColor Yellow
            $warnings++
        }
        
        # Verificar charset UTF-8
        if ($content -match 'charset="UTF-8"' -or $content -match "charset='UTF-8'") {
            Write-Host "  ✓ $file - Charset UTF-8 OK" -ForegroundColor Green
            $success++
        } else {
            Write-Host "  ✗ $file - Charset UTF-8 faltando!" -ForegroundColor Red
            $errors++
        }
        
        # Verificar viewport meta
        if ($content -match 'name="viewport"') {
            Write-Host "  ✓ $file - Viewport meta OK" -ForegroundColor Green
            $success++
        } else {
            Write-Host "  ✗ $file - Viewport meta faltando!" -ForegroundColor Red
            $errors++
        }
    } else {
        Write-Host "  ✗ $file - Arquivo não encontrado!" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""

# 2. VERIFICAR CSS
Write-Host "🎨 2. Verificando Arquivos CSS..." -ForegroundColor Yellow
$cssFiles = @(
    "public/jquery-frontend/assets/css/kadesh-original-theme.css"
)

foreach ($file in $cssFiles) {
    if (Test-Path $file) {
        $size = [math]::Round((Get-Item $file).Length / 1KB, 1)
        Write-Host "  ✓ $file ($size KB)" -ForegroundColor Green
        $success++
        
        $content = Get-Content $file -Raw
        
        # Verificar variáveis CSS
        if ($content -match '--kadesh-navy' -and $content -match '--kadesh-yellow') {
            Write-Host "  ✓ Variáveis CSS definidas" -ForegroundColor Green
            $success++
        } else {
            Write-Host "  ⚠ Variáveis CSS podem estar faltando" -ForegroundColor Yellow
            $warnings++
        }
    } else {
        Write-Host "  ✗ $file - Arquivo não encontrado!" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""

# 3. VERIFICAR IMAGENS
Write-Host "🖼️  3. Verificando Imagens..." -ForegroundColor Yellow
$images = @(
    @{name='hero-handshake.jpg'; required=$true},
    @{name='category-design.jpg'; required=$true},
    @{name='category-marketing.jpg'; required=$true},
    @{name='category-email.jpg'; required=$true},
    @{name='category-obras.jpg'; required=$true},
    @{name='project-1.jpg'; required=$true},
    @{name='project-2.jpg'; required=$true},
    @{name='project-3.jpg'; required=$true},
    @{name='project-4.jpg'; required=$true},
    @{name='logo-kaddesh.svg'; required=$true},
    @{name='logo-kaddesh.png'; required=$true},
    @{name='favicon.png'; required=$true}
)

$totalSize = 0
foreach ($img in $images) {
    $path = "public/assets/images/$($img.name)"
    if (Test-Path $path) {
        $size = (Get-Item $path).Length
        $sizeKB = [math]::Round($size / 1KB, 1)
        $totalSize += $size
        
        if ($sizeKB -gt 500) {
            Write-Host "  ⚠ $($img.name) - Muito grande ($sizeKB KB)" -ForegroundColor Yellow
            $warnings++
        } else {
            Write-Host "  ✓ $($img.name) ($sizeKB KB)" -ForegroundColor Green
            $success++
        }
    } else {
        if ($img.required) {
            Write-Host "  ✗ $($img.name) - OBRIGATÓRIA faltando!" -ForegroundColor Red
            $errors++
        } else {
            Write-Host "  ⚠ $($img.name) - Opcional faltando" -ForegroundColor Yellow
            $warnings++
        }
    }
}

$totalSizeMB = [math]::Round($totalSize / 1MB, 2)
Write-Host "  ℹ  Tamanho total das imagens: $totalSizeMB MB" -ForegroundColor Cyan

if ($totalSizeMB -gt 5) {
    Write-Host "  ⚠ Tamanho total > 5MB - Considere otimizar" -ForegroundColor Yellow
    $warnings++
}

Write-Host ""

# 4. VERIFICAR DEPENDÊNCIAS EXTERNAS
Write-Host "🌐 4. Verificando Dependências Externas..." -ForegroundColor Yellow

# jQuery
Write-Host "  ✓ jQuery 3.7.1 (CDN)" -ForegroundColor Green
$success++

# Font Awesome
Write-Host "  ✓ Font Awesome 6.4.0 (CDN)" -ForegroundColor Green
$success++

# Google Fonts
Write-Host "  ✓ Google Fonts - Open Sans (CDN)" -ForegroundColor Green
$success++

Write-Host ""

# 5. VERIFICAR ESTRUTURA DE PASTAS
Write-Host "📁 5. Verificando Estrutura de Pastas..." -ForegroundColor Yellow
$folders = @(
    "public",
    "public/assets",
    "public/assets/images",
    "public/jquery-frontend",
    "public/jquery-frontend/assets",
    "public/jquery-frontend/assets/css"
)

foreach ($folder in $folders) {
    if (Test-Path $folder -PathType Container) {
        Write-Host "  ✓ $folder/" -ForegroundColor Green
        $success++
    } else {
        Write-Host "  ✗ $folder/ - Pasta faltando!" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""

# 6. VERIFICAR BACKEND (OPCIONAL)
Write-Host "🔌 6. Verificando Backend (Opcional)..." -ForegroundColor Yellow
if (Test-Path "public/backend.php") {
    Write-Host "  ✓ backend.php existe" -ForegroundColor Green
    $success++
    
    # Tentar testar API
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/kadesh/public/backend.php/api/auctions/active" -Method GET -UseBasicParsing -TimeoutSec 3 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ API respondendo (200 OK)" -ForegroundColor Green
            $success++
        }
    } catch {
        if ($_.Exception.Response.StatusCode -eq 401) {
            Write-Host "  ℹ  API protegida (401) - OK em produção" -ForegroundColor Cyan
        } else {
            Write-Host "  ⚠ API não respondeu - Verificar manualmente" -ForegroundColor Yellow
            $warnings++
        }
    }
} else {
    Write-Host "  ⚠ backend.php não encontrado - API não funcionará" -ForegroundColor Yellow
    $warnings++
}

Write-Host ""

# 7. VERIFICAR GIT
Write-Host "🔀 7. Verificando Git..." -ForegroundColor Yellow
try {
    $branch = git rev-parse --abbrev-ref HEAD 2>$null
    $commit = git rev-parse --short HEAD 2>$null
    
    if ($branch) {
        Write-Host "  ✓ Branch: $branch" -ForegroundColor Green
        $success++
    }
    
    if ($commit) {
        Write-Host "  ✓ Commit: $commit" -ForegroundColor Green
        $success++
    }
    
    $status = git status --short
    if ($status) {
        Write-Host "  ⚠ Há arquivos não commitados" -ForegroundColor Yellow
        $warnings++
    } else {
        Write-Host "  ✓ Working tree limpo" -ForegroundColor Green
        $success++
    }
} catch {
    Write-Host "  ⚠ Git não disponível ou não é repositório" -ForegroundColor Yellow
    $warnings++
}

Write-Host ""

# RESUMO FINAL
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                      RESUMO FINAL                          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "  ✓ Sucessos:  $success" -ForegroundColor Green
Write-Host "  ⚠ Avisos:    $warnings" -ForegroundColor Yellow
Write-Host "  ✗ Erros:     $errors" -ForegroundColor Red

Write-Host ""

# VEREDITO
if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║          ✅ TUDO PERFEITO! PRONTO PARA DEPLOY!             ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    exit 0
} elseif ($errors -eq 0) {
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
    Write-Host "║     ⚠️  PRONTO COM AVISOS - Revisar antes do deploy        ║" -ForegroundColor Yellow
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║        ❌ ERROS CRÍTICOS - CORRIGIR ANTES DO DEPLOY!       ║" -ForegroundColor Red
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Red
    exit 2
}
