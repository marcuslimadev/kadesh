import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import Projects from '../views/Projects.vue';
import ProjectCreate from '../views/ProjectCreate.vue';
import ProjectShow from '../views/ProjectShow.vue';
import ProviderProfile from '../views/ProviderProfile.vue';
import ProviderPortfolio from '../views/ProviderPortfolio.vue';
import ProviderPublicView from '../views/ProviderPublicView.vue';
import ReviewForm from '../views/ReviewForm.vue';
import PaymentCheckout from '../views/PaymentCheckout.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import AdminSettings from '../views/AdminSettings.vue';
import AdminUsers from '../views/AdminUsers.vue';
import AdminProjects from '../views/AdminProjects.vue';
import AdminPayments from '../views/AdminPayments.vue';
import Dashboard from '../views/Dashboard.vue';
import ContractorDashboard from '../views/ContractorDashboard.vue';
import api from '../services/api';

const routes = [
  { path: '/', component: Home },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/contractor/dashboard', component: ContractorDashboard, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/projects', component: Projects },
  { path: '/projects/create', component: ProjectCreate, meta: { requiresAuth: true, requiresContractor: true } },
  { path: '/projects/:id', component: ProjectShow },
  { path: '/projects/:id/payment', component: PaymentCheckout, meta: { requiresAuth: true } },
  { path: '/projects/:id/review', component: ReviewForm, meta: { requiresAuth: true } },
  { path: '/providers/:id', component: ProviderPublicView },
  { path: '/provider/profile', component: ProviderProfile, meta: { requiresAuth: true, requiresProvider: true } },
  { path: '/provider/portfolio', component: ProviderPortfolio, meta: { requiresAuth: true, requiresProvider: true } },
  { path: '/admin/dashboard', component: AdminDashboard, meta: { requiresAdmin: true } },
  { path: '/admin/settings', component: AdminSettings, meta: { requiresAdmin: true } },
  { path: '/admin/users', component: AdminUsers, meta: { requiresAdmin: true } },
  { path: '/admin/projects', component: AdminProjects, meta: { requiresAdmin: true } },
  { path: '/admin/payments', component: AdminPayments, meta: { requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory('/kadesh/'),
  routes,
});

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const isAdmin = (
    (typeof localStorage !== 'undefined' && localStorage.getItem('isAdmin') === 'true') ||
    (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true')
  )
  
  // Rotas de admin
  if (to.meta.requiresAdmin) {
    if (!isAdmin) {
      next('/login')
      return
    }
  }
  
  // Rotas que exigem autenticação
  if (to.meta.requiresAuth) {
    try {
      const { data } = await api.get('/api/user')
      const user = data.user
      
      // Verificar se é rota de contractor (criar projeto)
      if (to.meta.requiresContractor) {
        if (user.user_type !== 'contractor' && user.user_type !== 'both') {
          alert('❌ Apenas contratantes podem criar projetos!')
          next('/projects')
          return
        }
      }
      
      // Verificar se é rota de provider (perfil/portfólio)
      if (to.meta.requiresProvider) {
        if (user.user_type !== 'provider' && user.user_type !== 'both') {
          alert('❌ Apenas fornecedores têm acesso a esta área!')
          next('/projects')
          return
        }
      }
      
      next()
    } catch (error) {
      // Não autenticado
      next('/login')
    }
    return
  }
  
  next()
})

export default router;
