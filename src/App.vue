<template>
  <div class="min-h-screen bg-neutral-50">
    
    <!-- ========================================== -->
    <!-- HEADER ÚNICO - SÓ APARECE QUANDO LOGADO -->
    <!-- ========================================== -->
    <nav v-if="isLoggedIn" class="bg-white border-b border-gray-300 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14">
          <!-- Logo -->
          <router-link to="/projects" class="flex items-center">
            <span class="text-sm font-semibold text-gray-900 tracking-wider uppercase">KADESH</span>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link v-if="!isAdmin" to="/projects" 
                         class="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              Projetos
            </router-link>

            <template v-if="isAdmin">
              <router-link to="/admin/dashboard" 
                           class="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                Dashboard
              </router-link>
              <router-link to="/admin/settings" 
                           class="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                Configurações
              </router-link>
            </template>
            
            <!-- Provider Links -->
            <template v-if="!isAdmin && canAccessProvider">
              <router-link to="/provider/profile" 
                           class="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                Perfil
              </router-link>
              <router-link to="/provider/portfolio" 
                           class="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
                Portfólio
              </router-link>
            </template>

            <!-- New Project Button (contractors only) -->
            <router-link v-if="!isAdmin && canCreateProjects" 
                         to="/projects/create" 
                         class="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 text-xs font-medium uppercase tracking-wide border border-gray-900 transition-colors">
              Novo Projeto
            </router-link>
          </div>

          <!-- User Info + Logout -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 px-3 py-2 border border-gray-300 bg-gray-50">
              <div class="w-6 h-6 bg-gray-800 flex items-center justify-center">
                <span class="text-white text-xs font-medium">{{ displayInitial }}</span>
              </div>
              <div class="hidden sm:block">
                <p class="text-xs font-medium text-gray-900">{{ displayName }}</p>
                <p class="text-xs text-gray-500">{{ roleInfo.label }}</p>
              </div>
            </div>
            
            <button @click="logout" 
                    class="text-gray-600 hover:text-gray-900 p-2 border border-transparent hover:border-gray-300 transition-colors"
                    title="Sair">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Bottom Navigation -->
        <div class="md:hidden border-t border-gray-300 py-3 flex justify-around items-center bg-gray-50">
          <router-link v-if="!isAdmin" to="/projects" 
                       class="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900 transition-colors px-3 py-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span class="text-xs font-medium">Projetos</span>
          </router-link>
          
          <!-- New Project (mobile - contractors) -->
          <router-link v-if="!isAdmin && canCreateProjects" 
                       to="/projects/create" 
                       class="flex flex-col items-center space-y-1 text-gray-900 hover:text-gray-950 transition-colors px-3 py-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span class="text-xs font-medium">Criar</span>
          </router-link>
          
          <!-- Provider Profile (mobile) -->
          <router-link v-if="!isAdmin && canAccessProvider" 
                       to="/provider/profile" 
                       class="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900 transition-colors px-3 py-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span class="text-xs font-medium">Perfil</span>
          </router-link>

          <!-- Admin Quick Links (mobile) -->
          <router-link v-if="isAdmin" to="/admin/dashboard" 
                       class="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-950 transition-colors px-3 py-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <span class="text-xs font-medium">Dashboard</span>
          </router-link>
          <router-link v-if="isAdmin" to="/admin/settings" 
                       class="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-900 transition-colors px-3 py-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="text-xs font-medium">Config</span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- HEADER PÚBLICO - Para página inicial e login -->
    <nav v-if="!isLoggedIn && showPublicHeader" class="bg-white border-b border-gray-300 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14">
          <!-- Logo -->
          <router-link to="/" class="flex items-center">
            <span class="text-sm font-semibold text-gray-900 tracking-wider uppercase">KADESH</span>
          </router-link>

          <!-- Navigation -->
          <div class="flex items-center space-x-8">
            <router-link to="/projects" 
                         class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Leilões
            </router-link>
            <router-link to="/login" 
                         class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Entrar
            </router-link>
            <router-link to="/register" 
                         class="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 text-xs font-medium uppercase tracking-wide border border-gray-900 transition-colors">
              Cadastrar
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <router-view @auth-change="fetchUser" />
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center mb-4 md:mb-0">
            <span class="text-xs font-semibold text-gray-300 tracking-wider uppercase">KADESH</span>
          </div>
          <div class="text-center md:text-right">
            <p class="text-xs text-gray-500">&copy; 2025 Kadesh - Plataforma de Leilões de Serviços</p>
            <div class="flex items-center justify-center md:justify-end space-x-4 mt-2">
              <router-link to="/admin/login" 
                           class="text-gray-600 hover:text-gray-400 text-xs transition-colors">
                Admin
              </router-link>
              <span class="text-gray-700">|</span>
              <a href="#" class="text-gray-600 hover:text-gray-400 text-xs transition-colors">
                Termos
              </a>
              <span class="text-gray-700">|</span>
              <a href="#" class="text-gray-600 hover:text-gray-400 text-xs transition-colors">
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
      return { label: ' Prestador', class: 'text-success-600' };
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
    console.log(' Usuário autenticado:', user.value);
  } catch (e) {
    // Se falhar, usuário não está autenticado
    user.value = null;
    console.log(' Nenhum usuário autenticado via API');
  }
  // Sempre sincroniza admin flag (login admin é separado do /api/user)
  syncAdminFromStorage();
  // Sincroniza usuário comum persistido
  syncUserFromStorage();
  
  // Debug: mostrar estado atual
  console.log(' Estado atual:', {
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




