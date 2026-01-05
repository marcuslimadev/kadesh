const fs = require('fs');
const path = require('path');

console.log('Postbuild: garantindo arquivos de configuracao SPA...');

const distDir = path.join(__dirname, 'dist');

const redirectsSource = path.join(__dirname, 'public', '_redirects');
const redirectsDest = path.join(distDir, '_redirects');

if (fs.existsSync(redirectsSource)) {
  fs.copyFileSync(redirectsSource, redirectsDest);
  console.log('_redirects copiado para dist/');
}

const renderConfig = {
  routes: [
    { type: 'rewrite', source: '/*', destination: '/index.html' }
  ]
};

fs.writeFileSync(
  path.join(distDir, 'renderconfig.json'),
  JSON.stringify(renderConfig, null, 2)
);
console.log('renderconfig.json criado');

const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
  const buildId = Date.now().toString();
  const buildLabel = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  let html = fs.readFileSync(indexPath, 'utf8');

  html = html.replace(/(\/dist\/assets\/[^"'\s>]+?\.(?:js|css))(?!\?v=)/g, `$1?v=${buildId}`);

  if (/build\s\d{4}-\d{2}-\d{2}T/.test(html)) {
    html = html.replace(/build\s[\dTZ:\-\.]+/g, `build ${buildLabel}`);
  } else {
    const badge = [
      '<div style="position:fixed;bottom:8px;right:8px;padding:4px 8px;border-radius:999px;',
      'background:#111;color:#f5f5f5;font:12px/1.2 system-ui, sans-serif;opacity:.75;z-index:9999;">',
      `build ${buildLabel}`,
      '</div>'
    ].join('');
    html = html.replace('</body>', `${badge}</body>`);
  }

  fs.writeFileSync(indexPath, html);
  console.log('build label e cache bust atualizados');
}

console.log('Postbuild concluido!');
