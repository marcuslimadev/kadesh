#!/bin/bash
# Script para ativar o backend PHP puro

echo "🔄 Ativando backend PHP puro..."

cd ~/kadesh/public

# Backup do .htaccess atual
if [ -f .htaccess ]; then
    cp .htaccess .htaccess.laravel.bak
    echo "✓ Backup do .htaccess Laravel criado"
fi

# Ativa o .htaccess do backend
cp .htaccess.backend .htaccess
echo "✓ .htaccess do backend ativado"

# Limpa caches
rm -rf ../bootstrap/cache/*.php
rm -rf ../storage/framework/cache/data/*
echo "✓ Caches limpos"

echo ""
echo "✅ Backend PHP puro ativado!"
echo ""
echo "Endpoints disponíveis:"
echo "  POST   /api/register"
echo "  POST   /api/login"
echo "  POST   /api/logout"
echo "  GET    /api/user"
echo "  GET    /api/projects"
echo "  POST   /api/projects"
echo "  GET    /api/projects/{id}"
echo "  PUT    /api/projects/{id}"
echo "  DELETE /api/projects/{id}"
echo "  GET    /api/projects/{id}/bids"
echo "  POST   /api/bids"
echo "  POST   /api/projects/{id}/confirm-winner"
echo "  GET    /api/dashboard/stats"
echo ""
echo "Teste: curl https://kadesh.mmbsites.com.br/api/projects"
