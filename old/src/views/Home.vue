<template>
  <div class="min-h-screen bg-white overflow-hidden">
    <!-- Navbar com efeito glass morphism -->
    <nav class="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 transition-all duration-300" :class="{ 'shadow-xl bg-white': scrolled }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center animate-fade-in-down">
            <img src="/assets/image/logo.png" alt="Kaddesh" class="h-12 transition-transform duration-300 hover:scale-110">
          </div>
          <div class="hidden md:flex items-center gap-8 animate-fade-in-down animation-delay-200">
            <router-link to="/" class="text-gray-700 hover:text-red-600 font-medium transition-all duration-300 hover:scale-110">Início</router-link>
            <router-link to="/auctions" class="text-gray-700 hover:text-red-600 font-medium transition-all duration-300 hover:scale-110">Leilões</router-link>
            <router-link to="/login" class="text-gray-700 hover:text-red-600 font-medium transition-all duration-300 hover:scale-110">Entrar</router-link>
            <router-link to="/register" class="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              Cadastre-se
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Banner com animações e partículas -->
    <section class="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
      <!-- Partículas animadas de fundo -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-96 h-96 bg-accent-500/10 rounded-full blur-3xl -top-48 -left-48 animate-blob"></div>
        <div class="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-blob animation-delay-2000"></div>
        <div class="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-1/2 left-1/2 animate-blob animation-delay-4000"></div>
      </div>
      
      <!-- Grid pattern animado -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0 bg-grid-pattern animate-grid-scroll"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-6 animate-slide-in-left">
            <h1 class="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Seja você um <span class="text-accent-500 animate-gradient-text bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600 bg-clip-text text-transparent">Kaddesh</span>
            </h1>
            <p class="text-2xl lg:text-3xl font-semibold text-accent-400 mb-6 animate-fade-in animation-delay-300">
              Melhores profissionais ou talentos
            </p>
            <p class="text-lg text-gray-200 mb-8 animate-fade-in animation-delay-500">
              Em busca de oportunidades, nossa plataforma de leilões de serviços profissionais é o seu destino certo. Com recursos de segurança robustos e uma comunidade de confiança, estamos aqui para impulsionar o seu sucesso.
            </p>
            
            <!-- Search Form com efeito glassmorphism -->
            <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 animate-fade-in-up animation-delay-700 hover:shadow-accent-500/20 hover:shadow-3xl transition-all duration-500">
              <div class="flex flex-col md:flex-row gap-3">
                <div class="flex-1">
                  <div class="relative group">
                    <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 group-focus-within:text-accent-500"></i>
                    <input 
                      type="text" 
                      v-model="searchKeyword"
                      placeholder="Pesquise com palavra-chave" 
                      class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-300"
                    >
                  </div>
                </div>
                <button 
                  @click="handleSearch"
                  class="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-primary-900 px-8 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-accent-500/50 relative overflow-hidden group"
                >
                  <span class="relative z-10">Procure agora <i class="fas fa-search ml-2"></i></span>
                  <div class="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>
            </div>
          </div>
          
          <div class="hidden lg:block animate-slide-in-right">
            <div class="relative">
              <!-- Círculo decorativo animado -->
              <div class="absolute -inset-4 bg-gradient-to-r from-accent-500/20 to-blue-500/20 rounded-3xl blur-2xl animate-pulse-slow"></div>
              <img 
                src="https://kaddeshsolucoes.com.br/wp-content/uploads/2024/07/business-people-shaking-hands-together_53876-13391.avif" 
                alt="Business people" 
                class="relative rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 hover:shadow-accent-500/30"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Wave separator -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg class="w-full h-24 text-gray-50" preserveAspectRatio="none" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 74L60 61.8C120 49.7 240 25.3 360 16.5C480 7.7 600 14.3 720 24.7C840 35 960 49 1080 53.2C1200 57.3 1320 51.7 1380 48.8L1440 46V74H1380C1320 74 1200 74 1080 74C960 74 840 74 720 74C600 74 480 74 360 74C240 74 120 74 60 74H0Z" fill="currentColor"/>
        </svg>
      </div>
    </section>

    <!-- Categorias Populares com animações de entrada -->
    <section class="bg-gradient-to-b from-gray-50 to-white py-20 relative">
      <!-- Elementos decorativos flutuantes -->
      <div class="absolute top-20 left-10 w-20 h-20 bg-accent-500/10 rounded-full blur-xl animate-float"></div>
      <div class="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-float animation-delay-2000"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-16 animate-fade-in-up">
          <h3 class="text-sm text-accent-500 font-semibold uppercase tracking-wide mb-3 animate-fade-in">Vamos começar rapidamente hoje</h3>
          <h2 class="text-4xl lg:text-5xl font-bold text-primary-900 mb-4 animate-fade-in animation-delay-200">
            Vamos explorar <span class="bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent">categorias populares</span>
          </h2>
          <p class="text-gray-600 text-lg max-w-3xl mx-auto animate-fade-in animation-delay-400">
            Encontre os melhores profissionais para o seu projeto em nossa plataforma segura de leilões de serviços.
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <!-- Card 1: Desenvolvimento Web -->
          <div class="category-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 animate-fade-in-up" style="animation-delay: 0ms">
            <div class="relative h-56 overflow-hidden">
              <img src="https://kaddeshsolucoes.com.br/wp-content/uploads/2024/07/11.jpg" alt="Desenvolvimento Web" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-5 transition-all duration-300 group-hover:from-black/90">
                <div class="text-white transform transition-all duration-300 group-hover:translate-y-[-4px]">
                  <i class="fas fa-code text-accent-500 text-3xl mb-3 block animate-bounce-slow"></i>
                  <h4 class="font-bold text-lg">Desenvolvimento Web</h4>
                  <p class="text-xs text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Sites e aplicações modernas</p>
                </div>
              </div>
              <div class="absolute top-0 right-0 bg-accent-500 text-primary-900 px-3 py-1 rounded-bl-xl font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Popular
              </div>
            </div>
          </div>

          <!-- Card 2: Marketing Digital -->
          <div class="category-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 animate-fade-in-up" style="animation-delay: 100ms">
            <div class="relative h-56 overflow-hidden">
              <img src="https://kaddeshsolucoes.com.br/wp-content/uploads/2024/07/12-1.jpg" alt="Marketing Digital" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-5 transition-all duration-300 group-hover:from-black/90">
                <div class="text-white transform transition-all duration-300 group-hover:translate-y-[-4px]">
                  <i class="fas fa-bullhorn text-accent-500 text-3xl mb-3 block animate-bounce-slow animation-delay-200"></i>
                  <h4 class="font-bold text-lg">Marketing Digital</h4>
                  <p class="text-xs text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Estratégias de crescimento</p>
                </div>
              </div>
              <div class="absolute top-0 right-0 bg-accent-500 text-primary-900 px-3 py-1 rounded-bl-xl font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Trending
              </div>
            </div>
          </div>

          <!-- Card 3: Design Gráfico -->
          <div class="category-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 animate-fade-in-up" style="animation-delay: 200ms">
            <div class="relative h-56 overflow-hidden">
              <img src="https://kaddeshsolucoes.com.br/wp-content/uploads/2024/07/13-1.jpg" alt="Design Gráfico" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-5 transition-all duration-300 group-hover:from-black/90">
                <div class="text-white transform transition-all duration-300 group-hover:translate-y-[-4px]">
                  <i class="fas fa-paint-brush text-accent-500 text-3xl mb-3 block animate-bounce-slow animation-delay-400"></i>
                  <h4 class="font-bold text-lg">Design Gráfico</h4>
                  <p class="text-xs text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Identidade visual criativa</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 4: Programação -->
          <div class="category-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 animate-fade-in-up" style="animation-delay: 300ms">
            <div class="relative h-56 overflow-hidden">
              <img src="https://kaddeshsolucoes.com.br/wp-content/uploads/2024/07/14-1.jpg" alt="Programação" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-5 transition-all duration-300 group-hover:from-black/90">
                <div class="text-white transform transition-all duration-300 group-hover:translate-y-[-4px]">
                  <i class="fas fa-laptop-code text-accent-500 text-3xl mb-3 block animate-bounce-slow animation-delay-600"></i>
                  <h4 class="font-bold text-lg">Programação</h4>
                  <p class="text-xs text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Soluções sob medida</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 5: Business -->
          <div class="category-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-3 animate-fade-in-up" style="animation-delay: 400ms">
            <div class="relative h-56 overflow-hidden">
              <img src="https://kaddeshsolucoes.com.br/wp-content/uploads/2022/06/Buisess-development.jpg" alt="Business" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-5 transition-all duration-300 group-hover:from-black/90">
                <div class="text-white transform transition-all duration-300 group-hover:translate-y-[-4px]">
                  <i class="fas fa-briefcase text-accent-500 text-3xl mb-3 block animate-bounce-slow animation-delay-800"></i>
                  <h4 class="font-bold text-lg">Business</h4>
                  <p class="text-xs text-gray-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Consultoria estratégica</p>
                </div>
              </div>
              <div class="absolute top-0 right-0 bg-accent-500 text-primary-900 px-3 py-1 rounded-bl-xl font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Hot
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mobile App Section com parallax -->
    <section class="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-24 overflow-hidden">
      <!-- Elementos decorativos com parallax -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute w-64 h-64 bg-accent-500/10 rounded-full blur-3xl top-10 right-20 animate-float-slow"></div>
        <div class="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl bottom-10 left-20 animate-float-slow animation-delay-3000"></div>
      </div>
      
      <!-- Pattern animado -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0 bg-grid-pattern animate-grid-scroll"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="text-white space-y-6 animate-slide-in-left">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-accent-500 mb-2 animate-fade-in">Leve seu trabalho em movimento</h3>
            <h2 class="text-4xl lg:text-5xl font-bold leading-tight animate-fade-in animation-delay-200">
              Aproveite a <span class="bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent animate-gradient-text">experiência definitiva</span>
            </h2>
            <p class="text-lg lg:text-xl text-gray-200 leading-relaxed animate-fade-in animation-delay-400">
              Destaque suas habilidades e conquiste novas oportunidades em nossa plataforma de leilões de serviços profissionais.
            </p>
            
            <div class="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 animate-fade-in animation-delay-600 hover:bg-white/20 transition-all duration-300">
              <div class="bg-accent-500 rounded-lg p-3 animate-pulse-slow">
                <i class="fas fa-bell text-primary-900 text-xl"></i>
              </div>
              <div>
                <p class="font-medium mb-1">Notificações em Tempo Real</p>
                <p class="text-sm text-gray-300">Este aplicativo é compatível com dispositivos Android e iOS</p>
              </div>
            </div>

            <div class="flex gap-4 mt-8 animate-fade-in animation-delay-800">
              <button class="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                <i class="fab fa-apple text-2xl"></i>
                <div class="text-left text-sm">
                  <div class="text-xs opacity-75">Download on the</div>
                  <div class="font-bold">App Store</div>
                </div>
              </button>
              <button class="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                <i class="fab fa-google-play text-2xl"></i>
                <div class="text-left text-sm">
                  <div class="text-xs opacity-75">Get it on</div>
                  <div class="font-bold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          <div class="flex justify-center lg:justify-end animate-slide-in-right">
            <div class="relative">
              <!-- Círculo decorativo pulsante -->
              <div class="absolute inset-0 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow scale-110"></div>
              <img 
                src="https://kaddeshsolucoes.com.br/wp-content/uploads/2024/07/mobile.png" 
                alt="Mobile App" 
                class="relative max-w-md w-full animate-float transform hover:scale-105 transition-transform duration-500"
              >
              <!-- Elementos flutuantes ao redor do celular -->
              <div class="absolute top-10 -left-10 bg-accent-500 rounded-full p-4 shadow-xl animate-bounce-slow">
                <i class="fas fa-check text-white text-xl"></i>
              </div>
              <div class="absolute bottom-20 -right-10 bg-blue-500 rounded-full p-4 shadow-xl animate-bounce-slow animation-delay-1000">
                <i class="fas fa-star text-white text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projetos em Destaque (DADOS REAIS DO BANCO) -->
    <section class="bg-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h3 class="text-sm text-accent-500 font-semibold uppercase tracking-wide mb-2">Quer começar a trabalhar?</h3>
            <h2 class="text-4xl font-bold text-primary-900">Aplique os projetos mais bem avaliados</h2>
          </div>
          <router-link to="/auctions" class="text-accent-500 hover:text-accent-600 font-semibold flex items-center gap-2">
            Todos os empregos <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>

        <LoadingScreen :show="loading" message="Carregando projetos..." icon="🎯" />

        <div v-if="!loading && featuredProjects.length > 0" class="space-y-6">
          <div 
            v-for="project in featuredProjects" 
            :key="project.id"
            class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div class="flex flex-col md:flex-row justify-between gap-6">
              <div class="flex-1">
                <div class="flex items-start gap-4 mb-4">
                  <div class="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                    <img src="https://kaddeshsolucoes.com.br/wp-content/uploads/2024/08/LogoSample_ByTailorBrands__1_-1724095217.jpg" alt="Logo" class="w-full h-full object-cover rounded-lg">
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="px-2 py-1 bg-accent-500 text-primary-900 text-xs font-bold rounded">⚡ DESTAQUE</span>
                      <span class="text-sm text-gray-600">Postado {{ formatDate(project.created_at) }}</span>
                    </div>
                    <h3 class="text-xl font-bold text-primary-900 mb-2">{{ project.title }}</h3>
                    <p class="text-gray-600 line-clamp-2 mb-4">{{ project.description }}</p>
                    
                    <div class="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span><i class="fas fa-calendar text-accent-500"></i> {{ formatTimeLeft(project.bidding_ends_at) }}</span>
                      <span><i class="fas fa-map-marker-alt text-accent-500"></i> Remoto</span>
                      <span><i class="fas fa-users text-accent-500"></i> {{ project.bids_count || 0 }} freelancers</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col justify-between md:w-64">
                <div class="mb-4">
                  <div class="text-sm text-gray-600 mb-1">Projeto preço fixo</div>
                  <div class="text-2xl font-bold text-green-600">R$ {{ parseFloat(project.max_budget).toFixed(2) }}</div>
                </div>
                <button 
                  @click="handleApplyProject(project.id)"
                  class="w-full bg-accent-500 hover:bg-accent-600 text-primary-900 font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Inscreva-se agora
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="!loading" class="text-center py-12 text-gray-500">
          <i class="fas fa-briefcase text-6xl mb-4 opacity-30"></i>
          <p>Nenhum projeto disponível no momento. Cadastre-se para ser notificado!</p>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="bg-primary-900 py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 class="text-3xl font-bold text-white mb-4">Inscreva-se no nosso boletim</h3>
        <p class="text-gray-300 mb-8">Inscreva-se agora para fazer parte desta incrível comunidade!</p>
        
        <form @submit.prevent="handleNewsletter" class="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <div class="flex-1">
            <input 
              type="email" 
              v-model="newsletterEmail"
              placeholder="Adicione seu e-mail" 
              class="w-full px-6 py-4 rounded-lg focus:ring-2 focus:ring-accent-500"
              required
            >
          </div>
          <button type="submit" class="bg-accent-500 hover:bg-accent-600 text-primary-900 px-8 py-4 rounded-lg font-bold whitespace-nowrap">
            Cadastre-se agora <i class="fas fa-paper-plane ml-2"></i>
          </button>
        </form>
        
        <p class="text-sm text-gray-400 mt-4">Não fique desatualizado, mantenha-se atualizado com nossa newsletter mensal.</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-primary-900 border-t border-gray-800 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src="/assets/image/logo.png" alt="Kaddesh" class="h-12 mb-4">
            <p class="text-gray-400 text-sm">
              Na Kaddesh Soluções Profissionais, estamos comprometidos em tornar a busca e a execução de serviços mais eficientes.
            </p>
          </div>

          <div>
            <h4 class="text-white font-bold mb-4">Links úteis</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><router-link to="/" class="hover:text-accent-500">Início</router-link></li>
              <li><router-link to="/auctions" class="hover:text-accent-500">Leilões</router-link></li>
              <li><router-link to="/login" class="hover:text-accent-500">Entrar</router-link></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-4">Suporte</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-accent-500">Políticas de privacidade</a></li>
              <li><a href="#" class="hover:text-accent-500">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-4">Contato</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><i class="fas fa-phone text-accent-500"></i> +55 31 99188-7791</li>
              <li><i class="fab fa-whatsapp text-accent-500"></i> +55 31 99188-7791</li>
              <li><i class="fas fa-map-marker-alt text-accent-500"></i> Belo Horizonte, MG</li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Kaddesh. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import LoadingScreen from '@/components/LoadingScreen.vue'

const router = useRouter()

const searchKeyword = ref('')
const newsletterEmail = ref('')
const featuredProjects = ref([])
const loading = ref(false)
const scrolled = ref(false)

// Scroll handler para navbar
const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

// Buscar projetos reais do banco
const fetchFeaturedProjects = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/projects?status=open', {
      withCredentials: true
    })
    
    // Pegar os primeiros 4 projetos
    featuredProjects.value = Array.isArray(response.data) 
      ? response.data.slice(0, 4) 
      : (response.data.projects || []).slice(0, 4)
  } catch (error) {
    console.error('Erro ao buscar projetos:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/auctions?keyword=${encodeURIComponent(searchKeyword.value)}`)
  } else {
    router.push('/auctions')
  }
}

const handleApplyProject = (projectId) => {
  // Redirecionar para login se não estiver logado
  const user = localStorage.getItem('kadesh_user')
  if (!user) {
    alert('Você precisa fazer login como fornecedor para se inscrever neste projeto.')
    router.push('/login')
  } else {
    router.push(`/auction/${projectId}`)
  }
}

const handleNewsletter = () => {
  alert(`Obrigado! Email ${newsletterEmail.value} cadastrado com sucesso!`)
  newsletterEmail.value = ''
}

const formatDate = (dateString) => {
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

const formatTimeLeft = (endsAt) => {
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

onMounted(() => {
  fetchFeaturedProjects()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
