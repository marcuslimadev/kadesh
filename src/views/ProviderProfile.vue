<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <p class="text-sm font-medium text-primary-600 uppercase tracking-wide">Perfil profissional</p>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 class="text-3xl font-bold text-gray-900">Meu Perfil de Fornecedor</h1>
          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="loadData"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M20 20v-5h-.581m-15.357-2a8.003 8.003 0 0015.357 2" />
              </svg>
              Atualizar dados
            </button>
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              @click="scrollToForm"
            >
              Editar perfil
            </button>
          </div>
        </div>
        <p class="mt-2 text-gray-600">
          Mantenha seu perfil atualizado para aumentar suas chances de ser encontrado por contratantes.
      <div v-if="!isProvider" class="bg-white rounded-2xl shadow-sm p-10 text-center border border-dashed border-gray-200">
        <h2 class="text-2xl font-semibold text-gray-900">Perfil de fornecedor indisponível</h2>
        <p class="mt-3 text-gray-600">
          Esta função está disponível apenas para contas do tipo fornecedor. Altere o tipo de conta ou crie uma nova conta de fornecedor.
        </p>
        <p class="mt-3 text-gray-600">
          Esta fun��ǜo estǭ dispon��vel apenas para contas do tipo fornecedor. Altere o tipo de conta ou crie uma nova conta de fornecedor.
        </p>
      </div>

      <div v-else>
        <div v-if="isPageLoading" class="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div class="inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin"></div>
          <p class="mt-4 text-gray-600">Carregando informa����es do perfil...</p>
        </div>

        <div v-else-if="error" class="bg-white rounded-2xl shadow-sm p-10 text-center border border-red-100">
          <svg class="w-14 h-14 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 5a7 7 0 00-7 7v1a7 7 0 0014 0v-1a7 7 0 00-7-7z" />
          </svg>
          <h2 class="mt-4 text-2xl font-semibold text-gray-900">Nǜo foi poss��vel carregar seu perfil</h2>
          <p class="mt-2 text-gray-600">{{ error }}</p>
          <button
            type="button"
            @click="loadData"
            class="mt-6 inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
          >
          <p class="mt-4 text-gray-600">Carregando informações do perfil...</p>
          </button>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Sidebar -->
          <aside class="space-y-6">
            <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div class="flex items-center gap-4">
          <h2 class="mt-4 text-2xl font-semibold text-gray-900">Não foi possível carregar seu perfil</h2>
                  <img
                    v-if="profile?.avatar_url"
                    :src="profile?.avatar_url"
                    :alt="profile?.name"
                    class="h-full w-full object-cover rounded-2xl"
                  />
                  <span v-else>{{ userInitials }}</span>
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-gray-900">{{ profile?.name }}</h2>
                  <p class="text-sm text-gray-500">{{ providerMeta.title || 'Defina um t��tulo profissional' }}</p>
                  <div class="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" :class="availabilityClasses">
                    {{ availabilityCopy.label }}
                  </div>
                </div>
              </div>

              <div class="mt-6 grid grid-cols-3 gap-4 text-center">
                <div class="bg-gray-50 rounded-xl p-3">
                  <p class="text-2xl font-semibold text-gray-900">{{ formatNumber(providerMeta.total_projects) }}</p>
                  <p class="text-xs text-gray-500">Projetos</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-3">
                  <p class="text-2xl font-semibold text-gray-900">{{ formatNumber(providerMeta.total_reviews) }}</p>
                  <p class="text-xs text-gray-500">Avalia����es</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-3">
                  <p class="text-2xl font-semibold text-gray-900">{{ providerMeta.rating ? providerMeta.rating.toFixed(1) : '—' }}</p>
                  <p class="text-xs text-gray-500">Nota</p>
                </div>
              </div>

              <dl class="mt-6 space-y-4 text-sm text-gray-600">
                <div class="flex items-center justify-between">
                  <dt>Or��amento/hora</dt>
                  <dd class="font-medium text-gray-900">
                    {{ providerMeta.hourly_rate ? formatCurrency(providerMeta.hourly_rate) : 'N/A' }}
                  </dd>
                </div>
                <div class="flex items-center justify-between">
                  <dt>Tempo de resposta</dt>
                  <dd class="font-medium text-gray-900">{{ providerMeta.response_time_hours || 24 }}h</dd>
                </div>
                <div class="flex items-center justify-between">
                  <dt>Experi��ncia</dt>
                  <dd class="font-medium text-gray-900">{{ providerMeta.experience_years || 0 }} anos</dd>
                </div>
              </dl>
            </section>

            <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">M��tricas recentes</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-500">Propostas enviadas</p>
                    <p class="text-xl font-semibold text-gray-900">{{ formatNumber(stats?.total_bids) }}</p>
                  </div>
                  <span class="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                    {{ formatNumber(stats?.pending_bids) }} pendentes
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm text-gray-500">Contratos ativos</p>
                    <p class="text-xl font-semibold text-gray-900">{{ formatNumber(stats?.active_contracts) }}</p>
                  </div>
                  <span class="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700">
                    {{ formatNumber(stats?.completed_contracts) }} conclu��dos
                  </span>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Receita total</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(stats?.total_earnings) }}</p>
                </div>
              </div>
            </section>

            <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Habilidades & ferramentas</h3>
              <div v-if="displaySkills.length" class="flex flex-wrap gap-2">
                <span
                  v-for="skill in displaySkills"
                  :key="skill"
                  class="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium"
                >
                  {{ skill }}
                </span>
              </div>
              <div v-else class="text-sm text-gray-500">
                Nenhuma habilidade cadastrada ainda. Utilize o formul��rio ao lado para adicionar suas compet��ncias principais.
              </div>
            </section>

            <section v-if="socialLinks.length" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">Links e contato</h3>
              <ul class="space-y-3 text-sm">
                <li v-for="link in socialLinks" :key="link.label" class="flex items-center gap-3">
                  <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <svg
                      v-if="link.type === 'portfolio'"
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 7l2 12h14l2-12M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                    <svg
                      v-else-if="link.type === 'github'"
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.093.682-.217.682-.482 0-.237-.01-1.025-.015-1.86-2.782.605-3.369-1.342-3.369-1.342-.454-1.153-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.033 1.532 1.033.892 1.53 2.341 1.088 2.91.833.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.112-4.555-4.945 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844a9.53 9.53 0 012.504.337c1.909-1.296 2.748-1.025 2.748-1.025.546 1.378.203 2.397.1 2.65.64.698 1.028 1.591 1.028 2.682 0 3.842-2.339 4.688-4.566 4.936.359.31.678.92.678 1.855 0 1.338-.012 2.418-.012 2.748 0 .267.18.58.688.481A10.02 10.02 0 0022 12.017C22 6.484 17.523 2 12 2z"
                      />
                    </svg>
                    <svg
                      v-else-if="link.type === 'linkedin'"
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.452 20.452h-3.554V14.89c0-1.327-.024-3.036-1.852-3.036-1.853 0-2.137 1.447-2.137 2.941v5.657H9.355V9h3.414v1.561h.049c.476-.9 1.637-1.852 3.368-1.852 3.604 0 4.271 2.372 4.271 5.455v6.288zM5.337 7.433a2.062 2.062 0 110-4.123 2.062 2.062 0 010 4.123zm-1.777 13.02h3.554V9H3.56v11.454z" />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1018 0 9 9 0 00-18 0zm9-9c-1.657 0-3 4.03-3 9s1.343 9 3 9 3-4.03 3-9-1.343-9-3-9zm-8 9h16" />
                    </svg>
                  </span>
                  <a :href="link.href" target="_blank" rel="noopener" class="text-primary-600 hover:text-primary-700 truncate">
                    {{ link.text }}
                  </a>
                </li>
              </ul>
            </section>
          </aside>

          <!-- Main form -->
          <main id="provider-profile-form" class="lg:col-span-2 space-y-8">
            <form @submit.prevent="handleSave" class="space-y-8">
              <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                <header class="flex items-start justify-between">
                  <div>
                    <h2 class="text-xl font-semibold text-gray-900">Informa����es gerais</h2>
                    <p class="text-sm text-gray-500">Essas informa����es sǜo exibidas na parte superior do seu perfil.</p>
                  </div>
                  <span v-if="hasChanges" class="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    Poss��i altera����es nǜo salvas
                  </span>
                </header>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
                    <input
                      v-model="form.name"
                      type="text"
                      class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Como aparecer�� no perfil"
                    />
                    <p v-if="validationErrors.name" class="mt-1 text-sm text-red-600">{{ validationErrors.name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">T��tulo profissional</label>
                    <input
                      v-model="form.title"
                      type="text"
                      class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex.: Desenvolvedor Full Stack Senior"
                    />
                    <p v-if="validationErrors.title" class="mt-1 text-sm text-red-600">{{ validationErrors.title }}</p>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    v-model="form.bio"
                    rows="4"
                    class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Conte aos contratantes sobre sua experi��ncia, abordagem e diferenciais."
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Localiza��ǜo</label>
                    <input
                      v-model="form.location"
                      type="text"
                      class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Cidade, pa��s"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      v-model="form.timezone"
                      class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option v-for="zone in timezoneOptions" :key="zone" :value="zone">
                        {{ zone }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                    <select
                      v-model="form.language"
                      class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option v-for="lang in languageOptions" :key="lang.value" :value="lang.value">
                        {{ lang.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </section>

              <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                <header>
                  <h2 class="text-xl font-semibold text-gray-900">Informa����es profissionais</h2>
                  <p class="text-sm text-gray-500">Defina disponibilidade, valores e habilidades principais.</p>
                </header>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Disponibilidade</label>
                    <select
                      v-model="form.availability"
                      class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option v-for="option in availabilityOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Valor hora (R$)</label>
                    <input
                      v-model.number="form.hourly_rate"
                      type="number"
                      min="0"
                      step="10"
                      class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Ex.: 150"
                    />
                    <p v-if="validationErrors.hourly_rate" class="mt-1 text-sm text-red-600">{{ validationErrors.hourly_rate }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Experi��ncia (anos)</label>
                    <input
                      v-model.number="form.experience_years"
                      type="number"
                      min="0"
                      step="1"
                      class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Habilidades principais</label>
                  <input
                    v-model="skillsInput"
                    type="text"
                    class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Separe as habilidades por v��rgula. Ex.: Vue, Node.js, PostgreSQL"
                    @blur="syncSkillsFromInput"
                  />
                  <p class="mt-1 text-xs text-gray-500">Exibiremos as habilidades individualmente no perfil.</p>
                </div>
              </section>

              <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                <header>
                  <h2 class="text-xl font-semibold text-gray-900">Portf��lio & links</h2>
                  <p class="text-sm text-gray-500">Compartilhe seus projetos e perfis profissionais.</p>
                </header>

                <div class="grid grid-cols-1 gap-5">
                  <div v-for="link in portfolioFields" :key="link.model">
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ link.label }}</label>
                    <input
                      v-model="form[link.model]"
                      type="url"
                      class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      :placeholder="link.placeholder"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    v-model="form.website"
                    type="url"
                    class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Telefone comercial</label>
                  <input
                    v-model="form.phone"
                    type="text"
                    class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </section>

              <div class="flex flex-col md:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  @click="resetForm"
                  class="w-full md:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Descartar altera����es
                </button>
                <button
                  type="submit"
                  :disabled="isSaving || !hasChanges"
                  class="w-full md:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-white font-semibold bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  <span v-if="isSaving" class="flex items-center">
                    <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M20 20v-5h-.581m-15.357-2a8.003 8.003 0 0015.357 2" />
                    </svg>
                    Salvando...
                  </span>
                  <span v-else>Salvar perfil</span>
                </button>
              </div>
              <!-- Avaliações recentes -->
              <section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <header class="flex items-center justify-between">
                  <h2 class="text-xl font-semibold text-gray-900">Avaliações recentes</h2>
                  <span class="text-sm text-gray-500" v-if="reviews.length">{{ reviews.length }} recebidas</span>
                </header>
                <div v-if="!reviewsLoaded" class="text-sm text-gray-500">Carregando avaliações...</div>
                <div v-else-if="reviews.length === 0" class="text-sm text-gray-500">Nenhuma avaliação recebida ainda.</div>
                <ul v-else class="space-y-4">
                  <li v-for="r in reviews" :key="r.id" class="border-b last:border-0 border-gray-100 pb-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ r.reviewer_name }}</p>
                        <p class="text-xs text-gray-500">{{ formatDate(r.created_at) }}</p>
                      </div>
                      <div class="text-amber-500 text-sm">
                        <span v-for="i in r.rating" :key="i">★</span>
                        <span v-for="i in (5 - r.rating)" :key="'e'+i" class="text-gray-300">★</span>
                      </div>
                    </div>
                    <p v-if="r.comment" class="mt-2 text-sm text-gray-700">{{ r.comment }}</p>
                  </li>
                </ul>
              </section>
            </form>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useProviderStore } from '@/stores/provider'
import { useAuthStore } from '@/stores/auth'

const providerStore = useProviderStore()
const authStore = useAuthStore()

const error = ref('')
const isPageLoading = ref(true)
const form = ref({
  name: '',
  title: '',
  bio: '',
  phone: '',
  website: '',
  location: '',
  timezone: 'America/Sao_Paulo',
  language: 'pt-BR',
  availability: 'available',
  hourly_rate: null,
  experience_years: 0,
  portfolio_url: '',
  github_url: '',
  linkedin_url: '',
  skills: []
})
const skillsInput = ref('')
const hasChanges = ref(false)
const validationErrors = ref({})
const isHydrating = ref(false)

const availabilityOptions = [
  { value: 'available', label: 'Dispon��vel' },
  { value: 'limited', label: 'Com agenda limitada' },
  { value: 'unavailable', label: 'Nǜo dispon��vel' }
]

const languageOptions = [
  { value: 'pt-BR', label: 'Portugu��s (Brasil)' },
  { value: 'en-US', label: 'Ingl��s' },
  { value: 'es-ES', label: 'Espanhol' }
]

const timezoneOptions = [
  'America/Sao_Paulo',
  'America/New_York',
  'Europe/London',
  'Europe/Lisbon'
]

const portfolioFields = [
  { model: 'portfolio_url', label: 'Portf��lio', placeholder: 'https://meuportfolio.com' },
  { model: 'github_url', label: 'GitHub', placeholder: 'https://github.com/usuario' },
  { model: 'linkedin_url', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/usuario' }
]

const profile = computed(() => providerStore.profile)
const providerMeta = computed(() => profile.value?.provider_profile || {})
const stats = computed(() => providerStore.stats)
const isProvider = computed(() => authStore.isProvider)
const userInitials = computed(() => authStore.userInitials)
const isSaving = computed(() => providerStore.isSaving)

const availabilityCopy = computed(() => {
  const current = availabilityOptions.find(option => option.value === (providerMeta.value.availability || form.value.availability))
  return current || availabilityOptions[0]
})

const availabilityClasses = computed(() => {
  switch (providerMeta.value.availability || form.value.availability) {
    case 'available':
      return 'bg-green-50 text-green-700'
    case 'limited':
      return 'bg-amber-50 text-amber-700'
    case 'unavailable':
      return 'bg-gray-100 text-gray-500'
    default:
      return 'bg-gray-100 text-gray-500'
  }
})

const displaySkills = computed(() => {
  if (form.value.skills?.length) {
    return form.value.skills
  }
  return providerMeta.value.skills || []
})

const socialLinks = computed(() => {
  const links = []
  if (form.value.portfolio_url || providerMeta.value.portfolio_url) {
    links.push({
      label: 'Portf��lio',
      href: form.value.portfolio_url || providerMeta.value.portfolio_url,
      text: 'Ver portf��lio',
      type: 'portfolio'
    })
  }
  if (form.value.github_url || providerMeta.value.github_url) {
    links.push({
      label: 'GitHub',
      href: form.value.github_url || providerMeta.value.github_url,
      text: 'Perfil GitHub',
      type: 'github'
    })
  }
  if (form.value.linkedin_url || providerMeta.value.linkedin_url) {
    links.push({
      label: 'LinkedIn',
      href: form.value.linkedin_url || providerMeta.value.linkedin_url,
      text: 'Perfil LinkedIn',
      type: 'linkedin'
    })
  }
  if (form.value.website || profile.value?.website) {
    links.push({
      label: 'Website',
      href: form.value.website || profile.value?.website,
      text: 'Visitar site',
      type: 'website'
    })
  }
  return links
})

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))
}

const formatNumber = (value) => {
  if (!value && value !== 0) return '0'
  return new Intl.NumberFormat('pt-BR').format(Number(value))
}

const parseSkills = (value) => {
  if (!value) return []
  return value
    .split(',')
    .map(skill => skill.trim())
    .filter(Boolean)
}

const populateForm = (data) => {
  isHydrating.value = true
  const providerData = data?.provider_profile || {}
  form.value = {
    name: data?.name || '',
    title: providerData.title || '',
    bio: data?.bio || '',
    phone: data?.phone || '',
    website: data?.website || '',
    location: data?.location || '',
    timezone: data?.timezone || 'America/Sao_Paulo',
    language: data?.language || 'pt-BR',
    availability: providerData.availability || 'available',
    hourly_rate: providerData.hourly_rate || null,
    experience_years: providerData.experience_years || 0,
    portfolio_url: providerData.portfolio_url || '',
    github_url: providerData.github_url || '',
    linkedin_url: providerData.linkedin_url || '',
    skills: providerData.skills || []
  }
  skillsInput.value = form.value.skills.join(', ')
  validationErrors.value = {}
  hasChanges.value = false
  nextTick(() => {
    isHydrating.value = false
  })
}

const loadData = async () => {
  if (!isProvider.value) {
    isPageLoading.value = false
    return
  }

  isPageLoading.value = true
  error.value = ''
  const [profileResult, statsResult] = await Promise.all([
    providerStore.fetchProfile(),
    providerStore.fetchStats()
  ])

  if (!profileResult.success) {
    error.value = profileResult.error || 'Erro ao carregar dados'
  } else if (profileResult.data) {
    populateForm(profileResult.data)
  }

  if (!statsResult.success && !error.value) {
    error.value = statsResult.error || 'Erro ao carregar mǸtricas'
  }

  isPageLoading.value = false
}

const validateForm = () => {
  const errors = {}

  if (!form.value.name) {
    errors.name = 'Nome Ǹ obrigat��rio'
  }

  if (!form.value.title) {
    errors.title = 'Informe um t��tulo profissional'
  }

  if (form.value.hourly_rate && form.value.hourly_rate < 0) {
    errors.hourly_rate = 'Valor hora deve ser positivo'
  }

  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

const handleSave = async () => {
  syncSkillsFromInput()

  if (!validateForm()) {
    return
  }

  const payload = {
    name: form.value.name,
    phone: form.value.phone,
    bio: form.value.bio,
    website: form.value.website,
    location: form.value.location,
    timezone: form.value.timezone,
    language: form.value.language,
    title: form.value.title,
    hourly_rate: form.value.hourly_rate ? Number(form.value.hourly_rate) : null,
    skills: form.value.skills,
    experience_years: Number(form.value.experience_years) || 0,
    portfolio_url: form.value.portfolio_url,
    github_url: form.value.github_url,
    linkedin_url: form.value.linkedin_url,
    availability: form.value.availability
  }

  const result = await providerStore.saveProfile(payload)
  if (result.success && result.data) {
    populateForm(result.data)
  }
}

const resetForm = () => {
  if (profile.value) {
    populateForm(profile.value)
  }
}

const syncSkillsFromInput = () => {
  form.value.skills = parseSkills(skillsInput.value)
}

const scrollToForm = () => {
  const element = document.getElementById('provider-profile-form')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

watch(
  form,
  () => {
    if (!isHydrating.value) {
      hasChanges.value = true
    }
  },
  { deep: true }
)

watch(
  skillsInput,
  (value) => {
    if (!isHydrating.value) {
      form.value.skills = parseSkills(value)
    }
  }
)

onMounted(() => {
  loadData()
})

// Reviews
import api from '@/services/api'
const reviews = ref([])
const reviewsLoaded = ref(false)
const formatDate = (v) => (v ? new Date(v).toLocaleDateString('pt-BR') : '-')

const fetchReviews = async () => {
  try {
    const id = profile.value?.id
    if (!id) return
    const { data } = await api.get('/api/reviews', { params: { user_id: id, limit: 5 } })
    reviews.value = data?.data || []
  } finally {
    reviewsLoaded.value = true
  }
}

watch(profile, (val) => {
  if (val?.id) fetchReviews()
})
</script>
