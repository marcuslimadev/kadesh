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
const Wallet = () => import('../views/Wallet.vue')
const Notifications = () => import('../views/Notifications.vue')

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
    path: '/wallet',
    name: 'wallet',
    component: Wallet,
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: Notifications,
    meta: { requiresAuth: true }
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
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) {
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
