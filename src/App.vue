<template>
  <div class="min-h-screen bg-neutral-50">
    
    <!-- ========================================== -->
    <!-- HEADER ÚNICO - SÓ APARECE QUANDO LOGADO -->
    <!-- ========================================== -->
    <nav v-if="isLoggedIn" class="bg-white shadow-lg border-b border-neutral-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14 sm:h-16">
          <!-- Logo -->
          <router-link to="/projects" class="flex items-center space-x-3">
            <div class="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white font-bold text-base sm:text-lg">K</span>
            </div>
            <span class="text-lg sm:text-xl font-bold text-primary-900">Kadesh</span>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-6">
            <router-link v-if="!isAdmin" to="/projects" 
                         class="text-neutral-700 hover:text-primary-600 transition-all font-semibold hover:scale-105 transform flex items-center gap-2">
              <span class="text-lg">📋</span> Projetos
            </router-link>

            <template v-if="isAdmin">
              <router-link to="/admin/dashboard" 
                           class="text-neutral-700 hover:text-primary-600 transition-all font-semibold hover:scale-105 transform flex items-center gap-2">
                <span class="text-lg">📊</span> Dashboard
              </router-link>
              <router-link to="/admin/settings" 
                           class="text-neutral-700 hover:text-warning-600 transition-all font-semibold hover:scale-105 transform flex items-center gap-2">
                <span class="text-lg">⚙️</span> Configurações
              </router-link>
            </template>
            
            <!-- Provider Links -->
            <template v-if="!isAdmin && canAccessProvider">
              <router-link to="/provider/profile" 
                           class="text-neutral-700 hover:text-success-600 transition-all font-semibold hover:scale-105 transform flex items-center gap-2">
                <span class="text-lg">�</span> Meu Perfil
              </router-link>
              <router-link to="/provider/portfolio" 
                           class="text-neutral-700 hover:text-success-600 transition-all font-semibold hover:scale-105 transform flex items-center gap-2">
                <span class="text-lg">📸</span> Portfólio
              </router-link>
            </template>

            <!-- New Project Button (contractors only) -->
            <router-link v-if="!isAdmin && canCreateProjects" 
                         to="/projects/create" 
                         class="bg-gradient-success hover:opacity-90 text-white px-5 py-2 rounded-xl transition-all duration-200 font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
              + Novo Projeto
            </router-link>
          </div>

          <!-- User Info + Logout -->
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-2 bg-gradient-to-r from-neutral-50 to-primary-50 px-3 py-2 rounded-lg border border-neutral-200">
              <div class="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-md">
                <span class="text-white text-sm font-bold">{{ displayInitial }}</span>
              </div>
              <div class="hidden sm:block">
                <p class="text-sm font-semibold text-neutral-900">{{ displayName }}</p>
                <p class="text-xs font-medium" :class="roleInfo.class">
                  {{ roleInfo.label }}
                </p>
              </div>
            </div>
            
            <button @click="logout" 
                    class="text-danger-500 hover:text-danger-600 hover:bg-danger-50 transition-all p-2 rounded-lg"
                    title="Sair">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Bottom Navigation -->
        <div class="md:hidden border-t border-neutral-200 py-2 flex justify-around items-center">
          <router-link v-if="!isAdmin" to="/projects" 
                       class="flex flex-col items-center space-y-1 text-neutral-600 hover:text-primary-600 transition-colors px-3 py-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span class="text-xs font-semibold">Projetos</span>
          </router-link>
          
          <!-- New Project (mobile - contractors) -->
          <router-link v-if="!isAdmin && canCreateProjects" 
                       to="/projects/create" 
                       class="flex flex-col items-center space-y-1 text-success-600 hover:text-success-700 transition-colors px-3 py-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span class="text-xs font-semibold">Criar</span>
          </router-link>
          
          <!-- Provider Profile (mobile) -->
          <router-link v-if="!isAdmin && canAccessProvider" 
                       to="/provider/profile" 
                       class="flex flex-col items-center space-y-1 text-neutral-600 hover:text-success-600 transition-colors px-3 py-1">
            <span class="text-lg">�</span>
            <span class="text-xs font-semibold">Perfil</span>
          </router-link>

          <!-- Admin Quick Links (mobile) -->
          <router-link v-if="isAdmin" to="/admin/dashboard" 
                       class="flex flex-col items-center space-y-1 text-neutral-600 hover:text-primary-600 transition-colors px-3 py-1">
            <span class="text-lg">📊</span>
            <span class="text-xs font-semibold">Dashboard</span>
          </router-link>
          <router-link v-if="isAdmin" to="/admin/settings" 
                       class="flex flex-col items-center space-y-1 text-warning-600 hover:text-warning-700 transition-colors px-3 py-1">
            <span class="text-lg">⚙️</span>
            <span class="text-xs font-semibold">Config</span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- HEADER PÚBLICO - Para página inicial e login -->
    <nav v-if="!isLoggedIn && showPublicHeader" class="bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white font-bold text-lg">K</span>
            </div>
            <span class="text-xl font-bold text-primary-900">Kadesh</span>
          </router-link>

          <!-- Navigation -->
          <div class="flex items-center space-x-6">
            <router-link to="/projects" 
                         class="text-neutral-700 hover:text-primary-600 font-semibold transition-colors">
              Leilões
            </router-link>
            <router-link to="/login" 
                         class="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              Entrar
            </router-link>
            <router-link to="/register" 
                         class="bg-gradient-primary hover:opacity-90 text-white px-6 py-2 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Cadastrar
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <router-view @auth-change="fetchUser" />
    </main>
    
    <!-- Footer moderno -->
    <footer class="bg-neutral-900 text-neutral-400 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center space-x-3 mb-4 md:mb-0">
            <div class="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">K</span>
            </div>
            <span class="text-lg font-bold text-white">Kadesh</span>
          </div>
          <div class="text-center md:text-right">
            <p class="text-sm">&copy; 2025 Kadesh - Plataforma de Leilões de Serviços</p>
            <div class="flex items-center justify-center md:justify-end space-x-4 mt-2">
              <router-link to="/admin/login" 
                           class="text-neutral-600 hover:text-neutral-400 text-xs transition-colors">
                Admin
              </router-link>
              <span class="text-neutral-600">•</span>
              <a href="#" class="text-neutral-600 hover:text-neutral-400 text-xs transition-colors">
                Termos
              </a>
              <span class="text-neutral-600">•</span>
              <a href="#" class="text-neutral-600 hover:text-neutral-400 text-xs transition-colors">
                Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from './services/api';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const user = ref(null);

// Admin state from storage (admin login não cria sessão /api/user)
const adminFlag = ref(
  (typeof localStorage !== 'undefined' && localStorage.getItem('isAdmin') === 'true') ||
  (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true')
);
const adminName = ref(
  (typeof localStorage !== 'undefined' && localStorage.getItem('adminName')) ||
  (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('adminName')) ||
  ''
);

// Fallback para usuário comum (quando API /api/user não está disponível)
const storedUserFlag = ref(
  (typeof localStorage !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true') ||
  (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('isLoggedIn') === 'true')
);
const storedUserName = ref(
  (typeof localStorage !== 'undefined' && localStorage.getItem('userName')) ||
  (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('userName')) ||
  ''
);
const storedUserType = ref(
  (typeof localStorage !== 'undefined' && localStorage.getItem('userType')) ||
  (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('userType')) ||
  ''
);

const userRole = computed(() => {
  if (adminFlag.value) return 'admin';
  if (user.value?.user_type) return user.value.user_type;
  if (storedUserFlag.value && storedUserType.value) return storedUserType.value;
  return null;
});

const isAdmin = computed(() => userRole.value === 'admin');
const isContractor = computed(() => userRole.value === 'contractor');
const isProvider = computed(() => userRole.value === 'provider');
const isBoth = computed(() => userRole.value === 'both');
const canCreateProjects = computed(() => isContractor.value || isBoth.value);
const canAccessProvider = computed(() => isProvider.value || isBoth.value);
const isLoggedIn = computed(() => !!user.value || isAdmin.value || storedUserFlag.value);
const displayName = computed(() => user.value?.name || adminName.value || storedUserName.value || 'Usuário');
const displayInitial = computed(() => (displayName.value?.charAt(0) || 'U').toUpperCase());

// Mostrar header público apenas em certas rotas
const showPublicHeader = computed(() => {
  const publicRoutes = ['/', '/login', '/register', '/projects'];
  return publicRoutes.includes(route.path) || route.path.startsWith('/projects/');
});

const roleInfo = computed(() => {
  if (!userRole.value) {
    return { label: '', class: 'text-neutral-500' };
  }

  switch (userRole.value) {
    case 'contractor':
      return { label: '👔 Contratante', class: 'text-primary-600' };
    case 'provider':
      return { label: '⚡ Prestador', class: 'text-success-600' };
    case 'both':
      return { label: '🔄 Contratante & Prestador', class: 'text-warning-600' };
    case 'admin':
      return { label: '🛠️ Administrador', class: 'text-danger-600' };
    default:
      return { label: 'Usuário', class: 'text-neutral-600' };
  }
});

function syncAdminFromStorage() {
  try {
    const lsAdmin = typeof localStorage !== 'undefined' && localStorage.getItem('isAdmin') === 'true';
    const ssAdmin = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true';
    adminFlag.value = !!(lsAdmin || ssAdmin);
    const name = (typeof localStorage !== 'undefined' && localStorage.getItem('adminName'))
      || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('adminName'))
      || '';
    adminName.value = name;
  } catch (_) {}
}

function syncUserFromStorage() {
  try {
    const lsLogged = typeof localStorage !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';
    const ssLogged = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('isLoggedIn') === 'true';
    storedUserFlag.value = !!(lsLogged || ssLogged);
    const nm = (typeof localStorage !== 'undefined' && localStorage.getItem('userName'))
      || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('userName'))
      || '';
    const tp = (typeof localStorage !== 'undefined' && localStorage.getItem('userType'))
      || (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('userType'))
      || '';
    storedUserName.value = nm;
    storedUserType.value = tp;
  } catch (_) {}
}

async function fetchUser() {
  try {
    const { data } = await api.get('/api/user');
    user.value = data.user; // Backend retorna { user: {...} }
    console.log('✅ Usuário autenticado:', user.value);
  } catch (e) {
    // Se falhar, usuário não está autenticado
    user.value = null;
    console.log('❌ Nenhum usuário autenticado via API');
  }
  // Sempre sincroniza admin flag (login admin é separado do /api/user)
  syncAdminFromStorage();
  // Sincroniza usuário comum persistido
  syncUserFromStorage();
  
  // Debug: mostrar estado atual
  console.log('📊 Estado atual:', {
    user: user.value,
    isAdmin: isAdmin.value,
    isLoggedIn: isLoggedIn.value,
    storedUser: storedUserFlag.value,
    displayName: displayName.value,
    userRole: userRole.value
  });
}

async function logout() {
  // Se for admin-only (sem usuário autenticado), apenas limpar storage
  if (isAdmin.value && !user.value) {
    try {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminName');
      sessionStorage.removeItem('isAdmin');
      sessionStorage.removeItem('adminName');
    } catch (_) {}
    adminFlag.value = false;
    adminName.value = '';
    router.push('/admin/login');
    return;
  }

  // Usuário autenticado pela API
  try {
    await api.post('/api/logout');
  } catch (e) {
    console.error('Erro ao fazer logout:', e);
  }
  user.value = null;
  try {
    sessionStorage.clear();
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminName');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
  } catch (_) {}
  adminFlag.value = false;
  adminName.value = '';
  storedUserFlag.value = false;
  storedUserName.value = '';
  storedUserType.value = '';
  router.push('/');
}

onMounted(() => {
  fetchUser();
  // Escuta mudanças entre abas no estado admin
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === 'isAdmin' || e.key === 'adminName') {
        syncAdminFromStorage();
      }
      if (e.key === 'isLoggedIn' || e.key === 'userName' || e.key === 'userType') {
        syncUserFromStorage();
      }
    });
  }
  // Atualiza usuário após cada navegação (ex: após login)
  try {
    router.afterEach(() => {
      fetchUser();
    });
  } catch (_) {}
});
</script>
