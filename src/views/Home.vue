<template>
    <div class="home-shell overflow-hidden">
    <AdRail position="left" />
    <AdRail position="right" />
    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-grid">
          <div class="hero-copy">
            <div class="flex items-center gap-3">
              <img src="/logo.jpeg" alt="Kaddesh" class="h-12 w-12 rounded-xl border border-gold/40 shadow-sm object-cover" />
              <p class="eyebrow">KADDESH - Service Bridge</p>
            </div>
            <h1 class="hero-title">Leiloes reversos com curadoria e seguranca</h1>
            <p class="hero-sub tagline">Kaddesh: Onde a excelencia encontra a demanda.</p>
            <p class="hero-sub">
              Conectamos contratantes e prestadores em um ambiente confiavel, com anexos, prazos em horas e vencedor automatico pelo menor lance elegivel.
            </p>

            <div class="hero-search">
              <div class="flex flex-col md:flex-row gap-3">
                <div class="flex-1">
                  <label class="sr-only" for="searchKeyword">Pesquise por palavra-chave</label>
                  <div class="relative group">
                    <MagnifyingGlassIcon class="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-offwhite-muted group-focus-within:text-gold" />
                    <input
                      id="searchKeyword"
                      v-model="searchKeyword"
                      type="text"
                      placeholder="Desenvolvimento web, branding, social media..."
                      class="search-input"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  @click="handleSearch"
                  class="cta-primary"
                >
                  Procurar agora
                  <ArrowRightIcon class="h-5 w-5" />
                </button>
              </div>
            </div>

            <dl class="hero-stats">
              <div v-for="stat in heroStats" :key="stat.label" class="hero-stat-card">
                <dt class="hero-stat-label">{{ stat.label }}</dt>
                <dd class="hero-stat-value">{{ stat.value }}</dd>
              </div>
            </dl>
          </div>

          <div class="hero-visual">
            <div class="hero-visual-glow"></div>
            <div class="hero-visual-card">
              <img
                src="/assets/images/hero-handshake.avif"
                alt="Profissionais fechando parceria"
                class="hero-visual-image"
              />
              <div class="hero-visual-overlay">
                <p class="hero-visual-caption">Prazo em horas + anexos ativos</p>
                <p class="hero-visual-highlight">Leilao ativo - menor lance define</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Banners em Destaque -->
    <section class="bg-gradient-to-b from-gray-900 via-primary-900 to-gray-900 py-20 relative overflow-hidden">
      <!-- Efeitos decorativos -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>
      
      <!-- Grid de estrelas animadas -->
      <div class="absolute inset-0 opacity-30">
        <div class="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div class="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute bottom-20 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style="animation-delay: 2s;"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <!-- Cabeçalho da seção -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 bg-accent-500/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <svg class="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span class="text-sm font-semibold text-accent-400 uppercase tracking-wider">Em Destaque</span>
          </div>
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Oportunidades <span class="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">Exclusivas</span>
          </h2>
          <p class="text-gray-300 text-lg max-w-2xl mx-auto">
            Confira as melhores ofertas e parceiros selecionados pela Kaddesh
          </p>
        </div>

        <!-- Loading state -->
        <div v-if="loadingBanners" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
        </div>

        <!-- Banners Grid -->
        <div v-else-if="activeBanners.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <a
            v-for="banner in activeBanners"
            :key="banner.id"
            :href="banner.link_url"
            target="_blank"
            rel="noopener noreferrer"
            @click="trackBannerClick(banner.id)"
            class="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-accent-500/50 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent-500/50 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50"
          >
            <!-- Brilho no hover -->
            <div class="absolute inset-0 bg-gradient-to-br from-accent-400/0 via-accent-400/0 to-accent-400/0 group-hover:from-accent-400/20 group-hover:via-transparent group-hover:to-amber-400/20 transition-all duration-700"></div>
            
            <!-- Imagem do Banner -->
            <div class="aspect-[16/9] overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 relative">
              <img
                v-if="banner.image_url"
                :src="banner.image_url"
                :alt="banner.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-600">
                <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              
              <!-- Overlay gradiente sempre visível -->
              <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            </div>

            <!-- Badge premium no topo -->
            <div class="absolute top-4 right-4 flex items-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 backdrop-blur-sm px-4 py-2 rounded-full shadow-xl border border-accent-400/30">
              <svg class="w-4 h-4 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="text-xs font-bold text-white uppercase tracking-wider">Premium</span>
            </div>

            <!-- Conteúdo sempre visível -->
            <div class="absolute inset-0 p-6 flex flex-col justify-end relative z-10">
              <!-- Título e descrição -->
              <div class="transform transition-all duration-500 group-hover:-translate-y-2">
                <h3 class="text-2xl font-bold text-white mb-3 drop-shadow-2xl leading-tight">
                  {{ banner.title }}
                </h3>
                <p class="text-gray-300 text-sm mb-4 line-clamp-2 drop-shadow-lg">
                  {{ banner.description }}
                </p>
              </div>

              <!-- CTA Button sempre visível mas com hover effect -->
              <div class="transform transition-all duration-500 group-hover:scale-105">
                <span class="inline-flex items-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-2xl shadow-accent-500/50 group-hover:shadow-accent-500/80 transition-all">
                  Ver Oportunidade
                  <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Categorias -->
    <!-- Categorias -->
    <section class="bg-gradient-to-b from-gray-50 to-white py-20 relative">
      <div class="absolute top-16 left-12 w-20 h-20 bg-accent-500/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute bottom-16 right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-float animation-delay-2000"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16">
          <p class="text-sm text-accent-500 font-semibold uppercase tracking-wide">Vamos começar rapidamente hoje</p>
          <h2 class="text-4xl lg:text-5xl font-bold text-primary-900">
            Vamos explorar <span class="bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">categorias populares</span>
          </h2>
          <p class="text-gray-600 text-lg mt-4 max-w-3xl mx-auto">
            Use o leilão reverso da Kaddesh para contratar especialistas ou aplicar seus talentos nos projetos certos.
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
            <div class="h-56 w-full overflow-hidden">
              <img
                v-if="category.image"
                :src="category.image"
                :alt="category.title"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                v-else
                class="h-full w-full transition-transform duration-700 group-hover:scale-105"
                :style="{ background: category.gradient || 'linear-gradient(180deg, #2f3f55 0%, #0f1625 100%)' }"
              ></div>
            </div>
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

    <!-- Acesso rápido (login/registro) -->
    <section class="cta-section">
      <div class="cta-shell">
        <div class="cta-header">
          <p class="cta-eyebrow">Entrar ou criar conta</p>
          <h2 class="cta-heading">Kaddesh: Onde a excelencia encontra a demanda.</h2>
          <p class="cta-subtext">Use sua conta para acessar o Lobby no modo Contratante ou Prestador e acompanhar os leiloes em tempo real.</p>
        </div>

        <div class="cta-grid">
          <div class="cta-card">
            <div class="cta-card__top">
              <div class="cta-icon">
                <LockClosedIcon class="h-5 w-5" />
              </div>
              <div>
                <h3 class="cta-title">Já tem conta?</h3>
                <p class="cta-text">Acesse o Lobby no seu modo preferido.</p>
              </div>
            </div>
            <button @click="goToLogin" class="cta-button primary">
              <span>Fazer login</span>
              <ArrowRightIcon class="h-5 w-5" />
            </button>
          </div>

          <div class="cta-card alt">
            <div class="cta-card__top">
              <div class="cta-icon alt">
                <UserPlusIcon class="h-5 w-5" />
              </div>
              <div>
                <h3 class="cta-title">Novo por aqui?</h3>
                <p class="cta-text">Crie sua conta para contratar ou prestar serviços.</p>
              </div>
            </div>
            <button @click="goToRegister" class="cta-button secondary">
              <span>Criar conta</span>
              <ArrowRightIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Experiência Mobile -->
    <section class="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-24 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-64 h-64 bg-accent-500/10 rounded-full blur-3xl top-12 right-20 animate-float-slow"></div>
        <div class="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl bottom-12 left-16 animate-float-slow animation-delay-3000"></div>
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

          <div class="flex flex-wrap gap-3">
            <button class="px-4 py-3 rounded-xl bg-gold text-dark font-semibold shadow-gold hover:bg-gold/90 transition" @click="goToLogin">
              Entrar
            </button>
            <button class="px-4 py-3 rounded-xl bg-dark-80 border border-gold/30 text-offwhite font-semibold hover:border-gold/50 transition" @click="goToRegister">
              Criar conta
            </button>
          </div>
        </div>

        <div class="flex justify-center lg:justify-end animate-slide-in-right">
          <div class="relative">
            <div class="absolute inset-0 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow scale-110"></div>
            <img src="/assets/images/mobile-app.png" alt="Aplicativo Kaddesh" class="relative w-full max-w-md animate-float" />
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
            <p class="text-gray-600 mt-3 max-w-2xl">Selecionamos oportunidades em aberto com pagamentos protegidos em escrow e Contratantes verificados.</p>
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
              <div class="w-full lg:w-48 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  v-if="getHeroImage(project)"
                  :src="getHeroImage(project)"
                  :alt="project.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-sm">Sem imagem</div>
              </div>
              <div class="flex-1 space-y-3">
                <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span class="px-3 py-1 bg-accent-100 text-primary-900 rounded-full text-xs font-bold">Destaque</span>
                  <span>Postado {{ formatDate(project.created_at) }}</span>
                  <span class="flex items-center gap-1"><UsersIcon class="h-4 w-4" /> {{ project.bid_count || 0 }} propostas</span>
                  <span class="flex items-center gap-1"><CalendarDaysIcon class="h-4 w-4 text-accent-500" /> Termina em {{ formatTimeLeft(project.deadline) }}</span>
                </div>
                <div class="flex items-start justify-between gap-4">
                  <div class="space-y-1">
                    <h3 class="text-2xl font-semibold text-primary-900">{{ project.title }}</h3>
                    <p class="text-sm text-gray-600 line-clamp-3">{{ project.description }}</p>
                    <div class="flex flex-wrap gap-3 text-sm text-gray-600 pt-1">
                      <span class="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        <MapPinIcon class="h-4 w-4 text-accent-500" /> Remoto
                      </span>
                      <span class="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        <CalendarDaysIcon class="h-4 w-4 text-accent-500" /> Prazo {{ formatDateShort(project.deadline) }}
                      </span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-500">Orçamento</p>
                    <p class="text-2xl font-bold text-green-600">R$ {{ formatBudget(project.budget) }}</p>
                    <p v-if="project.lowest_bid_amount" class="text-xs text-gray-500 mt-1">Menor lance: R$ {{ formatBudget(project.lowest_bid_amount) }}</p>
                  </div>
                </div>
                <button
                  type="button"
                  @click="handleApplyProject(project.id)"
                  class="btn btn-primary w-full sm:w-auto"
                >
                  Ver leilão
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

    <!-- Lobby de Leilões Reversos -->
    <section class="bg-gradient-to-br from-amber-50 to-amber-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-sm text-amber-600 font-semibold uppercase tracking-wide">🎯 Coração da Plataforma</p>
          <h2 class="text-4xl lg:text-5xl font-bold text-primary-900 mb-4">
            Lobby de <span class="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Leilões Reversos</span>
          </h2>
          <p class="text-gray-700 text-lg max-w-3xl mx-auto">
            O Lobby é onde a mágica acontece! Acompanhe em tempo real todos os projetos abertos, propostas em disputa e negocie com transparência total.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Projetos em Tempo Real</h3>
            <p class="text-gray-600">Veja todos os projetos ativos, quantas propostas receberam e participe da disputa.</p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Filtros Inteligentes</h3>
            <p class="text-gray-600">Filtre por categoria, orçamento, prazo e status. Encontre exatamente o que procura.</p>
          </div>

          <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Ações Rápidas</h3>
            <p class="text-gray-600">Acesse Dashboard, crie projetos, veja sua carteira e contratos em um clique.</p>
          </div>
        </div>

        <div class="text-center">
          <router-link
            v-if="isAuthenticated"
            to="/lobby"
            class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition"
          >
            🎯 Acessar Lobby Agora
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
          <router-link
            v-else
            to="/register"
            class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition"
          >
            Cadastre-se para Acessar o Lobby
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Documentação -->
    <section class="bg-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <p class="text-sm text-green-600 font-semibold uppercase tracking-wide">📚 Central de Conhecimento</p>
          <h2 class="text-4xl lg:text-5xl font-bold text-primary-900 mb-4">
            Documentação <span class="bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">Completa</span>
          </h2>
          <p class="text-gray-700 text-lg max-w-3xl mx-auto">
            Aprenda como funciona cada recurso da plataforma com guias detalhados, exemplos práticos e FAQs.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <router-link
            to="/tutorial"
            class="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 hover:shadow-lg transition group"
          >
            <div class="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Tutorial Passo a Passo</h3>
            <p class="text-sm text-gray-600">Guia completo dividido para Contratantes e Prestadores</p>
          </router-link>

          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 hover:shadow-lg transition group cursor-pointer">
            <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Como Funciona o Escrow</h3>
            <p class="text-sm text-gray-600">Entenda a proteção de pagamentos e liberação de milestones</p>
          </div>

          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 hover:shadow-lg transition group cursor-pointer">
            <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Contratos & Milestones</h3>
            <p class="text-sm text-gray-600">Gerencie contratos, etapas e entregas com segurança</p>
          </div>

          <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 hover:shadow-lg transition group cursor-pointer">
            <div class="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">FAQ & Suporte</h3>
            <p class="text-sm text-gray-600">Dúvidas frequentes e como entrar em contato</p>
          </div>
        </div>

        <div class="mt-12 bg-gradient-to-r from-amber-600 to-amber-600 rounded-2xl p-8 text-white">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 class="text-2xl font-bold mb-2">📄 Comprovantes de Pagamento</h3>
              <p class="text-amber-100">Gere comprovantes em PDF (modelo RPA) de todas as suas transações e serviços executados. Ideal para declaração e contabilidade!</p>
            </div>
            <div class="flex gap-4">
              <div class="text-center">
                <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-sm font-semibold">RPA Digital</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <section class="bg-primary-900 py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Inscreva-se no nosso boletim</h2>
        <p class="text-gray-300 mb-8">Receba novidades das categorias, eventos e vagas urgentes da comunidade Kaddesh.</p>

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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import AdRail from '@/components/layout/AdRail.vue'
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
  CalendarDaysIcon,
  LockClosedIcon,
  UserPlusIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
// const toast = typeof window !== 'undefined' ? useToast() : null

const isAuthenticated = computed(() => authStore.isAuthenticated)

const searchKeyword = ref('')
const newsletterEmail = ref('')
const featuredProjects = ref([])
const loadingProjects = ref(false)
const activeBanners = ref([])
const loadingBanners = ref(false)

const heroStats = [
  { label: 'Talentos ativos', value: '12k+' },
  { label: 'Projetos financiados', value: '2.4k+' },
  { label: 'Contratantes verificados', value: '940+' }
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
    title: 'Design',
    description: 'Identidade visual e UX/UI',
    label: 'Creative',
    tagline: 'Interface e marca',
    slug: 'design',
    image: '/assets/images/category-design-real.jpg',
    icon: PaintBrushIcon,
    delay: '120ms'
  },
  {
    id: 3,
    title: 'Marketing',
    description: 'Growth, mídia paga e social',
    label: 'Trending',
    tagline: 'Performance',
    slug: 'marketing',
    image: '/assets/images/category-marketing.jpg',
    icon: MegaphoneIcon,
    delay: '200ms'
  },
  {
    id: 4,
    title: 'Redação',
    description: 'Conteúdo, roteiros e scripts',
    label: 'Conteúdo',
    tagline: 'Copy e roteiro',
    slug: 'redacao',
    image: '/assets/images/category-email-real.jpg',
    icon: CpuChipIcon,
    delay: '280ms'
  },
  {
    id: 5,
    title: 'Consultoria',
    description: 'Plano de crescimento e processos',
    label: 'Premium',
    tagline: 'Estratégia',
    slug: 'consultoria',
    image: '/assets/images/hero-business.jpg',
    icon: BriefcaseIcon,
    delay: '360ms'
  },
  {
    id: 6,
    title: 'Outros',
    description: 'Projetos especiais e sob demanda',
    label: 'Sob medida',
    tagline: 'Personalizado',
    slug: 'outros',
    image: '/assets/images/category-obras-real.jpg',
    gradient: 'linear-gradient(180deg, #2f3f55 0%, #0f1625 100%)',
    icon: BriefcaseIcon,
    delay: '440ms'
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
    description: 'Liberamos o pagamento assim que o Contratante aprova as entregas.',
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
      params: { status: 'open', per_page: 4, page: 1 },
      silent: true // Não mostrar toast de erro
    })

    const payload = Array.isArray(data) ? data : data?.projects || []
    featuredProjects.value = payload.slice(0, 4)
  } catch (error) {
    console.warn('Projetos em destaque não disponíveis:', error.message)
    // Silenciosamente define array vazio - não mostrar erro ao usuário
    featuredProjects.value = []
  } finally {
    loadingProjects.value = false
  }
}

// Mock de banners para fallback
const mockBanners = [
  {
    id: 'banner-1',
    title: '🎯 Projetos Premium',
    description: 'Encontre os melhores profissionais para projetos de alta qualidade com garantia de resultados.',
    link_url: '/auction-lobby',
    image_url: null,
    position: 'home_featured',
    slot_order: 1
  },
  {
    id: 'banner-2',
    title: '💎 Seja um Prestador Elite',
    description: 'Destaque-se no mercado, conquiste mais clientes e aumente seus ganhos como prestador premium.',
    link_url: '/provider-profile',
    image_url: null,
    position: 'home_featured',
    slot_order: 2
  },
  {
    id: 'banner-3',
    title: '🔒 Pagamentos 100% Seguros',
    description: 'Sistema de escrow com Mercado Pago. Seus pagamentos e projetos totalmente protegidos.',
    link_url: '/wallet',
    image_url: null,
    position: 'home_featured',
    slot_order: 3
  }
]

const fetchActiveBanners = async () => {
  loadingBanners.value = true
  try {
    const { data } = await api.get('/api/advertisements', {
      params: { position: 'home_featured' },
      silent: true
    })
    activeBanners.value = Array.isArray(data) ? data.slice(0, 3) : []
  } catch (error) {
    console.warn('Banners não disponíveis, usando mock:', error.message)
    // Usar banners mock como fallback
    activeBanners.value = mockBanners
  } finally {
    loadingBanners.value = false
  }
}

const trackBannerClick = async (bannerId) => {
  try {
    await api.post(`/api/advertisements/${bannerId}/click`, {}, { silent: true })
  } catch (error) {
    console.warn('Erro ao registrar clique no banner:', error.message)
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
    // toast?.info('Entre na sua conta para se candidatar a projetos.')
    router.push({ name: 'login', query: { redirect: `/projects/${projectId}` } })
    return
  }
  router.push({ name: 'project-detail', params: { id: projectId } })
}

const handleNewsletter = () => {
  if (!newsletterEmail.value.trim()) {
    return
  }
  // toast?.success('Obrigado! Você receberá nossas novidades em breve.')
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
  if (days > 0) return `${days}d`
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours > 0) return `${hours}h`
  const minutes = Math.floor(diff / (1000 * 60))
  return `${minutes}min`
}

const formatBudget = value => {
  if (!value) return '0,00'
  const numeric = typeof value === 'number' ? value : parseFloat(value)
  return numeric.toFixed(2).replace('.', ',')
}

const formatDateShort = date => {
  if (!date) return 'Sem prazo'
  try {
    return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  } catch {
    return 'Sem prazo'
  }
}

const getHeroImage = project => {
  const attachments = Array.isArray(project.attachments) ? project.attachments : []
  const firstImage = attachments.find(att => (att.mime_type || '').startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(att.original_name || ''))
  return firstImage?.file_url || null
}

const goToLogin = () => {
  router.push({ name: 'login', query: { redirect: '/lobby' } })
}

const goToRegister = () => {
  router.push({ name: 'register' })
}

onMounted(() => {
  fetchFeaturedProjects()
  fetchActiveBanners()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Lato:wght@400;500;600&display=swap');

.home-shell {
  background: #f5f5f5;
  color: #1a1a1a;
  font-family: 'Lato', 'Inter', system-ui, -apple-system, sans-serif;
}

.hero-section {
  background: #1a1a1a;
  color: #f5f5f5;
  position: relative;
}

.hero-container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 4rem 1rem 3rem;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3.5rem;
}

@media (min-width: 1024px) {
  .hero-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .hero-container {
    padding-top: 5rem;
    padding-bottom: 5rem;
  }
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.eyebrow {
  color: #d4af37;
  font-weight: 700;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.hero-title {
  font-family: 'Montserrat', 'Lato', sans-serif;
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  font-weight: 800;
  line-height: 1.1;
  color: #d4af37;
}

.hero-sub {
  color: #e5e5e5;
  font-size: 1.05rem;
  max-width: 680px;
}
.hero-sub.tagline {
  font-weight: 700;
  color: #d4af37;
}

.hero-search {
  background: rgba(245, 245, 245, 0.06);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 18px;
  padding: 1rem;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
}

.search-input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 2.75rem;
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.5);
  background: #0f0f0f;
  color: #f5f5f5;
}

.search-input::placeholder {
  color: #b8b8b8;
}

.cta-primary {
  background: #d4af37;
  color: #1a1a1a;
  padding: 0.9rem 1.4rem;
  border-radius: 12px;
  font-weight: 800;
  box-shadow: 0 12px 30px rgba(212, 175, 55, 0.35);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.cta-primary:hover {
  background: #c49c2f;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.hero-stat-card {
  background: rgba(245, 245, 245, 0.06);
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: 16px;
  padding: 1rem;
}

.hero-stat-label {
  color: #cfcfcf;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.hero-stat-value {
  color: #d4af37;
  font-size: 1.8rem;
  font-weight: 800;
}

.hero-visual {
  position: relative;
}

.hero-visual-glow {
  position: absolute;
  inset: -12px;
  border-radius: 28px;
  background: rgba(212, 175, 55, 0.12);
  filter: blur(32px);
}

.hero-visual-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  background: #0f0f0f;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45);
}

.hero-visual-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
  display: block;
}

.hero-visual-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), transparent);
}

.hero-visual-caption {
  color: #cfcfcf;
  font-size: 0.85rem;
}

.hero-visual-highlight {
  color: #d4af37;
  font-weight: 700;
  margin-top: 0.35rem;
}

.text-gold {
  color: #d4af37;
}

.text-offwhite-muted {
  color: #d0d0d0;
}

.bg-dark {
  background: #111111;
}

.bg-dark-80 {
  background: rgba(17, 17, 17, 0.85);
}

.shadow-gold {
  box-shadow: 0 12px 30px rgba(212, 175, 55, 0.35);
}
.cta-section {
  background: linear-gradient(180deg, #f8f8f8 0%, #ffffff 60%, #f4f0e8 100%);
  padding: 3.5rem 1rem;
}

.cta-shell {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cta-header {
  text-align: center;
  max-width: 760px;
  margin: 0 auto;
}

.cta-eyebrow {
  font-weight: 700;
  letter-spacing: 0.18em;
  color: #d4af37;
  text-transform: uppercase;
  font-size: 0.78rem;
}

.cta-heading {
  font-family: 'Montserrat', 'Lato', sans-serif;
  font-size: clamp(1.9rem, 3vw, 2.5rem);
  font-weight: 800;
  color: #1a1a1a;
  margin-top: 0.35rem;
}

.cta-subtext {
  color: #4a4a4a;
  margin-top: 0.5rem;
  line-height: 1.6;
}

.cta-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .cta-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.cta-card {
  background: radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.18), rgba(26, 26, 26, 0) 45%), #ffffff;
  border: 1px solid rgba(26, 26, 26, 0.06);
  border-radius: 24px;
  padding: 1.75rem;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cta-card.alt {
  background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
  border: 1px solid rgba(212, 175, 55, 0.4);
  color: #f5f5f5;
}

.cta-card__top {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.cta-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #d4af37, #c49c2f);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1a1a1a;
  box-shadow: 0 10px 24px rgba(212, 175, 55, 0.35);
}

.cta-icon.alt {
  background: linear-gradient(135deg, #3a8beb, #2d5da8);
  color: #f5f5f5;
  box-shadow: 0 10px 24px rgba(58, 139, 235, 0.35);
}

.cta-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: inherit;
}

.cta-text {
  color: inherit;
  opacity: 0.85;
  font-size: 0.98rem;
}

.cta-button {
  width: 100%;
  border-radius: 14px;
  padding: 0.95rem 1.1rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  border: none;
}

.cta-button.primary {
  background: linear-gradient(135deg, #d4af37, #c49c2f);
  color: #1a1a1a;
  box-shadow: 0 16px 36px rgba(212, 175, 55, 0.32);
}

.cta-button.secondary {
  background: linear-gradient(135deg, #2d2d2d, #1a1a1a);
  color: #f5f5f5;
  border: 1px solid rgba(212, 175, 55, 0.4);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
}
</style>








