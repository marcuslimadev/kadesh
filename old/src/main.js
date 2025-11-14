import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import views
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Dashboard from './views/Dashboard.vue'
import AuctionsMarketplace from './views/AuctionsMarketplace.vue'
import AuctionDetail from './views/AuctionDetail.vue'
import MyBids from './views/MyBids.vue'
import Wallet from './views/Wallet.vue'
import CreateProject from './views/CreateProject.vue'
import ProviderProfile from './views/ProviderProfile.vue'
import Notifications from './views/Notifications.vue'
import ProjectDetail from './views/ProjectDetail.vue'
import MyProjects from './views/MyProjects.vue'

// Admin views
import AdminDashboard from './views/admin/AdminDashboard.vue'
import AdminUsers from './views/admin/AdminUsers.vue'
import AdminProjects from './views/admin/AdminProjects.vue'
import AdminPayments from './views/admin/AdminPayments.vue'
import AdminSettings from './views/admin/AdminSettings.vue'
import AdminDisputes from './views/admin/AdminDisputes.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/auctions', name: 'AuctionsMarketplace', component: AuctionsMarketplace, meta: { requiresAuth: true } },
  { path: '/auction/:id', name: 'AuctionDetail', component: AuctionDetail, meta: { requiresAuth: true } },
  { path: '/my-bids', name: 'MyBids', component: MyBids, meta: { requiresAuth: true } },
  { path: '/my-projects', name: 'MyProjects', component: MyProjects, meta: { requiresAuth: true } },
  { path: '/wallet', name: 'Wallet', component: Wallet, meta: { requiresAuth: true } },
  { path: '/create-project', name: 'CreateProject', component: CreateProject, meta: { requiresAuth: true } },
  { path: '/provider/:id', name: 'ProviderProfile', component: ProviderProfile, meta: { requiresAuth: false } },
  { path: '/notifications', name: 'Notifications', component: Notifications, meta: { requiresAuth: true } },
  { path: '/project/:id', name: 'ProjectDetail', component: ProjectDetail, meta: { requiresAuth: true } },
  
  // Admin routes
  { path: '/admin/dashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/users', name: 'AdminUsers', component: AdminUsers, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/projects', name: 'AdminProjects', component: AdminProjects, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/payments', name: 'AdminPayments', component: AdminPayments, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/settings', name: 'AdminSettings', component: AdminSettings, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/disputes', name: 'AdminDisputes', component: AdminDisputes, meta: { requiresAuth: true, requiresAdmin: true } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  // Verificar localStorage também (login persistente)
  const userJson = localStorage.getItem('kadesh_user') || sessionStorage.getItem('kadesh_user')
  const isAuthenticated = !!userJson
  
  // Parse user para verificar se é admin
  let user = null
  if (userJson) {
    try {
      user = JSON.parse(userJson)
    } catch (e) {
      console.error('Erro ao parsear user:', e)
    }
  }
  
  // Verificar autenticação
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }
  
  // Verificar se requer admin
  if (to.meta.requiresAdmin && (!user || user.user_type !== 'admin')) {
    alert('Acesso negado. Apenas administradores podem acessar esta área.')
    next('/dashboard')
    return
  }
  
  next()
})

const app = createApp(App)
app.use(router)
app.mount('#app')
