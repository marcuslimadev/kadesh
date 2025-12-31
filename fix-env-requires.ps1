# Remove require_once env.php de todos os arquivos da API
$files = Get-ChildItem -Path "api\api" -Recurse -Filter "*.php"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Remove a linha que carrega env.php
    $content = $content -replace "require_once __DIR__ \. '/\.\./\.\./config/env\.php';\r?\n", ""
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "✓ Atualizado: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`n✓ Processo concluído!" -ForegroundColor Cyan
