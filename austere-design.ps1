# Script para tornar o design austero e corporativo

$files = Get-ChildItem -Path "c:\xampp\htdocs\kadesh\src" -Filter "*.vue" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    
    # Remover transformações e escalas
    $content = $content -replace 'hover:scale-105', 'hover:opacity-90'
    $content = $content -replace 'hover:scale-110', 'hover:opacity-90'
    $content = $content -replace 'transform ', ''
    
    # Simplificar bordas arredondadas
    $content = $content -replace 'rounded-2xl', 'rounded'
    $content = $content -replace 'rounded-xl', 'rounded'
    $content = $content -replace 'rounded-3xl', 'rounded-lg'
    
    # Remover sombras excessivas
    $content = $content -replace 'shadow-2xl', 'shadow'
    $content = $content -replace 'shadow-xl', 'shadow'
    $content = $content -replace 'hover:shadow-2xl', 'hover:shadow-md'
    $content = $content -replace 'hover:shadow-xl', 'hover:shadow-md'
    
    # Simplificar font weights
    $content = $content -replace 'font-black', 'font-semibold'
    $content = $content -replace 'font-extrabold', 'font-semibold'
    
    # Remover animações decorativas
    $content = $content -replace 'animate-bounce', ''
    $content = $content -replace 'animate-pulse', ''
    $content = $content -replace 'animate-bounce-gentle', ''
    $content = $content -replace 'animate-pulse-slow', ''
    
    # Remover backdrop blur excessivo
    $content = $content -replace 'backdrop-blur-md', 'backdrop-blur-sm'
    $content = $content -replace 'backdrop-blur-lg', 'backdrop-blur-sm'
    
    Set-Content $file.FullName -Value $content -Encoding UTF8
}

Write-Host "✅ Design austero aplicado em $($files.Count) arquivos" -ForegroundColor Green
