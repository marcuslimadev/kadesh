# 🎨 Design System - Kadesh

## Paleta de Cores

### Cinzas (Uso Principal)
```
gray-50:  #fafafa  → Backgrounds muito claros
gray-100: #f5f5f5  → Backgrounds secundários
gray-200: #e5e5e5  → Borders, dividers
gray-300: #d4d4d4  → Borders com mais contraste
gray-400: #a3a3a3  → Textos desabilitados
gray-500: #737373  → Textos secundários
gray-600: #525252  → Textos normais
gray-700: #404040  → Textos com ênfase
gray-800: #262626  → Backgrounds escuros
gray-900: #171717  → Backgrounds muito escuros
gray-950: #0a0a0a  → Preto quase puro
```

### Preto & Branco
```
black:  #000000  → Textos de máximo contraste
white:  #ffffff  → Backgrounds puros
```

### Cores Semânticas (Mapeadas para cinzas)
```
primary:  gray-900  → Ações principais
success:  gray-600  → Estados positivos
warning:  gray-500  → Alertas
danger:   gray-700  → Erros
```

## Hierarquia de Contraste

### Hero/Headers
- **Background**: `bg-gray-950` (quase preto)
- **Texto principal**: `text-white`
- **Texto secundário**: `text-gray-300`
- **Botões primários**: `bg-white text-gray-950`
- **Botões secundários**: `border-2 border-white text-white`

### Seções de Conteúdo
- **Background**: `bg-gray-50` ou `bg-white`
- **Títulos**: `text-gray-950` (font-bold ou font-extrabold)
- **Subtítulos**: `text-gray-900`
- **Texto corpo**: `text-gray-600`
- **Texto desabilitado**: `text-gray-400`

### Cards
- **Background**: `bg-white`
- **Border**: `border-2 border-gray-200`
- **Border hover**: `hover:border-gray-900`
- **Shadow**: `shadow-sm hover:shadow-xl`
- **Título**: `text-gray-950 font-bold`
- **Descrição**: `text-gray-600`

### Botões

#### Primário (CTA principal)
```html
class="bg-gray-950 hover:bg-gray-900 text-white font-bold shadow-md hover:shadow-lg"
```

#### Secundário
```html
class="border-2 border-gray-900 text-gray-950 hover:bg-gray-50 font-bold"
```

#### Terciário
```html
class="text-gray-900 hover:text-gray-700 font-semibold"
```

### Forms/Inputs
- **Background**: `bg-white`
- **Border normal**: `border-2 border-gray-300`
- **Border focus**: `focus:border-gray-900`
- **Ring focus**: `focus:ring-2 focus:ring-gray-200`
- **Texto**: `text-gray-900`
- **Label**: `text-gray-900 font-bold`
- **Placeholder**: `text-gray-400`

### Badges/Tags
- **Normal**: `bg-gray-100 text-gray-800`
- **Destaque**: `bg-gray-950 text-white font-bold`

## Typography

### Font Family
```css
font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif
```

### Hierarquia
- **Hero H1**: `text-4xl sm:text-5xl lg:text-6xl font-bold`
- **Section H2**: `text-3xl lg:text-4xl font-extrabold`
- **Card H3**: `text-lg font-bold`
- **Body**: `text-base leading-relaxed`
- **Small**: `text-sm font-medium`
- **Tiny**: `text-xs font-medium`

## Spacing

### Container
```html
class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
```

### Sections
```html
class="py-16"  /* Padrão */
class="py-20"  /* Mais espaço */
```

### Cards/Components
```html
class="p-5"    /* Padding interno */
class="gap-6"  /* Grid gap */
class="mb-8"   /* Margin bottom */
```

## Borders & Shadows

### Borders
- **Sutil**: `border border-gray-200`
- **Normal**: `border-2 border-gray-200`
- **Forte**: `border-2 border-gray-900`
- **Separator**: `border-t border-gray-200`

### Shadows
- **Sutil**: `shadow-sm`
- **Normal**: `shadow-md`
- **Forte**: `shadow-lg`
- **Extra**: `shadow-xl`

### Border Radius
- **Pequeno**: `rounded-md` (4px)
- **Normal**: `rounded-lg` (8px)
- **Grande**: `rounded-xl` (12px)
- **Círculo**: `rounded-full`

## States & Interactions

### Hover
```html
class="transition-all duration-300"
class="hover:shadow-xl"
class="hover:border-gray-900"
class="hover:scale-110"  /* Apenas para ícones/badges */
```

### Focus
```html
class="focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-900"
```

### Disabled
```html
class="disabled:opacity-50 disabled:cursor-not-allowed"
```

## Componentes Específicos

### Score Progress Bar
- **Container**: `bg-gray-200 border border-gray-300 h-4`
- **Fill 90%+**: `bg-gray-950 shadow-lg`
- **Fill 70-89%**: `bg-gray-900 shadow-md`
- **Fill 50-69%**: `bg-gray-800`
- **Fill 30-49%**: `bg-gray-700`
- **Fill <30%**: `bg-gray-600`

### Countdown Timer
- **Normal**: `text-gray-900`
- **Urgent**: `text-gray-700`
- **Critical**: `text-gray-950 font-bold`

### Stats/Metrics
- **Container**: `bg-white/5 backdrop-blur-sm` (em dark bg)
- **Número**: `text-3xl font-bold text-white`
- **Label**: `text-gray-400 text-sm font-medium`

## Exemplos de Uso

### Card de Projeto
```html
<div class="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-900">
  <div class="h-48 bg-gray-100">
    <!-- Imagem -->
  </div>
  <div class="p-5">
    <h3 class="text-lg font-bold text-gray-950 mb-2">Título</h3>
    <p class="text-gray-600 text-sm mb-4 leading-relaxed">Descrição</p>
    <button class="w-full bg-gray-950 hover:bg-gray-900 text-white py-3 rounded-lg font-bold">
      Ação
    </button>
  </div>
</div>
```

### Hero Section
```html
<section class="bg-gray-950 text-white py-16 sm:py-24 border-b-4 border-gray-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
      Título Principal
    </h1>
    <p class="text-xl text-gray-300 mb-8 leading-relaxed">
      Descrição
    </p>
    <button class="bg-white text-gray-950 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold">
      CTA
    </button>
  </div>
</section>
```

## Acessibilidade

### Contraste WCAG AA
- ✅ `gray-950` em `white`: 20.26:1
- ✅ `gray-900` em `white`: 16.11:1
- ✅ `gray-600` em `white`: 6.57:1
- ✅ `white` em `gray-950`: 20.26:1
- ✅ `gray-300` em `gray-950`: 12.23:1

### Mínimos WCAG AA
- Texto normal: 4.5:1 ✅
- Texto grande (18pt+): 3:1 ✅
- UI Components: 3:1 ✅

## Princípios

1. **Alto Contraste**: Sempre priorizar legibilidade
2. **Consistência**: Usar sempre os mesmos tons para mesmas funções
3. **Hierarquia Clara**: Diferenciar títulos, texto corpo e secundário
4. **Profissionalismo**: Design limpo e minimalista
5. **Acessibilidade**: Garantir contraste WCAG AA mínimo
