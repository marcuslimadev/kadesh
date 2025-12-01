#!/usr/bin/env node
/**
 * Script para aplicar migrações de schema automaticamente
 * Uso: node backend/scripts/auto-migrate.js
 */

const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Verificando migrações pendentes...\n');
    
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
        console.log(`📝 Aplicando migração: ${migration.file}...`);
        
        const sqlPath = path.join(__dirname, '../database/migrations', migration.file);
        if (fs.existsSync(sqlPath)) {
          const sql = fs.readFileSync(sqlPath, 'utf8');
          await client.query(sql);
          console.log(`✅ Migração ${migration.file} aplicada com sucesso!`);
        } else {
          console.error(`❌ Arquivo de migração não encontrado: ${sqlPath}`);
        }
      } else {
        console.log(`⏭️  Migração ${migration.file} já aplicada (tabela existe).`);
      }
    }
    
    console.log('\n✅ Verificação de migrações concluída.');
    
  } catch (error) {
    console.warn('⚠️  Erro ao executar migrações:', error.message);
    // Não falhar o deploy, apenas logar
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar
runMigrations()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Erro fatal na migração:', error);
    process.exit(1);
  });
