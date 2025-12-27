const fs = require('fs');
const text = fs.readFileSync('src/views/AuctionLobby.vue', 'utf8');
const templateMatch = text.match(/<template>([\s\S]*?)<\/template>/);

if (!templateMatch) {
  console.log('❌ Template não encontrado');
  process.exit(1);
}

const html = templateMatch[1];
const stack = [];
const lines = html.split('\n');

// Regex para tags de abertura (não self-closing)
const openTagRe = /<([a-z][a-z0-9-]*)\b[^>]*(?<!\/)>/gi;
// Regex para tags de fechamento
const closeTagRe = /<\/([a-z][a-z0-9-]*)>/gi;
// Void elements que não precisam de fechamento
const voidElements = ['img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];

lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  
  // Encontrar tags de abertura
  let match;
  while ((match = openTagRe.exec(line)) !== null) {
    const tag = match[1].toLowerCase();
    if (!voidElements.includes(tag)) {
      stack.push({ tag, line: lineNum });
    }
  }
  
  // Encontrar tags de fechamento
  while ((match = closeTagRe.exec(line)) !== null) {
    const tag = match[1].toLowerCase();
    const opened = stack.pop();
    
    if (!opened) {
      console.log(`❌ Linha ${lineNum}: </${tag}> sem tag de abertura correspondente`);
    } else if (opened.tag !== tag) {
      console.log(`❌ Linha ${lineNum}: </${tag}> fecha <${opened.tag}> da linha ${opened.line}`);
      stack.push(opened); // Devolver ao stack
    }
  }
});

if (stack.length > 0) {
  console.log(`\n❌ ${stack.length} tag(s) não fechada(s):`);
  stack.slice(0, 10).forEach(item => {
    console.log(`   <${item.tag}> aberto na linha ${item.line}`);
  });
} else {
  console.log('\n✅ Todas as tags estão balanceadas!');
}
