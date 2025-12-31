import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useViewModeStore } from '@/stores/viewModeStore'

// Lazy load views
const Home = () => import('../views/Home.vue')
const Tutorial = () => import('../views/Tutorial.vue')
const AuctionLobby = () => import('../views/AuctionLobby.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const ForgotPassword = () => import('../views/ForgotPassword.vue')
const ResetPassword = () => import('../views/ResetPassword.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Projects = () => import('../views/Projects.vue')
const ProjectDetail = () => import('../views/ProjectDetail.vue')
const CreateProject = () => import('../views/CreateProject.vue')
const MyProjects = () => import('../views/MyProjects.vue')
const MyBids = () => import('../views/MyBids.vue')
const ProviderProfile = () => import('../views/ProviderProfile.vue')
const PublicProviderProfile = () => import('../views/PublicProviderProfile.vue')
const Wallet = () => import('../views/Wallet.vue')
const Receipts = () => import('../views/Receipts.vue')
const Notifications = () => import('../views/Notifications.vue')
const Settings = () => import('../views/Settings.vue')
const Contracts = () => import('../views/Contracts.vue')
const ContractDetail = () => import('../views/ContractDetail.vue')

// Admin views
const AdminLogin = () => import('../views/admin/AdminLogin.vue')
const AdminDashboard = () => import('../views/admin/AdminDashboard.vue')
const AdminUsers = () => import('../views/admin/AdminUsers.vue')
const AdminProjects = () => import('../views/admin/AdminProjects.vue')
const AdminPayments = () => import('../views/admin/AdminPayments.vue')
const AdminSettings = () => import('../views/admin/AdminSettings.vue')
const AdminDisputes = () => import('../views/admin/AdminDisputes.vue')
const AdminAdvertisements = () => import('../views/admin/AdminAdvertisements.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/tutorial',
    name: 'tutorial',
    component: Tutorial,
    meta: { requiresAuth: false }
  },
  {
    path: '/lobby',
    name: 'auction-lobby',
    component: AuctionLobby,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword,
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects,
    meta: { requiresAuth: false }
  },
  {
    path: '/projects/:id',
    name: 'project-detail',
    component: ProjectDetail,
    meta: { requiresAuth: false }
  },
  {
    path: '/projects/create',
    name: 'create-project',
    component: CreateProject,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-projects',
    name: 'my-projects',
    component: MyProjects,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-bids',
    name: 'my-bids',
    component: MyBids,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProviderProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/provider/:id',
    name: 'public-provider-profile',
    component: PublicProviderProfile,
    meta: { requiresAuth: false }
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: Wallet,
    meta: { requiresAuth: true }
  },
  {
    path: '/receipts',
    name: 'receipts',
    component: Receipts,
    meta: { requiresAuth: true }
  },
  {
    path: '/contracts',
    name: 'contracts',
    component: Contracts,
    meta: { requiresAuth: true }
  },
  {
    path: '/contracts/:id',
    name: 'contract-detail',
    component: ContractDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: Notifications,
    meta: { requiresAuth: true }
  },
  // Admin routes
  {
    path: '/admin/login',
    name: 'admin-login',
    component: AdminLogin,
    meta: { requiresAuth: false, adminOnly: true }
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAdminAuth: true }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: AdminUsers,
    meta: { requiresAdminAuth: true }
  },
  {
    path: '/admin/projects',
    name: 'admin-projects',
    component: AdminProjects,
    meta: { requiresAdminAuth: true }
  },
  {
    path: '/admin/payments',
    name: 'admin-payments',
    component: AdminPayments,
    meta: { requiresAdminAuth: true }
  },
  {
    path: '/admin/disputes',
    name: 'admin-disputes',
    component: AdminDisputes,
    meta: { requiresAdminAuth: true }
  },
  {
    path: '/admin/advertisements',
    name: 'admin-advertisements',
    component: AdminAdvertisements,
    meta: { requiresAdminAuth: true }
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: AdminSettings,
    meta: { requiresAdminAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const isBrowser = typeof window !== 'undefined'
  const authStore = useAuthStore()
  const viewMode = useViewModeStore()
  const token = isBrowser ? localStorage.getItem('kadesh_token') : null
  const adminToken = isBrowser ? localStorage.getItem('adminToken') : null

  const needsAuth = to.meta.requiresAuth
  const needsAdmin = to.meta.requiresAdminAuth
  const guestOnly = to.meta.guestOnly

  // Admin routes protection
  if (needsAdmin && !adminToken) {
    return next({ name: 'admin-login' })
  }

  // Guard for authenticated routes
  if (needsAuth) {
    if (!token) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    // Em hard reload, user pode não estar hidratado mas o token existe.
    // Não force verify aqui (race condition com App.vue bootstrap).
    // Apenas sincronize o modo se já tiver user hidratado.
    const userType = authStore.user?.value?.type
    if (userType) {
      if (userType === 'provider') {
        viewMode.setProviderMode()
      } else if (userType === 'client') {
        viewMode.setContractorMode()
      }
    }
    // Se user não estiver hidratado ainda, deixa o App.vue fazer o verify.
    // O guard só bloqueia se NÃO existir token.
  }

  // Guest-only routes redirect if already authenticated
  if (guestOnly && (authStore.isAuthenticated || token)) {
    return next({ name: 'dashboard' })
  }

  return next()
})

export default router
