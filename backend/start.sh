#!/bin/bash
# Script de inicialização do servidor com seed automático

echo "🚀 Iniciando servidor Kadesh Backend..."

# Executar migrações automáticas (schema)
echo "🔄 Executando migrações de schema..."
node scripts/auto-migrate.js || echo "⚠️  Migração falhou ou não necessária"

# Executar seed de anúncios (se ainda não existirem)
echo "🌱 Verificando anúncios no banco..."
node database/seeds/run-seeds.js || echo "⚠️  Seed falhou ou anúncios já existem"

# Iniciar servidor
echo "✅ Iniciando servidor..."
node server.js
