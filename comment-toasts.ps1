# Script para comentar/remover toasts de forma segura

$files = Get-ChildItem -Path "src" -Filter "*.vue" -Recurse

foreach ($file in $files) {
    $lines = Get-Content $file.FullName
    $modified = $false
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        # Comentar import do toast
        if ($lines[$i] -match "^import.*useToast.*vue-toastification") {
            $lines[$i] = "// " + $lines[$i]
            $modified = $true
        }
        
        # Comentar declaração const toast
        if ($lines[$i] -match "^const toast = (useToast\(\)|typeof)") {
            $lines[$i] = "// " + $lines[$i]
            $modified = $true
        }
        
        # Comentar chamadas de toast
        if ($lines[$i] -match "^\s+toast\.(success|error|warning|info)\(") {
            $lines[$i] = "    // " + $lines[$i].TrimStart()
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $lines
        Write-Host "Atualizado: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`nToasts comentados com sucesso!" -ForegroundColor Cyan
