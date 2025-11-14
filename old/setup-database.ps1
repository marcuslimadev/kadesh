# Kadesh Database Setup Script
# Script para configurar o banco PostgreSQL no Render

param(
    [string]$DatabaseUrl = "postgresql://kadesh_modern_user:OVMLWkBDzhsHoptphh0bmekmDCFJBs7q@dpg-d4bgunchg0os73eum7p0-a.oregon-postgres.render.com/kadesh_modern"
)

Write-Host "🗄️ Configurando banco PostgreSQL do Kadesh" -ForegroundColor Green
Write-Host "=" * 50

# Verificar se o arquivo schema existe
if (-not (Test-Path "modern-stack/backend/database/schema.sql")) {
    Write-Host "❌ Arquivo schema.sql não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Informações do banco:" -ForegroundColor Blue
Write-Host "  Host: dpg-d4bgunchg0os73eum7p0-a.oregon-postgres.render.com" -ForegroundColor Cyan
Write-Host "  Database: kadesh_modern" -ForegroundColor Cyan  
Write-Host "  User: kadesh_modern_user" -ForegroundColor Cyan
Write-Host "  SSL: Enabled" -ForegroundColor Cyan

Write-Host "`n🔧 Para configurar o banco, você pode:" -ForegroundColor Yellow

Write-Host "`n1. 💻 Instalar PostgreSQL Client localmente:" -ForegroundColor Blue
Write-Host "   • Windows: https://www.postgresql.org/download/windows/" -ForegroundColor White
Write-Host "   • Ou via Chocolatey: choco install postgresql" -ForegroundColor White

Write-Host "`n2. 🌐 Usar cliente web (recomendado):" -ForegroundColor Blue
Write-Host "   • Acesse: https://www.pgadmin.org/download/" -ForegroundColor White
Write-Host "   • Ou use: https://phppgadmin.sourceforge.net/" -ForegroundColor White

Write-Host "`n3. 🔧 Executar via Node.js (alternativa):" -ForegroundColor Blue
Write-Host "   cd modern-stack/backend" -ForegroundColor White
Write-Host "   npm install pg" -ForegroundColor White
Write-Host "   node -e `"const { Client } = require('pg'); const fs = require('fs'); const client = new Client('$DatabaseUrl'); client.connect().then(() => { const sql = fs.readFileSync('database/schema.sql', 'utf8'); return client.query(sql); }).then(() => console.log('✅ Schema executado!')).catch(console.error).finally(() => client.end());`"" -ForegroundColor White

Write-Host "`n4. 📱 Via app mobile:" -ForegroundColor Blue  
Write-Host "   • iOS: PostgreSQL Mobile" -ForegroundColor White
Write-Host "   • Android: DBeaver CloudBeaver" -ForegroundColor White

# Criar script Node.js para execução do schema
$nodeScript = @"
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    const client = new Client('$DatabaseUrl');
    
    try {
        console.log('🔌 Conectando ao PostgreSQL...');
        await client.connect();
        console.log('✅ Conectado!');
        
        console.log('📂 Lendo arquivo schema.sql...');
        const schemaPath = path.join(__dirname, 'modern-stack', 'backend', 'database', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('⚙️ Executando schema SQL...');
        await client.query(schema);
        
        console.log('✅ Database configurado com sucesso!');
        console.log('🎉 Tabelas criadas:');
        console.log('   • users (usuários)');
        console.log('   • provider_profiles (perfis de prestadores)');
        console.log('   • projects (projetos)');  
        console.log('   • bids (propostas)');
        console.log('   • contracts (contratos)');
        console.log('   • payments (pagamentos)');
        console.log('   • reviews (avaliações)');
        console.log('   • messages (mensagens)');
        console.log('   • notifications (notificações)');
        console.log('   • system_settings (configurações)');
        console.log('   • admin_users (usuários admin)');
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await client.end();
        console.log('🔌 Conexão fechada');
    }
}

setupDatabase();
"@

Write-Host "`n💾 Criando script de setup automatizado..." -ForegroundColor Blue
$nodeScript | Out-File -FilePath "setup-database.js" -Encoding UTF8

Write-Host "✅ Script criado: setup-database.js" -ForegroundColor Green

Write-Host "`n🚀 Para executar o setup automático:" -ForegroundColor Yellow
Write-Host "   npm install pg" -ForegroundColor White
Write-Host "   node setup-database.js" -ForegroundColor White

Write-Host "`n📋 Arquivo SQL localizado em:" -ForegroundColor Blue
Write-Host "   modern-stack/backend/database/schema.sql" -ForegroundColor White

Write-Host "`n✨ Após configurar o banco, você pode testar a conexão:" -ForegroundColor Green
Write-Host "   cd modern-stack/backend && npm install && npm start" -ForegroundColor White

Write-Host "`n🔗 String de conexão (use nos apps):" -ForegroundColor Blue
Write-Host "   $DatabaseUrl" -ForegroundColor Yellow