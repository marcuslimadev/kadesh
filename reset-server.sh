#!/bin/bash
# Script para resetar o repositório no servidor cPanel
# Execute via SSH: bash reset-server.sh

echo "======================================"
echo "Kadesh - Reset do repositório servidor"
echo "======================================"

cd /home/mmbsites/kadesh || exit 1

echo "1. Fetching origin..."
git fetch origin

echo "2. Resetando para origin/producao..."
git reset --hard origin/producao

echo "3. Limpando arquivos não rastreados..."
git clean -fd

echo "4. Verificando status..."
git status

echo ""
echo "✓ Reset completo!"
echo "Agora volte no cPanel > Git Version Control"
echo "e clique em 'Deploy HEAD Commit'"
echo "======================================"
