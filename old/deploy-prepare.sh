#!/bin/bash
# Script de preparação para deploy em produção

echo "🚀 Preparando Deploy para Produção - Kadesh"
echo "=========================================="
echo ""

# 1. Build do frontend
echo "📦 1. Fazendo build do frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build do frontend!"
    exit 1
fi

echo "✅ Build concluído!"
echo ""

# 2. Verificar arquivos essenciais
echo "🔍 2. Verificando arquivos essenciais..."

files=(
    "public/build/index.html"
    "public/index.php"
    "public/backend.php"
    ".htaccess"
    "index.php"
)

for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Arquivo não encontrado: $file"
        exit 1
    else
        echo "✅ $file"
    fi
done

echo ""

# 3. Commit e push
echo "📤 3. Fazendo commit e push..."
read -p "Mensagem do commit: " commit_msg

if [ -z "$commit_msg" ]; then
    commit_msg="build: preparar para deploy em produção"
fi

git add .
git commit -m "$commit_msg"
git push origin producao

if [ $? -ne 0 ]; then
    echo "❌ Erro no push!"
    exit 1
fi

echo "✅ Push concluído!"
echo ""

# 4. Resumo
echo "🎉 PREPARAÇÃO CONCLUÍDA!"
echo ""
echo "📋 Próximos Passos:"
echo "1. Acesse cPanel → Git Version Control"
echo "2. Clique em 'Pull or Deploy' no repositório 'kadesh'"
echo "3. Clique em 'Update from Remote'"
echo "4. Aguarde conclusão do deploy"
echo "5. Acesse: https://kadesh.mmbsites.com.br"
echo ""
echo "📖 Ver documentação completa: DEPLOY-PRODUCAO.md"
