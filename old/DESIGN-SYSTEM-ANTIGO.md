# 🎨 Design System - Kaddesh Soluções (Sistema Antigo)

## Análise Visual do Site Original
**URL**: https://kaddeshsolucoes.com.br/

---

## 📐 **LAYOUT GERAL**

### Estrutura Principal
- **Container**: Layout centralizado, max-width ~1200px
- **Grid**: Sistema de colunas responsivo
- **Espaçamentos**: Generosos, ar entre elementos
- **Background**: Branco (#ffffff) predominante

### Seções Principais
1. **Hero Section**
   - Título grande: "Seja você um Kaddesh"
   - Subtítulo: "Melhores profissionais ou talentos"
   - Search bar com dropdown de categorias
   - Call-to-action: "Procure agora"

2. **Categorias Populares**
   - Grid de cards com ícones
   - Título: "Vamos explorar categorias populares"
   - Cards com imagens/ícones circulares

3. **Projetos em Destaque**
   - Título: "Aplique os projetos mais bem avaliados"
   - Cards de projeto com:
     - Título do projeto
     - Informações: tempo, tipo, nível
     - Faixa de preço (R$XXX - R$YYY)
     - Botão: "Inscreva-Se Agora"

4. **Artigos/Notícias**
   - Título: "Nossos últimos artigos de notícias"
   - Cards com imagem, título, data, categoria

5. **Footer**
   - Links úteis
   - Newsletter signup
   - Informações de contato
   - Telefones: +55 31 99188-7791

---

## 🎨 **CORES**

### Palette Primária
```css
/* Baseado na análise do site */
--primary-blue: #1e3a8a;        /* Azul escuro para headers */
--secondary-blue: #3b82f6;      /* Azul médio para links */
--accent-orange: #f97316;       /* Laranja para CTAs */
--success-green: #22c55e;       /* Verde para badges */

--text-dark: #1f2937;           /* Texto principal */
--text-gray: #6b7280;           /* Texto secundário */
--border-gray: #e5e7eb;         /* Bordas */
--background-light: #f9fafb;    /* Background claro */
```

### Cores de Uso
- **Botões Primários**: Laranja/Orange (#f97316)
- **Botões Secundários**: Azul (#3b82f6)
- **Links**: Azul claro
- **Preços**: Verde (#22c55e)
- **Tags/Badges**: Azul claro, Verde

---

## 📝 **TIPOGRAFIA**

### Fontes
```css
font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
/* ou similar sans-serif moderna */
```

### Hierarquia
- **H1 (Hero)**: ~48px, bold
- **H2 (Seções)**: ~36px, semi-bold
- **H3 (Cards)**: ~24px, semi-bold
- **H4 (Subtítulos)**: ~18px, medium
- **Body**: 16px, regular
- **Small**: 14px

---

## 🧩 **COMPONENTES**

### Cards de Projeto
```
┌─────────────────────────┐
│  [Imagem/Ícone]        │
│                         │
│  Título do Projeto      │
│  📍 Localização        │
│  ⏱️ Tempo • Nível     │
│  👥 X freelancers      │
│                         │
│  💰 R$XXX - R$YYY      │
│                         │
│  [Inscreva-Se Agora]   │
└─────────────────────────┘
```

### Botões
- **Primary**: Background laranja, texto branco, rounded, padding generoso
- **Secondary**: Outline azul, texto azul
- **Tamanho**: Medium (~40px altura), Large (~48px)

### Tags/Badges
- Pills arredondados
- Background colorido com transparência
- Texto pequeno (12-14px)

---

## 📱 **RESPONSIVIDADE**

### Breakpoints
- **Mobile**: < 768px (1 coluna)
- **Tablet**: 768px - 1024px (2 colunas)
- **Desktop**: > 1024px (3-4 colunas)

---

## 🖼️ **IMAGENS E ÍCONES**

### Tipos de Imagens
- **Categorias**: Ícones circulares coloridos
- **Projetos**: Placeholders ou imagens de projeto
- **Avatar**: Gravatars circulares
- **Background**: Gradientes sutis

### Ícones
- Font Awesome (provavelmente)
- Tamanho: 24px - 48px
- Cor: Azul ou laranja

---

## 🎯 **ELEMENTOS CHAVE**

### Navbar/Header
- Logo "Kaddesh" à esquerda
- Menu horizontal central
- Botões de login/registro à direita
- Background branco, sombra sutil

### Search Bar
- Input grande e visível
- Dropdown de categorias à esquerda
- Botão de busca laranja à direita
- Placeholder: "Selecionar tipo de lista"

### Footer
- 3-4 colunas
- Links organizados por categoria
- Newsletter signup com input
- Informações de contato
- Copyright e redes sociais

---

## ✨ **ANIMAÇÕES E EFEITOS**

- **Hover em Cards**: Elevação suave (box-shadow)
- **Hover em Botões**: Escurecimento da cor
- **Transições**: Suaves (0.3s ease)
- **Loading**: Spinners ou skeletons

---

## 📊 **MÉTRICAS DE DESIGN**

### Espaçamentos
- **Padding de seção**: 80px - 120px vertical
- **Gap entre cards**: 24px - 32px
- **Padding interno de cards**: 24px
- **Border radius**: 8px - 12px

### Sombras
- **Cards**: 0 2px 8px rgba(0,0,0,0.08)
- **Hover**: 0 8px 16px rgba(0,0,0,0.12)
- **Navbar**: 0 2px 4px rgba(0,0,0,0.06)

---

## 🔄 **PRÓXIMOS PASSOS**

1. ✅ Extrair assets (logos, imagens)
2. ⬜ Criar tema CSS idêntico
3. ⬜ Reconstruir componentes HTML
4. ⬜ Testar responsividade
5. ⬜ Validar cores e tipografia
