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
            // 【修改點 1】：改用 allowedRoles 陣列宣告權限。
            // 這裡設定只有 SUPER_ADMIN 和 ADMIN 可以進入 Dashboard
            meta: { requiresAuth: true, allowedRoles: ['SUPER_ADMIN', 'ADMIN'] },
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

    const publicPages = ['/login', '/register']
    const authRequired = !publicPages.includes(to.path)

    // 1. 全域驗證：非公開頁面且沒有 Token 時，強制導向登入頁
    if (authRequired && !authStore.token) {
        next('/login')
        return
    }

    // 2. OTP 一次性密碼：強制導向 Profile 修改密碼（僅允許 Profile 頁面）
    if (authStore.token && authStore.isTempPassword && to.name !== 'Profile' && to.name !== 'Login') {
        next({ name: 'Profile' })
        return
    }

    // 3. 【修改點 2】：RBAC 動態角色驗證
    // 如果該路由有設定 allowedRoles，就檢查使用者的角色是否有在允許名單內
    if (to.meta.allowedRoles) {
        const allowedRoles = to.meta.allowedRoles as string[]
        // 假設你的 authStore.role 存放的是目前登入系統的 RoleCode (如 'USER', 'ADMIN')
        if (!allowedRoles.includes(authStore.role)) {
            // 角色不符，踢回 Welcome 頁面
            next({ name: 'Welcome' })
            return
        }
    }

    next()
})

export default router