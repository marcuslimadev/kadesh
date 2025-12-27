const fs = require('fs');
const text = fs.readFileSync('src/views/AuctionLobby.vue', 'utf8');
const html = text.match(/<template>([\s\S]*?)<\/template>/)[1];

const tags = ['section', 'nav', 'button', 'transition', 'router-link', 'select', 'option', 'label', 'textarea', 'input', 'span', 'p', 'h1', 'h2', 'h3', 'svg', 'a'];

tags.forEach(tag => {
  const openRe = new RegExp(`<${tag}[\\s>]`, 'g');
  const closeRe = new RegExp(`<\\/${tag}>`, 'g');
  
  const opens = (html.match(openRe) || []).length;
  const closes = (html.match(closeRe) || []).length;
  
  if (opens !== closes) {
    console.log(`${tag}: ${opens} abertos, ${closes} fechados, diff=${opens - closes}`);
  }
});

console.log('\n✓ Validação completa');
