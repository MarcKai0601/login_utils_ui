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
    // --------------- Getters ---------------
    const isAuthenticated = computed(() => !!token.value)

    // --------------- Actions ---------------
    function login(newToken: string, newUserId: string | number, newRole: string = 'USER') {
        token.value = newToken
        userId.value = String(newUserId)
        role.value = newRole

        localStorage.setItem('token', newToken)
        localStorage.setItem('userId', String(newUserId))
        localStorage.setItem('role', newRole)
    }

    function logout() {
        token.value = ''
        userId.value = ''
        role.value = ''

        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('role')
    }

    return {
        token,
        userId,
        role,
        isAuthenticated,
        login,
        logout,
    }
})
