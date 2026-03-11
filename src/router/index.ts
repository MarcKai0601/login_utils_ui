import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import WelcomeView from '../views/WelcomeView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import ProfileView from '../views/ProfileView.vue'
import { useAuthStore } from '../store/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: LoginView,
            meta: { requiresAuth: false },
        },
        {
            path: '/register',
            name: 'Register',
            component: RegisterView,
            meta: { requiresAuth: false },
        },
        {
            path: '/welcome',
            name: 'Welcome',
            component: WelcomeView,
            meta: { requiresAuth: true },
        },
        {
            path: '/',
            name: 'Dashboard',
            component: AdminDashboardView,
            meta: { requiresAuth: true, requiresSuperAdmin: true },
        },
        {
            path: '/profile',
            name: 'Profile',
            component: ProfileView,
            meta: { requiresAuth: true },
        },
    ],
})

// ─── Navigation Guard ─────────────────────────────────────────
router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore()

    // 1. 未登入 → 導向登入頁
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Login' })
        return
    }

    // 2. 需要 SUPER_ADMIN 但角色不符 → 導向 Welcome
    if (to.meta.requiresSuperAdmin && !authStore.isSuperAdmin) {
        next({ name: 'Welcome' })
        return
    }

    next()
})

export default router
