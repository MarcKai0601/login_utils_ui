import axios from 'axios'
import { useAuthStore } from '../store/auth'
import type { RoleInfo } from '../store/auth'

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
            alert('登入已逾期，請重新登入 / Login expired, please login again.')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    },
)

// ─── API Response Types ───────────────────────────────────────
export interface LoginResponseData {
    token: string
    userId: number
    username: string
    role: string
    roles: RoleInfo[]
    language?: string
    isTempPassword?: number
}

export interface RegisterRequestData {
    username: string
    password: string
    email: string
    status?: number
    roleId?: number
    nickname?: string
    phone?: string
    memo?: string
    language?: string
    systemId: number // <--- 【修復錯誤 2】新增 systemId 屬性定義
}

export interface MgrResponse<T = unknown> {
    code: string
    message: string
    data: T
}

// ─── Auth API ─────────────────────────────────────────────────
export const authApi = {
    // 【修復錯誤 1】將函式簽章加上 systemId: number，並加到 post payload 中
    login(username: string, password: string, systemId: number) {
        return apiClient.post<MgrResponse<LoginResponseData>>('/api/login', {
            username,
            password,
            systemId // <--- 把 systemId 一併打包丟給後端
        })
    },

    register(data: RegisterRequestData) {
        return apiClient.post<MgrResponse<string>>('/api/mgr/user/add', {
            ...data,
            status: data.status ?? 1,
            // 註冊時也可以考慮把寫死的 roleId 拿掉，因為我們現在後端已經會依據 systemId 自動賦予對應的預設角色了
        })
    },

    updatePassword(data: { oldPassword: string; newPassword: string }) {
        return apiClient.put<MgrResponse<null>>('/api/mgr/user/update-password', data)
    },

    forgotPassword(data: { email: string }) {
        return apiClient.post<MgrResponse<null>>('/api/v1/auth/forgot-password', data)
    },
}

// ─── System API ───────────────────────────────────────────────
export const systemApi = {
    getVersion() {
        return apiClient.get<MgrResponse<{ version: string }>>('/api/v1/system/version')
    },
}

export default apiClient