# Script para remover cores chamativas e gradientes de todos os arquivos Vue

$files = Get-ChildItem -Path "src" -Filter "*.vue" -Recurse

foreach ($file in $files) {
    Write-Host "Processando: $($file.FullName)"
    
    $content = Get-Content $file.FullName -Raw
    
    # Substituir gradientes por cores neutras
    $content = $content -replace 'bg-gradient-to-r from-purple-\d+ via-pink-\d+ to-indigo-\d+', 'bg-neutral-900'
    $content = $content -replace 'bg-gradient-to-r from-indigo-\d+ via-purple-\d+ to-pink-\d+', 'bg-neutral-900'
    $content = $content -replace 'bg-gradient-to-r from-purple-\d+ to-pink-\d+', 'bg-neutral-900'
    $content = $content -replace 'bg-gradient-to-r from-indigo-\d+ to-purple-\d+', 'bg-neutral-900'
    $content = $content -replace 'bg-gradient-to-br from-purple-\d+ via-pink-\d+ to-indigo-\d+', 'bg-neutral-900'
    $content = $content -replace 'bg-gradient-to-br from-purple-\d+ to-blue-\d+', 'bg-neutral-900'
    $content = $content -replace 'bg-gradient-to-br from-pink-\d+ to-purple-\d+', 'bg-neutral-900'
    
    # Cores específicas
    $content = $content -replace 'bg-gradient-to-r from-emerald-\d+ via-green-\d+ to-teal-\d+', 'bg-neutral-800'
    $content = $content -replace 'bg-gradient-to-br from-emerald-\d+ via-green-\d+ to-teal-\d+', 'bg-neutral-800'
    $content = $content -replace 'bg-gradient-to-r from-blue-\d+ via-indigo-\d+ to-purple-\d+', 'bg-neutral-700'
    $content = $content -replace 'bg-gradient-to-br from-blue-\d+ via-indigo-\d+ to-purple-\d+', 'bg-neutral-700'
    $content = $content -replace 'bg-gradient-to-r from-rose-\d+ via-pink-\d+ to-fuchsia-\d+', 'bg-neutral-600'
    $content = $content -replace 'bg-gradient-to-br from-rose-\d+ via-pink-\d+ to-fuchsia-\d+', 'bg-neutral-600'
    $content = $content -replace 'bg-gradient-to-r from-amber-\d+ via-orange-\d+ to-yellow-\d+', 'bg-neutral-600'
    $content = $content -replace 'bg-gradient-to-r from-yellow-\d+ to-orange-\d+', 'bg-neutral-600'
    $content = $content -replace 'bg-gradient-to-br from-yellow-\d+ to-orange-\d+', 'bg-neutral-600'
    $content = $content -replace 'bg-gradient-to-r from-red-\d+ via-rose-\d+ to-pink-\d+', 'bg-neutral-500'
    $content = $content -replace 'bg-gradient-to-br from-red-\d+ via-rose-\d+ to-pink-\d+', 'bg-neutral-500'
    
    # Backgrounds de cores sólidas
    $content = $content -replace 'from-purple-\d+ via-pink-\d+ to-indigo-\d+', 'from-neutral-800 to-neutral-900'
    $content = $content -replace 'from-purple-50 via-pink-50 to-indigo-100', 'from-neutral-50 to-neutral-100'
    $content = $content -replace 'from-purple-100 via-pink-100 to-indigo-100', 'from-neutral-100 to-neutral-200'
    $content = $content -replace 'from-amber-50 via-orange-50 to-yellow-50', 'from-neutral-50 to-neutral-100'
    $content = $content -replace 'from-red-50 via-rose-50 to-pink-50', 'from-neutral-50 to-neutral-100'
    
    # Textos gradientes
    $content = $content -replace 'bg-clip-text text-transparent.*?bg-gradient-to-r from-purple-\d+ to-pink-\d+', 'text-neutral-900'
    $content = $content -replace 'bg-clip-text text-transparent.*?bg-gradient-to-r from-indigo-\d+ to-purple-\d+', 'text-neutral-900'
    $content = $content -replace 'bg-clip-text text-transparent.*?bg-gradient-to-r from-red-\d+ to-rose-\d+', 'text-neutral-900'
    $content = $content -replace 'text-transparent bg-clip-text bg-gradient-to-r from-purple-\d+ via-pink-\d+ to-indigo-\d+', 'text-neutral-900'
    $content = $content -replace 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-\d+ to-purple-\d+', 'text-neutral-900'
    $content = $content -replace 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-\d+ to-teal-\d+', 'text-neutral-900'
    
    # Borders e badges coloridos
    $content = $content -replace 'border-purple-\d+', 'border-neutral-300'
    $content = $content -replace 'border-pink-\d+', 'border-neutral-300'
    $content = $content -replace 'border-indigo-\d+', 'border-neutral-300'
    $content = $content -replace 'border-blue-\d+', 'border-neutral-300'
    $content = $content -replace 'border-red-\d+', 'border-neutral-300'
    $content = $content -replace 'border-amber-\d+', 'border-neutral-300'
    $content = $content -replace 'border-emerald-\d+', 'border-neutral-300'
    
    # Backgrounds de badges/cards
    $content = $content -replace 'from-purple-100 via-pink-100 to-indigo-100', 'from-neutral-100 to-neutral-200'
    $content = $content -replace 'from-emerald-50 to-teal-50', 'from-neutral-50 to-neutral-100'
    $content = $content -replace 'from-blue-50 to-indigo-50', 'from-neutral-50 to-neutral-100'
    $content = $content -replace 'from-rose-50 to-pink-50', 'from-neutral-50 to-neutral-100'
    
    # Textos coloridos
    $content = $content -replace 'text-purple-\d00', 'text-neutral-900'
    $content = $content -replace 'text-pink-\d00', 'text-neutral-900'
    $content = $content -replace 'text-indigo-\d00', 'text-neutral-900'
    $content = $content -replace 'text-blue-\d00', 'text-neutral-900'
    $content = $content -replace 'text-emerald-\d00', 'text-neutral-900'
    $content = $content -replace 'text-green-\d00', 'text-neutral-900'
    
    # Hover states
    $content = $content -replace 'hover:from-purple-\d+ hover:via-pink-\d+ hover:to-indigo-\d+', 'hover:bg-neutral-800'
    $content = $content -replace 'hover:from-emerald-\d+ hover:via-green-\d+ hover:to-teal-\d+', 'hover:bg-neutral-700'
    $content = $content -replace 'hover:text-purple-\d+', 'hover:text-neutral-700'
    $content = $content -replace 'hover:text-pink-\d+', 'hover:text-neutral-700'
    $content = $content -replace 'hover:text-blue-\d+', 'hover:text-neutral-700'
    $content = $content -replace 'hover:text-green-\d+', 'hover:text-neutral-700'
    
    # Shadows coloridos
    $content = $content -replace 'shadow-purple-\d+/\d+', 'shadow-neutral-500/50'
    $content = $content -replace 'shadow-pink-\d+/\d+', 'shadow-neutral-500/50'
    $content = $content -replace 'shadow-green-\d+/\d+', 'shadow-neutral-500/50'
    
    Set-Content -Path $file.FullName -Value $content
}

Write-Host "Concluído! Processados $($files.Count) arquivos."
