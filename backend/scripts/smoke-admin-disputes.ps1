param(
  [string]$ApiBase = "http://localhost:3000"
)

Write-Host "🚦 Smoke test: Admin Disputes" -ForegroundColor Cyan

try {
  $loginBody = @{ email = 'admin@kadesh.local'; password = 'admin123' } | ConvertTo-Json
  $login = Invoke-RestMethod -UseBasicParsing -Uri "$ApiBase/api/admin/login" -Method POST -ContentType 'application/json' -Body $loginBody
  if (-not $login.success) { throw "Falha no login admin" }
  $token = $login.token
  Write-Host "✅ Admin login OK" -ForegroundColor Green

  $headers = @{ Authorization = "Bearer $token" }
  $disputes = Invoke-RestMethod -UseBasicParsing -Uri "$ApiBase/api/admin/disputes" -Headers $headers -Method GET
  if ($disputes.success) {
    $count = $disputes.data.Count
    Write-Host "📋 Disputas encontradas: $count" -ForegroundColor Yellow
    $disputes.data | Select-Object contract_id, project_title, client_name, provider_name, is_closed, last_activity | Format-Table -AutoSize
  } else {
    throw "Falha ao listar disputas"
  }

  Write-Host "✅ Smoke test concluído" -ForegroundColor Green
} catch {
  Write-Error $_
  exit 1
}
