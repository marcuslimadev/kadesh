const fs = require('fs');
const path = require('path');

console.log('📦 Postbuild: Garantindo arquivos de configuração SPA...');

const distDir = path.join(__dirname, 'dist');

// Garantir que _redirects existe em dist
const redirectsSource = path.join(__dirname, 'public', '_redirects');
const redirectsDest = path.join(distDir, '_redirects');

if (fs.existsSync(redirectsSource)) {
  fs.copyFileSync(redirectsSource, redirectsDest);
  console.log('✅ _redirects copiado para dist/');
}

// Criar renderconfig.json no dist/ (configuração específica do Render)
const renderConfig = {
  "routes": [
    { "type": "rewrite", "source": "/*", "destination": "/index.html" }
  ]
};

fs.writeFileSync(
  path.join(distDir, 'renderconfig.json'),
  JSON.stringify(renderConfig, null, 2)
);
console.log('✅ renderconfig.json criado');

console.log('✅ Postbuild concluído!');
