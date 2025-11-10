# 🚀 NOVO FRONTEND - VUE 3 + TAILWIND CSS

## ✨ Stack Moderno

- **Vue 3** (Composition API)
- **Tailwind CSS** (Design System Kadesh integrado)
- **Vue Router** (SPA routing)
- **Axios** (API calls)
- **Vite** (Build tool ultra-rápido)

---

## 📦 Instalação

```bash
npm install
```

---

## 🔧 Desenvolvimento

### 1. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O Vite vai rodar em: `http://localhost:5173/kadesh/`

### 2. Backend (XAMPP)

Certifique-se de que Apache e MySQL estão rodando.

O backend continua em: `http://localhost/kadesh/public/backend.php`

### 3. Acessar aplicação

```
http://localhost:5173/kadesh/
```

---

## 📁 Estrutura

```
kadesh/
├── index.html                 # Entry point
├── package.json               # Dependencies
├── vite.config.js             # Vite config (proxy para API)
├── tailwind.config.js         # Tailwind com cores Kadesh
├── postcss.config.js          # PostCSS
│
├── src/
│   ├── main.js                # App initialization + Router
│   ├── App.vue                # Root component
│   ├── style.css              # Tailwind + custom styles
│   │
│   ├── components/
│   │   ├── Navbar.vue         # Barra de navegação
│   │   └── LoadingScreen.vue  # Tela de carregamento
│   │
│   ├── composables/
│   │   ├── useAuth.js         # Auth logic (login, register, logout)
│   │   └── useAuctions.js     # Auctions logic (fetch, bid)
│   │
│   └── views/
│       ├── Home.vue           # Landing page
│       ├── Login.vue          # ✅ COMPLETO
│       ├── Register.vue       # ✅ COMPLETO
│       ├── Dashboard.vue      # 🚧 Scaffold
│       ├── AuctionsMarketplace.vue  # ✅ COMPLETO
│       ├── AuctionDetail.vue  # 🚧 Scaffold
│       ├── MyBids.vue         # 🚧 Scaffold
│       ├── Wallet.vue         # 🚧 Scaffold
│       └── CreateProject.vue  # 🚧 Scaffold
│
└── public/
    └── backend.php            # Backend PHP (mantido)
```

---

## 🎨 Design System

### Cores Kadesh (Tailwind)

```js
// tailwind.config.js
primary: {
  900: '#2c3e50'  // Navy
}

accent: {
  500: '#f4d03f'  // Yellow
}
```

### Classes Utilitárias

```css
.btn              /* Base button */
.btn-primary      /* Yellow button */
.btn-secondary    /* Navy button */
.card             /* White card with shadow */
.input            /* Styled input field */
```

---

## 🔌 API Integration

### Proxy Configuration (vite.config.js)

Requisições para `/api/*` são automaticamente enviadas para:
```
http://localhost/kadesh/public/backend.php/api/*
```

### Exemplo de uso:

```js
import axios from 'axios'

// Chama /api/auctions/active
// Vite proxia para http://localhost/kadesh/public/backend.php/api/auctions/active
const response = await axios.get('/api/auctions/active', {
  withCredentials: true
})
```

---

## 📝 Páginas Implementadas

### ✅ Completas

1. **Login** (`/login`)
   - Form validation
   - Error handling
   - Redirect após login

2. **Register** (`/register`)
   - Tipo de usuário (contractor/provider)
   - Validação de senha
   - Redirect após registro

3. **AuctionsMarketplace** (`/auctions`)
   - Lista de leilões ativos
   - Timer countdown visual
   - Cards clicáveis
   - Loading state

### 🚧 Scaffolds (para completar)

- Dashboard
- AuctionDetail (detalhes + placar + dar lance)
- MyBids (histórico de lances)
- Wallet (saldo + depósito + extrato)
- CreateProject (criar novo projeto)

---

## 🚀 Próximos Passos

### 1. Completar AuctionDetail.vue

```vue
<template>
  <!-- Layout 2 colunas -->
  <!-- Esquerda: Info + Placar -->
  <!-- Direita: Timer + Form de lance -->
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuctions } from '@/composables/useAuctions'

const route = useRoute()
const { currentAuction, fetchAuctionDetail, placeBid } = useAuctions()

onMounted(() => {
  fetchAuctionDetail(route.params.id)
})
</script>
```

### 2. Completar Wallet.vue

```vue
<script setup>
import { useWallet } from '@/composables/useWallet'

const { balance, deposit, statement } = useWallet()
</script>
```

### 3. Criar useWallet.js composable

```js
export function useWallet() {
  const balance = ref(0)
  const statement = ref([])
  
  const fetchBalance = async () => {
    const res = await axios.get('/api/wallet/balance')
    balance.value = res.data.balance
  }
  
  const deposit = async (amount) => {
    await axios.post('/api/wallet/deposit', { amount })
    await fetchBalance()
  }
  
  return { balance, deposit, statement, fetchBalance }
}
```

---

## 🎯 Vantagens do Novo Frontend

### vs jQuery

✅ **Reatividade automática** - Sem manipulação manual do DOM  
✅ **Componentes reutilizáveis** - DRY principle  
✅ **TypeScript ready** - Melhor IDE support  
✅ **Hot Module Replacement** - Mudanças instantâneas  
✅ **Build otimizado** - Vite é 10-100x mais rápido que Webpack  
✅ **Manutenção** - Código organizado e testável  

### Performance

- **Vite dev server**: < 1s cold start
- **HMR**: < 50ms
- **Production build**: Tree-shaking automático
- **Code splitting**: Lazy load de rotas

---

## 🧪 Testando

### 1. Verificar se Vite está rodando

```bash
npm run dev
```

Deve abrir em `http://localhost:5173/kadesh/`

### 2. Testar Login

1. Acesse `/login`
2. Preencha credenciais
3. Veja redirecionamento para `/auctions`

### 3. Ver Leilões

`/auctions` deve carregar leilões do backend PHP

---

## 📦 Build para Produção

```bash
npm run build
```

Gera pasta `dist/` com arquivos estáticos otimizados.

Para servir em produção, copie o conteúdo de `dist/` para a raiz do Apache.

---

## 🔧 Troubleshooting

### Erro: "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS / API errors

Verifique se o proxy está configurado em `vite.config.js`:

```js
proxy: {
  '/api': {
    target: 'http://localhost',
    rewrite: (path) => `/kadesh/public/backend.php${path}`
  }
}
```

### Tailwind não funciona

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## ✨ Resumo

**Frontend antigo removido:** ✅  
**Vue 3 + Tailwind configurado:** ✅  
**3 páginas completas:** Login, Register, AuctionsMarketplace  
**Backend mantido:** 100% funcional  
**Pronto para continuar:** Basta completar as views restantes  

**Comando para iniciar:**

```bash
npm install && npm run dev
```

Acesse: `http://localhost:5173/kadesh/` 🚀
