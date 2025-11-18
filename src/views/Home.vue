<template>
  <div class="bg-white text-gray-900 overflow-hidden">
    <!-- Hero -->
    <section class="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-96 h-96 bg-accent-500/10 rounded-full blur-3xl -top-48 -left-48 animate-blob"></div>
        <div class="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-blob animation-delay-2000"></div>
        <div class="absolute inset-0 opacity-5 bg-grid-pattern animate-grid-scroll"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-6 animate-slide-in-left">
            <p class="text-accent-400 font-semibold uppercase tracking-[0.3em] text-xs sm:text-sm">Plataforma completa de serviços profissionais</p>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Seja você um <span class="bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600 bg-clip-text text-transparent animate-gradient-text">Kaddesh</span>
            </h1>
            <p class="text-xl text-accent-100 font-semibold">Melhores profissionais ou talentos</p>
            <p class="text-lg text-gray-200">
              Reunimos talentos verificados, leilões seguros e ferramentas para que clientes e fornecedores negociem com transparência.
            </p>

            <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 animate-fade-in-up">
              <div class="flex flex-col md:flex-row gap-3">
                <div class="flex-1">
                  <label class="sr-only" for="searchKeyword">Pesquise por palavra-chave</label>
                  <div class="relative group">
                    <MagnifyingGlassIcon class="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-500" />
                    <input
                      id="searchKeyword"
                      v-model="searchKeyword"
                      type="text"
                      placeholder="Desenvolvedor, branding, social media..."
                      class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  @click="handleSearch"
                  class="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-primary-900 px-8 py-3 rounded-xl font-bold whitespace-nowrap flex items-center justify-center gap-2"
                >
                  Procurar agora
                  <ArrowRightIcon class="h-5 w-5" />
                </button>
              </div>
            </div>

            <dl class="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
              <div v-for="stat in heroStats" :key="stat.label" class="bg-white/10 rounded-2xl p-4 border border-white/10">
                <dt class="text-sm text-gray-300">{{ stat.label }}</dt>
                <dd class="text-3xl font-bold text-white">{{ stat.value }}</dd>
              </div>
            </dl>
            <div class="w-full flex justify-center">
              <router-link to="/tutorial" class="btn btn-accent px-6 py-3 rounded-xl font-bold text-primary-900 shadow-lg hover:bg-accent-600 transition-all">
                Como usar a plataforma (Tutorial)
              </router-link>
            </div>
          </div>

          <div class="relative animate-slide-in-right">
            <div class="absolute -inset-4 bg-gradient-to-r from-accent-500/20 to-blue-500/20 rounded-3xl blur-3xl animate-pulse-slow"></div>
            <img
              src="/assets/images/hero-handshake.avif"
              alt="Profissionais fechando parceria"
              class="relative rounded-3xl shadow-3xl w-full object-cover"
            />
            <div class="absolute -bottom-8 -right-6 bg-white rounded-2xl shadow-xl p-4 w-48 animate-float hidden sm:block">
              <p class="text-xs text-gray-500">Escrow liberado ─ 12:32</p>
              <p class="font-semibold text-primary-900">Projeto Branding Premium</p>
              <p class="text-sm text-green-600 font-bold">R$ 8.400,00</p>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 text-gray-50">
        <svg class="w-full h-20" viewBox="0 0 1440 74" fill="currentColor" preserveAspectRatio="none">
          <path d="M0 74L60 61.8C120 49.7 240 25.3 360 16.5C480 7.7 600 14.3 720 24.7C840 35 960 49 1080 53.2C1200 57.3 1320 51.7 1380 48.8L1440 46V74H1380C1320 74 1200 74 1080 74C960 74 840 74 720 74C600 74 480 74 360 74C240 74 120 74 60 74H0Z" />
        </svg>
      </div>
    </section>

    <!-- Categorias -->
    <section class="bg-gradient-to-b from-gray-50 to-white py-20 relative">
      <div class="absolute top-16 left-12 w-20 h-20 bg-accent-500/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-16 right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16">
          <p class="text-sm text-accent-500 font-semibold uppercase tracking-wide">Vamos começar rapidamente hoje</p>
          <h2 class="text-4xl lg:text-5xl font-bold text-primary-900">
            Vamos explorar <span class="bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">categorias populares</span>
          </h2>
          <p class="text-gray-600 text-lg mt-4 max-w-3xl mx-auto">
            Use o leilão reverso da Kadesh para contratar especialistas ou aplicar seus talentos nos projetos certos.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            @click="handleCategoryRedirect(category.slug)"
            class="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-accent-500 animate-fade-in-up"
            :style="{ animationDelay: category.delay }"
          >
            <img :src="category.image" :alt="category.title" class="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-5">
              <component :is="category.icon" class="h-8 w-8 text-accent-400 mb-3 animate-bounce-slow"></component>
              <p class="text-xs text-gray-300 uppercase tracking-wider">{{ category.tagline }}</p>
              <h3 class="text-white text-lg font-semibold">{{ category.title }}</h3>
              <p class="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity">{{ category.description }}</p>
            </div>
            <span class="absolute top-0 right-0 bg-accent-500 text-primary-900 px-3 py-1 text-xs font-bold rounded-bl-xl">{{ category.label }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Experiência Mobile -->
    <section class="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-24 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-64 h-64 bg-accent-500/10 rounded-full blur-3xl top-12 right-20 animate-float-slow"></div>
        <div class="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl bottom-12 left-16 animate-float-slow animation-delay-3000"></div>
        <div class="absolute inset-0 opacity-5 bg-grid-pattern animate-grid-scroll"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="text-white space-y-6 animate-slide-in-left">
          <p class="text-sm font-semibold uppercase tracking-wide text-accent-400">Leve o trabalho no bolso</p>
          <h2 class="text-4xl lg:text-5xl font-bold leading-tight">
            Segurança e oportunidades <span class="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent animate-gradient-text">por toda parte</span>
          </h2>
          <p class="text-lg text-gray-200">
            Receba alertas, responda propostas e monitore o escrow do seu projeto em tempo real.
          </p>

          <ul class="space-y-4">
            <li v-for="item in mobileHighlights" :key="item.title" class="flex items-start gap-4 bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <component :is="item.icon" class="h-6 w-6 text-accent-400 flex-shrink-0" />
              <div>
                <p class="font-semibold">{{ item.title }}</p>
                <p class="text-sm text-gray-300">{{ item.description }}</p>
              </div>
            </li>
          </ul>

          <div class="flex flex-wrap gap-4">
            <img src="/assets/images/appstore.png" alt="Download App Store" class="h-14 object-contain" />
            <img src="/assets/images/playstore.png" alt="Download Google Play" class="h-14 object-contain" />
          </div>
        </div>

        <div class="flex justify-center lg:justify-end animate-slide-in-right">
          <div class="relative">
            <div class="absolute inset-0 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow scale-110"></div>
            <img src="/assets/images/mobile-app.png" alt="Aplicativo Kadesh" class="relative w-full max-w-md animate-float" />
            <div class="absolute top-10 -left-8 bg-white rounded-2xl shadow-xl p-4 w-48">
              <p class="text-sm text-gray-500">Notificações inteligentes</p>
              <p class="font-semibold text-primary-900">12 convites pendentes</p>
            </div>
            <div class="absolute bottom-16 -right-6 bg-white rounded-2xl shadow-xl p-4 w-48">
              <p class="text-sm text-gray-500">Escrow liberado</p>
              <p class="font-bold text-green-600">R$ 4.500,00</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projetos em destaque -->
    <section class="bg-white py-20" id="projetos">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p class="text-sm text-accent-500 font-semibold uppercase tracking-wide">Quer começar a trabalhar?</p>
            <h2 class="text-4xl font-bold text-primary-900">Aplique os projetos mais bem avaliados</h2>
            <p class="text-gray-600 mt-3 max-w-2xl">Selecionamos oportunidades em aberto com pagamentos protegidos em escrow e clientes verificados.</p>
          </div>
          <button type="button" @click="router.push({ name: 'projects' })" class="text-accent-600 font-semibold flex items-center gap-2">
            Ver todos os projetos
            <ArrowRightIcon class="h-5 w-5" />
          </button>
        </div>

        <div v-if="loadingProjects" class="grid sm:grid-cols-2 gap-6">
          <div v-for="n in 2" :key="`skeleton-${n}`" class="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div class="mt-6 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div v-else-if="featuredProjects.length" class="space-y-6">
          <article
            v-for="project in featuredProjects"
            :key="project.id"
            class="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-shadow"
          >
            <div class="flex flex-col lg:flex-row gap-6">
              <div class="flex-1 flex gap-4">
                <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <img src="/assets/images/project-placeholder.png" alt="Projeto" class="w-full h-full object-cover rounded-2xl" />
                </div>
                <div>
                  <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2">
                    <span class="px-3 py-1 bg-accent-100 text-primary-900 rounded-full text-xs font-bold">⚡ Destaque</span>
                    <span>Postado {{ formatDate(project.created_at) }}</span>
                    <span class="flex items-center gap-1"><UsersIcon class="h-4 w-4" /> {{ project.bids_count || 0 }} propostas</span>
                  </div>
                  <h3 class="text-2xl font-semibold text-primary-900">{{ project.title }}</h3>
                  <p class="text-gray-600 mt-2">{{ project.description }}</p>
                  <div class="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                    <span class="flex items-center gap-1"><CalendarDaysIcon class="h-4 w-4 text-accent-500" /> {{ formatTimeLeft(project.bidding_ends_at) }}</span>
                    <span class="flex items-center gap-1"><MapPinIcon class="h-4 w-4 text-accent-500" /> Remoto</span>
                  </div>
                </div>
              </div>
              <div class="lg:w-64 flex flex-col justify-between">
                <div>
                  <p class="text-sm text-gray-500">Budget estimado</p>
                  <p class="text-3xl font-bold text-green-600">R$ {{ formatBudget(project.max_budget) }}</p>
                </div>
                <button
                  type="button"
                  @click="handleApplyProject(project.id)"
                  class="btn btn-primary w-full mt-4"
                >
                  Inscreva-se agora
                </button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="text-center py-12 text-gray-500">
          <p class="text-lg">Nenhum projeto disponível no momento. Cadastre-se para ser notificado.</p>
        </div>
      </div>
    </section>

    <!-- Progress snapshot -->
    <section class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 text-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-12 items-center">
          <div class="lg:w-2/5 space-y-4">
            <p class="text-sm font-semibold tracking-widest text-accent-300 uppercase">Estado real do roadmap</p>
            <h2 class="text-3xl font-bold">Estamos {{ progressSnapshot.mvp }}% do MVP e {{ progressSnapshot.platform }}% da plataforma completa</h2>
            <p class="text-gray-300">
              Percentuais confirmados no arquivo <strong>{{ progressSnapshot.referenceDoc }}</strong> em {{ progressSnapshot.lastUpdated }}. O quadro abaixo mostra exatamente o que
              falta para cada marco — sem placeholders, apenas sinalização transparente para quem acompanha o progresso.
            </p>
            <div class="text-sm text-gray-400">
              Último marco prioritário: <span class="text-white font-semibold">{{ progressSnapshot.nextMilestone }}</span>
            </div>
          </div>
          <div class="lg:flex-1 w-full grid gap-6 md:grid-cols-2">
            <article
              v-for="item in progressSnapshot.blocks"
              :key="item.label"
              class="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6 space-y-4"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-white">{{ item.label }}</h3>
                <span class="text-2xl font-bold text-accent-300">{{ item.value }}%</span>
              </div>
              <div class="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div class="h-3 bg-accent-400 rounded-full transition-all duration-500" :style="{ width: getProgressBarWidth(item.value) }"></div>
              </div>
              <p class="text-sm text-gray-300">{{ item.description }}</p>
              <ul class="text-xs text-gray-400 space-y-1">
                <li v-for="bullet in item.pending" :key="bullet">• {{ bullet }}</li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="bg-primary-900 py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Inscreva-se no nosso boletim</h2>
        <p class="text-gray-300 mb-8">Receba novidades das categorias, eventos e vagas urgentes da comunidade Kadesh.</p>

        <form @submit.prevent="handleNewsletter" class="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <label class="sr-only" for="newsletterEmail">Informe seu e-mail</label>
          <input
            id="newsletterEmail"
            v-model="newsletterEmail"
            type="email"
            required
            placeholder="nome@empresa.com"
            class="flex-1 px-6 py-4 rounded-xl focus:ring-2 focus:ring-accent-500 text-gray-900"
          />
          <button type="submit" class="px-8 py-4 rounded-xl font-bold bg-accent-500 text-primary-900 hover:bg-accent-600">
            Cadastre-se agora
          </button>
        </form>

        <p class="text-sm text-gray-400 mt-4">Sem spam. Apenas conteúdo valioso e convites ao vivo.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  CommandLineIcon,
  MegaphoneIcon,
  PaintBrushIcon,
  CpuChipIcon,
  BriefcaseIcon,
  BellAlertIcon,
  CheckCircleIcon,
  StarIcon,
  UsersIcon,
  MapPinIcon,
  CalendarDaysIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const toast = typeof window !== 'undefined' ? useToast() : null

const searchKeyword = ref('')
const newsletterEmail = ref('')
const featuredProjects = ref([])
const loadingProjects = ref(false)
const progressSnapshot = {
  mvp: 100,
  platform: 100,
  referenceDoc: 'STATUS-ATUAL-DESENVOLVIMENTO.md',
  lastUpdated: '17/11/2025',
  nextMilestone: 'Lançar gráficos/relatórios (analytics) como melhoria contínua',
  blocks: [
    {
      label: 'MVP Funcional',
      value: 100,
      description: 'Auth, marketplace, leilões, contratos, disputas admin, wallet e pagamentos 100% completos.',
      pending: [
        'MVP concluído! ✅'
      ]
    },
    {
      label: 'Plataforma Completa',
      value: 100,
      description: 'Plataforma completa entregue: escrow/milestones, reviews com moderação, perfis públicos/portfólio e chat em tempo real concluídos.',
      pending: [
        'Concluído! ✅'
      ]
    }
  ]
}

const heroStats = [
  { label: 'Talentos ativos', value: '12k+' },
  { label: 'Projetos financiados', value: '2.4k+' },
  { label: 'Clientes verificados', value: '940+' }
]

const categories = [
  {
    id: 1,
    title: 'Desenvolvimento Web',
    description: 'Sites, portais e apps responsivos',
    label: 'Popular',
    tagline: 'Stack moderna',
    slug: 'desenvolvimento-web',
    image: '/assets/images/category-design.jpg',
    icon: CommandLineIcon,
    delay: '0ms'
  },
  {
    id: 2,
    title: 'Marketing Digital',
    description: 'Growth, mídia paga e social',
    label: 'Trending',
    tagline: 'Performance',
    slug: 'marketing-digital',
    image: '/assets/images/category-marketing.jpg',
    icon: MegaphoneIcon,
    delay: '100ms'
  },
  {
    id: 3,
    title: 'Design & Branding',
    description: 'Identidade visual e UX/UI',
    label: 'Creative',
    tagline: 'Estética e produto',
    slug: 'design-branding',
    image: '/assets/images/category-design-real.jpg',
    icon: PaintBrushIcon,
    delay: '200ms'
  },
  {
    id: 4,
    title: 'Tecnologia & Dados',
    description: 'IA, integrações e automações',
    label: 'Hot',
    tagline: 'SaaS • AI',
    slug: 'tecnologia-dados',
    image: '/assets/images/category-email-real.jpg',
    icon: CpuChipIcon,
    delay: '300ms'
  },
  {
    id: 5,
    title: 'Consultoria de Negócios',
    description: 'Plano de crescimento e processos',
    label: 'Premium',
    tagline: 'Estratégia',
    slug: 'consultoria-negocios',
    image: '/assets/images/hero-business.jpg',
    icon: BriefcaseIcon,
    delay: '400ms'
  }
]

const mobileHighlights = [
  {
    title: 'Notificações em tempo real',
    description: 'Convites e mensagens sincronizados com o marketplace web.',
    icon: BellAlertIcon
  },
  {
    title: 'Escrow protegido',
    description: 'Liberamos o pagamento assim que o cliente aprova as entregas.',
    icon: CheckCircleIcon
  },
  {
    title: 'Reputação transparente',
    description: 'Avaliações, badges e nível de especialista sempre visíveis.',
    icon: StarIcon
  }
]

const fetchFeaturedProjects = async () => {
  loadingProjects.value = true
  try {
    const { data } = await api.get('/api/projects', {
      params: { status: 'open', limit: 4 }
    })

    const payload = Array.isArray(data) ? data : data?.projects || []
    featuredProjects.value = payload.slice(0, 4)
  } catch (error) {
    console.error('Erro ao buscar projetos em destaque', error)
    toast?.error('Não foi possível carregar os projetos em destaque.')
  } finally {
    loadingProjects.value = false
  }
}

const handleSearch = () => {
  const query = {}
  if (searchKeyword.value.trim()) {
    query.keyword = searchKeyword.value.trim()
  }
  router.push({ name: 'projects', query })
}

const handleCategoryRedirect = slug => {
  router.push({ name: 'projects', query: { category: slug } })
}

const handleApplyProject = projectId => {
  if (!authStore.isAuthenticated) {
    toast?.info('Entre na sua conta para se candidatar a projetos.')
    router.push({ name: 'login', query: { redirect: `/projects/${projectId}` } })
    return
  }
  router.push({ name: 'project-detail', params: { id: projectId } })
}

const handleNewsletter = () => {
  if (!newsletterEmail.value.trim()) {
    return
  }
  toast?.success('Obrigado! Você receberá nossas novidades em breve.')
  newsletterEmail.value = ''
}

const formatDate = dateString => {
  if (!dateString) return 'Recentemente'
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days < 7) return `${days} dias atrás`
  if (days < 30) return `${Math.floor(days / 7)} semanas atrás`
  return `${Math.floor(days / 30)} meses atrás`
}

const formatTimeLeft = endsAt => {
  if (!endsAt) return 'A definir'
  const now = new Date()
  const end = new Date(endsAt)
  const diff = end - now
  if (diff <= 0) return 'Encerrado'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days > 0) return `${days} dias restantes`
  const hours = Math.floor(diff / (1000 * 60 * 60))
  return `${hours} horas restantes`
}

const formatBudget = value => {
  if (!value) return '0,00'
  const numeric = typeof value === 'number' ? value : parseFloat(value)
  return numeric.toFixed(2).replace('.', ',')
}

const getProgressBarWidth = value => {
  const safeValue = Math.min(Math.max(Number(value) || 0, 0), 100)
  return `${safeValue}%`
}

onMounted(() => {
  fetchFeaturedProjects()
})
</script>
