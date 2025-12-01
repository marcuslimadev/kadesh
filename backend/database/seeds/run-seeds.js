#!/usr/bin/env node
/**
 * Script para popular a tabela de anúncios com dados iniciais
 * Uso: node backend/database/seeds/run-seeds.js
 */

const pool = require('../../config/database');
const fs = require('fs');
const path = require('path');

async function runSeeds() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Verificando anúncios no banco...\n');
    
    // Verificar se já existem anúncios
    const checkResult = await client.query('SELECT COUNT(*) FROM advertisements');
    const count = parseInt(checkResult.rows[0].count);
    
    if (count > 0) {
      console.log(`✅ Já existem ${count} anúncios no banco.`);
      console.log('   Seed não executado (anúncios já foram criados).\n');
      return; // Sair sem erro
    }
    
    console.log('📝 Criando anúncios iniciais...\n');
    
    // Ler arquivo SQL
    const sqlPath = path.join(__dirname, '001_seed_advertisements.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Executar seed
    await client.query(sql);
    
    // Verificar resultado
    const result = await client.query(`
      SELECT position, COUNT(*) as total
      FROM advertisements
      GROUP BY position
      ORDER BY position
    `);
    
    console.log('✅ Anúncios criados com sucesso!\n');
    console.log('Resumo:');
    result.rows.forEach(row => {
      console.log(`   ${row.position}: ${row.total} anúncios`);
    });
    
    const totalResult = await client.query('SELECT COUNT(*) FROM advertisements');
    console.log(`\n📊 Total: ${totalResult.rows[0].count} anúncios criados\n`);
    
  } catch (error) {
    // Não falhar o deploy por causa do seed
    console.warn('⚠️  Aviso ao executar seed:', error.message);
    console.warn('   Deploy continuará normalmente.\n');
    // Não fazer process.exit(1) - continuar mesmo se falhar
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar
runSeeds()
  .then(() => {
    console.log('✨ Processo concluído!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
