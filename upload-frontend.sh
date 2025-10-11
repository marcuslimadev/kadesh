#!/bin/bash
# Script para fazer upload do frontend buildado para produção

echo "📤 Uploading frontend build to production..."

# Copia o build para public/
cd frontend/dist
rsync -avz --delete ./ ../../public/

echo "✅ Frontend uploaded!"
echo ""
echo "Files copied to public/:"
ls -la ../../public/ | grep -E "index.html|assets"
