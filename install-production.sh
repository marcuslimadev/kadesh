#!/bin/bash
# Script de instalação para produção

echo "🚀 Iniciando instalação do Kadesh em produção..."

# Copiar arquivo de ambiente
echo "📝 Configurando ambiente..."
cp .env.production .env

# Instalar dependências PHP
echo "📦 Instalando dependências PHP..."
composer install --optimize-autoloader --no-dev --no-interaction

# Gerar chave da aplicação se necessário
echo "🔑 Configurando chave da aplicação..."
php artisan key:generate --force

# Executar migrações
echo "🗄️ Executando migrações do banco de dados..."
php artisan migrate --force

# Limpar e cachear configurações
echo "⚡ Otimizando caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

php artisan config:cache
php artisan route:cache
php artisan view:cache

# Instalar dependências Node.js e compilar assets
echo "🎨 Compilando assets..."
npm ci --production --silent
npm run build

# Configurar permissões
echo "🔒 Configurando permissões..."
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Otimizar autoloader
echo "⚡ Otimizando autoloader..."
composer dump-autoload --optimize

echo "✅ Instalação concluída com sucesso!"
echo "🌐 Aplicação pronta para produção em: $(pwd)"