# Script para remover todos os toasts do projeto

$files = Get-ChildItem -Path "src" -Filter "*.vue" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Remover import do useToast
    $content = $content -replace "import \{ useToast \} from 'vue-toastification'[\r\n]+", ""
    $content = $content -replace "import \{ useToast \} from 'vue-toastification'", ""
    
    # Remover declaração do toast
    $content = $content -replace "const toast = useToast\(\)[\r\n]+", ""
    $content = $content -replace "const toast = useToast\(\)", ""
    $content = $content -replace "const toast = typeof window !== 'undefined' \? useToast\(\) : null[\r\n]+", ""
    
    # Remover chamadas toast.success/error/warning/info
    $content = $content -replace "[\s]*toast\.(success|error|warning|info)\([^\)]*\)[\r\n]*", ""
    
    # Salvar apenas se houve mudanças
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Atualizado: $($file.FullName)" -ForegroundColor Green
    }
}

Write-Host "`nRemoção de toasts concluída!" -ForegroundColor Cyan
