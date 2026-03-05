import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import WelcomeView from '../views/WelcomeView.vue'
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
            path: '/',
            name: 'Welcome',
            component: WelcomeView,
            meta: { requiresAuth: true },
        },
    ],
})

// ─── Navigation Guard ─────────────────────────────────────────
router.beforeEach((to, _from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'Login' })
    } else {
        next()
    }
})

export default router
