import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface RoleInfo {
    roleId: number
    roleName: string
    systemCode: string
}

export const useAuthStore = defineStore('auth', () => {
    // --------------- State ---------------
    const token = ref<string>(localStorage.getItem('token') || '')
    const userId = ref<string>(localStorage.getItem('userId') || '')
    const role = ref<string>(localStorage.getItem('role') || '')
    const roles = ref<RoleInfo[]>(JSON.parse(localStorage.getItem('roles') || '[]'))
    const language = ref<string>(localStorage.getItem('language') || '')

    // --------------- Getters ---------------
    const isAuthenticated = computed(() => !!token.value)
    const isSuperAdmin = computed(() => role.value === 'SUPER_ADMIN')

    // --------------- Actions ---------------
    function login(newToken: string, newUserId: string | number, newRole: string = 'USER', newRoles: RoleInfo[] = [], newLanguage: string = '') {
        token.value = newToken
        userId.value = String(newUserId)
        role.value = newRole
        roles.value = newRoles
        if (newLanguage) language.value = newLanguage

        localStorage.setItem('token', newToken)
        localStorage.setItem('userId', String(newUserId))
        localStorage.setItem('role', newRole)
        localStorage.setItem('roles', JSON.stringify(newRoles))
        if (newLanguage) localStorage.setItem('language', newLanguage)
    }

    function logout() {
        token.value = ''
        userId.value = ''
        role.value = ''
        roles.value = []
        language.value = ''

        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('role')
        localStorage.removeItem('roles')
        localStorage.removeItem('language')
    }

    return {
        token,
        userId,
        role,
        roles,
        language,
        isAuthenticated,
        isSuperAdmin,
        login,
        logout,
    }
})
