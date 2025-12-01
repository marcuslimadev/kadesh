#!/usr/bin/env pwsh
# Criar admin user no banco

$env:PGPASSWORD = "kadesh"

Write-Host "`n🔧 Criando admin user..." -ForegroundColor Cyan

$sql = @"
-- Criar admin user se não existir
INSERT INTO admin_users (username, email, password_hash, name, role)
VALUES (
    'admin',
    'admin@kadesh.local',
    '\$2a\$10\$Xr8qQ6CtN6kZGj.YKvP7MeL5v9mZpJ3xH5dN8wQ1tR2sV3bW4cX5e',
    'Administrador',
    'super_admin'
)
ON CONFLICT (email) DO UPDATE SET
    updated_at = NOW();

SELECT email, name, role FROM admin_users WHERE email = 'admin@kadesh.local';
"@

& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U kadesh -h localhost -d kadesh -c $sql

$env:PGPASSWORD = $null

Write-Host "`n✅ Admin user criado/atualizado!`n" -ForegroundColor Green
