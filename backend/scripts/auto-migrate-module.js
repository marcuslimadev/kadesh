/**
 * Módulo para executar migrações (reutilizável)
 */
const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const client = await pool.connect();
  const logs = [];
  
  try {
    logs.push('🔄 Verificando migrações pendentes...');
    
    // Lista de migrações críticas que devem ser aplicadas
    const migrations = [
      {
        file: '001_add_advertisements_table.sql',
        check: "SELECT to_regclass('public.advertisements')"
      }
    ];

    for (const migration of migrations) {
      // Verificar se a tabela/objeto já existe
      const checkResult = await client.query(migration.check);
      const exists = checkResult.rows[0].to_regclass;

      if (!exists) {
        logs.push(`📝 Aplicando migração: ${migration.file}...`);
        
        const sqlPath = path.join(__dirname, '../database/migrations', migration.file);
        if (fs.existsSync(sqlPath)) {
          const sql = fs.readFileSync(sqlPath, 'utf8');
          await client.query(sql);
          logs.push(`✅ Migração ${migration.file} aplicada com sucesso!`);
        } else {
          logs.push(`❌ Arquivo de migração não encontrado: ${sqlPath}`);
        }
      } else {
        logs.push(`⏭️  Migração ${migration.file} já aplicada (tabela existe).`);
      }
    }
    
    logs.push('✅ Verificação de migrações concluída.');
    return logs;
    
  } catch (error) {
    logs.push(`⚠️  Erro ao executar migrações: ${error.message}`);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { runMigrations };
