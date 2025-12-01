# Sistema de Design Administrativo - Kadesh

> **Data de Criação**: Dezembro 2025  
> **Versão**: 1.0.0  
> **Status**: Implementado

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Componentes](#componentes)
4. [Guia de Uso](#guia-de-uso)
5. [Exemplos](#exemplos)

---

## 🎯 Visão Geral

O Sistema de Design Administrativo foi criado para padronizar a interface do painel administrativo do Kadesh, garantindo:

- **Consistência Visual**: Todas as páginas seguem o mesmo padrão de cores, tipografia, espaçamento e componentes
- **Experiência Unificada**: Usuários navegam por uma interface previsível e familiar
- **Manutenibilidade**: CSS centralizado facilita mudanças globais
- **Acessibilidade**: Componentes com contrast ratio adequado e estados de foco

### Princípios de Design

1. **Clareza**: Informações apresentadas de forma direta e hierárquica
2. **Eficiência**: Fluxos otimizados para tarefas administrativas
3. **Feedback Visual**: Estados claros (loading, sucesso, erro, warning)
4. **Responsividade**: Funciona em desktop, tablet e mobile

---

## 🏗️ Arquitetura

### Estrutura de Arquivos

```
src/
├── assets/
│   └── admin-design-system.css  # Sistema de design principal
├── components/
│   └── admin/
│       ├── AdminLayout.vue      # Layout wrapper
│       └── ConfirmationModal.vue # Modal de confirmação
└── views/
    └── admin/
        ├── AdminDashboard.vue
        ├── AdminUsers.vue
        ├── AdminProjects.vue
        ├── AdminPayments.vue
        ├── AdminDisputes.vue
        ├── AdminAdvertisements.vue
        └── AdminSettings.vue
```

### AdminLayout Component

O `AdminLayout.vue` é o wrapper padrão para todas as páginas admin:

**Características:**
- Navbar fixa com logo, menu e user dropdown
- Menu responsivo para mobile (hamburguer)
- Sistema de navegação ativa (highlight do item atual)
- Logout com remoção de tokens
- Slot para header customizado
- Slot default para conteúdo da página

**Uso Básico:**

```vue
<template>
  <AdminLayout>
    <!-- Header opcional -->
    <template #header>
      <h1 class="admin-heading-1">Título da Página</h1>
      <p class="admin-text-secondary">Descrição</p>
    </template>

    <!-- Conteúdo principal -->
    <div class="admin-card">
      <!-- ... -->
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/admin/AdminLayout.vue'
</script>
```

---

## 🧩 Componentes

### 1. Tipografia

#### Headings

```html
<h1 class="admin-heading-1">Título Principal</h1>
<h2 class="admin-heading-2">Subtítulo</h2>
<h3 class="admin-heading-3">Seção</h3>
<h4 class="admin-heading-4">Subseção</h4>
```

#### Text

```html
<p class="admin-text-primary">Texto principal</p>
<p class="admin-text-secondary">Texto secundário</p>
<p class="admin-text-sm">Texto pequeno</p>
<p class="admin-text-xs">Texto extra pequeno</p>
```

---

### 2. Botões

#### Variantes

```html
<!-- Primário (ações principais) -->
<button class="admin-btn admin-btn-primary">Salvar</button>

<!-- Secundário (ações alternativas) -->
<button class="admin-btn admin-btn-secondary">Cancelar</button>

<!-- Sucesso (confirmações positivas) -->
<button class="admin-btn admin-btn-success">Aprovar</button>

<!-- Perigo (ações destrutivas) -->
<button class="admin-btn admin-btn-danger">Excluir</button>

<!-- Warning (ações de alerta) -->
<button class="admin-btn admin-btn-warning">Atenção</button>

<!-- Outline (ações secundárias) -->
<button class="admin-btn admin-btn-outline">Detalhes</button>
```

#### Tamanhos

```html
<button class="admin-btn admin-btn-primary admin-btn-sm">Pequeno</button>
<button class="admin-btn admin-btn-primary">Normal</button>
<button class="admin-btn admin-btn-primary admin-btn-lg">Grande</button>
```

#### Botão com Ícone

```html
<button class="admin-btn admin-btn-icon">
  <svg><!-- ícone --></svg>
</button>
```

---

### 3. Formulários

#### Input Text

```html
<div class="admin-form-group">
  <label class="admin-form-label">Nome do Campo</label>
  <input type="text" class="admin-form-input" placeholder="Digite aqui" />
  <span class="admin-form-help">Texto de ajuda</span>
</div>
```

#### Input com Erro

```html
<div class="admin-form-group">
  <label class="admin-form-label">Email</label>
  <input type="email" class="admin-form-input admin-form-input-error" />
  <span class="admin-form-error">Email inválido</span>
</div>
```

#### Textarea

```html
<div class="admin-form-group">
  <label class="admin-form-label">Descrição</label>
  <textarea class="admin-form-textarea" rows="4"></textarea>
</div>
```

#### Select

```html
<div class="admin-form-group">
  <label class="admin-form-label">Categoria</label>
  <select class="admin-form-select">
    <option value="">Selecione...</option>
    <option value="1">Opção 1</option>
    <option value="2">Opção 2</option>
  </select>
</div>
```

---

### 4. Cards

#### Card Básico

```html
<div class="admin-card">
  <div class="admin-card-header">
    <h3 class="admin-heading-3">Título do Card</h3>
  </div>
  <div class="admin-card-body">
    <p>Conteúdo do card</p>
  </div>
  <div class="admin-card-footer">
    <button class="admin-btn admin-btn-primary">Ação</button>
  </div>
</div>
```

---

### 5. Alerts

#### Tipos

```html
<!-- Informação -->
<div class="admin-alert admin-alert-info">
  <p>Esta é uma mensagem informativa</p>
</div>

<!-- Sucesso -->
<div class="admin-alert admin-alert-success">
  <p>Operação realizada com sucesso!</p>
</div>

<!-- Warning -->
<div class="admin-alert admin-alert-warning">
  <p>Atenção: verifique os dados antes de continuar</p>
</div>

<!-- Perigo -->
<div class="admin-alert admin-alert-danger">
  <p>Erro: não foi possível completar a operação</p>
</div>
```

#### Alert com Botão de Fechar

```html
<div class="admin-alert admin-alert-success" v-if="showSuccess">
  <p>Salvo com sucesso!</p>
  <button @click="showSuccess = false" class="admin-alert-close">×</button>
</div>
```

---

### 6. Badges

```html
<span class="admin-badge admin-badge-primary">Novo</span>
<span class="admin-badge admin-badge-success">Ativo</span>
<span class="admin-badge admin-badge-warning">Pendente</span>
<span class="admin-badge admin-badge-danger">Bloqueado</span>
<span class="admin-badge admin-badge-neutral">Arquivado</span>
```

---

### 7. Tabelas

```html
<div class="admin-table-container">
  <table class="admin-table">
    <thead class="admin-table-head">
      <tr>
        <th class="admin-table-th">ID</th>
        <th class="admin-table-th">Nome</th>
        <th class="admin-table-th">Status</th>
        <th class="admin-table-th">Ações</th>
      </tr>
    </thead>
    <tbody class="admin-table-body">
      <tr class="admin-table-row">
        <td class="admin-table-td">001</td>
        <td class="admin-table-td">João Silva</td>
        <td class="admin-table-td">
          <span class="admin-badge admin-badge-success">Ativo</span>
        </td>
        <td class="admin-table-td">
          <button class="admin-btn admin-btn-sm admin-btn-outline">Editar</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### 8. Stats Cards

Cards de estatísticas com ícones:

```html
<div class="admin-stats-grid">
  <!-- Card Primário (azul) -->
  <div class="admin-stat-card admin-stat-card-primary">
    <div class="admin-stat-content">
      <div class="admin-stat-info">
        <p class="admin-stat-label">Total de Usuários</p>
        <p class="admin-stat-value">{{ totalUsers }}</p>
        <p class="admin-stat-meta">10 novos este mês</p>
      </div>
      <div class="admin-stat-icon admin-stat-icon-primary">
        <svg><!-- ícone --></svg>
      </div>
    </div>
    <div class="admin-stat-footer">
      Detalhes adicionais
    </div>
  </div>

  <!-- Outras variantes: admin-stat-card-success, -warning, -danger, -secondary -->
</div>
```

---

### 9. Loading States

#### Spinner

```html
<!-- Pequeno -->
<div class="admin-spinner-sm"></div>

<!-- Normal -->
<div class="admin-spinner"></div>

<!-- Grande -->
<div class="admin-spinner-lg"></div>
```

---

### 10. ConfirmationModal

Modal reutilizável para confirmações:

**Props:**
- `show` (Boolean): Exibe/oculta o modal
- `type` (String): `'info'`, `'warning'`, `'danger'`, `'success'`
- `title` (String): Título do modal
- `message` (String): Mensagem principal
- `warningMessage` (String, opcional): Mensagem de alerta adicional
- `confirmText` (String): Texto do botão de confirmação (padrão: 'Confirmar')
- `cancelText` (String): Texto do botão de cancelamento (padrão: 'Cancelar')
- `fields` (Array): Campos dinâmicos do formulário
- `loading` (Boolean): Estado de loading no botão de confirmação

**Events:**
- `@confirm`: Emite os dados do formulário
- `@cancel`: Emite ao cancelar
- `@update:show`: Emite ao fechar o modal

**Exemplo de Uso:**

```vue
<template>
  <ConfirmationModal
    :show="showDeleteModal"
    type="danger"
    title="Confirmar Exclusão"
    message="Tem certeza que deseja excluir este usuário?"
    warningMessage="Esta ação não pode ser desfeita"
    confirmText="Sim, excluir"
    cancelText="Cancelar"
    :loading="deleting"
    @confirm="handleDelete"
    @cancel="showDeleteModal = false"
  />
</template>

<script setup>
import { ref } from 'vue'
import ConfirmationModal from '@/components/admin/ConfirmationModal.vue'

const showDeleteModal = ref(false)
const deleting = ref(false)

const handleDelete = async () => {
  deleting.value = true
  // ... lógica de exclusão
  deleting.value = false
  showDeleteModal.value = false
}
</script>
```

**Exemplo com Campos Dinâmicos:**

```vue
<template>
  <ConfirmationModal
    :show="showPromoteModal"
    type="warning"
    title="Promover Usuário a Administrador"
    message="Preencha os dados de acesso administrativo:"
    confirmText="Promover"
    :fields="promoteFields"
    :loading="promoting"
    @confirm="handlePromote"
    @cancel="showPromoteModal = false"
  />
</template>

<script setup>
const promoteFields = ref([
  {
    name: 'username',
    label: 'Nome de usuário',
    type: 'text',
    placeholder: 'Digite o username',
    required: true
  },
  {
    name: 'password',
    label: 'Senha',
    type: 'password',
    placeholder: 'Digite a senha',
    required: true
  },
  {
    name: 'role',
    label: 'Nível',
    type: 'select',
    required: true,
    options: [
      { value: 'admin', label: 'Administrador' },
      { value: 'super_admin', label: 'Super Admin' }
    ]
  }
])

const handlePromote = async (formData) => {
  // formData = { username: '...', password: '...', role: '...' }
  promoting.value = true
  // ... lógica de promoção
  promoting.value = false
  showPromoteModal.value = false
}
</script>
```

---

## 🎨 Variáveis CSS

### Cores

```css
/* Cores Principais */
--admin-primary: #3b82f6;          /* Azul primário */
--admin-primary-hover: #2563eb;    /* Azul hover */
--admin-primary-bg: #eff6ff;       /* Background azul claro */

--admin-secondary: #8b5cf6;        /* Roxo */
--admin-secondary-hover: #7c3aed;
--admin-secondary-bg: #f5f3ff;

--admin-success: #10b981;          /* Verde */
--admin-success-hover: #059669;
--admin-success-bg: #ecfdf5;

--admin-warning: #f59e0b;          /* Amarelo */
--admin-warning-hover: #d97706;
--admin-warning-bg: #fffbeb;

--admin-danger: #ef4444;           /* Vermelho */
--admin-danger-hover: #dc2626;
--admin-danger-bg: #fef2f2;

/* Tons de Cinza */
--admin-gray-50: #f9fafb;
--admin-gray-100: #f3f4f6;
--admin-gray-200: #e5e7eb;
--admin-gray-300: #d1d5db;
--admin-gray-500: #6b7280;
--admin-gray-600: #4b5563;
--admin-gray-700: #374151;
--admin-gray-800: #1f2937;
--admin-gray-900: #111827;

/* Backgrounds */
--admin-bg-page: #f9fafb;          /* Background das páginas */
--admin-bg-navbar: #ffffff;        /* Background da navbar */
--admin-bg-card: #ffffff;          /* Background dos cards */

/* Textos */
--admin-text-primary: #111827;     /* Texto principal */
--admin-text-secondary: #6b7280;   /* Texto secundário */

/* Bordas */
--admin-border: #e5e7eb;           /* Cor de borda padrão */

/* Sombras */
--admin-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--admin-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--admin-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--admin-shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

/* Espaçamento */
--admin-spacing-xs: 0.25rem;       /* 4px */
--admin-spacing-sm: 0.5rem;        /* 8px */
--admin-spacing-md: 1rem;          /* 16px */
--admin-spacing-lg: 1.5rem;        /* 24px */
--admin-spacing-xl: 2rem;          /* 32px */
--admin-spacing-2xl: 3rem;         /* 48px */

/* Border Radius */
--admin-radius-sm: 0.25rem;        /* 4px */
--admin-radius: 0.5rem;            /* 8px */
--admin-radius-md: 0.75rem;        /* 12px */
--admin-radius-lg: 1rem;           /* 16px */
--admin-radius-full: 9999px;       /* Totalmente arredondado */

/* Transições */
--admin-transition: all 0.2s ease;
```

---

## 📚 Guia de Uso

### Passo 1: Importar o Design System

No `main.js` ou `App.vue`:

```js
import '@/assets/admin-design-system.css'
```

### Passo 2: Usar AdminLayout nas Páginas Admin

```vue
<template>
  <AdminLayout>
    <template #header>
      <h1 class="admin-heading-1">Minha Página</h1>
    </template>

    <div class="admin-card">
      <!-- Conteúdo -->
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '@/components/admin/AdminLayout.vue'
</script>

<style scoped>
@import '@/assets/admin-design-system.css';
</style>
```

### Passo 3: Usar Componentes do Design System

Sempre prefira usar as classes do design system em vez de criar CSS customizado:

✅ **BOM:**
```html
<button class="admin-btn admin-btn-primary">Salvar</button>
```

❌ **EVITAR:**
```html
<button class="bg-blue-600 px-4 py-2 rounded">Salvar</button>
```

---

## 📖 Exemplos Práticos

### Exemplo 1: Página de Listagem

```vue
<template>
  <AdminLayout>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="admin-heading-1">Usuários</h1>
          <p class="admin-text-secondary mt-2">Gerencie os usuários da plataforma</p>
        </div>
        <button @click="showCreateModal = true" class="admin-btn admin-btn-primary">
          Novo Usuário
        </button>
      </div>
    </template>

    <!-- Filtros -->
    <div class="admin-card mb-6">
      <div class="admin-card-body">
        <div class="grid grid-cols-3 gap-4">
          <div class="admin-form-group">
            <label class="admin-form-label">Buscar</label>
            <input type="text" class="admin-form-input" placeholder="Nome ou email" />
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">Tipo</label>
            <select class="admin-form-select">
              <option value="">Todos</option>
              <option value="client">Contratante</option>
              <option value="provider">Fornecedor</option>
            </select>
          </div>
          <div class="admin-form-group">
            <label class="admin-form-label">&nbsp;</label>
            <button class="admin-btn admin-btn-outline w-full">Filtrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="admin-card">
      <div class="admin-table-container">
        <table class="admin-table">
          <thead class="admin-table-head">
            <tr>
              <th class="admin-table-th">ID</th>
              <th class="admin-table-th">Nome</th>
              <th class="admin-table-th">Email</th>
              <th class="admin-table-th">Tipo</th>
              <th class="admin-table-th">Status</th>
              <th class="admin-table-th">Ações</th>
            </tr>
          </thead>
          <tbody class="admin-table-body">
            <tr v-for="user in users" :key="user.id" class="admin-table-row">
              <td class="admin-table-td">{{ user.id }}</td>
              <td class="admin-table-td">{{ user.name }}</td>
              <td class="admin-table-td">{{ user.email }}</td>
              <td class="admin-table-td">
                <span class="admin-badge" :class="user.type === 'client' ? 'admin-badge-primary' : 'admin-badge-success'">
                  {{ user.type === 'client' ? 'Contratante' : 'Fornecedor' }}
                </span>
              </td>
              <td class="admin-table-td">
                <span class="admin-badge admin-badge-success">Ativo</span>
              </td>
              <td class="admin-table-td">
                <button class="admin-btn admin-btn-sm admin-btn-outline mr-2">Editar</button>
                <button class="admin-btn admin-btn-sm admin-btn-danger">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>
```

### Exemplo 2: Formulário de Edição

```vue
<template>
  <AdminLayout>
    <template #header>
      <h1 class="admin-heading-1">Editar Projeto</h1>
      <p class="admin-text-secondary mt-2">Atualize as informações do projeto</p>
    </template>

    <!-- Alert de sucesso -->
    <div v-if="successMessage" class="admin-alert admin-alert-success mb-6">
      <p>{{ successMessage }}</p>
      <button @click="successMessage = ''" class="admin-alert-close">×</button>
    </div>

    <!-- Formulário -->
    <form @submit.prevent="handleSubmit" class="admin-card">
      <div class="admin-card-body space-y-6">
        <div class="admin-form-group">
          <label class="admin-form-label">Título do Projeto</label>
          <input
            v-model="form.title"
            type="text"
            class="admin-form-input"
            :class="{ 'admin-form-input-error': errors.title }"
            placeholder="Digite o título"
          />
          <span v-if="errors.title" class="admin-form-error">{{ errors.title }}</span>
        </div>

        <div class="admin-form-group">
          <label class="admin-form-label">Descrição</label>
          <textarea
            v-model="form.description"
            class="admin-form-textarea"
            rows="4"
            placeholder="Descreva o projeto"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="admin-form-group">
            <label class="admin-form-label">Orçamento (R$)</label>
            <input
              v-model="form.budget"
              type="number"
              class="admin-form-input"
              placeholder="0,00"
            />
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label">Prazo</label>
            <input v-model="form.deadline" type="date" class="admin-form-input" />
          </div>
        </div>

        <div class="admin-form-group">
          <label class="admin-form-label">Categoria</label>
          <select v-model="form.category" class="admin-form-select">
            <option value="">Selecione uma categoria</option>
            <option value="development">Desenvolvimento</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
      </div>

      <div class="admin-card-footer flex justify-end gap-3">
        <button type="button" @click="$router.back()" class="admin-btn admin-btn-outline">
          Cancelar
        </button>
        <button type="submit" class="admin-btn admin-btn-primary" :disabled="loading">
          <span v-if="loading" class="admin-spinner-sm"></span>
          <span v-else>Salvar Alterações</span>
        </button>
      </div>
    </form>
  </AdminLayout>
</template>
```

---

## 🔄 Migrations Recomendadas

Para migrar páginas existentes para o novo design system:

1. **Substituir navbar customizada** por `<AdminLayout>`
2. **Trocar classes Tailwind** por classes `.admin-*`
3. **Remover toasts/alerts globais** por alertas inline
4. **Usar ConfirmationModal** para ações críticas (delete, promote, etc.)
5. **Aplicar classes de tipografia** (`.admin-heading-*`, `.admin-text-*`)
6. **Padronizar botões** com `.admin-btn-*`

---

## ✅ Checklist de Implementação

Ao criar/refatorar uma página admin:

- [ ] Envolver conteúdo com `<AdminLayout>`
- [ ] Usar slot `#header` para título e descrição
- [ ] Aplicar classes de tipografia (headings, text)
- [ ] Usar `.admin-card` para containers de conteúdo
- [ ] Aplicar `.admin-btn-*` em todos os botões
- [ ] Usar `.admin-form-*` em formulários
- [ ] Implementar alertas inline (`.admin-alert-*`)
- [ ] Usar `.admin-badge-*` para status
- [ ] Aplicar `.admin-table` em tabelas
- [ ] Importar `@import '@/assets/admin-design-system.css'` no `<style scoped>`
- [ ] Testar responsividade (mobile, tablet, desktop)
- [ ] Validar estados de loading (`.admin-spinner`)
- [ ] Implementar ConfirmationModal para ações críticas

---

## 🚀 Próximos Passos

1. **Refatorar páginas restantes**: AdminUsers, AdminProjects, AdminPayments, AdminDisputes, AdminAdvertisements, AdminSettings
2. **Adicionar UI de promoção a admin** em AdminUsers.vue
3. **Importar design system globalmente** em main.js
4. **Testar sistema completo** (navegação, modais, responsividade)
5. **Documentar padrões adicionais** conforme surgem novos componentes

---

## 📞 Suporte

Para dúvidas ou sugestões sobre o design system:
- Consulte este documento
- Verifique exemplos em `src/views/admin/AdminDashboard.vue`
- Analise componentes em `src/components/admin/`

---

**Última Atualização**: Dezembro 2025  
**Autor**: Equipe Kadesh
