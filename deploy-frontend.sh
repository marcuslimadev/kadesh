#!/bin/bash
# Script de build e deploy do frontend para produção

set -e

echo "🚀 Kadesh - Build e Deploy Frontend"
echo "===================================="
echo ""

# Navegue para o diretório do frontend
cd "$(dirname "$0")/frontend"

echo "📦 Instalando dependências..."
npm install

echo ""
echo "🔨 Buildando frontend para produção..."
npm run build

echo ""
echo "📤 Copiando build para public..."
cd ..
rm -rf public/build
cp -r frontend/dist/* public/

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "Frontend disponível em:"
echo "  https://kadesh.mmbsites.com.br"
echo ""
echo "Backend PHP ativo em:"
echo "  https://kadesh.mmbsites.com.br/api/*"
