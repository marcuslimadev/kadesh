#!/usr/bin/env node
/**
 * Script para aplicar migrações de schema automaticamente
 * Uso: node backend/scripts/auto-migrate.js
 */

const { runMigrations } = require('./auto-migrate-module');
const pool = require('../config/database');

// Executar
runMigrations()
  .then((logs) => {
    logs.forEach(log => console.log(log));
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Erro fatal na migração:', error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
