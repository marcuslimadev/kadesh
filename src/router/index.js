import { createRouter, createWebHistory } from 'vue-router'

// Lazy load views
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const Projects = () => import('../views/Projects.vue')
const ProjectDetail = () => import('../views/ProjectDetail.vue')
const CreateProject = () => import('../views/CreateProject.vue')
const MyProjects = () => import('../views/MyProjects.vue')
const MyBids = () => import('../views/MyBids.vue')
const ProviderProfile = () => import('../views/ProviderProfile.vue')
const PublicProviderProfile = () => import('../views/PublicProviderProfile.vue')
const Wallet = () => import('../views/Wallet.vue')
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

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: false }
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
router.beforeEach((to, from, next) => {
  // Frontend stores the JWT under the `kadesh_token` key (see src/stores/auth.js)
  // so the navigation guard needs to look up the same key to accurately determine
  // whether the user is authenticated. Otherwise, even users with a valid session
  // would be redirected back to the login screen.
  const token = localStorage.getItem('kadesh_token')
  const adminToken = localStorage.getItem('adminToken')
  const isAuthenticated = !!token
  const isAdminAuthenticated = !!adminToken

  // Admin routes protection
  if (to.meta.requiresAdminAuth && !isAdminAuthenticated) {
    next({ name: 'admin-login' })
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guestOnly && isAuthenticated) {
    // Redirect to dashboard if route is for guests only and user is authenticated
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
