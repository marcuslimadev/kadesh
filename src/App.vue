<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    
    <!-- ========================================== -->
    <!-- HEADER ÚNICO - SÓ APARECE QUANDO LOGADO -->
    <!-- ========================================== -->
  <nav v-if="isLoggedIn" class="bg-white shadow-lg border-b-2 border-indigo-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14 sm:h-16">
          <!-- Logo -->
          <router-link to="/projects" class="flex items-center space-x-2">
            <div class="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span class="text-white font-bold text-base sm:text-lg">K</span>
            </div>
            <span class="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Kadesh</span>
          </router-link>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-4">
            <router-link v-if="!isAdmin" to="/projects" class="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 transform">
              📋 Projetos
            </router-link>

            <template v-if="isAdmin">
              <router-link to="/admin/dashboard" class="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 transform">
                📊 Dashboard
              </router-link>
              <router-link to="/admin/settings" class="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 transform">
                ⚙️ Configurações
              </router-link>
            </template>
            
            <!-- Provider Links -->
            <template v-if="!isAdmin && canAccessProvider">
              <router-link to="/provider/profile" class="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 transform">
                📝 Meu Perfil
              </router-link>
              <router-link to="/provider/portfolio" class="text-gray-700 hover:text-purple-600 transition-all font-semibold hover:scale-105 transform">
                📸 Portfólio
              </router-link>
            </template>

            <!-- New Project Button (contractors only) -->
            <router-link v-if="!isAdmin && canCreateProjects" 
                         to="/projects/create" 
                         class="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600 text-white px-5 py-2 rounded-xl transition-all duration-200 font-bold text-sm shadow-md hover:shadow-lg transform hover:scale-105">
              + Novo Projeto
            </router-link>
          </div>

          <!-- User Info + Logout -->
          <div class="flex items-center space-x-3">
            <div class="flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 rounded-lg">
              <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                <span class="text-white text-sm font-bold">{{ displayInitial }}</span>
              </div>
              <div class="hidden sm:block">
                <p class="text-sm font-semibold text-gray-900">{{ displayName }}</p>
                <p class="text-xs font-medium" :class="roleInfo.class">
                  {{ roleInfo.label }}
                </p>
              </div>
            </div>
            
            <button @click="logout" 
                    class="text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all p-2 rounded-lg"
                    title="Sair">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Bottom Navigation -->
  <div class="md:hidden border-t border-indigo-100 py-2 flex justify-around items-center">
          <router-link v-if="!isAdmin" to="/projects" class="flex flex-col items-center space-y-1 text-gray-600 hover:text-purple-600 transition-colors px-3 py-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span class="text-xs font-semibold">Projetos</span>
          </router-link>
          
          <!-- New Project (mobile - contractors) -->
          <router-link v-if="!isAdmin && canCreateProjects" 
                       to="/projects/create" 
                       class="flex flex-col items-center space-y-1 text-green-600 hover:text-green-700 transition-colors px-3 py-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span class="text-xs font-semibold">Criar</span>
          </router-link>
          
          <!-- Provider Profile (mobile) -->
          <router-link v-if="!isAdmin && canAccessProvider" 
                       to="/provider/profile" 
                       class="flex flex-col items-center space-y-1 text-gray-600 hover:text-purple-600 transition-colors px-3 py-1">
            <span class="text-lg">📝</span>
            <span class="text-xs font-semibold">Perfil</span>
          </router-link>

          <!-- Admin Quick Links (mobile) -->
          <router-link v-if="isAdmin" to="/admin/dashboard" class="flex flex-col items-center space-y-1 text-gray-600 hover:text-purple-600 transition-colors px-3 py-1">
            <span class="text-lg">📊</span>
            <span class="text-xs font-semibold">Dashboard</span>
          </router-link>
          <router-link v-if="isAdmin" to="/admin/settings" class="flex flex-col items-center space-y-1 text-amber-600 hover:text-amber-700 transition-colors px-3 py-1">
            <span class="text-lg">⚙️</span>
            <span class="text-xs font-semibold">Configuração</span>
          </router-link>
        </div>
      </div>
    </nav>

    <main>
      <router-view @auth-change="fetchUser" />
    </main>
    
    <!-- Admin Link (discreto no footer) -->
    <footer class="bg-gray-900 text-gray-400 py-4 text-center text-xs">
      <p>&copy; 2025 Kadesh - Plataforma de Serviços</p>
      <router-link to="/admin/login" class="text-gray-600 hover:text-gray-400 mt-1 inline-block">Admin</router-link>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from './services/api';
import { useRouter } from 'vue-router';

const router = useRouter();
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
const roleInfo = computed(() => {
  if (!userRole.value) {
    return { label: '', class: 'text-gray-500' };
  }

  switch (userRole.value) {
    case 'contractor':
      return { label: '👔 Contratante', class: 'text-indigo-600' };
    case 'provider':
      return { label: '⚡ Prestador', class: 'text-purple-600' };
    case 'both':
      return { label: '🔄 Contratante & Prestador', class: 'text-emerald-600' };
    case 'admin':
      return { label: '🛠️ Administrador', class: 'text-amber-600' };
    default:
      return { label: 'Usuário', class: 'text-gray-600' };
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
  router.push('/login');
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
