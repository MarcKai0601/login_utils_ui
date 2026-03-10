import axios from 'axios'
import { useAuthStore } from '../store/auth'
import router from '../router'

// ─── Axios Instance ────────────────────────────────────────────
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// ─── Request Interceptor ──────────────────────────────────────
apiClient.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore()
        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

// ─── Response Interceptor ─────────────────────────────────────
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const authStore = useAuthStore()
            authStore.logout()
            router.push('/login')
        }
        return Promise.reject(error)
    },
)

// ─── API Response Types ───────────────────────────────────────
export interface LoginResponseData {
    token: string
    userId: number
    role: string
}

export interface RegisterRequestData {
    username: string
    password: string
    status?: number
    roleId?: number
    nickname?: string
    email?: string
    phone?: string
    memo?: string
}

export interface MgrResponse<T = unknown> {
    code: string
    message: string
    data: T
}

// ─── Auth API ─────────────────────────────────────────────────
export const authApi = {
    login(username: string, password: string) {
        return apiClient.post<MgrResponse<LoginResponseData>>('/api/login', {
            username,
            password,
        })
    },

    register(data: RegisterRequestData) {
        return apiClient.post<MgrResponse<string>>('/api/mgr/user/add', {
            ...data,
            status: data.status ?? 1,
            roleId: data.roleId ?? 1,
        })
    },
}

export default apiClient
